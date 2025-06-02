
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { OnboardingData } from '@/types/onboarding';
import { useOnboardingProgress } from '@/hooks/useOnboardingProgress';
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
  const [hasExistingResume, setHasExistingResume] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { loadProgress, saveProgress, uploadResume, loading: progressLoading, saving } = useOnboardingProgress();

  // Load existing progress on component mount
  useEffect(() => {
    const initializeProgress = async () => {
      const progress = await loadProgress();
      if (progress) {
        setCurrentStep(progress.currentStep);
        setData(progress.data);
        setHasExistingResume(!!progress.resumeUrl);
        
        // If already completed, redirect to dashboard
        if (progress.isCompleted) {
          navigate('/dashboard');
        }
      }
    };

    initializeProgress();
  }, [user]);

  const handleNext = async () => {
    if (currentStep < 5) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      
      // Save progress after each step
      try {
        await saveProgress(nextStep, data);
      } catch (error) {
        console.error('Error saving progress:', error);
        toast({
          title: "Error saving progress",
          description: "Your progress couldn't be saved. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      handleComplete();
    }
  };

  const handlePrevious = async () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      
      // Save progress when going back
      try {
        await saveProgress(prevStep, data);
      } catch (error) {
        console.error('Error saving progress:', error);
      }
    }
  };

  const handleComplete = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      let resumeUrl = hasExistingResume ? undefined : null;

      // Upload resume if provided
      if (data.resumeFile) {
        try {
          resumeUrl = await uploadResume(data.resumeFile);
        } catch (error) {
          console.error('Error uploading resume:', error);
          toast({
            title: "Error uploading resume",
            description: "Please try uploading your resume again.",
            variant: "destructive",
          });
          return;
        }
      }

      // Save final onboarding data to profiles
      const { error: profileError } = await supabase
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
          resume_url: resumeUrl,
          updated_at: new Date().toISOString()
        });

      if (profileError) throw profileError;

      // Mark onboarding as completed
      await saveProgress(6, data, resumeUrl); // Step 6 means completed

      toast({
        title: "Welcome to CareerAI!",
        description: "Your personalized AI career journey begins now.",
      });
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error completing onboarding:', error);
      toast({
        title: "Error completing setup",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDataChange = async (newData: OnboardingData) => {
    setData(newData);
    
    // Auto-save data changes (debounced by saving state)
    if (!saving) {
      try {
        await saveProgress(currentStep, newData);
      } catch (error) {
        console.error('Error auto-saving:', error);
      }
    }
  };

  if (progressLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold">C</span>
          </div>
          <p>Loading your progress...</p>
        </div>
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep
            data={data}
            setData={handleDataChange}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <ProfessionalBackgroundStep
            data={data}
            setData={handleDataChange}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 3:
        return (
          <AIInterestStep
            data={data}
            setData={handleDataChange}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 4:
        return (
          <GoalsTimelineStep
            data={data}
            setData={handleDataChange}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 5:
        return (
          <DocumentUploadStep
            data={data}
            setData={handleDataChange}
            onNext={handleNext}
            onPrevious={handlePrevious}
            loading={loading}
            hasExistingResume={hasExistingResume}
          />
        );
      default:
        return null;
    }
  };

  return renderStep();
};

export default Onboarding;
