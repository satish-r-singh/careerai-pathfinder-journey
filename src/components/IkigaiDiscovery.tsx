
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import IkigaiStep from './IkigaiStep';
import IkigaiProgressHeader from './IkigaiProgressHeader';
import IkigaiNavigationButtons from './IkigaiNavigationButtons';
import IkigaiSidebar from './IkigaiSidebar';
import { useIkigaiProgress } from '@/hooks/useIkigaiProgress';
import { ikigaiQuestions } from '@/constants/ikigaiQuestions';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface IkigaiData {
  passion: string[];
  mission: string[];
  profession: string[];
  vocation: string[];
}

const IkigaiDiscovery = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
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
        // Save progress after updating step
        await saveProgress();
      } else {
        // Check if all steps are completed before allowing completion
        const allStepsCompleted = ikigaiData.passion.length > 0 && 
                                 ikigaiData.mission.length > 0 && 
                                 ikigaiData.profession.length > 0 && 
                                 ikigaiData.vocation.length > 0;

        if (!allStepsCompleted) {
          toast({
            title: "Incomplete Discovery",
            description: "Please complete all four sections (Passion, Mission, Profession, Vocation) before finishing your discovery.",
            variant: "destructive",
          });
          return;
        }

        console.log('Completing discovery...');
        
        // First save the current progress with completion
        await saveProgressWithCompletion();
        
        // Show success message
        toast({
          title: "Ikigai Discovery Complete!",
          description: "Congratulations! You've completed your Ikigai discovery journey.",
        });
        
        // Navigate back to introspection to see the completed results
        navigate('/introspection');
      }
    } catch (error) {
      console.error('Error in nextStep:', error);
      toast({
        title: "Error",
        description: "Failed to proceed to next step. Please try again.",
        variant: "destructive",
      });
    }
  };

  const saveProgressWithCompletion = async () => {
    // Custom save function that explicitly sets completion
    try {
      console.log('Saving completion state...');
      
      const { data: existingData, error: selectError } = await supabase
        .from('ikigai_progress')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (selectError) throw selectError;

      const progressData = {
        ikigai_data: ikigaiData as unknown as any,
        current_step: currentStep,
        is_completed: true, // Explicitly set to true
        updated_at: new Date().toISOString()
      };

      if (existingData) {
        const { error } = await supabase
          .from('ikigai_progress')
          .update(progressData)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('ikigai_progress')
          .insert({
            user_id: user.id,
            ...progressData
          });

        if (error) throw error;
      }

      // Update local state
      setIsCompleted(true);
      
      console.log('Completion saved successfully');
    } catch (error) {
      console.error('Error saving completion:', error);
      toast({
        title: "Error saving progress",
        description: "Failed to save completion status.",
        variant: "destructive",
      });
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // If completed, show a completion message instead of redirecting immediately
  if (isCompleted) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center py-12">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Discovery Complete!</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              Your Ikigai discovery journey is complete. Redirecting you to see your results...
            </p>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
          </CardContent>
        </Card>
      </div>
    );
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
              ikigaiData={ikigaiData}
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
