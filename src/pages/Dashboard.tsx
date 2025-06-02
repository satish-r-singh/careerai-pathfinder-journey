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
  // Exploration progress states
  const [explorationProject, setExplorationProject] = useState<string | null>(null);
  const [explorationLearningPlan, setExplorationLearningPlan] = useState(false);
  const [explorationPublicBuilding, setExplorationPublicBuilding] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    loadProgressData();
  }, [user]);

  const loadProgressData = async () => {
    if (!user) {
      setIkigaiLoading(false);
      return;
    }
    
    try {
      console.log('Loading progress data for dashboard...');
      
      // Load Introspection progress
      await loadIntrospectionProgress();
      
      // Load Exploration progress
      await loadExplorationProgress();
    } catch (error) {
      console.error('Error loading progress data:', error);
    } finally {
      setIkigaiLoading(false);
    }
  };

  const loadIntrospectionProgress = async () => {
    try {
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
    } catch (error) {
      console.error('Error loading introspection progress:', error);
    }
  };

  const loadExplorationProgress = async () => {
    try {
      // Check for selected project from localStorage
      const savedProject = localStorage.getItem(`exploration_project_${user.id}`);
      setExplorationProject(savedProject);

      if (savedProject) {
        // Check for learning plan
        const { data: learningPlan, error: learningError } = await supabase
          .from('learning_plans')
          .select('id')
          .eq('user_id', user.id)
          .eq('project_id', savedProject)
          .maybeSingle();

        if (!learningError && learningPlan) {
          setExplorationLearningPlan(true);
        }

        // Check for building in public plan
        const { data: buildingPlan, error: buildingError } = await supabase
          .from('building_in_public_plans')
          .select('id')
          .eq('user_id', user.id)
          .eq('project_id', savedProject)
          .maybeSingle();

        if (!buildingError && buildingPlan) {
          setExplorationPublicBuilding(true);
        }
      }
    } catch (error) {
      console.error('Error loading exploration progress:', error);
    }
  };

  const calculateCurrentPhaseAndProgress = () => {
    // Check if Introspection is complete
    const introspectionComplete = ikigaiCompleted && industryResearchCompleted && careerRoadmapCompleted;
    
    if (!introspectionComplete) {
      // Phase 1: Introspection
      let totalProgress = 0;
      if (ikigaiCompleted) totalProgress += 33;
      if (industryResearchCompleted) totalProgress += 33;
      if (careerRoadmapCompleted) totalProgress += 34;
      
      return { phase: 1, progress: Math.round(totalProgress) };
    }
    
    // Check if Exploration is complete
    const explorationComplete = explorationProject && explorationLearningPlan && explorationPublicBuilding;
    
    if (!explorationComplete) {
      // Phase 2: Exploration
      let totalProgress = 0;
      if (explorationProject) totalProgress += 33;
      if (explorationLearningPlan) totalProgress += 33;
      if (explorationPublicBuilding) totalProgress += 34;
      
      return { phase: 2, progress: Math.round(totalProgress) };
    }
    
    // After Exploration is complete, both Reflection and Action phases are available
    // Default to Phase 3 (Reflection) but both can be accessed
    return { phase: 3, progress: 0 };
  };

  const { phase, progress } = calculateCurrentPhaseAndProgress();
  
  // Update state if needed
  useEffect(() => {
    setCurrentPhase(phase);
    setPhaseProgress(progress);
  }, [phase, progress]);
  
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

  const handlePhaseClick = (phase: any) => {
    console.log(`Navigate to ${phase.name} phase`);
    
    switch (phase.name) {
      case 'Introspection':
        handleIntrospectionClick();
        break;
      case 'Exploration':
        if (phase.status === 'current' || phase.status === 'completed') {
          navigate('/exploration');
        }
        break;
      case 'Reflection':
        if (phase.status === 'current' || phase.status === 'completed') {
          navigate('/reflection');
        }
        break;
      case 'Action':
        if (phase.status === 'current' || phase.status === 'completed') {
          navigate('/action');
        }
        break;
      default:
        console.log(`Unknown phase: ${phase.name}`);
    }
  };

  // Determine phase statuses based on current phase - Updated logic for concurrent phases
  const getPhaseStatus = (phaseId: number): 'completed' | 'current' | 'locked' => {
    if (phaseId < currentPhase) return 'completed';
    if (phaseId === currentPhase) return 'current';
    
    // Special case: After Exploration (Phase 2) is complete, both Reflection (3) and Action (4) are available
    const explorationComplete = explorationProject && explorationLearningPlan && explorationPublicBuilding;
    if (explorationComplete && (phaseId === 3 || phaseId === 4)) {
      return 'current';
    }
    
    return 'locked';
  };

  const phases = [
    {
      id: 1,
      name: 'Introspection',
      description: 'Self-discovery and career alignment',
      status: getPhaseStatus(1),
      progress: currentPhase > 1 ? 100 : currentPhase === 1 ? phaseProgress : 0,
      estimatedTime: '1-2 weeks',
      keyActivities: ['Complete Ikigai assessment', 'Research AI industry', 'Generate career roadmap']
    },
    {
      id: 2,
      name: 'Exploration',
      description: 'Project identification and knowledge building',
      status: getPhaseStatus(2),
      progress: currentPhase > 2 ? 100 : currentPhase === 2 ? phaseProgress : 0,
      estimatedTime: '2-3 weeks',
      keyActivities: ['Choose project topic', 'Build learning plan', 'Start building in public']
    },
    {
      id: 3,
      name: 'Reflection',
      description: 'Skill validation through feedback',
      status: getPhaseStatus(3),
      progress: 0, // Reflection progress is independent and ongoing
      estimatedTime: '3-4 weeks',
      keyActivities: ['Get peer feedback', 'Connect with mentors', 'Validate skills']
    },
    {
      id: 4,
      name: 'Action',
      description: 'Active job hunting and applications',
      status: getPhaseStatus(4),
      progress: 0, // Action progress is independent and ongoing
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
      setTimeout(() => loadProgressData(), 100);
      
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

  // Get current phase name for display - Updated for concurrent phases
  const getCurrentPhaseName = () => {
    const explorationComplete = explorationProject && explorationLearningPlan && explorationPublicBuilding;
    
    if (currentPhase === 1) return 'Introspection';
    if (currentPhase === 2) return 'Exploration';
    if (explorationComplete) return 'Reflection & Action';
    
    const currentPhaseData = phases.find(p => p.id === currentPhase);
    return currentPhaseData?.name || 'Introspection';
  };

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      {/* Header */}
      <div className="relative z-10 glass-effect border-0 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/a82513ec-4139-4f2f-814a-7a8db8a59228.png" 
                alt="CareerAI" 
                className="h-10 w-auto"
              />
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" className="hover:bg-white/20 transition-all duration-300">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="hover:bg-white/20 transition-all duration-300">
                <User className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="hover:bg-white/20 transition-all duration-300">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold gradient-text mb-4 animate-fade-in">
            Welcome back, {user?.user_metadata?.full_name || user?.email}! 👋
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-slide-up">
            You're in the <span className="font-semibold gradient-text">{getCurrentPhaseName()}</span> phase. 
            {currentPhase === 1 
              ? " Let's continue building your AI career foundation."
              : currentPhase === 2
              ? " Time to explore projects and build your skills!"
              : " You can now work on both reflection activities and job applications!"
            }
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="mb-12 premium-card animate-scale-in">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3 text-2xl gradient-text">
              <TrendingUp className="w-6 h-6 text-primary" />
              <span>Your Progress</span>
            </CardTitle>
            <CardDescription className="text-lg">
              Track your journey through the 4-phase career transition program
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProgressBar currentPhase={currentPhase} totalPhases={4} />
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Today's Tasks */}
            <Card className="premium-card animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-xl gradient-text">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Today's Focus</span>
                </CardTitle>
                <CardDescription className="text-base">
                  Complete these tasks to progress in your current phase
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todaysTasks.map((task) => (
                    <div key={task.id} className="group flex items-center justify-between p-6 border border-white/20 rounded-xl hover:bg-white/30 transition-all duration-300 hover:shadow-xl backdrop-blur-sm">
                      <div className="flex items-center space-x-4">
                        <input 
                          type="checkbox" 
                          className="w-5 h-5 rounded border-2 border-primary/30 text-primary focus:ring-primary/20 transition-all duration-200" 
                          checked={completedTasks.includes(task.id)}
                          onChange={() => handleTaskToggle(task.id)}
                        />
                        <div>
                          <p className={`font-medium text-lg transition-all duration-200 ${completedTasks.includes(task.id) ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                            {task.task}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">Estimated: {task.estimated}</p>
                        </div>
                      </div>
                      <Badge className={`${getPriorityColor(task.priority)} px-3 py-1 text-sm font-medium`}>
                        {task.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Phase Cards */}
            <div className="animate-slide-up">
              <h2 className="text-3xl font-bold gradient-text mb-8">Your Career Journey</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {phases.map((phase, index) => (
                  <div key={phase.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <PhaseCard 
                      phase={phase}
                      onClick={() => handlePhaseClick(phase)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Stats */}
            <Card className="premium-card animate-scale-in">
              <CardHeader>
                <CardTitle className="gradient-text">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Days Active</span>
                  <span className="text-xl font-bold gradient-text">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Tasks Completed</span>
                  <span className="text-xl font-bold gradient-text">{completedTasks.length + 8}/32</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Current Phase</span>
                  <span className="text-lg font-bold gradient-text">{getCurrentPhaseName()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Phase Progress</span>
                  <span className="text-xl font-bold gradient-text">{Math.round(phaseProgress)}%</span>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming */}
            <Card className="premium-card animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 gradient-text">
                  <Calendar className="w-5 h-5" />
                  <span>Upcoming</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100">
                  <p className="font-medium text-gray-800">Phase Assessment</p>
                  <p className="text-sm text-gray-600 mt-1">Due in 5 days</p>
                </div>
                <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-blue-50 border border-green-100">
                  <p className="font-medium text-gray-800">Mentor Check-in</p>
                  <p className="text-sm text-gray-600 mt-1">Scheduled for Friday</p>
                </div>
              </CardContent>
            </Card>

            {/* Resources */}
            <Card className="premium-card animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 gradient-text">
                  <BookOpen className="w-5 h-5" />
                  <span>Recommended</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <p className="font-medium text-primary group-hover:text-purple-700 transition-colors">
                    AI Career Transition Guide
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Essential reading for Phase 1</p>
                </div>
                <div className="p-4 rounded-lg bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-100 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <p className="font-medium text-primary group-hover:text-blue-700 transition-colors">
                    Industry Trends Report 2024
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Latest AI job market insights</p>
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
