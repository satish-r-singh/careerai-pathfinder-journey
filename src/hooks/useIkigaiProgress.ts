
import { useState, useEffect, useRef, useCallback } from 'react';
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
  const [initialLoading, setInitialLoading] = useState(true);
  const lastSavedDataRef = useRef<string>('');
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSavingRef = useRef(false);

  useEffect(() => {
    if (user) {
      loadSavedProgress();
    } else {
      setInitialLoading(false);
    }
  }, [user]);

  // Debounced auto-save when ikigaiData changes
  useEffect(() => {
    if (!user || initialLoading) return;
    
    const currentDataString = JSON.stringify(ikigaiData);
    const hasData = ikigaiData.passion.length > 0 || ikigaiData.mission.length > 0 || 
                   ikigaiData.profession.length > 0 || ikigaiData.vocation.length > 0;
    
    // Only save if data has actually changed and we have some data
    if (hasData && currentDataString !== lastSavedDataRef.current) {
      // Clear any existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      // Debounce the save operation
      saveTimeoutRef.current = setTimeout(() => {
        if (!isSavingRef.current) {
          console.log('Auto-saving progress due to data change:', ikigaiData);
          lastSavedDataRef.current = currentDataString;
          saveProgress();
        }
      }, 1000); // Increased to 1000ms debounce for more stability
    }
  }, [ikigaiData, user, initialLoading]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const loadSavedProgress = async () => {
    if (!user) return;
    
    setInitialLoading(true);
    
    try {
      console.log('Loading saved progress for user:', user.id);
      
      const { data, error } = await supabase
        .from('ikigai_progress')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading saved progress:', error);
        throw error;
      }

      if (data) {
        console.log('Found saved ikigai progress:', data);
        
        const savedIkigaiData = data.ikigai_data as unknown as IkigaiData;
        const loadedData = savedIkigaiData || {
          passion: [],
          mission: [],
          profession: [],
          vocation: []
        };
        
        console.log('Setting loaded data:', loadedData);
        setIkigaiData(loadedData);
        setCurrentStep(data.current_step || 0);
        setIsCompleted(data.is_completed || false);
        
        // Update the ref to prevent immediate auto-save after loading
        lastSavedDataRef.current = JSON.stringify(loadedData);
        
        console.log('Loaded progress - Step:', data.current_step, 'Completed:', data.is_completed);
      } else {
        console.log('No saved progress found, starting fresh');
        // Reset to initial state if no data found
        setIkigaiData({
          passion: [],
          mission: [],
          profession: [],
          vocation: []
        });
        setCurrentStep(0);
        setIsCompleted(false);
      }
    } catch (error) {
      console.error('Error loading saved progress:', error);
      toast({
        title: "Error loading progress",
        description: "Failed to load your saved progress. Starting fresh.",
        variant: "destructive",
      });
    } finally {
      setInitialLoading(false);
    }
  };

  const saveProgress = useCallback(async () => {
    if (!user || isSavingRef.current) return;
    
    isSavingRef.current = true;
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
      isSavingRef.current = false;
    }
  }, [ikigaiData, currentStep, isCompleted, user, toast]);

  const handleStepData = useCallback((category: string, responses: string[]) => {
    console.log('Updating step data for category:', category, 'with responses:', responses);
    
    setIkigaiData(prev => {
      // Create a deep copy to ensure we don't mutate the previous state
      const updated = {
        passion: category === 'passion' ? [...responses] : [...prev.passion],
        mission: category === 'mission' ? [...responses] : [...prev.mission],
        profession: category === 'profession' ? [...responses] : [...prev.profession],
        vocation: category === 'vocation' ? [...responses] : [...prev.vocation]
      };
      
      console.log('Updated ikigaiData:', updated);
      return updated;
    });
  }, []);

  return {
    currentStep,
    setCurrentStep,
    ikigaiData,
    isCompleted,
    setIsCompleted,
    loading,
    initialLoading,
    saveProgress,
    handleStepData,
    loadSavedProgress
  };
};
