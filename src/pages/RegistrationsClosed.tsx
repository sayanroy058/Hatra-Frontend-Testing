import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import BlockchainBackground from '@/components/BlockchainBackground';
import { UserX, ArrowLeft, LogIn } from 'lucide-react';

const RegistrationsClosed = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <BlockchainBackground />
      
      <div className="relative z-10 w-full max-w-2xl">
        <Card className="border-2 border-primary bg-gradient-to-b from-card/95 to-card/80 backdrop-blur-sm p-8 card-glow text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
              <UserX className="w-10 h-10 text-primary" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold mb-4 text-gradient-gold">
            Registrations Temporarily Closed
          </h1>
          
          <p className="text-lg text-muted-foreground mb-6">
            We're not accepting new registrations at this moment.
          </p>
          
          <div className="bg-secondary/50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-3">Important Information</h2>
            <ul className="text-left space-y-2 text-muted-foreground">
              <li>• New user registrations are temporarily paused</li>
              <li>• Existing users can continue to login and use the platform</li>
              <li>• This is a temporary measure to ensure quality service</li>
              <li>• We'll reopen registrations soon</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go to Home
            </Button>
            <Button variant="default" onClick={() => navigate('/login')}>
              <LogIn className="w-4 h-4 mr-2" />
              Login (Existing Users)
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-6">
            Already have an account? You can still login and access all features.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default RegistrationsClosed;
