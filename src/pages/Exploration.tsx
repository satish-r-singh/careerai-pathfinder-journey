
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
import BuildingInPublicSection from '@/components/exploration/BuildingInPublicSection';
import ExplorationCompletion from '@/components/exploration/ExplorationCompletion';

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
    handleProjectSelect,
    resetExploration,
    getProgressPercentage,
    setGeneratedLearningPlan,
    setLearningPlanCreated,
    setShowLearningPlan,
    setBuildingInPublicPlan,
    setPublicBuildingStarted
  } = useExplorationProgress();

  const handleBackNavigation = () => {
    if (selectedProject) {
      resetExploration();
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

  const handleBuildingPlanCreated = (plan: any) => {
    setBuildingInPublicPlan(plan);
    setPublicBuildingStarted(true);
  };

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-float" style={{
          animationDelay: '2s'
        }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-200/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-cyan-200/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <ExplorationHeader />

        <div className="space-y-8">
          {/* Progress Overview */}
          <Card className="premium-card animate-scale-in">
            <CardContent className="p-6">
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
            <div className="animate-fade-in">
              <ProjectSelection onProjectSelect={handleProjectSelect} />
            </div>
          )}

          {/* Selected Project & Next Steps */}
          {selectedProject && (
            <div className="space-y-6 animate-slide-up">
              {/* Selected Project Summary */}
              <div className="animate-fade-in">
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

              {/* Building in Public */}
              <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <BuildingInPublicSection
                  selectedProject={getSelectedProjectData()}
                  learningPlanCreated={learningPlanCreated}
                  publicBuildingStarted={publicBuildingStarted}
                  buildingInPublicPlan={buildingInPublicPlan}
                  generatedLearningPlan={generatedLearningPlan}
                  onBuildingPlanCreated={handleBuildingPlanCreated}
                />
              </div>
            </div>
          )}

          {/* Completion Message */}
          {selectedProject && learningPlanCreated && publicBuildingStarted && (
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
