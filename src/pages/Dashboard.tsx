
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import WelcomeSection from '@/components/dashboard/WelcomeSection';
import ProgressOverview from '@/components/dashboard/ProgressOverview';
import CareerJourney from '@/components/dashboard/CareerJourney';
import TodaysTasks from '@/components/dashboard/TodaysTasks';
import QuickStats from '@/components/dashboard/QuickStats';
import UpcomingSection from '@/components/dashboard/UpcomingSection';
import ResourcesSection from '@/components/dashboard/ResourcesSection';
import { useDashboardProgress } from '@/hooks/useDashboardProgress';
import { useTodaysTasks } from '@/hooks/useTodaysTasks';

const Dashboard = () => {
  const {
    currentPhase,
    phaseProgress,
    ikigaiCompleted,
    industryResearchCompleted,
    careerRoadmapCompleted,
    ikigaiLoading,
    explorationProject,
    explorationLearningPlan,
    explorationPublicBuilding,
    getCurrentPhaseName
  } = useDashboardProgress();

  const { tasks: todaysTasks, completedTasks } = useTodaysTasks(
    currentPhase,
    ikigaiCompleted,
    industryResearchCompleted,
    careerRoadmapCompleted,
    explorationProject,
    explorationLearningPlan,
    explorationPublicBuilding
  );

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-float" style={{
          animationDelay: '2s'
        }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      <DashboardHeader />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <WelcomeSection currentPhase={currentPhase} getCurrentPhaseName={getCurrentPhaseName} />
        
        <ProgressOverview currentPhase={currentPhase} />

        <CareerJourney 
          currentPhase={currentPhase}
          phaseProgress={phaseProgress}
          ikigaiCompleted={ikigaiCompleted}
          ikigaiLoading={ikigaiLoading}
          explorationProject={explorationProject}
          explorationLearningPlan={explorationLearningPlan}
          explorationPublicBuilding={explorationPublicBuilding}
        />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <TodaysTasks 
              currentPhase={currentPhase}
              ikigaiCompleted={ikigaiCompleted}
              industryResearchCompleted={industryResearchCompleted}
              careerRoadmapCompleted={careerRoadmapCompleted}
              explorationProject={explorationProject}
              explorationLearningPlan={explorationLearningPlan}
              explorationPublicBuilding={explorationPublicBuilding}
            />
          </div>

          <div className="space-y-8">
            <QuickStats 
              completedTasksCount={completedTasks.length}
              totalTasksCount={todaysTasks.length}
              getCurrentPhaseName={getCurrentPhaseName}
            />
            <UpcomingSection />
            <ResourcesSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
