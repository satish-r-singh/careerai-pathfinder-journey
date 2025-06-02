
import IkigaiVisualizationCard from './IkigaiVisualizationCard';
import IkigaiAIInsightsCard from './IkigaiAIInsightsCard';
import IkigaiKeyThemes from './IkigaiKeyThemes';
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
  const { insights, loading, regenerateInsights } = useIkigaiInsights(ikigaiData);

  return (
    <div className="space-y-6">
      <IkigaiVisualizationCard />
      <IkigaiKeyThemes ikigaiData={ikigaiData} />
      <IkigaiAIInsightsCard 
        insights={insights} 
        loading={loading} 
        onRegenerate={regenerateInsights}
      />
    </div>
  );
};

export default IkigaiInsights;
