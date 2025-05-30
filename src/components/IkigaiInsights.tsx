
import IkigaiVisualizationCard from './IkigaiVisualizationCard';
import IkigaiAIInsightsCard from './IkigaiAIInsightsCard';
import { useIkigaiInsights } from '@/hooks/useIkigaiInsights';

interface IkigaiData {
  passion: string[];
  mission: string[];
  profession: string[];
  vocation: string[];
}

interface IkigaiInsightsProps {
  ikigaiData: IkigaiData;
}

const IkigaiInsights = ({ ikigaiData }: IkigaiInsightsProps) => {
  const { insights, loading } = useIkigaiInsights(ikigaiData);

  return (
    <div className="space-y-6">
      <IkigaiVisualizationCard />
      <IkigaiAIInsightsCard insights={insights} loading={loading} />
    </div>
  );
};

export default IkigaiInsights;
