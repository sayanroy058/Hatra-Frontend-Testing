import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import BlockchainBackground from '@/components/BlockchainBackground';
import { Wrench, ArrowLeft, RefreshCw } from 'lucide-react';

const Maintenance = () => {
  const navigate = useNavigate();

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <BlockchainBackground />
      
      <div className="relative z-10 w-full max-w-2xl">
        <Card className="border-2 border-warning bg-gradient-to-b from-card/95 to-card/80 backdrop-blur-sm p-8 card-glow text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-warning/20 flex items-center justify-center">
              <Wrench className="w-10 h-10 text-warning animate-pulse" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold mb-4 text-gradient-gold">
            Platform Under Maintenance
          </h1>
          
          <p className="text-lg text-muted-foreground mb-6">
            We're currently performing scheduled maintenance to improve your experience.
          </p>
          
          <div className="bg-secondary/50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-3">What does this mean?</h2>
            <ul className="text-left space-y-2 text-muted-foreground">
              <li>• All user operations are temporarily unavailable</li>
              <li>• Registrations, deposits, and withdrawals are paused</li>
              <li>• Your account and funds remain safe and secure</li>
              <li>• We'll be back online shortly</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go to Home
            </Button>
            <Button variant="default" onClick={handleRefresh}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Page
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-6">
            Thank you for your patience. We apologize for any inconvenience.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Maintenance;
