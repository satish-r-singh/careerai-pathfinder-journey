
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface IkigaiCompletionBannerProps {
  onRetakeAssessment: () => void;
}

const IkigaiCompletionBanner = ({ onRetakeAssessment }: IkigaiCompletionBannerProps) => {
  return (
    <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 shadow-xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-800">Ikigai Discovery Completed!</h3>
              <p className="text-green-700">
                Excellent! You've completed your Ikigai discovery. Review your results and AI insights below.
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={onRetakeAssessment}
            className="bg-white hover:bg-green-50 border-green-300"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retake Assessment
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default IkigaiCompletionBanner;
