import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowDownToLine, ArrowUpFromLine, Gift, Calendar, Activity, ChevronLeft, ChevronRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BlockchainBackground from '@/components/BlockchainBackground';
import { useTransactions } from '@/hooks/useApi';

interface Transaction {
  id: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  description?: string;
}

const TransactionHistory = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 20;
  
  const { data: transactionsData, isLoading: loading } = useTransactions(page, limit);
  const transactions = transactionsData?.data || [];
  const pagination = transactionsData?.pagination || { page: 1, pages: 1, total: 0 };

  const depositTransactions: Transaction[] = transactions
    .filter(tx => tx.type === 'deposit')
    .map(tx => ({
      id: tx._id,
      amount: tx.amount,
      date: new Date(tx.createdAt).toLocaleString(),
      status: tx.status,
      description: tx.description || 'Deposit'
    }));

  const withdrawTransactions: Transaction[] = transactions
    .filter(tx => tx.type === 'withdrawal')
    .map(tx => ({
      id: tx._id,
      amount: tx.amount,
      date: new Date(tx.createdAt).toLocaleString(),
      status: tx.status,
      description: tx.description || 'Withdrawal'
    }));

  const bonusTransactions: Transaction[] = transactions
    .filter(tx => ['bonus', 'referral', 'level_reward'].includes(tx.type))
    .map(tx => ({
      id: tx._id,
      amount: tx.amount,
      date: new Date(tx.createdAt).toLocaleString(),
      status: tx.status,
      description: tx.description || 'Bonus'
    }));

  const dailyRewardTransactions: Transaction[] = transactions
    .filter(tx => tx.type === 'daily_reward')
    .map(tx => ({
      id: tx._id,
      amount: tx.amount,
      date: new Date(tx.createdAt).toLocaleString(),
      status: tx.status,
      description: tx.description || 'Daily Reward'
    }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'pending':
        return 'text-yellow-500';
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 border-green-500/50';
      case 'pending':
        return 'bg-yellow-500/20 border-yellow-500/50';
      case 'failed':
        return 'bg-red-500/20 border-red-500/50';
      default:
        return 'bg-secondary/50 border-border';
    }
  };

  const TransactionList = ({ transactions, type, loading }: { transactions: Transaction[], type: string, loading: boolean }) => {
    if (loading) {
      return (
        <div className="flex justify-center py-12">
          <Activity className="w-8 h-8 animate-spin text-primary" />
        </div>
      );
    }

    if (transactions.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No {type} transactions yet</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {transactions.map((transaction) => (
          <Card key={transaction.id} className="p-4 bg-card/90 backdrop-blur-sm border-2 border-border card-glow">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${getStatusBadge(transaction.status)}`}>
                  {type === 'Deposit' && <ArrowDownToLine className="w-4 h-4 text-green-500" />}
                  {type === 'Withdraw' && <ArrowUpFromLine className="w-4 h-4 text-red-500" />}
                  {type === 'Bonus' && <Gift className="w-4 h-4 text-purple-500" />}
                  {type === 'Daily Reward' && <Calendar className="w-4 h-4 text-blue-500" />}
                </div>
                <div>
                  <p className="font-semibold text-sm">{transaction.description}</p>
                  <p className="text-xs text-muted-foreground">{transaction.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${type === 'Withdraw' ? 'text-red-500' : 'text-green-500'}`}>
                  {type === 'Withdraw' ? '-' : '+'}{transaction.amount.toFixed(2)} Tokens
                </p>
                <p className={`text-xs font-medium uppercase ${getStatusColor(transaction.status)}`}>
                  {transaction.status}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
              <span>Transaction ID: {transaction.id}</span>
            </div>
          </Card>
        ))}
      </div>
    );
  };
  
  return (
    <div className="min-h-screen relative">
      <BlockchainBackground />
      
      <div className="relative z-10 p-4 max-w-3xl mx-auto pb-20">
        {/* Header */}
        <header className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold flex-1 text-center pr-8">Transaction History</h1>
        </header>

        {/* Tabs */}
        <Tabs defaultValue="deposit" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="deposit">Deposit</TabsTrigger>
            <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
            <TabsTrigger value="bonus">Bonus</TabsTrigger>
            <TabsTrigger value="daily">Daily</TabsTrigger>
          </TabsList>

          <TabsContent value="deposit">
            <TransactionList transactions={depositTransactions} type="Deposit" loading={loading} />
          </TabsContent>

          <TabsContent value="withdraw">
            <TransactionList transactions={withdrawTransactions} type="Withdraw" loading={loading} />
          </TabsContent>

          <TabsContent value="bonus">
            <TransactionList transactions={bonusTransactions} type="Bonus" loading={loading} />
          </TabsContent>

          <TabsContent value="daily">
            <TransactionList transactions={dailyRewardTransactions} type="Daily Reward" loading={loading} />
          </TabsContent>
        </Tabs>

        {/* Pagination */}
        {!loading && pagination.pages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            
            <span className="text-sm text-muted-foreground">
              Page {pagination.page} of {pagination.pages} ({pagination.total} total)
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
              disabled={page === pagination.pages}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
