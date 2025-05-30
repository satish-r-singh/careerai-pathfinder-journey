
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import IkigaiStep from './IkigaiStep';
import IkigaiResults from './IkigaiResults';
import IkigaiProgressHeader from './IkigaiProgressHeader';
import IkigaiNavigationButtons from './IkigaiNavigationButtons';
import { useIkigaiProgress } from '@/hooks/useIkigaiProgress';
import { ikigaiQuestions } from '@/constants/ikigaiQuestions';

interface IkigaiData {
  passion: string[];
  mission: string[];
  profession: string[];
  vocation: string[];
}

const IkigaiDiscovery = () => {
  const { toast } = useToast();
  const {
    currentStep,
    setCurrentStep,
    ikigaiData,
    isCompleted,
    setIsCompleted,
    loading,
    saveProgress,
    handleStepData
  } = useIkigaiProgress();

  const nextStep = async () => {
    console.log('Next step clicked, current step:', currentStep);
    console.log('Current ikigaiData:', ikigaiData);
    
    try {
      if (currentStep < ikigaiQuestions.length - 1) {
        const newStep = currentStep + 1;
        setCurrentStep(newStep);
        console.log('Moving to step:', newStep);
      } else {
        console.log('Completing discovery...');
        setIsCompleted(true);
      }
      
      // Save progress after updating state
      await saveProgress();
    } catch (error) {
      console.error('Error in nextStep:', error);
      toast({
        title: "Error",
        description: "Failed to proceed to next step. Please try again.",
        variant: "destructive",
      });
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (isCompleted) {
    return <IkigaiResults ikigaiData={ikigaiData} onRestart={() => setIsCompleted(false)} />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Ikigai Discovery Journey</CardTitle>
          <CardDescription>
            Discover your purpose by exploring the intersection of what you love, what you're good at, 
            what the world needs, and what you can be paid for.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <IkigaiProgressHeader
            currentStep={currentStep}
            totalSteps={ikigaiQuestions.length}
            loading={loading}
            onSaveProgress={saveProgress}
          />

          <IkigaiStep
            step={ikigaiQuestions[currentStep]}
            initialData={ikigaiData[ikigaiQuestions[currentStep].category as keyof IkigaiData]}
            onDataChange={(responses) => handleStepData(ikigaiQuestions[currentStep].category, responses)}
          />

          <IkigaiNavigationButtons
            currentStep={currentStep}
            totalSteps={ikigaiQuestions.length}
            loading={loading}
            onPrevStep={prevStep}
            onNextStep={nextStep}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default IkigaiDiscovery;
