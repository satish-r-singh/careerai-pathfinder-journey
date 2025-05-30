
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const IkigaiCompletionBanner = () => {
  return (
    <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 shadow-xl">
      <CardContent className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-green-800">Ikigai Discovery Completed!</h3>
        </div>
        <p className="text-green-700">
          Excellent! You've completed your Ikigai discovery. Review your results and AI insights below.
        </p>
      </CardContent>
    </Card>
  );
};

export default IkigaiCompletionBanner;
