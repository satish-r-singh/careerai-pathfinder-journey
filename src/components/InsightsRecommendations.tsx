
interface Insights {
  summary: string;
  sentiment: string;
  keyThemes: string[];
  recommendations: string[];
}

interface InsightsRecommendationsProps {
  insights: Insights;
}

const InsightsRecommendations = ({ insights }: InsightsRecommendationsProps) => {
  return (
    <div>
      <h4 className="font-semibold text-gray-800 mb-2">AI Recommendations</h4>
      <div className="space-y-2">
        {insights.recommendations.map((rec, index) => (
          <div key={index} className="p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100">
            <p className="text-gray-700 text-sm">{rec}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsightsRecommendations;
