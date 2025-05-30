import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart, Globe, Star, DollarSign, CheckCircle, Target, Search, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import IkigaiChart from '@/components/IkigaiChart';

const Introspection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ikigaiCompleted, setIkigaiCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkIkigaiStatus();
  }, [user]);

  const checkIkigaiStatus = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      console.log('Checking Ikigai status for user:', user.id);
      
      const { data, error } = await supabase
        .from('ikigai_progress')
        .select('is_completed')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error checking Ikigai status:', error);
        setLoading(false);
        return;
      }

      console.log('Ikigai progress data:', data);
      const isCompleted = data?.is_completed || false;
      console.log('Setting ikigaiCompleted to:', isCompleted);
      setIkigaiCompleted(isCompleted);
    } catch (error) {
      console.error('Error loading Ikigai status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  console.log('Rendering Introspection page. ikigaiCompleted:', ikigaiCompleted);

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
          {!ikigaiCompleted ? (
            // Show Ikigai Discovery if not completed
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
                <IkigaiChart />
                
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
                  <p className="text-gray-600 mb-6">
                    This guided discovery will help you find clarity on your career direction 
                    and identify opportunities in the AI space that align with your true purpose.
                  </p>
                  <Button 
                    onClick={() => navigate('/ikigai')}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Start Ikigai Discovery
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            // Show next steps if Ikigai is completed
            <div className="space-y-6">
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <h3 className="text-lg font-semibold text-green-800">Ikigai Discovery Completed!</h3>
                  </div>
                  <p className="text-green-700">
                    Great job! You've completed your Ikigai discovery. Now let's move on to the next steps 
                    in your introspection journey.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Next Steps in Your Introspection Journey</CardTitle>
                  <CardDescription>
                    Continue building your foundation with these essential activities
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-3 mb-4">
                        <Search className="w-8 h-8 text-blue-500" />
                        <h3 className="text-lg font-semibold">Target Role Research</h3>
                      </div>
                      <p className="text-gray-600 mb-4">
                        Research specific AI roles that align with your Ikigai discovery. 
                        Understand job requirements, salary ranges, and career paths.
                      </p>
                      <Button className="w-full">
                        Start Role Research
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>

                    <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-3 mb-4">
                        <Target className="w-8 h-8 text-purple-500" />
                        <h3 className="text-lg font-semibold">Define Career Goals</h3>
                      </div>
                      <p className="text-gray-600 mb-4">
                        Set specific, measurable career goals based on your Ikigai insights. 
                        Create a roadmap for your AI career transition.
                      </p>
                      <Button className="w-full">
                        Set Career Goals
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>

                    <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-3 mb-4">
                        <FileText className="w-8 h-8 text-green-500" />
                        <h3 className="text-lg font-semibold">Industry Analysis</h3>
                      </div>
                      <p className="text-gray-600 mb-4">
                        Deep dive into the AI industry landscape. Understand market trends, 
                        key players, and emerging opportunities.
                      </p>
                      <Button className="w-full">
                        Analyze Industry
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>

                    <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-3 mb-4">
                        <CheckCircle className="w-8 h-8 text-orange-500" />
                        <h3 className="text-lg font-semibold">Review Your Results</h3>
                      </div>
                      <p className="text-gray-600 mb-4">
                        Revisit your Ikigai discovery results and refine your understanding 
                        of your career direction.
                      </p>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => navigate('/ikigai')}
                      >
                        View Ikigai Results
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Introspection;
