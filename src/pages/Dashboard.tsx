
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProgressBar from '@/components/ProgressBar';
import PhaseCard from '@/components/PhaseCard';
import { Bell, Calendar, CheckCircle, TrendingUp, User, BookOpen, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const [currentPhase, setCurrentPhase] = useState(1);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  const [ikigaiCompleted, setIkigaiCompleted] = useState(false);
  const [industryResearchCompleted, setIndustryResearchCompleted] = useState(false);
  const [careerRoadmapCompleted, setCareerRoadmapCompleted] = useState(false);
  const [ikigaiLoading, setIkigaiLoading] = useState(true);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    loadIntrospectionProgress();
  }, [user]);

  const loadIntrospectionProgress = async () => {
    if (!user) {
      setIkigaiLoading(false);
      return;
    }
    
    try {
      console.log('Loading introspection progress for dashboard...');
      
      // Load Ikigai progress
      const { data: ikigaiData, error: ikigaiError } = await supabase
        .from('ikigai_progress')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (ikigaiError) {
        console.error('Error loading ikigai progress:', ikigaiError);
        return;
      }

      console.log('Dashboard - Ikigai progress data:', ikigaiData);
      const isIkigaiCompleted = ikigaiData?.is_completed || false;
      console.log('Dashboard - Setting ikigaiCompleted to:', isIkigaiCompleted);
      setIkigaiCompleted(isIkigaiCompleted);

      // Load Industry Research completion
      const { data: researchData, error: researchError } = await supabase
        .from('industry_research')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (researchError) {
        console.error('Error checking Industry Research status:', researchError);
      } else {
        const isResearchCompleted = !!researchData;
        console.log('Dashboard - Setting industryResearchCompleted to:', isResearchCompleted);
        setIndustryResearchCompleted(isResearchCompleted);
      }

      // Load Career Roadmap completion
      const { data: roadmapData, error: roadmapError } = await supabase
        .from('career_roadmaps')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (roadmapError) {
        console.error('Error checking Career Roadmap status:', roadmapError);
      } else {
        const isRoadmapCompleted = !!roadmapData;
        console.log('Dashboard - Setting careerRoadmapCompleted to:', isRoadmapCompleted);
        setCareerRoadmapCompleted(isRoadmapCompleted);
      }

      // Calculate overall introspection phase progress based on actual completion status
      let totalProgress = 0;

      // 1. Ikigai assessment (33% of total progress)
      if (isIkigaiCompleted) {
        totalProgress += 33;
      } else if (ikigaiData?.current_step > 0) {
        // Partial progress based on current step (assuming 4 total steps)
        const stepProgress = ((ikigaiData.current_step + 1) / 4) * 33;
        totalProgress += Math.min(stepProgress, 30); // Cap at 30% until fully completed
      }

      // 2. Industry research (33% of total progress)
      if (!!researchData) {
        totalProgress += 33;
      }

      // 3. Career roadmap (34% of total progress)
      if (!!roadmapData) {
        totalProgress += 34;
      }

      console.log('Dashboard - Calculated progress:', totalProgress, {
        ikigai: isIkigaiCompleted,
        research: !!researchData,
        roadmap: !!roadmapData
      });

      setPhaseProgress(Math.round(totalProgress));

      // Update current phase based on completion
      const introspectionCompleted = isIkigaiCompleted && !!researchData && !!roadmapData;
      if (introspectionCompleted) {
        setCurrentPhase(2); // Move to Exploration phase
      } else {
        setCurrentPhase(1); // Stay in Introspection phase
      }
    } catch (error) {
      console.error('Error loading introspection progress:', error);
    } finally {
      setIkigaiLoading(false);
    }
  };
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleIntrospectionClick = () => {
    console.log('Introspection clicked - ikigaiCompleted:', ikigaiCompleted, 'ikigaiLoading:', ikigaiLoading);
    
    if (ikigaiLoading) {
      // Wait for loading to complete
      return;
    }
    
    if (ikigaiCompleted) {
      // Navigate to introspection page which will show next steps
      navigate('/introspection');
    } else {
      // Navigate to ikigai discovery
      navigate('/ikigai');
    }
  };

  // Determine phase statuses based on current phase
  const getPhaseStatus = (phaseId: number) => {
    if (phaseId < currentPhase) return 'completed';
    if (phaseId === currentPhase) return 'current';
    return 'locked';
  };

  const phases = [
    {
      id: 1,
      name: 'Introspection',
      description: 'Self-discovery and career alignment',
      status: getPhaseStatus(1),
      progress: currentPhase > 1 ? 100 : phaseProgress,
      estimatedTime: '1-2 weeks',
      keyActivities: ['Complete Ikigai assessment', 'Research AI industry', 'Generate career roadmap']
    },
    {
      id: 2,
      name: 'Exploration',
      description: 'Project identification and knowledge building',
      status: getPhaseStatus(2),
      progress: currentPhase > 2 ? 100 : 0,
      estimatedTime: '2-3 weeks',
      keyActivities: ['Choose project topic', 'Build learning plan', 'Start building in public']
    },
    {
      id: 3,
      name: 'Reflection',
      description: 'Skill validation through feedback',
      status: getPhaseStatus(3),
      progress: currentPhase > 3 ? 100 : 0,
      estimatedTime: '3-4 weeks',
      keyActivities: ['Get peer feedback', 'Connect with mentors', 'Build case studies']
    },
    {
      id: 4,
      name: 'Action',
      description: 'Active job hunting and applications',
      status: getPhaseStatus(4),
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

  const handleTaskToggle = (taskId: number) => {
    setCompletedTasks(prev => {
      const newCompleted = prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId];
      
      // Recalculate progress when tasks change
      setTimeout(() => loadIntrospectionProgress(), 100);
      
      return newCompleted;
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get current phase name for display
  const getCurrentPhaseName = () => {
    const currentPhaseData = phases.find(p => p.id === currentPhase);
    return currentPhaseData?.name || 'Introspection';
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
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.user_metadata?.full_name || user?.email}! 👋
          </h1>
          <p className="text-gray-600">
            You're in the <span className="font-semibold text-primary">{getCurrentPhaseName()}</span> phase. 
            {currentPhase === 1 
              ? " Let's continue building your AI career foundation."
              : " Great progress! Continue with your career journey."
            }
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
                        <input 
                          type="checkbox" 
                          className="rounded" 
                          checked={completedTasks.includes(task.id)}
                          onChange={() => handleTaskToggle(task.id)}
                        />
                        <div>
                          <p className={`font-medium ${completedTasks.includes(task.id) ? 'line-through text-gray-500' : ''}`}>
                            {task.task}
                          </p>
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
                    onClick={() => {
                      if (phase.name === 'Introspection') {
                        handleIntrospectionClick();
                      } else {
                        console.log(`Navigate to ${phase.name} phase`);
                      }
                    }}
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
                  <span className="font-semibold">{completedTasks.length + 8}/32</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Current Phase</span>
                  <span className="font-semibold">{getCurrentPhaseName()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Phase Progress</span>
                  <span className="font-semibold">
                    {currentPhase === 1 ? `${Math.round(phaseProgress)}%` : '100%'}
                  </span>
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
