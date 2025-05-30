
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Globe, Star, DollarSign } from 'lucide-react';

interface IkigaiData {
  passion: string[];
  mission: string[];
  profession: string[];
  vocation: string[];
}

interface IkigaiAnswersDisplayProps {
  ikigaiData: IkigaiData;
}

const IkigaiAnswersDisplay = ({ ikigaiData }: IkigaiAnswersDisplayProps) => {
  const categories = [
    {
      key: 'passion' as keyof IkigaiData,
      title: 'What You Love',
      description: 'Your passions & interests',
      icon: Heart,
      color: 'from-red-50 to-pink-50 border-red-100',
      iconColor: 'text-red-500',
      badgeColor: 'bg-red-100 text-red-800'
    },
    {
      key: 'mission' as keyof IkigaiData,
      title: 'What the World Needs',
      description: 'Your mission & purpose',
      icon: Globe,
      color: 'from-green-50 to-emerald-50 border-green-100',
      iconColor: 'text-green-500',
      badgeColor: 'bg-green-100 text-green-800'
    },
    {
      key: 'profession' as keyof IkigaiData,
      title: 'What You\'re Good At',
      description: 'Your skills & talents',
      icon: Star,
      color: 'from-blue-50 to-cyan-50 border-blue-100',
      iconColor: 'text-blue-500',
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    {
      key: 'vocation' as keyof IkigaiData,
      title: 'What You Can Be Paid For',
      description: 'Market opportunities',
      icon: DollarSign,
      color: 'from-purple-50 to-violet-50 border-purple-100',
      iconColor: 'text-purple-500',
      badgeColor: 'bg-purple-100 text-purple-800'
    }
  ];

  return (
    <Card className="premium-card">
      <CardHeader>
        <CardTitle className="gradient-text">Your Ikigai Discovery Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            const answers = ikigaiData[category.key] || [];
            
            return (
              <div
                key={category.key}
                className={`p-4 bg-gradient-to-br ${category.color} rounded-xl border`}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <Icon className={`w-6 h-6 ${category.iconColor}`} />
                  <div>
                    <h4 className="font-medium text-gray-800">{category.title}</h4>
                    <p className="text-xs text-gray-600">{category.description}</p>
                  </div>
                  <Badge className={`ml-auto ${category.badgeColor} text-xs`}>
                    {answers.length}
                  </Badge>
                </div>
                
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {answers.length > 0 ? (
                    answers.map((answer, index) => (
                      <div
                        key={index}
                        className="text-sm p-2 bg-white/60 rounded border text-gray-700 leading-relaxed"
                      >
                        {answer}
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-400 italic">No responses yet</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default IkigaiAnswersDisplay;
