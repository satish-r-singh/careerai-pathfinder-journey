
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface IkigaiData {
  passion: string[];
  mission: string[];
  profession: string[];
  vocation: string[];
}

export const useIntrospectionStatus = () => {
  const { user } = useAuth();
  const [ikigaiCompleted, setIkigaiCompleted] = useState(false);
  const [industryResearchCompleted, setIndustryResearchCompleted] = useState(false);
  const [ikigaiData, setIkigaiData] = useState<IkigaiData>({
    passion: [],
    mission: [],
    profession: [],
    vocation: []
  });
  const [loading, setLoading] = useState(true);

  // Helper function to safely convert JSON to IkigaiData
  const parseIkigaiData = (data: any): IkigaiData => {
    const defaultData: IkigaiData = {
      passion: [],
      mission: [],
      profession: [],
      vocation: []
    };

    if (!data || typeof data !== 'object') {
      return defaultData;
    }

    return {
      passion: Array.isArray(data.passion) ? data.passion : [],
      mission: Array.isArray(data.mission) ? data.mission : [],
      profession: Array.isArray(data.profession) ? data.profession : [],
      vocation: Array.isArray(data.vocation) ? data.vocation : []
    };
  };

  useEffect(() => {
    checkCompletionStatus();
  }, [user]);

  const checkCompletionStatus = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      console.log('Checking completion status for user:', user.id);
      
      // Check Ikigai completion and get data
      const { data: ikigaiData, error: ikigaiError } = await supabase
        .from('ikigai_progress')
        .select('is_completed, ikigai_data')
        .eq('user_id', user.id)
        .maybeSingle();

      if (ikigaiError) {
        console.error('Error checking Ikigai status:', ikigaiError);
      } else {
        const isIkigaiCompleted = ikigaiData?.is_completed || false;
        console.log('Setting ikigaiCompleted to:', isIkigaiCompleted);
        setIkigaiCompleted(isIkigaiCompleted);
        
        // Set Ikigai data if available with safe parsing
        if (ikigaiData?.ikigai_data) {
          const parsedData = parseIkigaiData(ikigaiData.ikigai_data);
          setIkigaiData(parsedData);
        }
      }

      // Check Industry Research completion
      const { data: researchData, error: researchError } = await supabase
        .from('industry_research')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (researchError) {
        console.error('Error checking Industry Research status:', researchError);
      } else {
        const isResearchCompleted = !!researchData;
        console.log('Setting industryResearchCompleted to:', isResearchCompleted);
        setIndustryResearchCompleted(isResearchCompleted);
      }
    } catch (error) {
      console.error('Error loading completion status:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    ikigaiCompleted,
    industryResearchCompleted,
    ikigaiData,
    loading,
    checkCompletionStatus
  };
};
