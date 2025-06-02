import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Loader2, Target, Lightbulb, TrendingUp, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
interface CareerRoadmap {
  overview: string;
  shortTermGoals: Array<{
    title: string;
    timeline: string;
    description: string;
    priority: 'High' | 'Medium' | 'Low';
  }>;
  longTermGoals: Array<{
    title: string;
    timeline: string;
    description: string;
    impact: string;
  }>;
  skillDevelopmentPlan: Array<{
    skill: string;
    currentLevel: string;
    targetLevel: string;
    resources: string[];
    timeline: string;
  }>;
  careerPath: Array<{
    role: string;
    timeline: string;
    requirements: string[];
    preparationSteps: string[];
  }>;
  actionItems: string[];
}
const AICareerIntegration = () => {
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [roadmap, setRoadmap] = useState<CareerRoadmap | null>(null);
  const [ikigaiData, setIkigaiData] = useState(null);
  const [industryResearch, setIndustryResearch] = useState(null);
  useEffect(() => {
    loadData();
  }, [user]);
  const loadData = async () => {
    if (!user) {
      setInitialLoading(false);
      return;
    }
    try {
      // Load Ikigai data
      const {
        data: ikigaiResult,
        error: ikigaiError
      } = await supabase.from('ikigai_progress').select('ikigai_data').eq('user_id', user.id).maybeSingle();
      if (ikigaiError) throw ikigaiError;

      // Load industry research
      const {
        data: researchResult,
        error: researchError
      } = await supabase.from('industry_research').select('research_data').eq('user_id', user.id).maybeSingle();
      if (researchError) throw researchError;

      // Load existing roadmap
      const {
        data: roadmapResult,
        error: roadmapError
      } = await supabase.from('career_roadmaps').select('roadmap_data').eq('user_id', user.id).maybeSingle();
      if (roadmapError) throw roadmapError;
      if (!ikigaiResult?.ikigai_data || !researchResult?.research_data) {
        toast({
          title: "Missing Prerequisites",
          description: "Please complete both Ikigai discovery and Industry research first.",
          variant: "destructive"
        });
        navigate('/introspection');
        return;
      }
      setIkigaiData(ikigaiResult.ikigai_data);
      setIndustryResearch(researchResult.research_data);

      // Set existing roadmap if found - cast via unknown to CareerRoadmap type
      if (roadmapResult?.roadmap_data) {
        setRoadmap(roadmapResult.roadmap_data as unknown as CareerRoadmap);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load your data.",
        variant: "destructive"
      });
    } finally {
      setInitialLoading(false);
    }
  };
  const generateRoadmap = async () => {
    if (!ikigaiData || !industryResearch || !user) return;
    setLoading(true);
    try {
      const {
        data,
        error
      } = await supabase.functions.invoke('ai-career-integration', {
        body: {
          ikigaiData,
          industryResearch,
          userId: user.id
        }
      });
      if (error) throw error;
      setRoadmap(data.roadmap);
      toast({
        title: "Career Roadmap Generated!",
        description: "Your personalized AI career roadmap is ready."
      });
    } catch (error) {
      console.error('Error generating roadmap:', error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate your career roadmap. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  if (initialLoading) {
    return <div className="min-h-screen gradient-bg flex items-center justify-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-float" style={{
          animationDelay: '2s'
        }} />
        </div>
        
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Loading your data...</p>
        </div>
      </div>;
  }
  return <div className="min-h-screen gradient-bg relative overflow-hidden">
      {/* Enhanced Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-float" style={{
        animationDelay: '2s'
      }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-200/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-200/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="mb-8">
          <Button variant="outline" onClick={() => navigate('/introspection')} className="mb-4 bg-white/20 backdrop-blur-sm border-white/30 text-purple-800 hover:bg-white/30 transition-all duration-300">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Introspection
          </Button>
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold gradient-text py-[4px] my-[4px]">AI Career Integration</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Generate your personalized AI career roadmap by integrating your Ikigai insights with industry research
            </p>
          </div>
        </div>

        {!roadmap ? <Card className="premium-card animate-fade-in">
            <div className="absolute inset-0 bg-gradient-to-br from-white via-purple-50/50 to-blue-50/50 rounded-lg" />
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center gap-2 gradient-text text-left py-[4px]">
                <Target className="w-6 h-6" />
                Generate Your Career Roadmap
              </CardTitle>
              <CardDescription className="text-base">
                Our AI will analyze your Ikigai discovery results and industry research to create 
                a comprehensive, personalized career development plan tailored to your unique profile.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl shadow-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="font-semibold text-green-800 text-lg">Ikigai Discovery</span>
                  </div>
                  <p className="text-green-700 font-medium">✓ Completed</p>
                </div>
                <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl shadow-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="font-semibold text-green-800 text-lg">Industry Research</span>
                  </div>
                  <p className="text-green-700 font-medium">✓ Completed</p>
                </div>
              </div>
              
              <Button onClick={generateRoadmap} disabled={loading} className="w-full premium-button" size="lg">
                {loading ? <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating Your Roadmap...
                  </> : <>
                    <Lightbulb className="w-5 h-5 mr-2" />
                    Generate AI Career Roadmap
                  </>}
              </Button>
            </CardContent>
          </Card> : <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold gradient-text">Your Personalized Career Roadmap</h2>
              <Button variant="outline" onClick={generateRoadmap} disabled={loading} className="bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30">
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Regenerate'}
              </Button>
            </div>

            {/* Overview */}
            <Card className="premium-card animate-fade-in">
              <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 rounded-lg" />
              <CardHeader className="relative z-10">
                <CardTitle className="gradient-text">Career Overview</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-gray-700 leading-relaxed">{roadmap.overview}</p>
              </CardContent>
            </Card>

            {/* Short Term Goals */}
            <Card className="premium-card animate-fade-in" style={{
          animationDelay: '0.1s'
        }}>
              <div className="absolute inset-0 bg-gradient-to-br from-white via-orange-50/30 to-yellow-50/30 rounded-lg" />
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-2 gradient-text">
                  <Target className="w-5 h-5" />
                  Short-Term Goals (3-12 months)
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-4">
                  {roadmap.shortTermGoals?.map((goal, index) => <div key={index} className="p-4 bg-white/60 backdrop-blur-sm border border-white/20 rounded-lg shadow-md">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-800">{goal.title}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant={goal.priority === 'High' ? 'destructive' : goal.priority === 'Medium' ? 'default' : 'secondary'}>
                            {goal.priority}
                          </Badge>
                          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{goal.timeline}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{goal.description}</p>
                    </div>)}
                </div>
              </CardContent>
            </Card>

            {/* Career Path */}
            <Card className="premium-card animate-fade-in" style={{
          animationDelay: '0.2s'
        }}>
              <div className="absolute inset-0 bg-gradient-to-br from-white via-green-50/30 to-emerald-50/30 rounded-lg" />
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-2 gradient-text my-0 py-[10px]">
                  <TrendingUp className="w-5 h-5" />
                  Career Progression Path
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-4">
                  {roadmap.careerPath?.map((step, index) => <div key={index} className="p-4 bg-white/60 backdrop-blur-sm border border-white/20 rounded-lg shadow-md">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-800">{step.role}</h4>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{step.timeline}</span>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium text-gray-700">Requirements:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {step.requirements?.map((req, reqIndex) => <Badge key={reqIndex} variant="outline" className="text-xs">
                                {req}
                              </Badge>)}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">Preparation:</span>
                          <ul className="mt-1 text-sm text-gray-600">
                            {step.preparationSteps?.map((prep, prepIndex) => <li key={prepIndex} className="flex items-start gap-2">
                                <span className="text-primary">•</span>
                                {prep}
                              </li>)}
                          </ul>
                        </div>
                      </div>
                    </div>)}
                </div>
              </CardContent>
            </Card>

            {/* Skill Development Plan */}
            <Card className="premium-card animate-fade-in" style={{
          animationDelay: '0.3s'
        }}>
              <div className="absolute inset-0 bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 rounded-lg" />
              <CardHeader className="relative z-10">
                <CardTitle className="gradient-text">Skill Development Plan</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-4">
                  {roadmap.skillDevelopmentPlan?.map((skill, index) => <div key={index} className="p-4 bg-white/60 backdrop-blur-sm border border-white/20 rounded-lg shadow-md">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-800">{skill.skill}</h4>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{skill.timeline}</span>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 mb-2">
                        <div>
                          <span className="text-sm text-gray-600">Current: </span>
                          <Badge variant="secondary">{skill.currentLevel}</Badge>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Target: </span>
                          <Badge variant="default">{skill.targetLevel}</Badge>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Resources:</span>
                        <ul className="mt-1 text-sm text-gray-600">
                          {skill.resources?.map((resource, resIndex) => <li key={resIndex} className="flex items-start gap-2">
                              <span className="text-primary">•</span>
                              {resource}
                            </li>)}
                        </ul>
                      </div>
                    </div>)}
                </div>
              </CardContent>
            </Card>

            {/* Action Items */}
            <Card className="premium-card animate-fade-in" style={{
          animationDelay: '0.4s'
        }}>
              <div className="absolute inset-0 bg-gradient-to-br from-white via-cyan-50/30 to-blue-50/30 rounded-lg" />
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-2 gradient-text">
                  <Calendar className="w-5 h-5" />
                  Immediate Action Items
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <ul className="space-y-3">
                  {roadmap.actionItems?.map((action, index) => <li key={index} className="flex items-start gap-3 p-3 bg-white/60 backdrop-blur-sm border border-white/20 rounded-lg shadow-sm">
                      <span className="text-primary font-bold text-lg">{index + 1}.</span>
                      <span className="text-gray-700">{action}</span>
                    </li>)}
                </ul>
              </CardContent>
            </Card>
          </div>}
      </div>
    </div>;
};
export default AICareerIntegration;