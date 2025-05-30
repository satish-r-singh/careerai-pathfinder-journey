
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
  const { user } = useAuth();
  const { toast } = useToast();
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
      const { data: ikigaiResult, error: ikigaiError } = await supabase
        .from('ikigai_progress')
        .select('ikigai_data')
        .eq('user_id', user.id)
        .maybeSingle();

      if (ikigaiError) throw ikigaiError;

      // Load industry research
      const { data: researchResult, error: researchError } = await supabase
        .from('industry_research')
        .select('research_data')
        .eq('user_id', user.id)
        .maybeSingle();

      if (researchError) throw researchError;

      // Load existing roadmap
      const { data: roadmapResult, error: roadmapError } = await supabase
        .from('career_roadmaps')
        .select('roadmap_data')
        .eq('user_id', user.id)
        .maybeSingle();

      if (roadmapError) throw roadmapError;

      if (!ikigaiResult?.ikigai_data || !researchResult?.research_data) {
        toast({
          title: "Missing Prerequisites",
          description: "Please complete both Ikigai discovery and Industry research first.",
          variant: "destructive",
        });
        navigate('/introspection');
        return;
      }

      setIkigaiData(ikigaiResult.ikigai_data);
      setIndustryResearch(researchResult.research_data);
      
      // Set existing roadmap if found - cast the JSON to CareerRoadmap type
      if (roadmapResult?.roadmap_data) {
        setRoadmap(roadmapResult.roadmap_data as CareerRoadmap);
      }

    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load your data.",
        variant: "destructive",
      });
    } finally {
      setInitialLoading(false);
    }
  };

  const generateRoadmap = async () => {
    if (!ikigaiData || !industryResearch || !user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-career-integration', {
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
        description: "Your personalized AI career roadmap is ready.",
      });
    } catch (error) {
      console.error('Error generating roadmap:', error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate your career roadmap. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/introspection')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Introspection
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Career Integration</h1>
          <p className="text-gray-600">
            Generate your personalized AI career roadmap by integrating your Ikigai insights with industry research
          </p>
        </div>

        {!roadmap ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Generate Your Career Roadmap
              </CardTitle>
              <CardDescription>
                Our AI will analyze your Ikigai discovery results and industry research to create 
                a comprehensive, personalized career development plan tailored to your unique profile.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-green-800">Ikigai Discovery</span>
                  </div>
                  <p className="text-sm text-green-700">Completed</p>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-green-800">Industry Research</span>
                  </div>
                  <p className="text-sm text-green-700">Completed</p>
                </div>
              </div>
              
              <Button 
                onClick={generateRoadmap} 
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Your Roadmap...
                  </>
                ) : (
                  <>
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Generate AI Career Roadmap
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Your Personalized Career Roadmap</h2>
              <Button variant="outline" onClick={generateRoadmap} disabled={loading}>
                {loading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  'Regenerate'
                )}
              </Button>
            </div>

            {/* Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Career Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{roadmap.overview}</p>
              </CardContent>
            </Card>

            {/* Short Term Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Short-Term Goals (3-12 months)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {roadmap.shortTermGoals?.map((goal, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{goal.title}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant={goal.priority === 'High' ? 'destructive' : goal.priority === 'Medium' ? 'default' : 'secondary'}>
                            {goal.priority}
                          </Badge>
                          <span className="text-sm text-gray-500">{goal.timeline}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{goal.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Career Path */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Career Progression Path
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {roadmap.careerPath?.map((step, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{step.role}</h4>
                        <span className="text-sm text-gray-500">{step.timeline}</span>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium text-gray-700">Requirements:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {step.requirements?.map((req, reqIndex) => (
                              <Badge key={reqIndex} variant="outline" className="text-xs">
                                {req}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">Preparation:</span>
                          <ul className="mt-1 text-sm text-gray-600">
                            {step.preparationSteps?.map((prep, prepIndex) => (
                              <li key={prepIndex} className="flex items-start gap-2">
                                <span className="text-primary">•</span>
                                {prep}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Skill Development Plan */}
            <Card>
              <CardHeader>
                <CardTitle>Skill Development Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {roadmap.skillDevelopmentPlan?.map((skill, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{skill.skill}</h4>
                        <span className="text-sm text-gray-500">{skill.timeline}</span>
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
                          {skill.resources?.map((resource, resIndex) => (
                            <li key={resIndex} className="flex items-start gap-2">
                              <span className="text-primary">•</span>
                              {resource}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Immediate Action Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {roadmap.actionItems?.map((action, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary font-medium">{index + 1}.</span>
                      {action}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AICareerIntegration;
