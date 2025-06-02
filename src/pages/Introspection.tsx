
import { Card, CardContent } from '@/components/ui/card';
import IntrospectionProgressBar from '@/components/IntrospectionProgressBar';
import IkigaiAnswersDisplay from '@/components/IkigaiAnswersDisplay';
import IkigaiInsights from '@/components/IkigaiInsights';
import IntrospectionHeader from '@/components/IntrospectionHeader';
import IkigaiDiscoveryIntro from '@/components/IkigaiDiscoveryIntro';
import IkigaiCompletionBanner from '@/components/IkigaiCompletionBanner';
import IntrospectionJourneySteps from '@/components/IntrospectionJourneySteps';
import { useIntrospectionStatus } from '@/hooks/useIntrospectionStatus';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const Introspection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const {
    ikigaiCompleted,
    industryResearchCompleted,
    careerRoadmapCompleted,
    ikigaiData,
    loading,
    checkCompletionStatus
  } = useIntrospectionStatus();

  const handleRetakeAssessment = async () => {
    if (!user) return;
    
    try {
      // Reset the ikigai progress
      const { error: ikigaiError } = await supabase
        .from('ikigai_progress')
        .update({
          is_completed: false,
          current_step: 0,
          ikigai_data: {
            passion: [],
            mission: [],
            profession: [],
            vocation: []
          },
          ai_insights: null
        })
        .eq('user_id', user.id);

      if (ikigaiError) throw ikigaiError;

      // Reset industry research (since it's based on Ikigai data)
      const { error: industryError } = await supabase
        .from('industry_research')
        .delete()
        .eq('user_id', user.id);

      if (industryError) throw industryError;

      // Reset career roadmaps (since they're based on Ikigai and industry research)
      const { error: roadmapError } = await supabase
        .from('career_roadmaps')
        .delete()
        .eq('user_id', user.id);

      if (roadmapError) throw roadmapError;

      // Reset outreach templates (since they're personalized based on Ikigai)
      const { error: templatesError } = await supabase
        .from('outreach_templates')
        .delete()
        .eq('user_id', user.id);

      if (templatesError) throw templatesError;

      toast({
        title: "Assessment Reset Complete",
        description: "Your Ikigai assessment and all related data have been reset. You can now start over.",
      });

      // Refresh the status
      await checkCompletionStatus();
      
      // Navigate to the Ikigai page to restart
      navigate('/ikigai');
    } catch (error: any) {
      console.error('Error resetting assessment:', error);
      toast({
        title: "Error",
        description: "Failed to reset the assessment. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Loading your introspection journey...</p>
        </div>
      </div>
    );
  }

  console.log('Rendering Introspection page. ikigaiCompleted:', ikigaiCompleted, 'industryResearchCompleted:', industryResearchCompleted, 'careerRoadmapCompleted:', careerRoadmapCompleted);

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      {/* Enhanced Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-200/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-200/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <IntrospectionHeader />

        <div className="space-y-8">
          {/* Enhanced Progress Bar Card */}
          <Card className="premium-card animate-fade-in relative overflow-hidden">
            {/* Background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white via-purple-50/50 to-blue-50/50" />
            
            <CardContent className="p-8 relative z-10">
              <IntrospectionProgressBar 
                ikigaiCompleted={ikigaiCompleted}
                industryResearchCompleted={industryResearchCompleted}
                careerRoadmapCompleted={careerRoadmapCompleted}
              />
            </CardContent>
          </Card>

          {!ikigaiCompleted ? (
            <div className="animate-slide-up">
              <IkigaiDiscoveryIntro />
            </div>
          ) : (
            <div className="space-y-8">
              <div className="animate-fade-in">
                <IkigaiCompletionBanner onRetakeAssessment={handleRetakeAssessment} />
              </div>
              
              <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <IkigaiAnswersDisplay ikigaiData={ikigaiData} />
              </div>
              
              <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <IkigaiInsights ikigaiData={ikigaiData} />
              </div>
              
              <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <IntrospectionJourneySteps 
                  industryResearchCompleted={industryResearchCompleted} 
                  careerRoadmapCompleted={careerRoadmapCompleted}
                  ikigaiData={ikigaiData}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Introspection;
