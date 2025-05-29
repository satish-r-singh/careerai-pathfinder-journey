
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProgressBar from '@/components/ProgressBar';
import PhaseCard from '@/components/PhaseCard';
import { Bell, Calendar, CheckCircle, TrendingUp, User, BookOpen } from 'lucide-react';

const Dashboard = () => {
  const [currentPhase] = useState(1);
  
  const phases = [
    {
      id: 1,
      name: 'Introspection',
      description: 'Self-discovery and career alignment',
      status: 'current' as const,
      progress: 25,
      estimatedTime: '1-2 weeks',
      keyActivities: ['Complete Ikigai assessment', 'Research target roles', 'Define career goals']
    },
    {
      id: 2,
      name: 'Exploration',
      description: 'Project identification and knowledge building',
      status: 'locked' as const,
      progress: 0,
      estimatedTime: '2-3 weeks',
      keyActivities: ['Choose project topic', 'Build learning plan', 'Start building in public']
    },
    {
      id: 3,
      name: 'Reflection',
      description: 'Skill validation through feedback',
      status: 'locked' as const,
      progress: 0,
      estimatedTime: '3-4 weeks',
      keyActivities: ['Get peer feedback', 'Connect with mentors', 'Build case studies']
    },
    {
      id: 4,
      name: 'Action',
      description: 'Active job hunting and applications',
      status: 'locked' as const,
      progress: 0,
      estimatedTime: 'Ongoing',
      keyActivities: ['Apply to positions', 'Network with recruiters', 'Track applications']
    }
  ];

  const todaysTasks = [
    { id: 1, task: 'Complete Ikigai questionnaire', priority: 'high', estimated: '30 min' },
    { id: 2, task: 'Research 3 target AI companies', priority: 'medium', estimated: '45 min' },
    { id: 3, task: 'Read industry trend article', priority: 'low', estimated: '15 min' }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="ml-2 text-xl font-bold gradient-text">CareerAI</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <User className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, Alex! 👋
          </h1>
          <p className="text-gray-600">
            You're in the <span className="font-semibold text-primary">Introspection</span> phase. 
            Let's continue building your AI career foundation.
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span>Your Progress</span>
            </CardTitle>
            <CardDescription>
              Track your journey through the 4-phase career transition program
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProgressBar currentPhase={currentPhase} totalPhases={4} />
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Today's Tasks */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Today's Focus</span>
                </CardTitle>
                <CardDescription>
                  Complete these tasks to progress in your current phase
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todaysTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <input type="checkbox" className="rounded" />
                        <div>
                          <p className="font-medium">{task.task}</p>
                          <p className="text-sm text-gray-500">Estimated: {task.estimated}</p>
                        </div>
                      </div>
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Phase Cards */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Your Career Journey</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {phases.map((phase) => (
                  <PhaseCard 
                    key={phase.id} 
                    phase={phase}
                    onClick={() => console.log(`Navigate to ${phase.name} phase`)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Days Active</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tasks Completed</span>
                  <span className="font-semibold">8/32</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Phase Progress</span>
                  <span className="font-semibold">25%</span>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Upcoming</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <p className="font-medium">Phase Assessment</p>
                  <p className="text-gray-500">Due in 5 days</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium">Mentor Check-in</p>
                  <p className="text-gray-500">Scheduled for Friday</p>
                </div>
              </CardContent>
            </Card>

            {/* Resources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Recommended</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <p className="font-medium text-primary cursor-pointer hover:underline">
                    AI Career Transition Guide
                  </p>
                  <p className="text-gray-500">Essential reading for Phase 1</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-primary cursor-pointer hover:underline">
                    Industry Trends Report 2024
                  </p>
                  <p className="text-gray-500">Latest AI job market insights</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
