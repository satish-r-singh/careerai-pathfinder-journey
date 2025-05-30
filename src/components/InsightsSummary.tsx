
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';

interface Insights {
  summary: string;
  sentiment: string;
  keyThemes: string[];
  recommendations: string[];
}

interface InsightsSummaryProps {
  insights: Insights;
}

const InsightsSummary = ({ insights }: InsightsSummaryProps) => {
  const getSentimentColor = (sentiment: string) => {
    const lowerSentiment = sentiment.toLowerCase();
    if (lowerSentiment.includes('positive') || lowerSentiment.includes('optimistic')) {
      return 'bg-green-100 text-green-800';
    } else if (lowerSentiment.includes('neutral') || lowerSentiment.includes('balanced')) {
      return 'bg-blue-100 text-blue-800';
    } else if (lowerSentiment.includes('negative') || lowerSentiment.includes('concerned')) {
      return 'bg-red-100 text-red-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div>
        <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
          <TrendingUp className="w-4 h-4 mr-2 text-blue-500" />
          Summary
        </h4>
        <p className="text-gray-700 leading-relaxed">{insights.summary}</p>
      </div>

      {/* Sentiment */}
      <div>
        <h4 className="font-semibold text-gray-800 mb-2">Sentiment Analysis</h4>
        <Badge className={getSentimentColor(insights.sentiment)}>
          {insights.sentiment}
        </Badge>
      </div>

      {/* Key Themes */}
      <div>
        <h4 className="font-semibold text-gray-800 mb-2">Key Themes</h4>
        <div className="flex flex-wrap gap-2">
          {insights.keyThemes.map((theme, index) => (
            <Badge key={index} variant="outline" className="bg-purple-50 text-purple-700">
              {theme}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InsightsSummary;
