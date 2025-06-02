
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ExplorationCompletion = () => {
  const navigate = useNavigate();

  return (
    <Card className="premium-card animate-scale-in relative overflow-hidden">
      {/* Celebratory background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50/90 via-emerald-50/80 to-cyan-50/60" />
      
      {/* Floating celebration elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-4 right-4 w-8 h-8 bg-yellow-200/40 rounded-full animate-pulse" />
        <div className="absolute bottom-4 left-4 w-6 h-6 bg-green-200/40 rounded-full animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-blue-200/40 rounded-full animate-pulse delay-500" />
      </div>

      <CardContent className="p-8 relative z-10">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <Sparkles className="w-6 h-6 text-yellow-500 absolute -top-2 -right-2 animate-pulse" />
            </div>
          </div>
          
          <h3 className="text-3xl font-bold gradient-text mb-4">
            Exploration Phase Complete! 🎉
          </h3>
          
          <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto leading-relaxed">
            Congratulations! You've successfully completed the Exploration phase. You're now ready to move on to the 
            <span className="font-semibold text-primary"> Reflection phase</span> where you'll validate your skills through feedback and mentorship.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={() => navigate('/dashboard')} 
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              Continue to Reflection Phase
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="border-green-200 text-green-700 hover:bg-green-50 px-6 py-3 rounded-xl transition-all duration-300"
            >
              Return to Dashboard
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExplorationCompletion;
