
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface IkigaiNavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  loading: boolean;
  onPrevStep: () => void;
  onNextStep: () => void;
}

const IkigaiNavigationButtons = ({ 
  currentStep, 
  totalSteps, 
  loading, 
  onPrevStep, 
  onNextStep 
}: IkigaiNavigationButtonsProps) => {
  return (
    <div className="flex justify-between pt-6">
      <Button 
        variant="outline" 
        onClick={onPrevStep} 
        disabled={currentStep === 0}
      >
        <ChevronLeft className="w-4 h-4 mr-2" />
        Previous
      </Button>
      
      <Button onClick={onNextStep} disabled={loading}>
        {currentStep === totalSteps - 1 ? 'Complete Discovery' : 'Continue'}
        <ChevronRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
};

export default IkigaiNavigationButtons;
