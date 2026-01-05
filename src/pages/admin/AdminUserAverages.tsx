import { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Gift,
  Activity,
  Calendar,
  DollarSign,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/components/AdminLayout';
import { toast } from '@/hooks/use-toast';
import { adminAPI } from '@/services/api';

interface UserAverage {
  userId: string;
  username: string;
  email: string;
  daysConsidered: number;
  depositsLastPeriod: number;
  withdrawalsLastPeriod: number;
  bonusesLastPeriod: number;
  averagePerDay: number;
}

const AdminUserAverages = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserAverage[]>([]);
  const [days, setDays] = useState(30);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    fetchUserAverages();
  }, [currentPage]);

  const fetchUserAverages = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUserAverages({ days: 30, page: currentPage, limit: 50 });
      setUsers(response.data.users || []);
      setDays(response.data.days || 30);
      setTotalPages(response.data.pagination?.pages || 1);
      setTotalUsers(response.data.pagination?.total || 0);
    } catch (error: any) {
      console.error('Error fetching user averages:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.response?.data?.message || 'Failed to fetch user averages',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="User 30-Day Averages">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Activity className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading user averages...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="User 30-Day Averages">
      <div className="space-y-6">
        {/* Header */}
        <Card className="p-6 bg-card/90 backdrop-blur-sm border-2 border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/20">
                <Calendar className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">User 30-Day Averages</h2>
                <p className="text-sm text-muted-foreground">
                  Per-user financial activity over the last {days} days
                </p>
              </div>
            </div>
            <Badge className="text-lg px-4 py-2">
              {days} Days
            </Badge>
          </div>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-card/90 backdrop-blur-sm border-2 border-border">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <h3 className="text-2xl font-bold">{totalUsers}</h3>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-card/90 backdrop-blur-sm border-2 border-green-500/30">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Deposits</p>
                <h3 className="text-2xl font-bold text-green-500">
                  ${users.length > 0 ? (users.reduce((sum, u) => sum + (u.depositsLastPeriod || 0), 0) / users.length).toFixed(2) : '0.00'}
                </h3>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-card/90 backdrop-blur-sm border-2 border-red-500/30">
            <div className="flex items-center gap-3">
              <TrendingDown className="w-8 h-8 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Withdrawals</p>
                <h3 className="text-2xl font-bold text-red-500">
                  ${users.length > 0 ? (users.reduce((sum, u) => sum + (u.withdrawalsLastPeriod || 0), 0) / users.length).toFixed(2) : '0.00'}
                </h3>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-card/90 backdrop-blur-sm border-2 border-purple-500/30">
            <div className="flex items-center gap-3">
              <Gift className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Bonuses</p>
                <h3 className="text-2xl font-bold text-purple-500">
                  ${users.length > 0 ? (users.reduce((sum, u) => sum + (u.bonusesLastPeriod || 0), 0) / users.length).toFixed(2) : '0.00'}
                </h3>
              </div>
            </div>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="p-6 bg-card/90 backdrop-blur-sm border-2 border-border">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Per-User Breakdown
          </h3>

          {users.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No User Data</h3>
              <p className="text-muted-foreground">No user activity found for the selected period</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block rounded-lg border border-border overflow-hidden">
                <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>User</TableHead>
                    <TableHead className="text-right">Days</TableHead>
                    <TableHead className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        Deposits
                      </div>
                    </TableHead>
                    <TableHead className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <TrendingDown className="w-4 h-4 text-red-500" />
                        Withdrawals
                      </div>
                    </TableHead>
                    <TableHead className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Gift className="w-4 h-4 text-purple-500" />
                        Bonuses
                      </div>
                    </TableHead>
                    <TableHead className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <DollarSign className="w-4 h-4 text-primary" />
                        Avg/Day
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.userId} className="hover:bg-muted/30">
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.username}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-semibold">
                          {user.daysConsidered || 0}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-semibold text-green-500">
                          ${(user.depositsLastPeriod || 0).toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-semibold text-red-500">
                          ${(user.withdrawalsLastPeriod || 0).toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-semibold text-purple-500">
                          ${(user.bonusesLastPeriod || 0).toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-bold text-primary">
                          ${(user.averagePerDay || 0).toFixed(2)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {users.map((user) => (
                <Card key={user.userId} className="p-4 bg-secondary/30 border border-border">
                  <div className="mb-3">
                    <p className="font-semibold text-base truncate">{user.username}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">Days: {user.daysConsidered || 0}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-2">
                      <div className="flex items-center gap-1 mb-1">
                        <TrendingUp className="w-3 h-3 text-green-500" />
                        <p className="text-xs text-muted-foreground">Deposits</p>
                      </div>
                      <p className="font-semibold text-sm text-green-500">
                        ${(user.depositsLastPeriod || 0).toFixed(2)}
                      </p>
                    </div>

                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-2">
                      <div className="flex items-center gap-1 mb-1">
                        <TrendingDown className="w-3 h-3 text-red-500" />
                        <p className="text-xs text-muted-foreground">Withdrawals</p>
                      </div>
                      <p className="font-semibold text-sm text-red-500">
                        ${(user.withdrawalsLastPeriod || 0).toFixed(2)}
                      </p>
                    </div>

                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-2">
                      <div className="flex items-center gap-1 mb-1">
                        <Gift className="w-3 h-3 text-purple-500" />
                        <p className="text-xs text-muted-foreground">Bonuses</p>
                      </div>
                      <p className="font-semibold text-sm text-purple-500">
                        ${(user.bonusesLastPeriod || 0).toFixed(2)}
                      </p>
                    </div>

                    <div className="bg-primary/10 border border-primary/30 rounded-lg p-2">
                      <div className="flex items-center gap-1 mb-1">
                        <DollarSign className="w-3 h-3 text-primary" />
                        <p className="text-xs text-muted-foreground">Avg/Day</p>
                      </div>
                      <p className="font-semibold text-sm text-primary">
                        ${(user.averagePerDay || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages} • Showing {users.length} of {totalUsers} users
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1 || loading}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages || loading}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </>
          )}
        </Card>

        {/* Legend */}
        <Card className="p-4 bg-muted/30 backdrop-blur-sm border border-border">
          <h4 className="text-sm font-semibold mb-2">Formula Reference</h4>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• <strong>Average Per Day</strong> = Total activity / Days considered (based on actual transaction history)</p>
            <p>• All amounts are calculated from approved deposits/withdrawals and completed bonus transactions</p>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminUserAverages;
