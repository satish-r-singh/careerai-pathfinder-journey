
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface IkigaiData {
  passion: string[];
  mission: string[];
  profession: string[];
  vocation: string[];
}

interface IkigaiKeyThemesProps {
  ikigaiData: IkigaiData;
}

const IkigaiKeyThemes = ({ ikigaiData }: IkigaiKeyThemesProps) => {
  const findIntersections = () => {
    const allResponses = [
      ...ikigaiData.passion,
      ...ikigaiData.mission,
      ...ikigaiData.profession,
      ...ikigaiData.vocation
    ];
    
    // Simple keyword matching for intersections
    const keywords = allResponses
      .join(' ')
      .toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 3)
      .reduce((acc, word) => {
        acc[word] = (acc[word] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(keywords)
      .filter(([_, count]) => count >= 2)
      .sort(([_, a], [__, b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word);
  };

  const intersections = findIntersections();

  if (intersections.length === 0) {
    return null;
  }

  return (
    <Card className="premium-card">
      <CardHeader>
        <CardTitle className="gradient-text">Key Themes & Intersections</CardTitle>
        <CardDescription>
          These recurring themes appear across multiple categories and may point to your Ikigai
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {intersections.map((theme, index) => (
            <Badge key={index} variant="secondary" className="capitalize">
              {theme}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default IkigaiKeyThemes;
