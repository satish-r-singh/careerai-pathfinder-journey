
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Save } from 'lucide-react';

interface IkigaiProgressHeaderProps {
  currentStep: number;
  totalSteps: number;
  loading: boolean;
  onSaveProgress: () => void;
}

const IkigaiProgressHeader = ({ 
  currentStep, 
  totalSteps, 
  loading, 
  onSaveProgress 
}: IkigaiProgressHeaderProps) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex-1">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Step {currentStep + 1} of {totalSteps}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="w-full" />
      </div>
      <Button 
        variant="outline" 
        onClick={onSaveProgress} 
        disabled={loading}
        className="ml-4"
      >
        <Save className="w-4 h-4 mr-2" />
        {loading ? 'Saving...' : 'Save Progress'}
      </Button>
    </div>
  );
};

export default IkigaiProgressHeader;
