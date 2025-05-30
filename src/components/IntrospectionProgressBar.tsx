
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IntrospectionProgressBarProps {
  ikigaiCompleted: boolean;
  industryResearchCompleted: boolean;
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
  className 
}: IntrospectionProgressBarProps) => {
  const getStepStatus = (stepKey: string) => {
    switch (stepKey) {
      case 'ikigai':
        return ikigaiCompleted ? 'completed' : 'current';
      case 'industry':
        return industryResearchCompleted ? 'completed' : ikigaiCompleted ? 'current' : 'locked';
      case 'integration':
        return industryResearchCompleted ? 'current' : 'locked';
      default:
        return 'locked';
    }
  };

  const completedSteps = [ikigaiCompleted, industryResearchCompleted, false].filter(Boolean).length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-800">Introspection Progress</h3>
          <span className="text-sm text-gray-600">{completedSteps}/{steps.length} completed</span>
        </div>
        <Progress value={progressPercentage} className="h-3" />
      </div>
      
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const status = getStepStatus(step.key);
          
          return (
            <div key={step.key} className="flex flex-col items-center flex-1">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 mb-2",
                status === 'completed' 
                  ? "bg-green-500 text-white" 
                  : status === 'current'
                  ? "bg-purple-500 text-white"
                  : "bg-gray-200 text-gray-400"
              )}>
                {status === 'completed' ? (
                  <CheckCircle className="w-5 h-5" />
                ) : status === 'current' ? (
                  <Clock className="w-5 h-5" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
              </div>
              <div className="text-center">
                <div className={cn(
                  "font-medium text-sm",
                  status === 'completed' ? "text-green-600" 
                  : status === 'current' ? "text-purple-600" 
                  : "text-gray-400"
                )}>
                  {step.name}
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className={cn(
                  "absolute h-0.5 w-20 top-5 translate-x-10",
                  status === 'completed' ? "bg-green-300" : "bg-gray-200"
                )} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IntrospectionProgressBar;
