import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { authAPI } from '@/services/api';
import { Activity } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      // Validate token by fetching profile
      await authAPI.getProfile();
      setIsAuthenticated(true);
    } catch (error: any) {
      // Check for maintenance mode (503 status)
      if (error.response?.status === 503 || error.response?.data?.maintenanceMode) {
        // Don't clear token during maintenance
        setIsMaintenanceMode(true);
        setIsAuthenticated(false);
      } else {
        // Real auth failure - clear token
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Activity className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect to maintenance page if maintenance mode is active
  if (isMaintenanceMode) {
    return <Navigate to="/maintenance" replace state={{ from: location.pathname }} />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
