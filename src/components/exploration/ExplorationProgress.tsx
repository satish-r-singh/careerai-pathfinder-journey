
import { Progress } from '@/components/ui/progress';
import { BookOpen, CheckCircle, Clock, TrendingUp, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExplorationProgressProps {
  selectedProject: string | null;
  learningPlanCreated: boolean;
  publicBuildingStarted: boolean;
  progressPercentage: number;
  projectProgress: Record<string, { learningPlan: boolean; buildingPlan: boolean }>;
}

const steps = [
  { name: 'Choose Project', key: 'project', icon: BookOpen },
  { name: 'Build Learning Plan', key: 'learning', icon: BookOpen },
  { name: 'Start Building in Public', key: 'building', icon: Users },
];

const ExplorationProgress = ({ 
  selectedProject, 
  learningPlanCreated, 
  publicBuildingStarted, 
  progressPercentage,
  projectProgress 
}: ExplorationProgressProps) => {
  // Check if user has any learning plans across all projects
  const hasAnyLearningPlan = Object.values(projectProgress).some(progress => progress.learningPlan);
  
  // Check if user has any building plans across all projects
  const hasAnyBuildingPlan = Object.values(projectProgress).some(progress => progress.buildingPlan);

  const getStepStatus = (stepKey: string) => {
    switch (stepKey) {
      case 'project':
        return selectedProject ? 'completed' : 'current';
      case 'learning':
        if (hasAnyLearningPlan || learningPlanCreated) return 'completed';
        return selectedProject ? 'current' : 'locked';
      case 'building':
        if (hasAnyBuildingPlan || publicBuildingStarted) return 'completed';
        return (hasAnyLearningPlan || learningPlanCreated) ? 'current' : 'locked';
      default:
        return 'locked';
    }
  };

  const completedSteps = [selectedProject, hasAnyLearningPlan || learningPlanCreated, hasAnyBuildingPlan || publicBuildingStarted].filter(Boolean).length;

  return (
    <div className="w-full">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold gradient-text">Exploration Progress</h3>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-gray-700">{completedSteps}/{steps.length}</span>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">completed</span>
          </div>
        </div>
        <Progress value={progressPercentage} className="h-4 bg-gray-100" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step, index) => {
          const status = getStepStatus(step.key);
          const IconComponent = step.icon;
          
          return (
            <div key={step.key} className={cn(
              "relative p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg",
              status === 'completed' 
                ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-md" 
                : status === 'current'
                ? "bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200 shadow-md"
                : "bg-gray-50 border-gray-200"
            )}>
              {/* Step number/icon */}
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 mb-4",
                status === 'completed' 
                  ? "bg-green-500 text-white shadow-lg" 
                  : status === 'current'
                  ? "bg-purple-500 text-white shadow-lg animate-pulse"
                  : "bg-gray-300 text-gray-500"
              )}>
                {status === 'completed' ? (
                  <CheckCircle className="w-6 h-6" />
                ) : status === 'current' ? (
                  <Clock className="w-6 h-6" />
                ) : (
                  <IconComponent className="w-5 h-5" />
                )}
              </div>
              
              {/* Step content */}
              <div>
                <h4 className={cn(
                  "font-bold text-lg mb-2",
                  status === 'completed' ? "text-green-800" 
                  : status === 'current' ? "text-purple-800" 
                  : "text-gray-500"
                )}>
                  {step.name}
                </h4>
                
                <div className={cn(
                  "text-sm font-medium px-3 py-1 rounded-full inline-block",
                  status === 'completed' ? "bg-green-100 text-green-700" 
                  : status === 'current' ? "bg-purple-100 text-purple-700" 
                  : "bg-gray-100 text-gray-500"
                )}>
                  {status === 'completed' ? 'Completed' 
                   : status === 'current' ? 'In Progress' 
                   : 'Locked'}
                </div>

                {/* Step descriptions */}
                <p className="text-sm text-gray-600 mt-3">
                  {step.key === 'project' && "Select your focus project from personalized recommendations"}
                  {step.key === 'learning' && "Create your AI-powered skill development roadmap"}
                  {step.key === 'building' && "Begin documenting and sharing your learning journey"}
                </p>
              </div>
              
              {/* Connecting line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-6 w-12 h-0.5 bg-gray-200 transform -translate-y-1/2">
                  <div className={cn(
                    "h-full transition-all duration-300",
                    status === 'completed' ? "bg-green-300 w-full" : "bg-gray-200 w-0"
                  )} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExplorationProgress;
