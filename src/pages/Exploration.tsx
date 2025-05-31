import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BookOpen, Code, Lightbulb, Target, Users, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { usePersonalizedProjects } from '@/hooks/usePersonalizedProjects';

const Exploration = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { projects, loading: projectsLoading, regenerateProjects } = usePersonalizedProjects();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [learningPlanCreated, setLearningPlanCreated] = useState(false);
  const [publicBuildingStarted, setPublicBuildingStarted] = useState(false);

  useEffect(() => {
    checkExplorationProgress();
  }, [user]);

  const checkExplorationProgress = async () => {
    if (!user) return;
    
    try {
      // Check if user has exploration progress saved
      const savedProject = localStorage.getItem(`exploration_project_${user.id}`);
      const savedLearningPlan = localStorage.getItem(`learning_plan_${user.id}`);
      const savedPublicBuilding = localStorage.getItem(`public_building_${user.id}`);
      
      if (savedProject) setSelectedProject(savedProject);
      if (savedLearningPlan) setLearningPlanCreated(true);
      if (savedPublicBuilding) setPublicBuildingStarted(true);
    } catch (error) {
      console.error('Error loading exploration progress:', error);
    }
  };

  const handleProjectSelect = (projectId: string) => {
    setSelectedProject(projectId);
    localStorage.setItem(`exploration_project_${user.id}`, projectId);
  };

  const handleCreateLearningPlan = () => {
    setLearningPlanCreated(true);
    localStorage.setItem(`learning_plan_${user.id}`, 'true');
  };

  const handleStartPublicBuilding = () => {
    setPublicBuildingStarted(true);
    localStorage.setItem(`public_building_${user.id}`, 'true');
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

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      Users,
      Target,
      Lightbulb,
      Code
    };
    return iconMap[iconName] || Code;
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
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
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
                <Button 
                  variant="outline" 
                  onClick={regenerateProjects}
                  disabled={projectsLoading}
                  className="flex items-center space-x-2"
                >
                  <RefreshCw className={`w-4 h-4 ${projectsLoading ? 'animate-spin' : ''}`} />
                  <span>Regenerate</span>
                </Button>
              </div>
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
                  {projects.map((project) => {
                    const IconComponent = getIconComponent(project.iconName || 'Code');
                    return (
                      <div
                        key={project.id}
                        className="p-6 border rounded-xl hover:shadow-lg transition-all cursor-pointer hover:border-primary/30"
                        onClick={() => handleProjectSelect(project.id)}
                      >
                        <div className="flex items-start space-x-4">
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
                  })}
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
                  const project = projects.find(p => p.id === selectedProject);
                  if (!project) return null;
                  const IconComponent = getIconComponent(project.iconName || 'Code');
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
                  <span>Build Learning Plan</span>
                </CardTitle>
                <CardDescription>
                  Create a structured learning plan based on your selected project
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!learningPlanCreated ? (
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      Based on your selected project, we'll help you create a personalized learning plan that covers:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                      <li>Required technical skills and knowledge areas</li>
                      <li>Recommended learning resources and tutorials</li>
                      <li>Project milestones and timelines</li>
                      <li>Hands-on exercises and practice projects</li>
                    </ul>
                    <Button onClick={handleCreateLearningPlan} className="w-full">
                      Generate My Learning Plan
                    </Button>
                  </div>
                ) : (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="font-medium text-green-800">Learning Plan Created!</span>
                    </div>
                    <p className="text-green-700">Your personalized learning plan has been generated and is ready to guide your skill development journey.</p>
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
                  <span>Start Building in Public</span>
                </CardTitle>
                <CardDescription>
                  Document and share your learning journey with the community
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!publicBuildingStarted ? (
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      Building in public is a powerful way to accelerate your learning and build your professional network. We'll help you:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                      <li>Set up your development blog or social media presence</li>
                      <li>Create templates for sharing your progress</li>
                      <li>Connect with other AI professionals and learners</li>
                      <li>Build a portfolio that showcases your journey</li>
                    </ul>
                    <Button 
                      onClick={handleStartPublicBuilding} 
                      className="w-full"
                      disabled={!learningPlanCreated}
                    >
                      {learningPlanCreated ? 'Start Building in Public' : 'Complete Learning Plan First'}
                    </Button>
                  </div>
                ) : (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="font-medium text-green-800">Building in Public Started!</span>
                    </div>
                    <p className="text-green-700">You're now documenting your journey and building your professional presence. Keep sharing your progress!</p>
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
