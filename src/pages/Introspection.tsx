
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  console.log('Rendering Introspection page. ikigaiCompleted:', ikigaiCompleted, 'industryResearchCompleted:', industryResearchCompleted, 'careerRoadmapCompleted:', careerRoadmapCompleted);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-200/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-200/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <IntrospectionHeader />

        <div className="space-y-8">
          {/* Progress Bar */}
          <Card className="premium-card">
            <CardContent className="p-6">
              <IntrospectionProgressBar 
                ikigaiCompleted={ikigaiCompleted}
                industryResearchCompleted={industryResearchCompleted}
                careerRoadmapCompleted={careerRoadmapCompleted}
              />
            </CardContent>
          </Card>

          {!ikigaiCompleted ? (
            <IkigaiDiscoveryIntro />
          ) : (
            <div className="space-y-6">
              <IkigaiCompletionBanner onRetakeAssessment={handleRetakeAssessment} />
              <IkigaiAnswersDisplay ikigaiData={ikigaiData} />
              <IkigaiInsights ikigaiData={ikigaiData} />
              <IntrospectionJourneySteps 
                industryResearchCompleted={industryResearchCompleted} 
                careerRoadmapCompleted={careerRoadmapCompleted}
                ikigaiData={ikigaiData}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Introspection;
