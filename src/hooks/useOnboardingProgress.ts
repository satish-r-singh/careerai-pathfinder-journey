
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { OnboardingData } from '@/types/onboarding';

export const useOnboardingProgress = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadProgress = async () => {
    if (!user) {
      setLoading(false);
      return { currentStep: 1, data: getInitialData() };
    }

    try {
      const { data: progress, error } = await supabase
        .from('onboarding_progress')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading onboarding progress:', error);
        return { currentStep: 1, data: getInitialData() };
      }

      if (!progress) {
        return { currentStep: 1, data: getInitialData() };
      }

      return {
        currentStep: progress.current_step,
        data: {
          ...getInitialData(),
          ...(progress.onboarding_data as Partial<OnboardingData>),
          resumeFile: null, // File objects can't be persisted
        },
        isCompleted: progress.is_completed,
        resumeUrl: progress.resume_url
      };
    } catch (error) {
      console.error('Error loading progress:', error);
      return { currentStep: 1, data: getInitialData() };
    } finally {
      setLoading(false);
    }
  };

  const saveProgress = async (currentStep: number, data: OnboardingData, resumeUrl?: string) => {
    if (!user) return;

    setSaving(true);
    try {
      // Convert OnboardingData to a plain object for JSON storage
      const dataToSave = {
        currentRole: data.currentRole,
        experience: data.experience,
        background: data.background,
        aiInterest: data.aiInterest,
        goals: data.goals,
        timeline: data.timeline
        // Note: resumeFile is not saved as it's a File object
        // Note: linkedinUrl removed as we only support PDF upload now
      };

      const { error } = await supabase
        .from('onboarding_progress')
        .upsert({
          user_id: user.id,
          current_step: currentStep,
          onboarding_data: dataToSave,
          resume_url: resumeUrl || null,
          is_completed: currentStep > 5
        });

      if (error) {
        console.error('Error saving onboarding progress:', error);
        throw error;
      }
    } finally {
      setSaving(false);
    }
  };

  const uploadResume = async (file: File): Promise<string> => {
    if (!user) throw new Error('User not authenticated');

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/resume.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('resumes')
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      console.error('Error uploading resume:', uploadError);
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('resumes')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  return {
    loadProgress,
    saveProgress,
    uploadResume,
    loading,
    saving
  };
};

const getInitialData = (): OnboardingData => ({
  currentRole: '',
  experience: '',
  background: '',
  aiInterest: '',
  goals: [],
  timeline: '',
  resumeFile: null
});
