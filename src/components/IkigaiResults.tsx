
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Heart, Globe, Star, DollarSign } from 'lucide-react';

interface IkigaiData {
  passion: string[];
  mission: string[];
  profession: string[];
  vocation: string[];
}

interface IkigaiResultsProps {
  ikigaiData: IkigaiData;
  onRestart: () => void;
}

const IkigaiResults = ({ ikigaiData, onRestart }: IkigaiResultsProps) => {
  const categories = [
    {
      key: 'passion',
      title: 'What You Love',
      icon: Heart,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      data: ikigaiData.passion
    },
    {
      key: 'mission',
      title: 'What the World Needs',
      icon: Globe,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      data: ikigaiData.mission
    },
    {
      key: 'profession',
      title: 'What You\'re Good At',
      icon: Star,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      data: ikigaiData.profession
    },
    {
      key: 'vocation',
      title: 'What You Can Be Paid For',
      icon: DollarSign,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      data: ikigaiData.vocation
    }
  ];

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

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">Your Ikigai Discovery Results</CardTitle>
              <CardDescription>
                Congratulations! You've completed your Ikigai discovery journey. 
                Here are your insights across the four key dimensions.
              </CardDescription>
            </div>
            <Button variant="outline" onClick={onRestart}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Retake Assessment
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Card key={category.key}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg ${category.bgColor}`}>
                    <Icon className={`w-5 h-5 ${category.color}`} />
                  </div>
                  <span>{category.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {category.data.length > 0 ? (
                  <div className="space-y-2">
                    {category.data.map((item, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg text-sm">
                        {item}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No responses added for this category</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {intersections.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Key Themes & Intersections</CardTitle>
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
      )}

      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
          <CardDescription>
            Use these insights to guide your career decisions and AI journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-primary/5 rounded-lg">
              <h4 className="font-medium mb-2">Industry Research</h4>
              <p className="text-sm text-gray-600">
                Research industries and roles that align with your Ikigai insights. 
                Look for opportunities where your passions, skills, and market needs intersect.
              </p>
            </div>
            <div className="p-4 bg-primary/5 rounded-lg">
              <h4 className="font-medium mb-2">AI Career Integration</h4>
              <p className="text-sm text-gray-600">
                Consider how AI and machine learning can enhance or transform your identified interests and skills. 
                Explore AI roles that match your purpose and expertise.
              </p>
            </div>
            <div className="p-4 bg-primary/5 rounded-lg">
              <h4 className="font-medium mb-2">Personalized Outreach</h4>
              <p className="text-sm text-gray-600">
                Use your Ikigai insights to craft compelling messages to recruiters and industry professionals. 
                Your authentic purpose will resonate with the right opportunities.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IkigaiResults;
