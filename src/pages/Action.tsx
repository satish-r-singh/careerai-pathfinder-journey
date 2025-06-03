
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

        {/* Progress Summary Bar - Compact horizontal layout */}
        <div className="mb-6">
          <Card className="premium-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold gradient-text">Your Progress</h3>
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">8</div>
                    <div className="text-xs text-gray-600">Applications</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">3</div>
                    <div className="text-xs text-gray-600">Interviews</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">15</div>
                    <div className="text-xs text-gray-600">Contacts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">25%</div>
                    <div className="text-xs text-gray-600">Response Rate</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Full Width Main Content */}
        <div className="w-full">
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

          {/* Tab Content - Full Width */}
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
  );
};

export default Action;
