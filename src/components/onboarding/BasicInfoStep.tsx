
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
  const isValid = Boolean(data.fullName && data.email);

  return (
    <OnboardingStep
      stepNumber={1}
      totalSteps={5}
      title="Let's Get Started"
      description="Tell us a bit about yourself"
      onNext={onNext}
      isValid={isValid}
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            value={data.fullName}
            onChange={(e) => setData({ ...data, fullName: e.target.value })}
            placeholder="Enter your full name"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            placeholder="Enter your email address"
            className="mt-1"
          />
        </div>
      </div>
    </OnboardingStep>
  );
};

export default BasicInfoStep;
