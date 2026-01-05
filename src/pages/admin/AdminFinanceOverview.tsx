import { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Gift,
  Users,
  Activity,
  Wallet
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import AdminLayout from '@/components/AdminLayout';
import { toast } from '@/hooks/use-toast';
import { adminAPI } from '@/services/api';

interface FinanceData {
  totalUsers: number;
  totalDeposits: number;
  totalWithdrawals: number;
  totalBonuses: number;
  available: number;
}

const AdminFinanceOverview = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<FinanceData>({
    totalUsers: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    totalBonuses: 0,
    available: 0,
  });

  useEffect(() => {
    fetchFinanceData();
  }, []);

  const fetchFinanceData = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getFinanceOverview();
      setData(response.data);
    } catch (error: any) {
      console.error('Error fetching finance overview:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.response?.data?.message || 'Failed to fetch finance data',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Finance Overview">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Activity className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading finance data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Finance Overview">
      <div className="space-y-6">
        {/* Header */}
        <Card className="p-6 bg-card/90 backdrop-blur-sm border-2 border-border">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/20">
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Finance Overview</h2>
              <p className="text-sm text-muted-foreground">
                Complete financial summary of platform operations
              </p>
            </div>
          </div>
        </Card>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Total Users */}
          <Card className="p-6 bg-card/90 backdrop-blur-sm border-2 border-border hover:border-primary/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-blue-500/20">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">Platform Users</span>
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-1">{data.totalUsers}</h3>
              <p className="text-sm text-muted-foreground">Total Registered Users</p>
            </div>
          </Card>

          {/* Total Deposits */}
          <Card className="p-6 bg-card/90 backdrop-blur-sm border-2 border-green-500/30 hover:border-green-500/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-green-500/20">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
              <span className="text-xs font-medium text-green-500">Approved</span>
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-1 text-green-500">
                ${data.totalDeposits.toFixed(2)}
              </h3>
              <p className="text-sm text-muted-foreground">Total Deposits</p>
            </div>
          </Card>

          {/* Total Withdrawals */}
          <Card className="p-6 bg-card/90 backdrop-blur-sm border-2 border-red-500/30 hover:border-red-500/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-red-500/20">
                <TrendingDown className="w-6 h-6 text-red-500" />
              </div>
              <span className="text-xs font-medium text-red-500">Approved</span>
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-1 text-red-500">
                ${data.totalWithdrawals.toFixed(2)}
              </h3>
              <p className="text-sm text-muted-foreground">Total Withdrawals</p>
            </div>
          </Card>

          {/* Total Bonuses */}
          <Card className="p-6 bg-card/90 backdrop-blur-sm border-2 border-purple-500/30 hover:border-purple-500/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-purple-500/20">
                <Gift className="w-6 h-6 text-purple-500" />
              </div>
              <span className="text-xs font-medium text-purple-500">Completed</span>
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-1 text-purple-500">
                ${data.totalBonuses.toFixed(2)}
              </h3>
              <p className="text-sm text-muted-foreground">Total Bonuses</p>
            </div>
          </Card>

          {/* Available Balance */}
          <Card className="p-6 bg-card/90 backdrop-blur-sm border-2 border-primary hover:border-primary/80 transition-all md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-primary/20">
                <Wallet className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">Net Available</span>
            </div>
            <div>
              <h3 className={`text-4xl font-bold mb-1 ${data.available >= 0 ? 'text-primary' : 'text-red-500'}`}>
                ${data.available.toFixed(2)}
              </h3>
              <p className="text-sm text-muted-foreground">
                Available = Deposits - Withdrawals - Bonuses
              </p>
            </div>
          </Card>
        </div>

        {/* Breakdown Card */}
        <Card className="p-6 bg-card/90 backdrop-blur-sm border-2 border-border">
          <h3 className="text-lg font-semibold mb-4">Financial Breakdown</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <span className="font-medium">Total Inflow (Deposits)</span>
              </div>
              <span className="text-lg font-bold text-green-500">
                +${data.totalDeposits.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/20">
                  <TrendingDown className="w-5 h-5 text-red-500" />
                </div>
                <span className="font-medium">Total Outflow (Withdrawals)</span>
              </div>
              <span className="text-lg font-bold text-red-500">
                -${data.totalWithdrawals.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Gift className="w-5 h-5 text-purple-500" />
                </div>
                <span className="font-medium">Total Distribution (Bonuses)</span>
              </div>
              <span className="text-lg font-bold text-purple-500">
                -${data.totalBonuses.toFixed(2)}
              </span>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <Wallet className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-semibold text-lg">Net Available</span>
                </div>
                <span className={`text-2xl font-bold ${data.available >= 0 ? 'text-primary' : 'text-red-500'}`}>
                  ${data.available.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminFinanceOverview;
