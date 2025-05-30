
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface IkigaiData {
  passion: string[];
  mission: string[];
  profession: string[];
  vocation: string[];
}

export const useIkigaiProgress = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [ikigaiData, setIkigaiData] = useState<IkigaiData>({
    passion: [],
    mission: [],
    profession: [],
    vocation: []
  });
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSavedProgress();
  }, [user]);

  const loadSavedProgress = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('ikigai_progress')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (data) {
        const savedIkigaiData = data.ikigai_data as unknown as IkigaiData;
        setIkigaiData(savedIkigaiData || {
          passion: [],
          mission: [],
          profession: [],
          vocation: []
        });
        setCurrentStep(data.current_step || 0);
        setIsCompleted(data.is_completed || false);
      }
    } catch (error) {
      console.error('Error loading saved progress:', error);
    }
  };

  const saveProgress = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('ikigai_progress')
        .upsert({
          user_id: user.id,
          ikigai_data: ikigaiData as unknown as any,
          current_step: currentStep,
          is_completed: isCompleted,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Progress saved!",
        description: "Your Ikigai discovery progress has been saved.",
      });
    } catch (error: any) {
      toast({
        title: "Error saving progress",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStepData = (category: string, responses: string[]) => {
    console.log('Updating step data for category:', category, 'with responses:', responses);
    setIkigaiData(prev => {
      const updated = {
        ...prev,
        [category]: responses
      };
      console.log('Updated ikigaiData:', updated);
      return updated;
    });
  };

  return {
    currentStep,
    setCurrentStep,
    ikigaiData,
    isCompleted,
    setIsCompleted,
    loading,
    saveProgress,
    handleStepData,
    loadSavedProgress
  };
};
