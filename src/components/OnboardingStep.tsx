
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface OnboardingStepProps {
  stepNumber: number;
  totalSteps: number;
  title: string;
  description: string;
  children: React.ReactNode;
  onNext?: () => void;
  onPrevious?: () => void;
  isValid?: boolean;
  nextLabel?: string;
  previousLabel?: string;
}

const OnboardingStep = ({
  stepNumber,
  totalSteps,
  title,
  description,
  children,
  onNext,
  onPrevious,
  isValid = true,
  nextLabel = "Continue",
  previousLabel = "Back"
}: OnboardingStepProps) => {
  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">
              Step {stepNumber} of {totalSteps}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round((stepNumber / totalSteps) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-500"
              style={{ width: `${(stepNumber / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        <Card className="glass-effect">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold gradient-text">
              {title}
            </CardTitle>
            <CardDescription className="text-lg">
              {description}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {children}
            
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={onPrevious}
                disabled={stepNumber === 1}
                className="flex items-center space-x-2"
              >
                <ArrowLeft size={16} />
                <span>{previousLabel}</span>
              </Button>
              
              <Button
                onClick={onNext}
                disabled={!isValid}
                className="flex items-center space-x-2 bg-primary hover:bg-primary/90"
              >
                <span>{nextLabel}</span>
                <ArrowRight size={16} />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingStep;
