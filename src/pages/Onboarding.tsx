
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { OnboardingData } from '@/types/onboarding';
import BasicInfoStep from '@/components/onboarding/BasicInfoStep';
import ProfessionalBackgroundStep from '@/components/onboarding/ProfessionalBackgroundStep';
import AIInterestStep from '@/components/onboarding/AIInterestStep';
import GoalsTimelineStep from '@/components/onboarding/GoalsTimelineStep';
import DocumentUploadStep from '@/components/onboarding/DocumentUploadStep';

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    currentRole: '',
    experience: '',
    background: '',
    aiInterest: '',
    goals: [],
    timeline: '',
    resumeFile: null,
    linkedinUrl: ''
  });
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          user_role: data.currentRole,
          experience: data.experience,
          background: data.background,
          ai_interest: data.aiInterest,
          goals: data.goals,
          timeline: data.timeline,
          linkedin_url: data.linkedinUrl,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Welcome to CareerAI!",
        description: "Your personalized AI career journey begins now.",
      });
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error saving onboarding data:', error);
      toast({
        title: "Error saving profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep
            data={data}
            setData={setData}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <ProfessionalBackgroundStep
            data={data}
            setData={setData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 3:
        return (
          <AIInterestStep
            data={data}
            setData={setData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 4:
        return (
          <GoalsTimelineStep
            data={data}
            setData={setData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 5:
        return (
          <DocumentUploadStep
            data={data}
            setData={setData}
            onNext={handleNext}
            onPrevious={handlePrevious}
            loading={loading}
          />
        );
      default:
        return null;
    }
  };

  return renderStep();
};

export default Onboarding;
