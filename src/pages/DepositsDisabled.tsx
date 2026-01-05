import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import BlockchainBackground from '@/components/BlockchainBackground';
import { ArrowDownCircle, ArrowLeft, LayoutDashboard } from 'lucide-react';

const DepositsDisabled = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <BlockchainBackground />
      
      <div className="relative z-10 w-full max-w-2xl">
        <Card className="border-2 border-accent bg-gradient-to-b from-card/95 to-card/80 backdrop-blur-sm p-8 card-glow text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center">
              <ArrowDownCircle className="w-10 h-10 text-accent" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold mb-4 text-gradient-gold">
            Deposits Temporarily Disabled
          </h1>
          
          <p className="text-lg text-muted-foreground mb-6">
            Deposit functionality is currently unavailable.
          </p>
          
          <div className="bg-secondary/50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-3">What You Need to Know</h2>
            <ul className="text-left space-y-2 text-muted-foreground">
              <li>• Deposit submissions are temporarily paused</li>
              <li>• Your existing balance and transactions remain safe</li>
              <li>• Other platform features continue to work normally</li>
              <li>• Deposits will be re-enabled shortly</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Button>
            <Button variant="default" onClick={() => navigate('/transactions')}>
              View Transaction History
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-6">
            You can still view your balance, transactions, and use other platform features.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default DepositsDisabled;
