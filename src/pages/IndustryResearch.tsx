import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Loader2, TrendingUp, Briefcase, DollarSign, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface AIRole {
  title: string;
  description: string;
  required_skills: string[];
  salary_range: string;
  growth_outlook: string;
}

interface Industry {
  name: string;
  alignment_score: number;
  description: string;
  ai_roles: AIRole[];
  market_trends: string[];
  target_companies: string[];
}

interface ResearchResults {
  industries: Industry[];
  next_steps: string[];
  skill_gaps: string[];
  content?: string;
  type?: string;
}

const IndustryResearch = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [researchResults, setResearchResults] = useState<ResearchResults | null>(null);
  const [ikigaiData, setIkigaiData] = useState(null);

  useEffect(() => {
    loadIkigaiData();
  }, [user]);

  const loadIkigaiData = async () => {
    if (!user) {
      console.log('No user found, cannot load Ikigai data');
      return;
    }

    try {
      console.log('Loading Ikigai data for user:', user.id);
      const { data, error } = await supabase
        .from('ikigai_progress')
        .select('ikigai_data')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading Ikigai data:', error);
        throw error;
      }

      console.log('Loaded Ikigai data:', data);

      if (data?.ikigai_data) {
        // Check if we have at least some data in the ikigai_data
        const ikigaiValues = data.ikigai_data;
        const hasAnyData = Object.values(ikigaiValues).some((arr: any) => 
          Array.isArray(arr) && arr.length > 0
        );

        if (hasAnyData) {
          setIkigaiData(data.ikigai_data);
        } else {
          console.log('Ikigai data exists but is empty');
          toast({
            title: "Incomplete Ikigai Data",
            description: "Please complete more sections of your Ikigai discovery first.",
            variant: "destructive",
          });
          navigate('/ikigai');
        }
      } else {
        console.log('No Ikigai data found');
        toast({
          title: "No Ikigai Data Found",
          description: "Please complete your Ikigai discovery first.",
          variant: "destructive",
        });
        navigate('/ikigai');
      }
    } catch (error) {
      console.error('Error loading Ikigai data:', error);
      toast({
        title: "Error",
        description: "Failed to load your Ikigai data.",
        variant: "destructive",
      });
    }
  };

  const startResearch = async () => {
    if (!ikigaiData) {
      toast({
        title: "No Data Available",
        description: "Please complete your Ikigai discovery first.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      console.log('Starting industry research with ikigai data:', ikigaiData);

      const { data, error } = await supabase.functions.invoke('industry-research', {
        body: { ikigaiData }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      console.log('Research results received:', data);
      setResearchResults(data.research);

      toast({
        title: "Research Complete!",
        description: "Your personalized industry analysis is ready.",
      });
    } catch (error) {
      console.error('Error conducting research:', error);
      toast({
        title: "Research Failed",
        description: "Unable to complete the industry research. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderTextResults = (content: string) => (
    <Card>
      <CardHeader>
        <CardTitle>Industry Research Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="whitespace-pre-wrap text-sm leading-relaxed">
          {content}
        </div>
      </CardContent>
    </Card>
  );

  const renderStructuredResults = (results: ResearchResults) => (
    <div className="space-y-6">
      {results.industries?.map((industry, index) => (
        <Card key={index}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {industry.name}
                  <Badge variant="secondary">{industry.alignment_score}% match</Badge>
                </CardTitle>
                <CardDescription>{industry.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {industry.ai_roles && industry.ai_roles.length > 0 && (
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  AI Roles
                </h4>
                <div className="grid gap-3">
                  {industry.ai_roles.map((role, roleIndex) => (
                    <div key={roleIndex} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-medium">{role.title}</h5>
                        <div className="flex items-center gap-1 text-sm text-green-600">
                          <DollarSign className="w-3 h-3" />
                          {role.salary_range}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{role.description}</p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {role.required_skills?.map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-blue-600">
                        <TrendingUp className="w-3 h-3" />
                        Growth: {role.growth_outlook}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {industry.market_trends && industry.market_trends.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Market Trends</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {industry.market_trends.map((trend, trendIndex) => (
                    <li key={trendIndex} className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {trend}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {industry.target_companies && industry.target_companies.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Target Companies</h4>
                <div className="flex flex-wrap gap-2">
                  {industry.target_companies.map((company, companyIndex) => (
                    <Badge key={companyIndex} variant="outline">
                      {company}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {results.next_steps && results.next_steps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Next Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {results.next_steps.map((step, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary font-medium">{index + 1}.</span>
                  {step}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {results.skill_gaps && results.skill_gaps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Skills to Develop</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {results.skill_gaps.map((skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Industry Research</h1>
          <p className="text-gray-600">
            Discover industries and AI roles that align with your Ikigai insights
          </p>
        </div>

        {!researchResults ? (
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Industry Analysis</CardTitle>
              <CardDescription>
                Get personalized industry recommendations based on your Ikigai discovery. 
                Our AI will analyze your passions, skills, mission, and vocation to identify 
                the best career opportunities in the AI space.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={startResearch} 
                disabled={loading || !ikigaiData}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing Your Profile...
                  </>
                ) : (
                  'Start Industry Research'
                )}
              </Button>
              {!ikigaiData && (
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Complete your Ikigai discovery first to enable research
                </p>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Your Personalized Results</h2>
              <Button variant="outline" onClick={startResearch} disabled={loading}>
                {loading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  'Refresh Analysis'
                )}
              </Button>
            </div>
            
            {researchResults.type === 'text' && researchResults.content 
              ? renderTextResults(researchResults.content)
              : renderStructuredResults(researchResults)
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default IndustryResearch;
