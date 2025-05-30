
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import IkigaiStep from './IkigaiStep';
import IkigaiResults from './IkigaiResults';
import IkigaiProgressHeader from './IkigaiProgressHeader';
import IkigaiNavigationButtons from './IkigaiNavigationButtons';
import IkigaiSidebar from './IkigaiSidebar';
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
    initialLoading,
    saveProgress,
    handleStepData
  } = useIkigaiProgress();

  // Show loading state while initial data is being fetched
  if (initialLoading) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your progress...</p>
        </div>
      </div>
    );
  }

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

  // If completed, show results
  if (isCompleted) {
    return <IkigaiResults ikigaiData={ikigaiData} onRestart={() => setIsCompleted(false)} />;
  }

  return (
    <div className="max-w-7xl mx-auto flex gap-6">
      <IkigaiSidebar 
        ikigaiData={ikigaiData} 
        currentStep={currentStep} 
      />
      
      <div className="flex-1 space-y-6">
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
    </div>
  );
};

export default IkigaiDiscovery;
