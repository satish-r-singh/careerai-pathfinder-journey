
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import OnboardingStep from '@/components/OnboardingStep';
import { OnboardingData } from '@/types/onboarding';

interface BasicInfoStepProps {
  data: OnboardingData;
  setData: (data: OnboardingData) => void;
  onNext: () => void;
}

const BasicInfoStep = ({ data, setData, onNext }: BasicInfoStepProps) => {
  const isValid = Boolean(data.currentRole);

  return (
    <OnboardingStep
      stepNumber={1}
      totalSteps={5}
      title="Let's Get Started"
      description="Tell us about your current professional situation"
      onNext={onNext}
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
      </div>
    </OnboardingStep>
  );
};

export default BasicInfoStep;
