
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ExplorationCompletion = () => {
  const navigate = useNavigate();

  return (
    <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
      <CardContent className="p-6">
        <div className="text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-green-800 mb-2">
            Exploration Phase Complete! 🎉
          </h3>
          <p className="text-green-700 mb-4">
            You've successfully completed the Exploration phase. You're now ready to move on to the Reflection phase where you'll validate your skills through feedback and mentorship.
          </p>
          <Button onClick={() => navigate('/dashboard')} className="bg-green-600 hover:bg-green-700">
            Return to Dashboard
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExplorationCompletion;
