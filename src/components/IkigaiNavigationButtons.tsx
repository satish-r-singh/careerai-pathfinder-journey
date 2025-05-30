
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface IkigaiData {
  passion: string[];
  mission: string[];
  profession: string[];
  vocation: string[];
}

interface IkigaiNavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  loading: boolean;
  ikigaiData: IkigaiData;
  onPrevStep: () => void;
  onNextStep: () => void;
}

const IkigaiNavigationButtons = ({ 
  currentStep, 
  totalSteps, 
  loading, 
  ikigaiData,
  onPrevStep, 
  onNextStep 
}: IkigaiNavigationButtonsProps) => {
  // Check if all steps have at least one response
  const allStepsCompleted = ikigaiData.passion.length > 0 && 
                           ikigaiData.mission.length > 0 && 
                           ikigaiData.profession.length > 0 && 
                           ikigaiData.vocation.length > 0;

  const isLastStep = currentStep === totalSteps - 1;
  const canComplete = isLastStep && allStepsCompleted;

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
      
      <div className="flex flex-col items-end">
        <Button 
          onClick={onNextStep} 
          disabled={loading || (isLastStep && !allStepsCompleted)}
        >
          {isLastStep ? 'Complete Discovery' : 'Continue'}
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
        {isLastStep && !allStepsCompleted && (
          <p className="text-sm text-red-600 mt-2">
            Please complete all steps before finishing your discovery
          </p>
        )}
      </div>
    </div>
  );
};

export default IkigaiNavigationButtons;
