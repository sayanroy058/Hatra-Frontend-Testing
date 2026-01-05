import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';import { useQueryClient } from '@tanstack/react-query';import { 
  LayoutDashboard, 
  Users, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  History,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  UserCheck,
  Gift,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import BlockchainBackground from '@/components/BlockchainBackground';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/registration-verification', label: 'Registration Verification', icon: UserCheck },
    { path: '/admin/users', label: 'Users', icon: Users },
    { path: '/admin/deposits', label: 'Deposits', icon: ArrowDownCircle },
    { path: '/admin/withdrawals', label: 'Withdrawals', icon: ArrowUpCircle },
    { path: '/admin/transactions', label: 'All Transactions', icon: History },
    { path: '/admin/bonus', label: 'Credit Bonus', icon: Gift },
    { path: '/admin/finance-overview', label: 'Finance Overview', icon: TrendingUp },
    { path: '/admin/user-averages', label: 'User Averages', icon: BarChart3 },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = () => {
    // Clear React Query cache to prevent showing old user data
    queryClient.clear();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen relative">
      <BlockchainBackground />
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-card/95 backdrop-blur-sm border-r-2 border-border z-50
        transform transition-transform duration-300 ease-in-out overflow-y-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="p-4 sm:p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-serif text-gradient-gold truncate">Hatra Suci</h1>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all
                    ${isActive 
                      ? 'bg-primary/20 text-primary border border-primary/30' 
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    }
                  `}
                >
                  <item.icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="text-sm sm:text-base font-medium truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6">
          <Button 
            variant="outline" 
            size="sm"
            className="w-full justify-start gap-2 sm:gap-3 text-destructive border-destructive/30 hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Logout</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-sm border-b-2 border-border">
          <div className="flex items-center justify-between px-3 sm:px-4 py-3 sm:py-4">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              <button
                className="lg:hidden p-2 hover:bg-secondary rounded-lg transition-colors flex-shrink-0"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
              </button>
              <h2 className="text-base sm:text-xl font-semibold truncate">{title}</h2>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-muted-foreground">Super Admin</p>
              </div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-3 sm:p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
