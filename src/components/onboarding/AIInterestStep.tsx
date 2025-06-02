
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import OnboardingStep from '@/components/OnboardingStep';
import { OnboardingData } from '@/types/onboarding';

interface AIInterestStepProps {
  data: OnboardingData;
  setData: (data: OnboardingData) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const AIInterestStep = ({ data, setData, onNext, onPrevious }: AIInterestStepProps) => {
  const isValid = Boolean(data.background && data.aiInterest);

  return (
    <OnboardingStep
      stepNumber={3}
      totalSteps={5}
      title="AI Interest & Background"
      description="Tell us about your AI journey so far"
      onNext={onNext}
      onPrevious={onPrevious}
      isValid={isValid}
    >
      <div className="space-y-4">
        <div>
          <Label>Educational/Professional Background *</Label>
          <RadioGroup
            value={data.background}
            onValueChange={(value) => setData({ ...data, background: value })}
            className="mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="technical" id="tech" />
              <Label htmlFor="tech">Technical (Engineering, CS, Math, etc.)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="business" id="biz" />
              <Label htmlFor="biz">Business (MBA, Management, Finance, etc.)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="creative" id="creative" />
              <Label htmlFor="creative">Creative (Design, Marketing, Arts, etc.)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="other" id="other" />
              <Label htmlFor="other">Other</Label>
            </div>
          </RadioGroup>
        </div>
        <div>
          <Label htmlFor="aiInterest">What specifically interests you about AI? *</Label>
          <Textarea
            id="aiInterest"
            value={data.aiInterest}
            onChange={(e) => setData({ ...data, aiInterest: e.target.value })}
            placeholder="e.g., Machine Learning, Natural Language Processing, Computer Vision, AI Product Management..."
            className="mt-1"
            rows={3}
          />
        </div>
      </div>
    </OnboardingStep>
  );
};

export default AIInterestStep;
