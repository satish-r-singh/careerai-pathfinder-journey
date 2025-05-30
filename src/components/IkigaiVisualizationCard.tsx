
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import IkigaiChart from './IkigaiChart';

const IkigaiVisualizationCard = () => {
  return (
    <Card className="premium-card">
      <CardHeader>
        <CardTitle className="gradient-text text-center">
          Your Ikigai Visualization
        </CardTitle>
      </CardHeader>
      <CardContent>
        <IkigaiChart />
        <p className="text-center text-gray-600 mt-4">
          Your purpose lies at the intersection of these four elements
        </p>
      </CardContent>
    </Card>
  );
};

export default IkigaiVisualizationCard;
