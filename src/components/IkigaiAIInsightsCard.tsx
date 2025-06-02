
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, RefreshCw } from 'lucide-react';
import InsightsSummary from './InsightsSummary';
import InsightsRecommendations from './InsightsRecommendations';

interface Insights {
  summary: string;
  sentiment: string;
  keyThemes: string[];
  recommendations: string[];
}

interface IkigaiAIInsightsCardProps {
  insights: Insights | null;
  loading: boolean;
  onRegenerate: () => void;
}

const IkigaiAIInsightsCard = ({ insights, loading, onRegenerate }: IkigaiAIInsightsCardProps) => {
  return (
    <Card className="premium-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="gradient-text flex items-center">
            <Brain className="w-5 h-5 mr-2" />
            AI-Powered Insights
          </CardTitle>
          {insights && !loading && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRegenerate}
              disabled={loading}
              className="ml-2"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Regenerate
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Generating your personalized insights...</p>
          </div>
        ) : insights ? (
          <div className="space-y-6">
            <InsightsSummary insights={insights} />
            <InsightsRecommendations insights={insights} />
          </div>
        ) : (
          <div className="text-center py-8">
            <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              Complete your Ikigai discovery to get AI-powered insights and recommendations.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IkigaiAIInsightsCard;
