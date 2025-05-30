
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, TrendingUp, Heart, Globe, Star, DollarSign } from 'lucide-react';
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
        .update({ ai_insights: newInsights as unknown as any })
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
      const hasCompleteData = Object.values(ikigaiData).every(arr => arr.length > 0);
      if (!hasCompleteData) return;

      const hasStoredInsights = await loadStoredInsights();
      
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

  const categories = [
    {
      key: 'passion' as keyof IkigaiData,
      title: 'What You Love',
      description: 'Your passions & interests',
      icon: Heart,
      color: 'from-red-50 to-pink-50 border-red-100',
      iconColor: 'text-red-500',
      badgeColor: 'bg-red-100 text-red-800'
    },
    {
      key: 'mission' as keyof IkigaiData,
      title: 'What the World Needs',
      description: 'Your mission & purpose',
      icon: Globe,
      color: 'from-green-50 to-emerald-50 border-green-100',
      iconColor: 'text-green-500',
      badgeColor: 'bg-green-100 text-green-800'
    },
    {
      key: 'profession' as keyof IkigaiData,
      title: 'What You\'re Good At',
      description: 'Your skills & talents',
      icon: Star,
      color: 'from-blue-50 to-cyan-50 border-blue-100',
      iconColor: 'text-blue-500',
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    {
      key: 'vocation' as keyof IkigaiData,
      title: 'What You Can Be Paid For',
      description: 'Market opportunities',
      icon: DollarSign,
      color: 'from-purple-50 to-violet-50 border-purple-100',
      iconColor: 'text-purple-500',
      badgeColor: 'bg-purple-100 text-purple-800'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Integrated Ikigai Visualization and Results */}
      <Card className="premium-card">
        <CardHeader>
          <CardTitle className="gradient-text text-center">
            Your Ikigai Discovery & Visualization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="visualization" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="visualization" className="flex items-center space-x-2">
                <Brain className="w-4 h-4" />
                <span>Visual Journey</span>
              </TabsTrigger>
              <TabsTrigger value="detailed" className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>Detailed Responses</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="visualization" className="space-y-6">
              {/* Ikigai Chart */}
              <div className="text-center">
                <IkigaiChart />
                <p className="text-gray-600 mt-4 mb-8">
                  Your purpose lies at the intersection of these four elements
                </p>
              </div>

              {/* Summary Cards with User Data */}
              <div className="grid md:grid-cols-2 gap-6">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const answers = ikigaiData[category.key] || [];
                  
                  return (
                    <div
                      key={category.key}
                      className={`p-6 bg-gradient-to-br ${category.color} rounded-xl border hover:shadow-lg transition-all duration-300`}
                    >
                      <div className="flex items-center space-x-3 mb-4">
                        <div className={`p-2 rounded-lg bg-white/60 ${category.iconColor}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">{category.title}</h4>
                          <p className="text-sm text-gray-600">{category.description}</p>
                        </div>
                        <Badge className={`${category.badgeColor} text-xs font-medium`}>
                          {answers.length} {answers.length === 1 ? 'item' : 'items'}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {answers.length > 0 ? (
                          answers.slice(0, 3).map((answer, index) => (
                            <div
                              key={index}
                              className="text-sm p-3 bg-white/80 rounded-lg border text-gray-700 leading-relaxed shadow-sm"
                            >
                              {answer.length > 120 
                                ? `${answer.substring(0, 120)}...` 
                                : answer
                              }
                            </div>
                          ))
                        ) : (
                          <div className="text-sm text-gray-400 italic p-3 bg-white/40 rounded-lg border">
                            No responses yet
                          </div>
                        )}
                        {answers.length > 3 && (
                          <div className="text-xs text-gray-500 text-center mt-2">
                            +{answers.length - 3} more responses
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="detailed" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const answers = ikigaiData[category.key] || [];
                  
                  return (
                    <div
                      key={category.key}
                      className={`p-4 bg-gradient-to-br ${category.color} rounded-xl border`}
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <Icon className={`w-6 h-6 ${category.iconColor}`} />
                        <div>
                          <h4 className="font-medium text-gray-800">{category.title}</h4>
                          <p className="text-xs text-gray-600">{category.description}</p>
                        </div>
                        <Badge className={`ml-auto ${category.badgeColor} text-xs`}>
                          {answers.length}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {answers.length > 0 ? (
                          answers.map((answer, index) => (
                            <div
                              key={index}
                              className="text-sm p-2 bg-white/60 rounded border text-gray-700 leading-relaxed"
                            >
                              {answer}
                            </div>
                          ))
                        ) : (
                          <div className="text-sm text-gray-400 italic">No responses yet</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* AI Insights */}
      {(Object.values(ikigaiData).some(arr => arr.length > 0)) && (
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
      )}
    </div>
  );
};

export default IkigaiInsights;
