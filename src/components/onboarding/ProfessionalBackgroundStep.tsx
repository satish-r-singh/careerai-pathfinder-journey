
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import OnboardingStep from '@/components/OnboardingStep';
import { OnboardingData } from '@/types/onboarding';

interface ProfessionalBackgroundStepProps {
  data: OnboardingData;
  setData: (data: OnboardingData) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const ProfessionalBackgroundStep = ({ data, setData, onNext, onPrevious }: ProfessionalBackgroundStepProps) => {
  const isValid = Boolean(data.currentRole && data.experience);

  return (
    <OnboardingStep
      stepNumber={2}
      totalSteps={5}
      title="Your Professional Background"
      description="Help us understand your current situation"
      onNext={onNext}
      onPrevious={onPrevious}
      isValid={isValid}
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="currentRole">Current Role/Status *</Label>
          <Input
            id="currentRole"
            value={data.currentRole}
            onChange={(e) => setData({ ...data, currentRole: e.target.value })}
            placeholder="e.g., Software Engineer, Student, Marketing Manager"
            className="mt-1"
          />
        </div>
        <div>
          <Label>Years of Professional Experience *</Label>
          <RadioGroup
            value={data.experience}
            onValueChange={(value) => setData({ ...data, experience: value })}
            className="mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="0-1" id="exp1" />
              <Label htmlFor="exp1">0-1 years (Student/Entry level)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2-5" id="exp2" />
              <Label htmlFor="exp2">2-5 years</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="6-10" id="exp3" />
              <Label htmlFor="exp3">6-10 years</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="10+" id="exp4" />
              <Label htmlFor="exp4">10+ years</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </OnboardingStep>
  );
};

export default ProfessionalBackgroundStep;
