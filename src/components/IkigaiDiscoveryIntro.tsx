
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart, Globe, Star, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import IkigaiChart from './IkigaiChart';

const IkigaiDiscoveryIntro = () => {
  const navigate = useNavigate();

  return (
    <Card className="premium-card">
      <CardHeader>
        <CardTitle className="gradient-text">About Ikigai Discovery</CardTitle>
        <CardDescription>
          Ikigai (生き甲斐) is a Japanese concept meaning "a reason for being." 
          It represents the intersection of what you love, what you're good at, 
          what the world needs, and what you can be paid for.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <IkigaiChart />
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border border-red-100">
            <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <h4 className="font-medium">What You Love</h4>
            <p className="text-sm text-gray-600">Your passions & interests</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
            <Globe className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <h4 className="font-medium">What the World Needs</h4>
            <p className="text-sm text-gray-600">Your mission & purpose</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
            <Star className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <h4 className="font-medium">What You're Good At</h4>
            <p className="text-sm text-gray-600">Your skills & talents</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-100">
            <DollarSign className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <h4 className="font-medium">What You Can Be Paid For</h4>
            <p className="text-sm text-gray-600">Market opportunities</p>
          </div>
        </div>
        <div className="text-center">
          <p className="text-gray-600 mb-6">
            This guided discovery will help you find clarity on your career direction 
            and identify opportunities in the AI space that align with your true purpose.
          </p>
          <Button 
            onClick={() => navigate('/ikigai')}
            className="premium-button"
          >
            Start Ikigai Discovery
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default IkigaiDiscoveryIntro;
