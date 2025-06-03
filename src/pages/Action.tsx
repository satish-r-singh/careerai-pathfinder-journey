import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Briefcase, Users, Target, Plus, Search, Filter, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ActionHeader from '@/components/ActionHeader';
import JobApplicationTracker from '@/components/action/JobApplicationTracker';
import NetworkingTools from '@/components/action/NetworkingTools';
import ActionProgress from '@/components/action/ActionProgress';
import ProjectDashboard from '@/components/action/ProjectDashboard';
import Delta4Analysis from '@/components/action/Delta4Analysis';
import TargetFirmAlerts from '@/components/action/TargetFirmAlerts';

const Action = () => {
  const [activeTab, setActiveTab] = useState('applications');
  const { user } = useAuth();
  const navigate = useNavigate();

  const tabs = [
    { id: 'applications', name: 'Job Applications', icon: Briefcase },
    { id: 'networking', name: 'Networking', icon: Users },
    { id: 'projects', name: 'Project Dashboard', icon: Target },
    { id: 'delta4', name: 'Delta 4 Analysis', icon: CheckCircle },
    { id: 'alerts', name: 'Target Firm Alerts', icon: Search },
  ];

  const actionActivities = [
    {
      title: 'Apply to Positions',
      description: 'Track your job applications and follow-ups',
      status: 'in-progress',
      estimatedTime: 'Ongoing'
    },
    {
      title: 'Network with Recruiters',
      description: 'Build relationships with industry professionals',
      status: 'in-progress',
      estimatedTime: 'Ongoing'
    },
    {
      title: 'Track Application Progress',
      description: 'Monitor your application pipeline',
      status: 'in-progress',
      estimatedTime: 'Ongoing'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50/30 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-200/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-emerald-200/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-teal-200/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <ActionHeader />

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="premium-card mb-6">
              <CardHeader>
                <CardTitle className="text-lg gradient-text">Your Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <ActionProgress />
              </CardContent>
            </Card>

            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="text-lg gradient-text">Activities</CardTitle>
                <CardDescription>Your action plan activities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {actionActivities.map((activity, index) => (
                  <div key={index} className="border-l-4 border-green-200 pl-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{activity.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">{activity.description}</p>
                        <p className="text-xs text-gray-400 mt-1">Est: {activity.estimatedTime}</p>
                      </div>
                      <div className="ml-2">
                        <div className="w-4 h-4 rounded-full bg-green-500" />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tab Navigation */}
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                          flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors
                          ${activeTab === tab.id
                            ? 'border-green-500 text-green-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }
                        `}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {tab.name}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === 'applications' && <JobApplicationTracker />}
              {activeTab === 'networking' && <NetworkingTools />}
              {activeTab === 'projects' && <ProjectDashboard />}
              {activeTab === 'delta4' && <Delta4Analysis />}
              {activeTab === 'alerts' && <TargetFirmAlerts />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Action;
