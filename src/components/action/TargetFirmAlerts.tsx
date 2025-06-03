
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Building2 } from 'lucide-react';
import { TargetFirm, Alert, NewFirmData } from '@/types/targetFirms';
import TargetFirmCard from './TargetFirmCard';
import AlertCard from './AlertCard';
import AddFirmDialog from './AddFirmDialog';

const TargetFirmAlerts = () => {
  const [targetFirms, setTargetFirms] = useState<TargetFirm[]>([
    {
      id: '1',
      name: 'TechCorp',
      industry: 'Technology',
      size: '1000-5000',
      location: 'San Francisco, CA',
      priority: 'high',
      alertsEnabled: true,
      lastUpdate: '2024-01-10T10:30:00Z',
      website: 'https://techcorp.com'
    },
    {
      id: '2',
      name: 'StartupXYZ',
      industry: 'Fintech',
      size: '50-200',
      location: 'New York, NY',
      priority: 'high',
      alertsEnabled: true,
      lastUpdate: '2024-01-09T15:20:00Z',
      website: 'https://startupxyz.com'
    },
    {
      id: '3',
      name: 'InnovateLabs',
      industry: 'AI/ML',
      size: '200-1000',
      location: 'Austin, TX',
      priority: 'medium',
      alertsEnabled: false,
      lastUpdate: '2024-01-08T09:15:00Z'
    }
  ]);

  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      firmId: '1',
      firmName: 'TechCorp',
      type: 'job_posting',
      title: 'New Senior Developer Position Posted',
      description: 'TechCorp posted a Senior Full-Stack Developer position that matches your profile',
      timestamp: '2024-01-10T10:30:00Z',
      isRead: false,
      actionUrl: 'https://techcorp.com/careers/senior-developer'
    },
    {
      id: '2',
      firmId: '2',
      firmName: 'StartupXYZ',
      type: 'news',
      title: 'Company Announces Series B Funding',
      description: 'StartupXYZ raised $25M in Series B, likely expanding their engineering team',
      timestamp: '2024-01-09T15:20:00Z',
      isRead: false,
      actionUrl: 'https://techcrunch.com/startupxyz-series-b'
    },
    {
      id: '3',
      firmId: '1',
      firmName: 'TechCorp',
      type: 'people_update',
      title: 'Engineering Team Expansion',
      description: 'TechCorp hired 3 new engineering managers, indicating team growth',
      timestamp: '2024-01-08T12:45:00Z',
      isRead: true
    }
  ]);

  const [isAddingFirm, setIsAddingFirm] = useState(false);
  const [newFirm, setNewFirm] = useState<NewFirmData>({
    name: '',
    industry: '',
    size: '',
    location: '',
    priority: 'medium',
    website: ''
  });

  const handleAddFirm = () => {
    if (newFirm.name.trim()) {
      const firm: TargetFirm = {
        id: Date.now().toString(),
        ...newFirm,
        alertsEnabled: true,
        lastUpdate: new Date().toISOString()
      };
      setTargetFirms([...targetFirms, firm]);
      setNewFirm({
        name: '',
        industry: '',
        size: '',
        location: '',
        priority: 'medium',
        website: ''
      });
      setIsAddingFirm(false);
    }
  };

  const toggleAlerts = (firmId: string) => {
    setTargetFirms(targetFirms.map(firm => 
      firm.id === firmId ? { ...firm, alertsEnabled: !firm.alertsEnabled } : firm
    ));
  };

  const markAsRead = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
  };

  const unreadAlerts = alerts.filter(alert => !alert.isRead);

  return (
    <div className="space-y-6">
      {/* Alerts Overview */}
      <Card className="premium-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="gradient-text flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Target Firm Alerts</span>
              </CardTitle>
              <CardDescription>
                Stay updated on opportunities and news from your target companies
              </CardDescription>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{targetFirms.length}</div>
                <div className="text-xs text-gray-500">Companies</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{unreadAlerts.length}</div>
                <div className="text-xs text-gray-500">New Alerts</div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Target Companies */}
        <Card className="premium-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="w-5 h-5" />
                <span>Target Companies</span>
              </CardTitle>
              <AddFirmDialog
                isOpen={isAddingFirm}
                onOpenChange={setIsAddingFirm}
                newFirm={newFirm}
                onNewFirmChange={setNewFirm}
                onAddFirm={handleAddFirm}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {targetFirms.map((firm) => (
                <TargetFirmCard
                  key={firm.id}
                  firm={firm}
                  onToggleAlerts={toggleAlerts}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card className="premium-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5" />
              <span>Recent Alerts</span>
              {unreadAlerts.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadAlerts.length} new
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onMarkAsRead={markAsRead}
                />
              ))}
              {alerts.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No alerts yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TargetFirmAlerts;
