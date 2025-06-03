import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Plus, Building2, Users, TrendingUp, Calendar, ExternalLink, Settings } from 'lucide-react';

interface TargetFirm {
  id: string;
  name: string;
  industry: string;
  size: string;
  location: string;
  priority: 'high' | 'medium' | 'low';
  alertsEnabled: boolean;
  lastUpdate: string;
  website?: string;
}

interface Alert {
  id: string;
  firmId: string;
  firmName: string;
  type: 'job_posting' | 'news' | 'people_update' | 'funding';
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

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
  const [newFirm, setNewFirm] = useState({
    name: '',
    industry: '',
    size: '',
    location: '',
    priority: 'medium' as const,
    website: ''
  });

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'job_posting': return '💼';
      case 'news': return '📰';
      case 'people_update': return '👥';
      case 'funding': return '💰';
      default: return '🔔';
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'job_posting': return 'bg-green-50 border-green-200 text-green-800';
      case 'news': return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'people_update': return 'bg-purple-50 border-purple-200 text-purple-800';
      case 'funding': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

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
              <Dialog open={isAddingFirm} onOpenChange={setIsAddingFirm}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Company
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Target Company</DialogTitle>
                    <DialogDescription>Add a company to monitor for job opportunities and updates</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="company-name">Company Name</Label>
                      <Input
                        id="company-name"
                        value={newFirm.name}
                        onChange={(e) => setNewFirm({...newFirm, name: e.target.value})}
                        placeholder="Enter company name"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="industry">Industry</Label>
                        <Input
                          id="industry"
                          value={newFirm.industry}
                          onChange={(e) => setNewFirm({...newFirm, industry: e.target.value})}
                          placeholder="e.g., Technology"
                        />
                      </div>
                      <div>
                        <Label htmlFor="size">Company Size</Label>
                        <Select value={newFirm.size} onValueChange={(value) => setNewFirm({...newFirm, size: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-50">1-50 employees</SelectItem>
                            <SelectItem value="50-200">50-200 employees</SelectItem>
                            <SelectItem value="200-1000">200-1,000 employees</SelectItem>
                            <SelectItem value="1000-5000">1,000-5,000 employees</SelectItem>
                            <SelectItem value="5000+">5,000+ employees</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={newFirm.location}
                          onChange={(e) => setNewFirm({...newFirm, location: e.target.value})}
                          placeholder="e.g., San Francisco, CA"
                        />
                      </div>
                      <div>
                        <Label htmlFor="priority">Priority</Label>
                        <Select value={newFirm.priority} onValueChange={(value: any) => setNewFirm({...newFirm, priority: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="website">Website (Optional)</Label>
                      <Input
                        id="website"
                        value={newFirm.website}
                        onChange={(e) => setNewFirm({...newFirm, website: e.target.value})}
                        placeholder="https://company.com"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsAddingFirm(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddFirm}>
                        Add Company
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {targetFirms.map((firm) => (
                <Card key={firm.id} className="border hover:shadow-md transition-shadow duration-200">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-sm">{firm.name}</h4>
                          <p className="text-xs text-gray-600">{firm.industry} • {firm.size} employees</p>
                          <p className="text-xs text-gray-500">{firm.location}</p>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <Badge className={`text-xs ${getPriorityColor(firm.priority)}`}>
                            {firm.priority} priority
                          </Badge>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={firm.alertsEnabled}
                              onCheckedChange={() => toggleAlerts(firm.id)}
                            />
                            <span className="text-xs text-gray-500">Alerts</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>Last updated: {new Date(firm.lastUpdate).toLocaleDateString()}</span>
                        {firm.website && (
                          <a 
                            href={firm.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Visit</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
                <Card 
                  key={alert.id} 
                  className={`cursor-pointer transition-all duration-200 ${
                    alert.isRead ? 'opacity-75' : 'border-l-4 border-l-blue-500 shadow-sm'
                  }`}
                  onClick={() => markAsRead(alert.id)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-2">
                          <span className="text-lg">{getAlertIcon(alert.type)}</span>
                          <div>
                            <h4 className="font-medium text-sm">{alert.title}</h4>
                            <p className="text-xs text-gray-600">{alert.description}</p>
                          </div>
                        </div>
                        <Badge className={`text-xs ${getAlertColor(alert.type)}`}>
                          {alert.type.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{alert.firmName}</span>
                        <div className="flex items-center space-x-2">
                          <span>{new Date(alert.timestamp).toLocaleDateString()}</span>
                          {alert.actionUrl && (
                            <a 
                              href={alert.actionUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
