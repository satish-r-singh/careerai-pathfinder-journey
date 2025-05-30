import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart, Globe, Star, DollarSign, CheckCircle, Target, Search, FileText, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import IkigaiChart from '@/components/IkigaiChart';
import IntrospectionProgressBar from '@/components/IntrospectionProgressBar';
import IkigaiAnswersDisplay from '@/components/IkigaiAnswersDisplay';
import IkigaiInsights from '@/components/IkigaiInsights';

interface IkigaiData {
  passion: string[];
  mission: string[];
  profession: string[];
  vocation: string[];
}

const Introspection = () => {
  const navigate = useNavigate();
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
        
        // Set Ikigai data if available
        if (ikigaiData?.ikigai_data) {
          setIkigaiData(ikigaiData.ikigai_data as IkigaiData);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  console.log('Rendering Introspection page. ikigaiCompleted:', ikigaiCompleted, 'industryResearchCompleted:', industryResearchCompleted);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-200/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-200/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            className="mb-6 bg-white/80 backdrop-blur-sm border-purple-200 hover:bg-purple-50 transition-all duration-300"
          >
            ← Back to Dashboard
          </Button>
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm border border-purple-200/50 rounded-full text-sm font-medium text-purple-700 shadow-lg mb-4">
              <Target className="w-4 h-4 mr-2" />
              Phase 1: Self-Discovery
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Introspection Journey
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover your purpose and align your career path through guided self-reflection
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Progress Bar */}
          <Card className="premium-card">
            <CardContent className="p-6">
              <IntrospectionProgressBar 
                ikigaiCompleted={ikigaiCompleted}
                industryResearchCompleted={industryResearchCompleted}
              />
            </CardContent>
          </Card>

          {!ikigaiCompleted ? (
            // Show Ikigai Discovery if not completed
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="gradient-text">About Ikigai Discovery</CardTitle>
                <CardDescription>
                  Ikigai (生き甲斐) is a Japanese concept meaning "a reason for being." 
                  It represents the intersection of what you love, what you're good at, 
                  what the world needs, and what you can be paid for.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <IkigaiChart />
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border border-red-100">
                    <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
                    <h4 className="font-medium">What You Love</h4>
                    <p className="text-sm text-gray-600">Your passions & interests</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                    <Globe className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <h4 className="font-medium">What the World Needs</h4>
                    <p className="text-sm text-gray-600">Your mission & purpose</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                    <Star className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <h4 className="font-medium">What You're Good At</h4>
                    <p className="text-sm text-gray-600">Your skills & talents</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-100">
                    <DollarSign className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                    <h4 className="font-medium">What You Can Be Paid For</h4>
                    <p className="text-sm text-gray-600">Market opportunities</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 mb-6">
                    This guided discovery will help you find clarity on your career direction 
                    and identify opportunities in the AI space that align with your true purpose.
                  </p>
                  <Button 
                    onClick={() => navigate('/ikigai')}
                    className="premium-button"
                  >
                    Start Ikigai Discovery
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            // Show completed Ikigai results and next steps
            <div className="space-y-6">
              <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-green-800">Ikigai Discovery Completed!</h3>
                  </div>
                  <p className="text-green-700">
                    Excellent! You've completed your Ikigai discovery. Review your results and AI insights below.
                  </p>
                </CardContent>
              </Card>

              {/* Display Ikigai Answers */}
              <IkigaiAnswersDisplay ikigaiData={ikigaiData} />

              {/* AI Insights */}
              <IkigaiInsights ikigaiData={ikigaiData} />

              {/* Continue Your Journey */}
              <Card className="premium-card">
                <CardHeader>
                  <CardTitle className="gradient-text">Continue Your Journey</CardTitle>
                  <CardDescription>
                    Complete these essential activities to finish your introspection phase
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 border rounded-xl hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 border-blue-200">
                      <div className="flex items-center space-x-3 mb-4">
                        <Search className="w-8 h-8 text-blue-500" />
                        <h3 className="text-lg font-semibold">Target Role Research</h3>
                      </div>
                      <p className="text-gray-600 mb-4">
                        Research specific AI roles that align with your Ikigai discovery. 
                        Understand job requirements, salary ranges, and career paths.
                      </p>
                      <Button className="w-full" variant="outline">
                        Start Role Research
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>

                    <div className="p-6 border rounded-xl hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-purple-50/50 to-violet-50/50 border-purple-200">
                      <div className="flex items-center space-x-3 mb-4">
                        <Target className="w-8 h-8 text-purple-500" />
                        <h3 className="text-lg font-semibold">Define Career Goals</h3>
                      </div>
                      <p className="text-gray-600 mb-4">
                        Set specific, measurable career goals based on your Ikigai insights. 
                        Create a roadmap for your AI career transition.
                      </p>
                      <Button className="w-full" variant="outline">
                        Set Career Goals
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>

                    <div className={`p-6 border rounded-xl transition-all duration-300 ${
                      industryResearchCompleted 
                        ? 'bg-gradient-to-br from-green-50/50 to-emerald-50/50 border-green-200 shadow-lg' 
                        : 'bg-gradient-to-br from-orange-50/50 to-yellow-50/50 border-orange-200 hover:shadow-lg'
                    }`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <FileText className={`w-8 h-8 ${industryResearchCompleted ? 'text-green-500' : 'text-orange-500'}`} />
                          <h3 className="text-lg font-semibold">Industry Analysis</h3>
                        </div>
                        {industryResearchCompleted && (
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-gray-600 mb-4">
                        {industryResearchCompleted 
                          ? 'Completed! You\'ve analyzed the AI industry landscape and identified opportunities.'
                          : 'Deep dive into the AI industry landscape. Understand market trends, key players, and emerging opportunities.'
                        }
                      </p>
                      <Button 
                        className="w-full" 
                        variant={industryResearchCompleted ? "default" : "outline"}
                        onClick={() => navigate('/industry-research')}
                      >
                        {industryResearchCompleted ? 'View Results' : 'Analyze Industry'}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>

                    <div className={`p-6 border rounded-xl transition-all duration-300 ${
                      industryResearchCompleted 
                        ? 'bg-gradient-to-br from-violet-50/50 to-purple-50/50 border-violet-200 hover:shadow-lg' 
                        : 'bg-gray-50/50 border-gray-200 opacity-60'
                    }`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <Sparkles className={`w-8 h-8 ${industryResearchCompleted ? 'text-violet-500' : 'text-gray-400'}`} />
                          <h3 className="text-lg font-semibold">AI Career Integration</h3>
                        </div>
                        {!industryResearchCompleted && (
                          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                            Complete Industry Analysis first
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-4">
                        {industryResearchCompleted 
                          ? 'Integrate your Ikigai insights with industry research to create your personalized AI career roadmap.'
                          : 'This step will become available after completing the Industry Analysis.'
                        }
                      </p>
                      <Button 
                        className="w-full" 
                        disabled={!industryResearchCompleted}
                        variant={industryResearchCompleted ? "default" : "outline"}
                      >
                        {industryResearchCompleted ? 'Start Integration' : 'Locked'}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>

                    <div className="md:col-span-2 p-6 border rounded-xl hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-indigo-50/50 to-blue-50/50 border-indigo-200">
                      <div className="flex items-center space-x-3 mb-4">
                        <CheckCircle className="w-8 h-8 text-indigo-500" />
                        <h3 className="text-lg font-semibold">Review Your Progress</h3>
                      </div>
                      <p className="text-gray-600 mb-4">
                        Revisit your Ikigai discovery results and track your overall introspection progress.
                      </p>
                      <div className="flex gap-3">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => navigate('/ikigai')}
                        >
                          View Ikigai Results
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                        <Button 
                          className="flex-1"
                          onClick={() => navigate('/dashboard')}
                        >
                          View Dashboard
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Introspection;
