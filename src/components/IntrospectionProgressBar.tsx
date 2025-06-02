
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IntrospectionProgressBarProps {
  ikigaiCompleted: boolean;
  industryResearchCompleted: boolean;
  careerRoadmapCompleted: boolean;
  className?: string;
}

const steps = [
  { name: 'Ikigai Discovery', key: 'ikigai' },
  { name: 'Industry Research', key: 'industry' },
  { name: 'AI Career Integration', key: 'integration' },
];

const IntrospectionProgressBar = ({ 
  ikigaiCompleted, 
  industryResearchCompleted, 
  careerRoadmapCompleted,
  className 
}: IntrospectionProgressBarProps) => {
  const getStepStatus = (stepKey: string) => {
    switch (stepKey) {
      case 'ikigai':
        return ikigaiCompleted ? 'completed' : 'current';
      case 'industry':
        return industryResearchCompleted ? 'completed' : ikigaiCompleted ? 'current' : 'locked';
      case 'integration':
        return careerRoadmapCompleted ? 'completed' : industryResearchCompleted ? 'current' : 'locked';
      default:
        return 'locked';
    }
  };

  const completedSteps = [ikigaiCompleted, industryResearchCompleted, careerRoadmapCompleted].filter(Boolean).length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold gradient-text">Introspection Progress</h3>
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
                  <Lock className="w-5 h-5" />
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

export default IntrospectionProgressBar;
