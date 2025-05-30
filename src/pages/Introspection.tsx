
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart, Globe, Star, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import IkigaiDiscovery from '@/components/IkigaiDiscovery';

const Introspection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            ← Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Introspection Phase</h1>
          <p className="text-gray-600">
            Discover your purpose and align your career path through guided self-reflection
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>About Ikigai Discovery</CardTitle>
              <CardDescription>
                Ikigai (生き甲斐) is a Japanese concept meaning "a reason for being." 
                It represents the intersection of what you love, what you're good at, 
                what the world needs, and what you can be paid for.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <h4 className="font-medium">What You Love</h4>
                  <p className="text-sm text-gray-600">Your passions & interests</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Globe className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <h4 className="font-medium">What the World Needs</h4>
                  <p className="text-sm text-gray-600">Your mission & purpose</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Star className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <h4 className="font-medium">What You're Good At</h4>
                  <p className="text-sm text-gray-600">Your skills & talents</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <DollarSign className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <h4 className="font-medium">What You Can Be Paid For</h4>
                  <p className="text-sm text-gray-600">Market opportunities</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  This guided discovery will help you find clarity on your career direction 
                  and identify opportunities in the AI space that align with your true purpose.
                </p>
              </div>
            </CardContent>
          </Card>

          <IkigaiDiscovery />
        </div>
      </div>
    </div>
  );
};

export default Introspection;
