
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, MessageSquare, Star, Calendar, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ReflectionHeader from '@/components/ReflectionHeader';
import FeedbackCollection from '@/components/reflection/FeedbackCollection';
import MentorConnection from '@/components/reflection/MentorConnection';
import ReflectionProgress from '@/components/reflection/ReflectionProgress';

const Reflection = () => {
  const [activeTab, setActiveTab] = useState('feedback');
  const { user } = useAuth();
  const navigate = useNavigate();

  const tabs = [
    { id: 'feedback', name: 'Peer Feedback', icon: MessageSquare },
    { id: 'mentors', name: 'Connect with Mentors', icon: Users },
  ];

  const reflectionActivities = [
    {
      title: 'Collect Peer Feedback',
      description: 'Get valuable insights from fellow professionals',
      status: 'in-progress',
      estimatedTime: '1-2 weeks'
    },
    {
      title: 'Connect with Mentors',
      description: 'Find experienced professionals to guide your journey',
      status: 'pending',
      estimatedTime: '2-3 weeks'
    },
    {
      title: 'Skill Validation',
      description: 'Validate your skills through practical feedback',
      status: 'pending',
      estimatedTime: '1 week'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-indigo-200/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-200/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <ReflectionHeader />

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="premium-card mb-6">
              <CardHeader>
                <CardTitle className="text-lg gradient-text">Your Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <ReflectionProgress />
              </CardContent>
            </Card>

            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="text-lg gradient-text">Activities</CardTitle>
                <CardDescription>Track your reflection journey</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {reflectionActivities.map((activity, index) => (
                  <div key={index} className="border-l-4 border-purple-200 pl-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{activity.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">{activity.description}</p>
                        <p className="text-xs text-gray-400 mt-1">Est: {activity.estimatedTime}</p>
                      </div>
                      <div className="ml-2">
                        {activity.status === 'completed' && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                        {activity.status === 'in-progress' && (
                          <div className="w-4 h-4 rounded-full bg-purple-500" />
                        )}
                        {activity.status === 'pending' && (
                          <div className="w-4 h-4 rounded-full bg-gray-300" />
                        )}
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
                            ? 'border-purple-500 text-purple-600'
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
              {activeTab === 'feedback' && <FeedbackCollection />}
              {activeTab === 'mentors' && <MentorConnection />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reflection;
