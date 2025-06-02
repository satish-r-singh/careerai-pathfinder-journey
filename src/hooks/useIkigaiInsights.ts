
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

interface Insights {
  summary: string;
  sentiment: string;
  keyThemes: string[];
  recommendations: string[];
}

export const useIkigaiInsights = (ikigaiData: IkigaiData) => {
  const { user } = useAuth();
  const [insights, setInsights] = useState<Insights | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadStoredInsights = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('ikigai_progress')
        .select('ai_insights')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data?.ai_insights) {
        console.log('Loading stored insights:', data.ai_insights);
        setInsights(data.ai_insights as unknown as Insights);
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Error loading stored insights:', error);
      return false;
    }
  };

  const saveInsights = async (newInsights: Insights) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('ikigai_progress')
        .update({ ai_insights: newInsights as any })
        .eq('user_id', user.id);

      if (error) throw error;
      console.log('Insights saved successfully');
    } catch (error: any) {
      console.error('Error saving insights:', error);
    }
  };

  const generateInsights = async (forceRegenerate = false) => {
    setLoading(true);
    
    try {
      const ikigaiText = Object.entries(ikigaiData)
        .map(([category, answers]) => `${category}: ${answers.join(', ')}`)
        .join('\n');

      const { data, error } = await supabase.functions.invoke('generate-ikigai-insights', {
        body: { ikigaiData: ikigaiText }
      });

      if (error) throw error;

      const newInsights = data.insights;
      setInsights(newInsights);
      
      await saveInsights(newInsights);

      if (forceRegenerate) {
        toast({
          title: "Insights Regenerated",
          description: "Your AI insights have been updated with fresh analysis.",
        });
      }
    } catch (error: any) {
      console.error('Error generating insights:', error);
      toast({
        title: "Error",
        description: "Failed to generate insights. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const regenerateInsights = () => {
    generateInsights(true);
  };

  useEffect(() => {
    const loadOrGenerateInsights = async () => {
      const hasCompleteData = Object.values(ikigaiData).every(arr => arr.length > 0);
      if (!hasCompleteData) return;

      const hasStoredInsights = await loadStoredInsights();
      
      if (!hasStoredInsights) {
        await generateInsights();
      }
    };

    loadOrGenerateInsights();
  }, [ikigaiData, user]);

  return {
    insights,
    loading,
    generateInsights,
    regenerateInsights
  };
};
