import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { authAPI, userAPI, adminAPI } from '@/services/api';

// Query keys
export const queryKeys = {
  profile: ['profile'] as const,
  transactions: (page?: number, limit?: number) => ['transactions', { page, limit }] as const,
  referrals: (page?: number, limit?: number) => ['referrals', { page, limit }] as const,
  deposits: ['deposits'] as const,
  withdrawals: ['withdrawals'] as const,
  publicSettings: ['publicSettings'] as const,
  
  // Admin keys
  adminStats: ['adminStats'] as const,
  adminUsers: (page?: number, limit?: number) => ['adminUsers', { page, limit }] as const,
  adminTransactions: (page?: number, limit?: number) => ['adminTransactions', { page, limit }] as const,
  adminRecentTransactions: (limit?: number) => ['adminRecentTransactions', limit] as const,
  adminDeposits: (page?: number, limit?: number) => ['adminDeposits', { page, limit }] as const,
  adminWithdrawals: (page?: number, limit?: number) => ['adminWithdrawals', { page, limit }] as const,
  adminSettings: ['adminSettings'] as const,
  adminPendingRegistrations: ['adminPendingRegistrations'] as const,
};

// Shared config
const defaultStaleTime = 60 * 1000; // 1 minute
const longStaleTime = 5 * 60 * 1000; // 5 minutes

// Auth hooks
export const useProfile = () => {
  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: async () => {
      const response = await authAPI.getProfile();
      // Profile returns the user object directly (not wrapped in data)
      return response.data;
    },
    staleTime: defaultStaleTime,
    refetchOnWindowFocus: true,
  });
};

export const usePublicSettings = () => {
  return useQuery({
    queryKey: queryKeys.publicSettings,
    queryFn: async () => {
      const response = await authAPI.getPublicSettings();
      return response.data;
    },
    staleTime: longStaleTime,
  });
};

// User hooks
export const useTransactions = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: queryKeys.transactions(page, limit),
    queryFn: async () => {
      const response = await userAPI.getTransactions({ page, limit });
      // Normalize response structure - handle both array and paginated responses
      const responseData = response.data;
      if (Array.isArray(responseData)) {
        return { data: responseData, pagination: { page: 1, pages: 1, total: responseData.length } };
      }
      return {
        data: Array.isArray(responseData?.data) ? responseData.data : [],
        pagination: responseData?.pagination || { page: 1, pages: 1, total: 0 }
      };
    },
    staleTime: defaultStaleTime,
    placeholderData: keepPreviousData, // Keep previous data while fetching new page
  });
};

export const useReferrals = (page = 1, limit = 50) => {
  return useQuery({
    queryKey: queryKeys.referrals(page, limit),
    queryFn: async () => {
      const response = await userAPI.getReferrals({ page, limit });
      // Normalize response structure - handle both array and paginated responses
      const responseData = response.data;
      if (Array.isArray(responseData)) {
        // Direct array response - calculate team counts from data
        const leftCount = responseData.filter((ref: any) => ref.side === 'left').length;
        const rightCount = responseData.filter((ref: any) => ref.side === 'right').length;
        return { 
          data: responseData, 
          pagination: { page: 1, pages: 1, total: responseData.length },
          teamCounts: { left: leftCount, right: rightCount }
        };
      }
      // Paginated response with { data: [...], pagination: {...}, teamCounts: {...} }
      return {
        data: Array.isArray(responseData?.data) ? responseData.data : [],
        pagination: responseData?.pagination || { page: 1, pages: 1, total: 0 },
        teamCounts: responseData?.teamCounts || { left: 0, right: 0 }
      };
    },
    staleTime: defaultStaleTime,
    placeholderData: keepPreviousData,
  });
};

export const useDeposits = () => {
  return useQuery({
    queryKey: queryKeys.deposits,
    queryFn: async () => {
      const response = await userAPI.getDeposits();
      return response.data;
    },
    staleTime: defaultStaleTime,
  });
};

export const useWithdrawals = () => {
  return useQuery({
    queryKey: queryKeys.withdrawals,
    queryFn: async () => {
      const response = await userAPI.getWithdrawals();
      return response.data;
    },
    staleTime: defaultStaleTime,
  });
};

// Mutations
export const useCheckLevelRewards = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => userAPI.checkLevelRewards(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions() });
    },
  });
};

export const useSpinWheel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data?: { reward: number }) => userAPI.spinWheel(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions() });
    },
  });
};

export const useCreateDeposit = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => userAPI.createDeposit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.deposits });
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
    },
  });
};

export const useCreateWithdrawal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => userAPI.createWithdrawal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.withdrawals });
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
    },
  });
};

// Admin hooks
export const useAdminStats = () => {
  return useQuery({
    queryKey: queryKeys.adminStats,
    queryFn: async () => {
      const response = await adminAPI.getDashboardStats();
      return response.data;
    },
    staleTime: defaultStaleTime,
  });
};

export const useAdminRecentTransactions = (limit = 5) => {
  return useQuery({
    queryKey: queryKeys.adminRecentTransactions(limit),
    queryFn: async () => {
      const response = await adminAPI.getRecentTransactions(limit);
      // Returns an array of transactions directly
      const responseData = response.data;
      return Array.isArray(responseData) ? responseData : [];
    },
    staleTime: defaultStaleTime,
  });
};

export const useAdminUsers = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: queryKeys.adminUsers(page, limit),
    queryFn: async () => {
      const response = await adminAPI.getAllUsers({ page, limit });
      // Normalize response
      const responseData = response.data;
      if (Array.isArray(responseData)) {
        return { data: responseData, pagination: { page: 1, pages: 1, total: responseData.length } };
      }
      return {
        data: Array.isArray(responseData?.data) ? responseData.data : [],
        pagination: responseData?.pagination || { page: 1, pages: 1, total: 0 }
      };
    },
    staleTime: defaultStaleTime,
    placeholderData: keepPreviousData,
  });
};

export const useAdminTransactions = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: queryKeys.adminTransactions(page, limit),
    queryFn: async () => {
      const response = await adminAPI.getAllTransactions({ page, limit });
      const responseData = response.data;
      if (Array.isArray(responseData)) {
        return { data: responseData, pagination: { page: 1, pages: 1, total: responseData.length } };
      }
      return {
        data: Array.isArray(responseData?.data) ? responseData.data : [],
        pagination: responseData?.pagination || { page: 1, pages: 1, total: 0 }
      };
    },
    staleTime: defaultStaleTime,
    placeholderData: keepPreviousData,
  });
};

export const useAdminDeposits = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: queryKeys.adminDeposits(page, limit),
    queryFn: async () => {
      const response = await adminAPI.getAllDeposits({ page, limit });
      const responseData = response.data;
      if (Array.isArray(responseData)) {
        return { data: responseData, pagination: { page: 1, pages: 1, total: responseData.length } };
      }
      return {
        data: Array.isArray(responseData?.data) ? responseData.data : [],
        pagination: responseData?.pagination || { page: 1, pages: 1, total: 0 }
      };
    },
    staleTime: defaultStaleTime,
    placeholderData: keepPreviousData,
  });
};

export const useAdminWithdrawals = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: queryKeys.adminWithdrawals(page, limit),
    queryFn: async () => {
      const response = await adminAPI.getAllWithdrawals({ page, limit });
      const responseData = response.data;
      if (Array.isArray(responseData)) {
        return { data: responseData, pagination: { page: 1, pages: 1, total: responseData.length } };
      }
      return {
        data: Array.isArray(responseData?.data) ? responseData.data : [],
        pagination: responseData?.pagination || { page: 1, pages: 1, total: 0 }
      };
    },
    staleTime: defaultStaleTime,
    placeholderData: keepPreviousData,
  });
};

export const useAdminSettings = () => {
  return useQuery({
    queryKey: queryKeys.adminSettings,
    queryFn: async () => {
      const response = await adminAPI.getSettings();
      return response.data;
    },
    staleTime: longStaleTime,
  });
};

export const useAdminPendingRegistrations = () => {
  return useQuery({
    queryKey: queryKeys.adminPendingRegistrations,
    queryFn: async () => {
      const response = await adminAPI.getPendingRegistrations();
      return response.data;
    },
    staleTime: defaultStaleTime,
  });
};

// Admin mutations
export const useUpdateAdminSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => adminAPI.updateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminSettings });
      queryClient.invalidateQueries({ queryKey: queryKeys.publicSettings });
    },
  });
};

export const useVerifyRegistrationDeposit = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      adminAPI.verifyRegistrationDeposit(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminPendingRegistrations });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminUsers() });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminStats });
    },
  });
};

export const useCreditBonus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { userId: string; amount: number; description?: string }) => 
      adminAPI.creditBonus(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminUsers() });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminTransactions() });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminStats });
    },
  });
};
