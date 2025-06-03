
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useExplorationProgress } from '@/hooks/useExplorationProgress';
import { usePersonalizedProjects } from '@/hooks/usePersonalizedProjects';
import ExplorationHeader from '@/components/ExplorationHeader';
import ExplorationProgress from '@/components/exploration/ExplorationProgress';
import ProjectSelection from '@/components/exploration/ProjectSelection';
import SelectedProjectSummary from '@/components/exploration/SelectedProjectSummary';
import LearningPlanSection from '@/components/exploration/LearningPlanSection';
import ExplorationCompletion from '@/components/exploration/ExplorationCompletion';
import DailyPostGenerator from '@/components/exploration/DailyPostGenerator';

const Exploration = () => {
  const navigate = useNavigate();
  const { projects } = usePersonalizedProjects();
  const {
    selectedProject,
    learningPlanCreated,
    publicBuildingStarted,
    showLearningPlan,
    generatedLearningPlan,
    buildingInPublicPlan,
    projectProgress,
    handleProjectSelect,
    backToProjectSelection,
    resetExploration,
    getProgressPercentage,
    getProjectProgress,
    setGeneratedLearningPlan,
    setLearningPlanCreated,
    setShowLearningPlan,
    setBuildingInPublicPlan,
    setPublicBuildingStarted
  } = useExplorationProgress();

  const handleBackNavigation = () => {
    if (selectedProject) {
      backToProjectSelection();
    } else {
      navigate('/dashboard');
    }
  };

  const getSelectedProjectData = () => {
    return projects.find(p => p.id === selectedProject);
  };

  const handleLearningPlanCreated = (plan: any) => {
    setGeneratedLearningPlan(plan);
    setLearningPlanCreated(true);
    setShowLearningPlan(true);
  };

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      {/* Enhanced Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-float" style={{
          animationDelay: '2s'
        }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-200/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-200/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <ExplorationHeader />

        <div className="space-y-8">
          {/* Enhanced Progress Overview */}
          <Card className="premium-card animate-fade-in relative overflow-hidden">
            {/* Background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white via-purple-50/50 to-blue-50/50" />
            
            <CardContent className="p-8 relative z-10">
              <div className="flex items-center justify-between mb-6">
                <Button 
                  variant="outline" 
                  onClick={handleBackNavigation}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{selectedProject ? 'Back to Project Selection' : 'Back to Dashboard'}</span>
                </Button>
              </div>
              
              <ExplorationProgress
                selectedProject={selectedProject}
                learningPlanCreated={learningPlanCreated}
                publicBuildingStarted={publicBuildingStarted}
                progressPercentage={getProgressPercentage()}
              />
            </CardContent>
          </Card>

          {/* Project Selection */}
          {!selectedProject && (
            <div className="animate-slide-up">
              <ProjectSelection 
                onProjectSelect={handleProjectSelect}
                projectProgress={projectProgress}
                getProjectProgress={getProjectProgress}
              />
            </div>
          )}

          {/* Daily Post Generator - Show when no project is selected */}
          {!selectedProject && (
            <div className="animate-fade-in">
              <DailyPostGenerator projectProgress={projectProgress} />
            </div>
          )}

          {/* Selected Project & Next Steps */}
          {selectedProject && (
            <div className="space-y-8 animate-fade-in">
              {/* Selected Project Summary */}
              <div className="animate-scale-in">
                <SelectedProjectSummary project={getSelectedProjectData()} />
              </div>

              {/* Learning Plan */}
              <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <LearningPlanSection
                  selectedProject={getSelectedProjectData()}
                  learningPlanCreated={learningPlanCreated}
                  showLearningPlan={showLearningPlan}
                  generatedLearningPlan={generatedLearningPlan}
                  onLearningPlanCreated={handleLearningPlanCreated}
                />
              </div>
            </div>
          )}

          {/* Completion Message */}
          {selectedProject && learningPlanCreated && (
            <div className="animate-scale-in">
              <ExplorationCompletion />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Exploration;
