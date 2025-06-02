import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Loader2, TrendingUp, Briefcase, DollarSign } from 'lucide-react';
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
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [researchResults, setResearchResults] = useState<ResearchResults | null>(null);
  const [ikigaiData, setIkigaiData] = useState(null);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) {
      console.log('No user found, cannot load data');
      setInitialLoading(false);
      return;
    }

    try {
      // Load existing research results first
      await loadExistingResearch();
      
      // Then load Ikigai data
      await loadIkigaiData();
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

  const loadExistingResearch = async () => {
    try {
      console.log('Loading existing research for user:', user?.id);
      const { data, error } = await supabase
        .from('industry_research')
        .select('research_data, created_at')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading existing research:', error);
        return;
      }

      if (data?.research_data) {
        console.log('Found existing research results');
        // Safely cast the data with type checking
        const researchData = data.research_data as unknown as ResearchResults;
        setResearchResults(researchData);
      }
    } catch (error) {
      console.error('Error loading existing research:', error);
    }
  };

  const loadIkigaiData = async () => {
    try {
      console.log('Loading Ikigai data for user:', user?.id);
      const { data, error } = await supabase
        .from('ikigai_progress')
        .select('ikigai_data')
        .eq('user_id', user?.id)
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
    if (!ikigaiData || !user) {
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
        body: { 
          ikigaiData,
          userId: user.id 
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      console.log('Research results received:', data);
      setResearchResults(data.research);

      toast({
        title: "Research Complete!",
        description: "Your personalized industry analysis is ready and saved.",
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
    <Card className="premium-card animate-fade-in relative overflow-hidden">
      {/* Background pattern overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-blue-50/50" />
      
      <CardHeader className="relative z-10">
        <CardTitle className="gradient-text text-2xl">Industry Research Results</CardTitle>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="whitespace-pre-wrap text-sm leading-relaxed">
          {content}
        </div>
      </CardContent>
    </Card>
  );

  const renderStructuredResults = (results: ResearchResults) => (
    <div className="space-y-8">
      {results.industries?.map((industry, index) => (
        <Card key={index} className="premium-card animate-fade-in relative overflow-hidden group" 
              style={{ animationDelay: `${index * 0.1}s` }}>
          {/* Animated gradient border */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300" />
          
          {/* Background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 rounded-xl" />
          
          <CardHeader className="relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-3 text-2xl gradient-text">
                  {industry.name}
                  <Badge variant="secondary" className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 border-purple-200">
                    {industry.alignment_score}% match
                  </Badge>
                </CardTitle>
                <CardDescription className="text-lg mt-2">{industry.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 relative z-10">
            {industry.ai_roles && industry.ai_roles.length > 0 && (
              <div>
                <h4 className="font-semibold mb-4 flex items-center gap-2 text-lg gradient-text">
                  <Briefcase className="w-5 h-5 text-primary" />
                  AI Roles
                </h4>
                <div className="grid gap-4">
                  {industry.ai_roles.map((role, roleIndex) => (
                    <div key={roleIndex} className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/80 transition-all duration-300 hover:shadow-lg">
                      <div className="flex justify-between items-start mb-3">
                        <h5 className="font-semibold text-lg text-gray-800">{role.title}</h5>
                        <div className="flex items-center gap-1 text-sm font-medium text-green-700 bg-green-50 px-3 py-1 rounded-full">
                          <DollarSign className="w-3 h-3" />
                          {role.salary_range}
                        </div>
                      </div>
                      <p className="text-gray-600 mb-3 leading-relaxed">{role.description}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {role.required_skills?.map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 transition-colors">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-blue-700 bg-blue-50 px-3 py-1 rounded-full inline-flex">
                        <TrendingUp className="w-3 h-3" />
                        Growth: {role.growth_outlook}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {industry.market_trends && industry.market_trends.length > 0 && (
              <div className="p-4 bg-white/40 backdrop-blur-sm rounded-xl border border-white/20">
                <h4 className="font-semibold mb-3 text-lg gradient-text">Market Trends</h4>
                <ul className="text-gray-700 space-y-2">
                  {industry.market_trends.map((trend, trendIndex) => (
                    <li key={trendIndex} className="flex items-start gap-3">
                      <span className="text-primary text-lg">•</span>
                      <span className="leading-relaxed">{trend}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {industry.target_companies && industry.target_companies.length > 0 && (
              <div className="p-4 bg-white/40 backdrop-blur-sm rounded-xl border border-white/20">
                <h4 className="font-semibold mb-3 text-lg gradient-text">Target Companies</h4>
                <div className="flex flex-wrap gap-2">
                  {industry.target_companies.map((company, companyIndex) => (
                    <Badge key={companyIndex} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 transition-colors px-3 py-1">
                      {company}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {results.skill_gaps && results.skill_gaps.length > 0 && (
        <Card className="premium-card animate-fade-in relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-red-50/50" />
          
          <CardHeader className="relative z-10">
            <CardTitle className="gradient-text text-2xl">Skills to Develop</CardTitle>
            <CardDescription className="text-lg">Focus on these areas to strengthen your profile</CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="flex flex-wrap gap-3">
              {results.skill_gaps.map((skill, index) => (
                <Badge key={index} variant="secondary" className="bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border-orange-200 px-4 py-2 text-sm">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const handleBackNavigation = () => {
    // Go back to Introspection page where the Industry Research button is
    navigate('/introspection');
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="text-center relative z-10">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-6 text-primary" />
          <p className="text-xl text-white font-medium">Loading your research data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Enhanced Header Section */}
        <div className="mb-12 relative overflow-hidden rounded-3xl">
          {/* Background image with overlay */}
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
               style={{ backgroundImage: `url('https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1920&q=80')` }} />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 via-blue-900/70 to-purple-900/80 backdrop-blur-sm" />
          
          {/* Content */}
          <div className="relative z-10 py-16 px-8">
            <Button 
              variant="outline" 
              onClick={handleBackNavigation}
              className="mb-6 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Introspection
            </Button>
            
            <h1 className="text-5xl font-bold text-white mb-4 animate-fade-in drop-shadow-lg">
              Industry Research
            </h1>
            <p className="text-xl text-white/90 max-w-3xl animate-slide-up drop-shadow-md">
              Discover industries and AI roles that align with your Ikigai insights
            </p>
          </div>
        </div>

        {!researchResults ? (
          <Card className="premium-card animate-scale-in relative overflow-hidden">
            {/* Background image with overlay */}
            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10" 
                 style={{ backgroundImage: `url('https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1920&q=80')` }} />
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-blue-50/50" />
            
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center space-x-3 text-3xl gradient-text">
                <TrendingUp className="w-8 h-8 text-primary" />
                <span>AI-Powered Industry Analysis</span>
              </CardTitle>
              <CardDescription className="text-lg leading-relaxed">
                Get personalized industry recommendations based on your Ikigai discovery. 
                Our AI will analyze your passions, skills, mission, and vocation to identify 
                the best career opportunities in the AI space.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <Button 
                onClick={startResearch} 
                disabled={loading || !ikigaiData}
                className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300 transform hover:scale-[1.02]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                    Analyzing Your Profile...
                  </>
                ) : (
                  'Start Industry Research'
                )}
              </Button>
              {!ikigaiData && (
                <p className="text-sm text-gray-500 mt-4 text-center bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  Complete your Ikigai discovery first to enable research
                </p>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            <div className="flex justify-between items-center p-6 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30">
              <h2 className="text-2xl font-bold gradient-text">Your Personalized Results</h2>
              <Button variant="outline" onClick={startResearch} disabled={loading}
                      className="bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30 transition-all duration-300">
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
