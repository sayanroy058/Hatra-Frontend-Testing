/**
 * Request Deduplication Utility
 * 
 * Prevents duplicate API requests from being sent simultaneously.
 * If the same request is already in flight, returns the existing promise.
 * 
 * Usage:
 * import { apiCall } from './requestDeduplication';
 * 
 * const data = await apiCall('/api/user/deposits', { method: 'GET' });
 */

const pendingRequests = new Map();

/**
 * Make an API call with automatic deduplication
 * @param {string} url - The API endpoint URL
 * @param {RequestInit} options - Fetch options (method, headers, body, etc.)
 * @returns {Promise<any>} - The API response data
 */
export const apiCall = async (url, options = {}) => {
    // Create a unique key for this request
    const key = `${url}-${JSON.stringify(options)}`;

    // If same request is already pending, return that promise
    if (pendingRequests.has(key)) {
        console.log(`[Request Dedup] Reusing pending request: ${url}`);
        return pendingRequests.get(key);
    }

    console.log(`[Request Dedup] New request: ${url}`);

    // Make the request
    const promise = fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    })
        .then(async (response) => {
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Request failed');
            }
            return response.json();
        })
        .finally(() => {
            // Remove from pending requests when done
            pendingRequests.delete(key);
        });

    // Store the promise
    pendingRequests.set(key, promise);

    return promise;
};

/**
 * Clear all pending requests (useful for cleanup)
 */
export const clearPendingRequests = () => {
    pendingRequests.clear();
};

/**
 * Get number of pending requests (useful for debugging)
 */
export const getPendingRequestCount = () => {
    return pendingRequests.size;
};

// Example usage in React:
/*
import { apiCall } from './utils/requestDeduplication';

// In your component or service
export const fetchDeposits = async (token) => {
  return apiCall('/api/user/deposits', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Even if called multiple times simultaneously, only 1 request is made
Promise.all([
  fetchDeposits(token),  // Request 1
  fetchDeposits(token),  // Reuses Request 1
  fetchDeposits(token),  // Reuses Request 1
]);
// Result: Only 1 actual HTTP request sent!
*/
