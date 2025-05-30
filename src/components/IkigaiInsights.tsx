
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import IkigaiChart from './IkigaiChart';

interface IkigaiData {
  passion: string[];
  mission: string[];
  profession: string[];
  vocation: string[];
}

interface IkigaiInsightsProps {
  ikigaiData: IkigaiData;
}

interface Insights {
  summary: string;
  sentiment: string;
  keyThemes: string[];
  recommendations: string[];
}

const IkigaiInsights = ({ ikigaiData }: IkigaiInsightsProps) => {
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
        setInsights(data.ai_insights as Insights);
        return true; // Found stored insights
      }
      return false; // No stored insights
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
        .update({ ai_insights: newInsights })
        .eq('user_id', user.id);

      if (error) throw error;
      console.log('Insights saved successfully');
    } catch (error: any) {
      console.error('Error saving insights:', error);
    }
  };

  const generateInsights = async () => {
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
      
      // Save insights to database
      await saveInsights(newInsights);
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

  useEffect(() => {
    const loadOrGenerateInsights = async () => {
      // Check if we have complete Ikigai data
      const hasCompleteData = Object.values(ikigaiData).every(arr => arr.length > 0);
      if (!hasCompleteData) return;

      // Try to load stored insights first
      const hasStoredInsights = await loadStoredInsights();
      
      // If no stored insights, generate new ones
      if (!hasStoredInsights) {
        await generateInsights();
      }
    };

    loadOrGenerateInsights();
  }, [ikigaiData, user]);

  const getSentimentColor = (sentiment: string) => {
    const lowerSentiment = sentiment.toLowerCase();
    if (lowerSentiment.includes('positive') || lowerSentiment.includes('optimistic')) {
      return 'bg-green-100 text-green-800';
    } else if (lowerSentiment.includes('neutral') || lowerSentiment.includes('balanced')) {
      return 'bg-blue-100 text-blue-800';
    } else if (lowerSentiment.includes('negative') || lowerSentiment.includes('concerned')) {
      return 'bg-red-100 text-red-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Ikigai Visual Diagram */}
      <Card className="premium-card">
        <CardHeader>
          <CardTitle className="gradient-text text-center">
            Your Ikigai Visualization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <IkigaiChart />
          <p className="text-center text-gray-600 mt-4">
            Your purpose lies at the intersection of these four elements
          </p>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card className="premium-card">
        <CardHeader>
          <CardTitle className="gradient-text flex items-center">
            <Brain className="w-5 h-5 mr-2" />
            AI-Powered Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Generating your personalized insights...</p>
            </div>
          ) : insights ? (
            <div className="space-y-6">
              {/* Summary */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-blue-500" />
                  Summary
                </h4>
                <p className="text-gray-700 leading-relaxed">{insights.summary}</p>
              </div>

              {/* Sentiment */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Sentiment Analysis</h4>
                <Badge className={getSentimentColor(insights.sentiment)}>
                  {insights.sentiment}
                </Badge>
              </div>

              {/* Key Themes */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Key Themes</h4>
                <div className="flex flex-wrap gap-2">
                  {insights.keyThemes.map((theme, index) => (
                    <Badge key={index} variant="outline" className="bg-purple-50 text-purple-700">
                      {theme}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">AI Recommendations</h4>
                <div className="space-y-2">
                  {insights.recommendations.map((rec, index) => (
                    <div key={index} className="p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100">
                      <p className="text-gray-700 text-sm">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                Complete your Ikigai discovery to get AI-powered insights and recommendations.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default IkigaiInsights;
