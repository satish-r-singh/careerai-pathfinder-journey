import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, BookOpen, Code, Lightbulb, Target, Users, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { usePersonalizedProjects } from '@/hooks/usePersonalizedProjects';
import { getIconComponent } from '@/utils/iconUtils';
import LearningPlan from '@/components/LearningPlan';
import { generateLearningPlan, LearningPlan as LearningPlanType } from '@/utils/learningPlanGeneration';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Exploration = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    projects, 
    loading: projectsLoading, 
    regenerateProjects,
    selectedProjects,
    toggleProjectSelection,
    regenerateUnselected,
    regeneratingProjects
  } = usePersonalizedProjects();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [learningPlanCreated, setLearningPlanCreated] = useState(false);
  const [publicBuildingStarted, setPublicBuildingStarted] = useState(false);
  const [showLearningPlan, setShowLearningPlan] = useState(false);
  const [generatedLearningPlan, setGeneratedLearningPlan] = useState<LearningPlanType | null>(null);
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const [buildingInPublicPlan, setBuildingInPublicPlan] = useState<any>(null);
  const [generatingBuildingPlan, setGeneratingBuildingPlan] = useState(false);

  useEffect(() => {
    checkExplorationProgress();
  }, [user]);

  const checkExplorationProgress = async () => {
    if (!user) return;
    
    try {
      // Check if user has exploration progress saved in localStorage (for backwards compatibility)
      const savedProject = localStorage.getItem(`exploration_project_${user.id}`);
      const savedPublicBuilding = localStorage.getItem(`public_building_${user.id}`);
      
      if (savedProject) setSelectedProject(savedProject);
      if (savedPublicBuilding) setPublicBuildingStarted(true);
      
      // Check for learning plan in database
      if (savedProject) {
        const { data: learningPlan, error } = await supabase
          .from('learning_plans')
          .select('*')
          .eq('user_id', user.id)
          .eq('project_id', savedProject)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error('Error loading learning plan:', error);
        } else if (learningPlan) {
          setGeneratedLearningPlan(learningPlan.learning_plan_data as unknown as LearningPlanType);
          setLearningPlanCreated(true);
          setShowLearningPlan(true);
        }

        // Check for building in public plan
        try {
          const { data: buildingPlan, error: buildingError } = await supabase
            .from('building_in_public_plans')
            .select('*')
            .eq('user_id', user.id)
            .eq('project_id', savedProject)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (!buildingError && buildingPlan) {
            setBuildingInPublicPlan(buildingPlan.plan_data);
            setPublicBuildingStarted(true);
          }
        } catch (buildingQueryError) {
          console.error('Error loading building in public plan for project:', buildingQueryError);
        }
      }
    } catch (error) {
      console.error('Error loading exploration progress:', error);
    }
  };

  const handleProjectSelect = (projectId: string) => {
    setSelectedProject(projectId);
    localStorage.setItem(`exploration_project_${user.id}`, projectId);
    
    // Reset learning plan state when selecting a new project
    setLearningPlanCreated(false);
    setShowLearningPlan(false);
    setGeneratedLearningPlan(null);
    setPublicBuildingStarted(false);
    setBuildingInPublicPlan(null);
    
    // Check if this project already has a learning plan
    checkLearningPlanForProject(projectId);
  };

  const checkLearningPlanForProject = async (projectId: string) => {
    if (!user) return;
    
    try {
      const { data: learningPlan, error } = await supabase
        .from('learning_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error loading learning plan for project:', error);
      } else if (learningPlan) {
        setGeneratedLearningPlan(learningPlan.learning_plan_data as unknown as LearningPlanType);
        setLearningPlanCreated(true);
        setShowLearningPlan(true);
      }

      // Also check for building in public plan
      try {
        const { data: buildingPlan, error: buildingError } = await supabase
          .from('building_in_public_plans')
          .select('*')
          .eq('user_id', user.id)
          .eq('project_id', projectId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!buildingError && buildingPlan) {
          setBuildingInPublicPlan(buildingPlan.plan_data);
          setPublicBuildingStarted(true);
        }
      } catch (buildingQueryError) {
        console.error('Error loading building in public plan for project:', buildingQueryError);
      }
    } catch (error) {
      console.error('Error checking learning plan for project:', error);
    }
  };

  const handleBackNavigation = () => {
    if (selectedProject) {
      // If a project is selected, go back to project selection
      setSelectedProject(null);
      localStorage.removeItem(`exploration_project_${user.id}`);
      // Also reset the learning plan and public building states
      setLearningPlanCreated(false);
      setPublicBuildingStarted(false);
      setShowLearningPlan(false);
      setGeneratedLearningPlan(null);
      setBuildingInPublicPlan(null);
      localStorage.removeItem(`public_building_${user.id}`);
    } else {
      // If no project selected, go back to dashboard
      navigate('/dashboard');
    }
  };

  const handleCreateLearningPlan = async () => {
    const selectedProjectData = getSelectedProjectData();
    if (!selectedProjectData || !user) return;

    setGeneratingPlan(true);
    
    try {
      // Get user profile and ikigai data (you might need to fetch these from your database)
      // For now, we'll pass them as undefined, but you can enhance this later
      const userProfile = undefined; // TODO: Fetch from user profile
      const ikigaiData = undefined; // TODO: Fetch from ikigai data
      
      const aiLearningPlan = await generateLearningPlan(
        selectedProjectData,
        userProfile,
        ikigaiData
      );
      
      if (aiLearningPlan) {
        // Save to database
        const { error } = await supabase
          .from('learning_plans')
          .insert({
            user_id: user.id,
            project_id: selectedProjectData.id,
            project_name: selectedProjectData.name,
            learning_plan_data: aiLearningPlan as any
          });

        if (error) {
          console.error('Error saving learning plan to database:', error);
          toast({
            title: "Error saving learning plan",
            description: "The plan was generated but couldn't be saved. Please try again.",
            variant: "destructive",
          });
        } else {
          setGeneratedLearningPlan(aiLearningPlan);
          setLearningPlanCreated(true);
          setShowLearningPlan(true);
          localStorage.setItem(`learning_plan_${user.id}`, 'true'); // Keep for backwards compatibility
          
          toast({
            title: "Learning plan created!",
            description: "Your personalized AI learning plan has been generated and saved.",
          });
        }
      } else {
        throw new Error('Failed to generate learning plan');
      }
    } catch (error) {
      console.error('Error generating learning plan:', error);
      toast({
        title: "Error generating learning plan",
        description: "There was an issue creating your personalized learning plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGeneratingPlan(false);
    }
  };

  const handleStartPublicBuilding = async () => {
    const selectedProjectData = getSelectedProjectData();
    if (!selectedProjectData || !user) return;

    setGeneratingBuildingPlan(true);
    
    try {
      // Call the AI function to generate building in public plan
      const { data, error } = await supabase.functions.invoke('generate-building-plan', {
        body: {
          project: selectedProjectData,
          learningPlan: generatedLearningPlan
        }
      });

      if (error) {
        throw error;
      }

      if (data) {
        // Save to database
        const { error: saveError } = await supabase
          .from('building_in_public_plans')
          .insert({
            user_id: user.id,
            project_id: selectedProjectData.id,
            project_name: selectedProjectData.name,
            plan_data: data as any
          });

        if (saveError) {
          console.error('Error saving building in public plan to database:', saveError);
          toast({
            title: "Error saving building plan",
            description: "The plan was generated but couldn't be saved. Please try again.",
            variant: "destructive",
          });
        } else {
          setBuildingInPublicPlan(data);
          setPublicBuildingStarted(true);
          localStorage.setItem(`public_building_${user.id}`, 'true');
          
          toast({
            title: "Building in public plan created!",
            description: "Your personalized building strategy has been generated and saved.",
          });
        }
      } else {
        throw new Error('Failed to generate building in public plan');
      }
    } catch (error) {
      console.error('Error generating building in public plan:', error);
      toast({
        title: "Error generating building plan",
        description: "There was an issue creating your building in public strategy. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGeneratingBuildingPlan(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressPercentage = () => {
    let completed = 0;
    if (selectedProject) completed += 33;
    if (learningPlanCreated) completed += 33;
    if (publicBuildingStarted) completed += 34;
    return completed;
  };

  const getIconComponentForProject = (iconName: string) => {
    return getIconComponent(iconName || 'Code');
  };

  const getSelectedProjectData = () => {
    return projects.find(p => p.id === selectedProject);
  };

  const renderProjectCard = (project: any) => {
    const IconComponent = getIconComponentForProject(project.iconName || 'Code');
    const isSelected = selectedProjects.has(project.id);
    const isRegenerating = regeneratingProjects.has(project.id);

    if (isRegenerating) {
      return (
        <div key={project.id} className="p-6 border rounded-xl">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Generating new project...</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        key={project.id}
        className={`p-6 border rounded-xl transition-all ${
          isSelected 
            ? 'border-blue-300 bg-blue-50' 
            : 'hover:shadow-lg hover:border-primary/30'
        }`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => toggleProjectSelection(project.id)}
              className="mt-1"
            />
            <span className="text-sm text-gray-600">Keep this project</span>
          </div>
        </div>
        
        <div 
          className="flex items-start space-x-4 cursor-pointer"
          onClick={() => handleProjectSelect(project.id)}
        >
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <IconComponent className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg">{project.name}</h3>
              <Badge className={getDifficultyColor(project.difficulty)}>
                {project.difficulty}
              </Badge>
            </div>
            <p className="text-gray-600 mb-3">{project.description}</p>
            {project.reasoning && (
              <div className="mb-3 p-2 bg-blue-50 rounded text-sm text-blue-800">
                <strong>Why this fits you:</strong> {project.reasoning}
              </div>
            )}
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-2" />
                {project.duration}
              </div>
              <div className="flex flex-wrap gap-2">
                {project.skills.map((skill, index) => (
                  <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <Button className="w-full mt-4">
              Select This Project
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-200/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-cyan-200/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={handleBackNavigation}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {selectedProject ? 'Back to Project Selection' : 'Back to Dashboard'}
          </Button>
          
          <h1 className="text-4xl font-bold gradient-text mb-4">
            Exploration Phase
          </h1>
          <p className="text-gray-600 text-lg">
            Choose your personalized project, build your learning plan, and start building in public
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <span>Exploration Progress</span>
            </CardTitle>
            <CardDescription>
              Complete these three key activities to finish the Exploration phase
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">Overall Progress</span>
              <span className="font-semibold">{getProgressPercentage()}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
              <div 
                className="bg-gradient-to-r from-primary to-accent h-3 rounded-full transition-all duration-500"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className={`p-4 rounded-lg border-2 transition-all ${selectedProject ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                <div className="flex items-center space-x-2 mb-2">
                  {selectedProject ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <Clock className="w-5 h-5 text-gray-400" />
                  )}
                  <span className="font-medium">Choose Project</span>
                </div>
                <p className="text-sm text-gray-600">Select your focus project</p>
              </div>
              
              <div className={`p-4 rounded-lg border-2 transition-all ${learningPlanCreated ? 'border-green-200 bg-green-50' : selectedProject ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex items-center space-x-2 mb-2">
                  {learningPlanCreated ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : selectedProject ? (
                    <Clock className="w-5 h-5 text-blue-500" />
                  ) : (
                    <Clock className="w-5 h-5 text-gray-400" />
                  )}
                  <span className="font-medium">Build Learning Plan</span>
                </div>
                <p className="text-sm text-gray-600">Create your skill development roadmap</p>
              </div>
              
              <div className={`p-4 rounded-lg border-2 transition-all ${publicBuildingStarted ? 'border-green-200 bg-green-50' : learningPlanCreated ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex items-center space-x-2 mb-2">
                  {publicBuildingStarted ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : learningPlanCreated ? (
                    <Clock className="w-5 h-5 text-blue-500" />
                  ) : (
                    <Clock className="w-5 h-5 text-gray-400" />
                  )}
                  <span className="font-medium">Start Building in Public</span>
                </div>
                <p className="text-sm text-gray-600">Begin documenting your journey</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Selection */}
        {!selectedProject && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Your Personalized AI Projects</CardTitle>
                  <CardDescription>
                    These projects are tailored to your Ikigai profile, skills, and career goals from your introspection phase.
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  {selectedProjects.size > 0 && (
                    <Button 
                      variant="outline" 
                      onClick={regenerateUnselected}
                      disabled={projectsLoading || regeneratingProjects.size > 0}
                      className="flex items-center space-x-2"
                    >
                      <RefreshCw className={`w-4 h-4 ${regeneratingProjects.size > 0 ? 'animate-spin' : ''}`} />
                      <span>Regenerate Others</span>
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    onClick={regenerateProjects}
                    disabled={projectsLoading || regeneratingProjects.size > 0}
                    className="flex items-center space-x-2"
                  >
                    <RefreshCw className={`w-4 h-4 ${projectsLoading ? 'animate-spin' : ''}`} />
                    <span>Regenerate All</span>
                  </Button>
                </div>
              </div>
              {selectedProjects.size > 0 && (
                <p className="text-sm text-blue-600 mt-2">
                  {selectedProjects.size} project(s) selected to keep. Click "Regenerate Others" to only replace unselected projects.
                </p>
              )}
            </CardHeader>
            <CardContent>
              {projectsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Generating personalized projects based on your profile...</p>
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {projects.map((project) => renderProjectCard(project))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Selected Project & Next Steps */}
        {selectedProject && (
          <div className="space-y-6">
            {/* Selected Project Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Selected Project</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const project = getSelectedProjectData();
                  if (!project) return null;
                  const IconComponent = getIconComponentForProject(project.iconName || 'Code');
                  return (
                    <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{project.name}</h3>
                        <p className="text-gray-600">{project.description}</p>
                        {project.reasoning && (
                          <p className="text-sm text-green-700 mt-1">
                            <strong>Perfect for you because:</strong> {project.reasoning}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>

            {/* Learning Plan */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {learningPlanCreated ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <BookOpen className="w-5 h-5 text-primary" />
                  )}
                  <span>AI-Generated Learning Plan</span>
                </CardTitle>
                <CardDescription>
                  Create a personalized learning plan powered by AI based on your selected project and profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!learningPlanCreated ? (
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      Our AI will analyze your selected project, background, and goals to create a completely personalized learning plan that includes:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                      <li>Customized learning phases based on your experience level</li>
                      <li>Project-specific skill development roadmap</li>
                      <li>Curated resources and tutorials for your exact needs</li>
                      <li>Personalized building-in-public strategy</li>
                      <li>Success metrics tailored to your goals</li>
                    </ul>
                    <Button 
                      onClick={handleCreateLearningPlan} 
                      className="w-full"
                      disabled={generatingPlan}
                    >
                      {generatingPlan ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Generating Your AI Learning Plan...
                        </>
                      ) : (
                        'Generate My AI Learning Plan'
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="font-medium text-green-800">AI Learning Plan Generated & Saved!</span>
                      </div>
                      <p className="text-green-700">Your personalized learning plan has been created using AI and saved to your account. You can access it anytime.</p>
                    </div>
                    
                    {showLearningPlan && generatedLearningPlan && (
                      <LearningPlan 
                        projectName={getSelectedProjectData()?.name || ''}
                        learningPlan={generatedLearningPlan}
                      />
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Building in Public */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {publicBuildingStarted ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <Users className="w-5 h-5 text-primary" />
                  )}
                  <span>AI-Generated Building in Public Strategy</span>
                </CardTitle>
                <CardDescription>
                  Get a personalized strategy for documenting and sharing your learning journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!publicBuildingStarted ? (
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      Our AI will create a customized building-in-public strategy based on your project and learning plan:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                      <li>Personalized content calendar and posting schedule</li>
                      <li>Platform-specific content recommendations</li>
                      <li>Milestone celebration ideas tailored to your project</li>
                      <li>Networking strategies for your specific field</li>
                      <li>Templates for sharing progress updates</li>
                    </ul>
                    <Button 
                      onClick={handleStartPublicBuilding} 
                      className="w-full"
                      disabled={!learningPlanCreated || generatingBuildingPlan}
                    >
                      {generatingBuildingPlan ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Generating Your Building Strategy...
                        </>
                      ) : learningPlanCreated ? (
                        'Generate My Building in Public Strategy'
                      ) : (
                        'Complete Learning Plan First'
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="font-medium text-green-800">Building in Public Strategy Generated!</span>
                      </div>
                      <p className="text-green-700">Your personalized building strategy has been created and saved to your account.</p>
                    </div>
                    
                    {buildingInPublicPlan && (
                      <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium mb-3">Recommended Platforms</h4>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {buildingInPublicPlan.platforms?.map((platform: string, index: number) => (
                                <Badge key={index} variant="outline">{platform}</Badge>
                              ))}
                            </div>
                            
                            <h4 className="font-medium mb-3">Content Strategy</h4>
                            <ul className="space-y-2">
                              {buildingInPublicPlan.contentStrategy?.map((item: string, index: number) => (
                                <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                                  <Lightbulb className="w-3 h-3 mt-1 text-yellow-500" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-3">Posting Schedule</h4>
                            <div className="bg-blue-50 p-3 rounded-lg mb-4">
                              <p className="text-sm text-blue-800">{buildingInPublicPlan.postingSchedule}</p>
                            </div>
                            
                            <h4 className="font-medium mb-3">Networking Tips</h4>
                            <ul className="space-y-2">
                              {buildingInPublicPlan.networkingTips?.map((tip: string, index: number) => (
                                <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                                  <Users className="w-3 h-3 mt-1 text-purple-500" />
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        
                        {buildingInPublicPlan.milestoneIdeas && (
                          <div>
                            <h4 className="font-medium mb-3">Milestone Celebration Ideas</h4>
                            <div className="grid md:grid-cols-3 gap-3">
                              {buildingInPublicPlan.milestoneIdeas.map((idea: string, index: number) => (
                                <div key={index} className="p-3 bg-green-50 rounded-lg">
                                  <p className="text-sm text-green-800">{idea}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Completion Message */}
        {selectedProject && learningPlanCreated && publicBuildingStarted && (
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-6">
              <div className="text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-green-800 mb-2">
                  Exploration Phase Complete! 🎉
                </h3>
                <p className="text-green-700 mb-4">
                  You've successfully completed the Exploration phase. You're now ready to move on to the Reflection phase where you'll validate your skills through feedback and mentorship.
                </p>
                <Button onClick={() => navigate('/dashboard')} className="bg-green-600 hover:bg-green-700">
                  Return to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Exploration;
