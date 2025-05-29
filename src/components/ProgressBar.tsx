
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  currentPhase: number;
  totalPhases: number;
  className?: string;
}

const phases = [
  { name: 'Introspection', description: 'Self-discovery & career alignment' },
  { name: 'Exploration', description: 'Project identification & knowledge building' },
  { name: 'Reflection', description: 'Skill validation through feedback' },
  { name: 'Action', description: 'Active job hunting & applications' }
];

const ProgressBar = ({ currentPhase, totalPhases, className }: ProgressBarProps) => {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-4">
        {phases.map((phase, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300",
              index + 1 <= currentPhase 
                ? "bg-primary text-white" 
                : index + 1 === currentPhase + 1
                ? "bg-primary/20 text-primary border-2 border-primary"
                : "bg-gray-200 text-gray-500"
            )}>
              {index + 1}
            </div>
            <div className="mt-2 text-center">
              <div className={cn(
                "font-medium text-sm",
                index + 1 <= currentPhase ? "text-primary" : "text-gray-500"
              )}>
                {phase.name}
              </div>
              <div className="text-xs text-gray-400 max-w-24 hidden sm:block">
                {phase.description}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-500"
          style={{ width: `${(currentPhase / totalPhases) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
