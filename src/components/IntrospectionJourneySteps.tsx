
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText, Sparkles, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PersonalizedOutreachCard from './PersonalizedOutreachCard';

interface IntrospectionJourneyStepsProps {
  industryResearchCompleted: boolean;
  ikigaiData: {
    passion: string[];
    mission: string[];
    profession: string[];
    vocation: string[];
  };
}

const IntrospectionJourneySteps = ({ industryResearchCompleted, ikigaiData }: IntrospectionJourneyStepsProps) => {
  const navigate = useNavigate();

  return (
    <Card className="premium-card">
      <CardHeader>
        <CardTitle className="gradient-text">Continue Your Journey</CardTitle>
        <CardDescription>
          Complete these essential activities to finish your introspection phase
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Industry Analysis Card */}
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

          {/* AI Career Integration Card */}
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
              onClick={() => navigate('/ai-career-integration')}
            >
              {industryResearchCompleted ? 'Start Integration' : 'Locked'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Personalised Outreach Card - now spans full width */}
          <div className="md:col-span-2">
            <PersonalizedOutreachCard ikigaiData={ikigaiData} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IntrospectionJourneySteps;
