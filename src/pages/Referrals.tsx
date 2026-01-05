import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Check, Send, User, Users, Activity, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BlockchainBackground from '@/components/BlockchainBackground';
import { toast } from '@/hooks/use-toast';
import { useProfile, useReferrals, useCheckLevelRewards } from '@/hooks/useApi';

const Referrals = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: profileData } = useProfile();
  const { data: referralsData, isLoading: loading } = useReferrals(page, limit);
  const checkLevelRewards = useCheckLevelRewards();
  
  const referralCode = profileData?.referralCode || '';
  const referrals = referralsData?.data || [];
  const pagination = referralsData?.pagination || { page: 1, pages: 1, total: 0 };
  const teamCounts = referralsData?.teamCounts || { left: 0, right: 0 };

  useEffect(() => {
    // Check for level rewards in the background (only once on mount)
    checkLevelRewards.mutate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Map referrals with stored side from backend
  const referredUsers = referrals.map((ref: any) => ({
    id: ref._id,
    user: ref.referred.username,
    status: 'Approved',
    date: new Date(ref.createdAt).toLocaleDateString(),
    side: ref.side || 'left'
  }));

  // Use current page data for display
  const leftTeam = referredUsers.filter(user => user.side === 'left');
  const rightTeam = referredUsers.filter(user => user.side === 'right');

  const handleCopy = async () => {
    await navigator.clipboard.writeText(referralCode);
    setCopied(true);
    toast({ title: 'Referral code copied!' });
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <BlockchainBackground />
        <div className="relative z-10 text-center">
          <Activity className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading referrals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <BlockchainBackground />
      
      <div className="relative z-10 p-4 max-w-lg mx-auto">
        {/* Header */}
        <header className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold flex-1 text-center pr-8">Referrals</h1>
        </header>

        {/* Referral Code Card */}
        <div className="border-2 border-border rounded-xl bg-card/90 backdrop-blur-sm p-6 mb-4 card-glow">
          <p className="text-sm text-muted-foreground mb-2">Your Referral Code</p>
          
          <div className="flex items-center gap-2 bg-input rounded-lg p-3 border border-border mb-4">
            <span className="flex-1 text-lg font-semibold text-center">{referralCode}</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCopy}
              className="shrink-0 text-accent border-accent hover:bg-accent/10"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span className="ml-1">Copy</span>
            </Button>
          </div>

          {/* Team Stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 text-center">
              <Users className="w-5 h-5 text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground mb-1">Left Team</p>
              <p className="text-2xl font-bold text-primary">{teamCounts.left}</p>
            </div>
            <div className="bg-accent/10 border border-accent/30 rounded-lg p-3 text-center">
              <Users className="w-5 h-5 text-accent mx-auto mb-1" />
              <p className="text-xs text-muted-foreground mb-1">Right Team</p>
              <p className="text-2xl font-bold text-accent">{teamCounts.right}</p>
            </div>
          </div>
        </div>

        {/* Binary Tree Structure */}
        <div className="border-2 border-border rounded-xl bg-card/90 backdrop-blur-sm p-6 mb-4 card-glow">
          <h2 className="text-lg font-semibold mb-4 text-center">Your Referral Network</h2>

          {/* You (Root) */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center border-2 border-primary">
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-border" />
            </div>
            <p className="mt-2 font-semibold text-sm">You</p>
          </div>

          {/* Left and Right Branches */}
          <div className="relative">
            {/* Connecting Lines */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-border" />
            <div className="absolute top-0 left-1/4 w-0.5 h-8 bg-border" />
            <div className="absolute top-0 right-1/4 w-0.5 h-8 bg-border" />

            <div className="grid grid-cols-2 gap-4 pt-8">
              {/* Left Team Column */}
              <div>
                <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <Users className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-semibold text-primary">Left Team</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{leftTeam.length} members</p>
                </div>

                <div className="space-y-2">
                  {leftTeam.length > 0 ? (
                    leftTeam.map((user) => (
                      <div 
                        key={user.id}
                        className="bg-secondary/50 border border-primary/20 rounded-lg p-3 hover:bg-secondary/70 transition-colors"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                            <User className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{user.user}</p>
                            <p className="text-xs text-muted-foreground">{user.date}</p>
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          user.status === 'Approved' 
                            ? 'bg-green-500/20 text-green-500' 
                            : 'bg-yellow-500/20 text-yellow-500'
                        }`}>
                          {user.status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground text-sm">
                      No members yet
                    </div>
                  )}
                </div>
              </div>

              {/* Right Team Column */}
              <div>
                <div className="bg-accent/10 border border-accent/30 rounded-lg p-3 mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                      <Users className="w-4 h-4 text-accent" />
                    </div>
                    <span className="font-semibold text-accent">Right Team</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{rightTeam.length} members</p>
                </div>

                <div className="space-y-2">
                  {rightTeam.length > 0 ? (
                    rightTeam.map((user) => (
                      <div 
                        key={user.id}
                        className="bg-secondary/50 border border-accent/20 rounded-lg p-3 hover:bg-secondary/70 transition-colors"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                            <User className="w-4 h-4 text-accent" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{user.user}</p>
                            <p className="text-xs text-muted-foreground">{user.date}</p>
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          user.status === 'Approved' 
                            ? 'bg-green-500/20 text-green-500' 
                            : 'bg-yellow-500/20 text-yellow-500'
                        }`}>
                          {user.status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground text-sm">
                      No members yet
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

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

export default Referrals;
