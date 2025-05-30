
import { Card, CardContent } from '@/components/ui/card';
import IntrospectionProgressBar from '@/components/IntrospectionProgressBar';
import IkigaiAnswersDisplay from '@/components/IkigaiAnswersDisplay';
import IkigaiInsights from '@/components/IkigaiInsights';
import IntrospectionHeader from '@/components/IntrospectionHeader';
import IkigaiDiscoveryIntro from '@/components/IkigaiDiscoveryIntro';
import IkigaiCompletionBanner from '@/components/IkigaiCompletionBanner';
import IntrospectionJourneySteps from '@/components/IntrospectionJourneySteps';
import { useIntrospectionStatus } from '@/hooks/useIntrospectionStatus';

const Introspection = () => {
  const {
    ikigaiCompleted,
    industryResearchCompleted,
    ikigaiData,
    loading
  } = useIntrospectionStatus();

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
        <IntrospectionHeader />

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
            <IkigaiDiscoveryIntro />
          ) : (
            <div className="space-y-6">
              <IkigaiCompletionBanner />
              <IkigaiAnswersDisplay ikigaiData={ikigaiData} />
              <IkigaiInsights ikigaiData={ikigaiData} />
              <IntrospectionJourneySteps 
                industryResearchCompleted={industryResearchCompleted} 
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
