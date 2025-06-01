
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useExplorationProgress } from '@/hooks/useExplorationProgress';
import { usePersonalizedProjects } from '@/hooks/usePersonalizedProjects';
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
        <ExplorationProgress
          selectedProject={selectedProject}
          learningPlanCreated={learningPlanCreated}
          publicBuildingStarted={publicBuildingStarted}
          progressPercentage={getProgressPercentage()}
        />

        {/* Project Selection */}
        {!selectedProject && (
          <ProjectSelection onProjectSelect={handleProjectSelect} />
        )}

        {/* Selected Project & Next Steps */}
        {selectedProject && (
          <div className="space-y-6">
            {/* Selected Project Summary */}
            <SelectedProjectSummary project={getSelectedProjectData()} />

            {/* Learning Plan */}
            <LearningPlanSection
              selectedProject={getSelectedProjectData()}
              learningPlanCreated={learningPlanCreated}
              showLearningPlan={showLearningPlan}
              generatedLearningPlan={generatedLearningPlan}
              onLearningPlanCreated={handleLearningPlanCreated}
            />

            {/* Building in Public */}
            <BuildingInPublicSection
              selectedProject={getSelectedProjectData()}
              learningPlanCreated={learningPlanCreated}
              publicBuildingStarted={publicBuildingStarted}
              buildingInPublicPlan={buildingInPublicPlan}
              generatedLearningPlan={generatedLearningPlan}
              onBuildingPlanCreated={handleBuildingPlanCreated}
            />
          </div>
        )}

        {/* Completion Message */}
        {selectedProject && learningPlanCreated && publicBuildingStarted && (
          <ExplorationCompletion />
        )}
      </div>
    </div>
  );
};

export default Exploration;
