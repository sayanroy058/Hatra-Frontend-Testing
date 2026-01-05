import { useState, useEffect } from 'react';
import { 
  Users, 
  Shield, 
  Lock, 
  CheckCircle2, 
  XCircle, 
  Activity,
  AlertTriangle,
  Settings as SettingsIcon
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/components/AdminLayout';
import { toast } from '@/hooks/use-toast';
import { adminAPI } from '@/services/api';

const PASSCODE = 'HatMaxLimUse@598';

interface UserLimitSettings {
  maxUsersEnabled: boolean;
  maxUsersLimit: number;
  currentUserCount: number;
}

const AdminUserLimit = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [showPasscodeDialog, setShowPasscodeDialog] = useState(true);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [settings, setSettings] = useState<UserLimitSettings>({
    maxUsersEnabled: false,
    maxUsersLimit: 0,
    currentUserCount: 0,
  });

  const [formData, setFormData] = useState({
    maxUsersEnabled: false,
    maxUsersLimit: '',
  });

  const handlePasscodeSubmit = () => {
    if (passcode === PASSCODE) {
      setIsAuthenticated(true);
      setShowPasscodeDialog(false);
      fetchSettings();
      toast({
        title: 'Access Granted',
        description: 'You can now manage user limits',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Access Denied',
        description: 'Invalid passcode. Please try again.',
      });
      setPasscode('');
    }
  };

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const [settingsResponse, usersResponse] = await Promise.all([
        adminAPI.getSettings(),
        adminAPI.getAllUsers({ page: 1, limit: 1 }),
      ]);

      const settingsData = settingsResponse.data;
      const maxUsersEnabled = settingsData.find((s: any) => s.key === 'maxUsersEnabled')?.value || false;
      const maxUsersLimit = settingsData.find((s: any) => s.key === 'maxUsersLimit')?.value || 0;
      const currentUserCount = usersResponse.data.pagination?.total || 0;

      setSettings({
        maxUsersEnabled,
        maxUsersLimit,
        currentUserCount,
      });

      setFormData({
        maxUsersEnabled,
        maxUsersLimit: maxUsersLimit.toString(),
      });
    } catch (error: any) {
      console.error('Error fetching settings:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load user limit settings',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const limit = parseInt(formData.maxUsersLimit);
    
    if (formData.maxUsersEnabled && (!formData.maxUsersLimit || limit <= 0)) {
      toast({
        variant: 'destructive',
        title: 'Invalid Input',
        description: 'Please enter a valid maximum user limit greater than 0',
      });
      return;
    }

    if (formData.maxUsersEnabled && limit < settings.currentUserCount) {
      toast({
        variant: 'destructive',
        title: 'Invalid Limit',
        description: `Limit cannot be less than current user count (${settings.currentUserCount})`,
      });
      return;
    }

    try {
      setSubmitting(true);
      await adminAPI.updateSettings([
        {
          key: 'maxUsersEnabled',
          value: formData.maxUsersEnabled,
          description: 'Enable/disable maximum user registration limit',
        },
        {
          key: 'maxUsersLimit',
          value: formData.maxUsersEnabled ? limit : 0,
          description: 'Maximum number of users allowed to register',
        },
      ]);

      toast({
        title: 'Settings Updated',
        description: 'User limit settings have been updated successfully',
      });

      fetchSettings();
    } catch (error: any) {
      console.error('Error updating settings:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update settings',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusInfo = () => {
    if (!settings.maxUsersEnabled) {
      return {
        color: 'bg-green-500/20 text-green-500 border-green-500/30',
        icon: CheckCircle2,
        status: 'Unlimited',
        message: 'Registration is open for unlimited users',
      };
    }

    const remaining = settings.maxUsersLimit - settings.currentUserCount;
    const percentage = (settings.currentUserCount / settings.maxUsersLimit) * 100;

    if (remaining <= 0) {
      return {
        color: 'bg-red-500/20 text-red-500 border-red-500/30',
        icon: XCircle,
        status: 'Limit Reached',
        message: 'Maximum user limit has been reached',
      };
    }

    if (percentage >= 90) {
      return {
        color: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
        icon: AlertTriangle,
        status: 'Near Limit',
        message: `Only ${remaining} slots remaining`,
      };
    }

    return {
      color: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
      icon: Users,
      status: 'Active',
      message: `${remaining} slots available`,
    };
  };

  if (!isAuthenticated) {
    return (
      <AdminLayout title="Maximum Users On Board">
        <Dialog open={showPasscodeDialog} onOpenChange={() => {}}>
          <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Restricted Access
              </DialogTitle>
              <DialogDescription>
                This page requires a passcode for access. Please enter the passcode to continue.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="passcode">Passcode</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="passcode"
                    type="password"
                    placeholder="Enter passcode"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handlePasscodeSubmit()}
                    className="pl-10"
                    autoFocus
                  />
                </div>
              </div>

              <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                <p className="text-xs text-yellow-500 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  This page allows modifying critical registration limits
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button
                onClick={handlePasscodeSubmit}
                className="w-full"
                disabled={!passcode}
              >
                <Shield className="w-4 h-4 mr-2" />
                Verify Passcode
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="flex items-center justify-center h-96">
          <Card className="p-8 bg-card/90 backdrop-blur-sm border-2 border-border text-center max-w-md">
            <Lock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Access Restricted</h3>
            <p className="text-muted-foreground">
              Please enter the passcode to access user limit settings
            </p>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  if (loading) {
    return (
      <AdminLayout title="Maximum Users On Board">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Activity className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading settings...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <AdminLayout title="Maximum Users On Board">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="p-6 bg-card/90 backdrop-blur-sm border-2 border-border">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/20">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">Maximum Users On Board</h2>
              <p className="text-sm text-muted-foreground">
                Control the maximum number of users allowed to register on the platform
              </p>
            </div>
            <Badge className={statusInfo.color}>
              <StatusIcon className="w-4 h-4 mr-1" />
              {statusInfo.status}
            </Badge>
          </div>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 bg-card/90 backdrop-blur-sm border-2 border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Users</p>
                <h3 className="text-3xl font-bold mt-1">{settings.currentUserCount}</h3>
              </div>
              <Users className="w-10 h-10 text-blue-500" />
            </div>
          </Card>

          <Card className="p-6 bg-card/90 backdrop-blur-sm border-2 border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Maximum Limit</p>
                <h3 className="text-3xl font-bold mt-1">
                  {settings.maxUsersEnabled ? settings.maxUsersLimit : '∞'}
                </h3>
              </div>
              <SettingsIcon className="w-10 h-10 text-purple-500" />
            </div>
          </Card>

          <Card className="p-6 bg-card/90 backdrop-blur-sm border-2 border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available Slots</p>
                <h3 className="text-3xl font-bold mt-1">
                  {settings.maxUsersEnabled 
                    ? Math.max(0, settings.maxUsersLimit - settings.currentUserCount)
                    : '∞'}
                </h3>
              </div>
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
          </Card>
        </div>

        {/* Status Message */}
        <Card className={`p-4 border-2 ${statusInfo.color}`}>
          <div className="flex items-center gap-3">
            <StatusIcon className="w-6 h-6" />
            <p className="font-medium">{statusInfo.message}</p>
          </div>
        </Card>

        {/* Settings Form */}
        <Card className="p-6 bg-card/90 backdrop-blur-sm border-2 border-border">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <SettingsIcon className="w-5 h-5" />
            Limit Configuration
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Enable/Disable Toggle */}
            <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border">
              <div>
                <Label className="text-base font-medium">Enable User Limit</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Restrict the total number of users who can register
                </p>
              </div>
              <Button
                type="button"
                variant={formData.maxUsersEnabled ? "default" : "outline"}
                onClick={() => setFormData({ ...formData, maxUsersEnabled: !formData.maxUsersEnabled })}
                disabled={submitting}
              >
                {formData.maxUsersEnabled ? 'Enabled' : 'Disabled'}
              </Button>
            </div>

            {/* Maximum Users Input */}
            {formData.maxUsersEnabled && (
              <div className="space-y-2">
                <Label htmlFor="maxLimit">Maximum Users Allowed</Label>
                <Input
                  id="maxLimit"
                  type="number"
                  min={settings.currentUserCount}
                  step="1"
                  placeholder="Enter maximum number of users"
                  value={formData.maxUsersLimit}
                  onChange={(e) => setFormData({ ...formData, maxUsersLimit: e.target.value })}
                  disabled={submitting}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Minimum: {settings.currentUserCount} (current user count)
                </p>
              </div>
            )}

            {/* Warning Message */}
            <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
              <div className="flex gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-1 text-sm">
                  <p className="font-medium text-yellow-500">Important Information:</p>
                  <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                    <li>When the limit is reached, new users will see a maintenance page</li>
                    <li>Existing users can still log in and use the platform</li>
                    <li>You can disable the limit at any time to allow new registrations</li>
                    <li>The limit cannot be set below the current number of registered users</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={fetchSettings}
                disabled={submitting}
                className="flex-1"
              >
                Reset Changes
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="flex-1 gap-2"
              >
                {submitting ? (
                  <>
                    <Activity className="w-4 h-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Save Settings
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminUserLimit;
