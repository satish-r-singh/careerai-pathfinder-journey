
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

  // Auto-save when ikigaiData changes
  useEffect(() => {
    if (user && (ikigaiData.passion.length > 0 || ikigaiData.mission.length > 0 || 
        ikigaiData.profession.length > 0 || ikigaiData.vocation.length > 0)) {
      console.log('Auto-saving progress due to data change:', ikigaiData);
      saveProgress();
    }
  }, [ikigaiData, user]);

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
        console.log('Loaded saved ikigai data:', savedIkigaiData);
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
      console.log('Saving progress with data:', ikigaiData);
      
      // First check if a record exists
      const { data: existingData, error: selectError } = await supabase
        .from('ikigai_progress')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (selectError) throw selectError;

      const progressData = {
        ikigai_data: ikigaiData as unknown as any,
        current_step: currentStep,
        is_completed: isCompleted,
        updated_at: new Date().toISOString()
      };

      if (existingData) {
        // Update existing record
        const { error } = await supabase
          .from('ikigai_progress')
          .update(progressData)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('ikigai_progress')
          .insert({
            user_id: user.id,
            ...progressData
          });

        if (error) throw error;
      }

      console.log('Progress saved successfully');
    } catch (error: any) {
      console.error('Error saving progress:', error);
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
      // Create a completely new object to avoid any reference issues
      const updated = {
        passion: category === 'passion' ? [...responses] : [...prev.passion],
        mission: category === 'mission' ? [...responses] : [...prev.mission],
        profession: category === 'profession' ? [...responses] : [...prev.profession],
        vocation: category === 'vocation' ? [...responses] : [...prev.vocation]
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
