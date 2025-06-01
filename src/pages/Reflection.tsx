
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, MessageSquare, Star, Calendar, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/dashboard')}
                className="mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Reflection Phase</h1>
                <p className="text-sm text-gray-500">Skill validation through feedback</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              Phase 3 of 4
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Your Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <ReflectionProgress />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Activities</CardTitle>
                <CardDescription>Track your reflection journey</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {reflectionActivities.map((activity, index) => (
                  <div key={index} className="border-l-4 border-gray-200 pl-4">
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
