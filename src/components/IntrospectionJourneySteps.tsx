
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Search, Target, FileText, Sparkles, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface IntrospectionJourneyStepsProps {
  industryResearchCompleted: boolean;
}

const IntrospectionJourneySteps = ({ industryResearchCompleted }: IntrospectionJourneyStepsProps) => {
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
  );
};

export default IntrospectionJourneySteps;
