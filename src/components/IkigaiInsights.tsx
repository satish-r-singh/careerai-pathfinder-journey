
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Brain, TrendingUp, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  const [insights, setInsights] = useState<Insights | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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

      setInsights(data.insights);
      
      toast({
        title: "Insights Generated",
        description: "Your AI-powered Ikigai insights are ready!",
      });
    } catch (error: any) {
      console.error('Error generating insights:', error);
      toast({
        title: "Error",
        description: "Failed to generate insights. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto-generate insights if we have complete Ikigai data
    const hasCompleteData = Object.values(ikigaiData).every(arr => arr.length > 0);
    if (hasCompleteData && !insights) {
      generateInsights();
    }
  }, [ikigaiData]);

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
    <Card className="premium-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="gradient-text flex items-center">
            <Brain className="w-5 h-5 mr-2" />
            AI-Powered Insights
          </CardTitle>
          <Button
            onClick={generateInsights}
            disabled={loading}
            variant="outline"
            size="sm"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {loading ? 'Analyzing...' : 'Regenerate'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {insights ? (
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
            <p className="text-gray-600 mb-4">
              Complete your Ikigai discovery to get AI-powered insights and recommendations.
            </p>
            <Button 
              onClick={generateInsights} 
              disabled={loading || Object.values(ikigaiData).every(arr => arr.length === 0)}
              className="premium-button"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              Generate Insights
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IkigaiInsights;
