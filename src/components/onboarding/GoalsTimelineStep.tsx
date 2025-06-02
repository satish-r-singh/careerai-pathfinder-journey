
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import OnboardingStep from '@/components/OnboardingStep';
import { OnboardingData } from '@/types/onboarding';

interface GoalsTimelineStepProps {
  data: OnboardingData;
  setData: (data: OnboardingData) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const GoalsTimelineStep = ({ data, setData, onNext, onPrevious }: GoalsTimelineStepProps) => {
  const isValid = Boolean(data.goals.length > 0 && data.timeline);

  const goalOptions = [
    'Land an AI/ML role at a tech company',
    'Transition my current role to include AI',
    'Start an AI-focused startup',
    'Build AI expertise in my current industry',
    'Learn AI for personal projects',
    'Other'
  ];

  return (
    <OnboardingStep
      stepNumber={4}
      totalSteps={5}
      title="Your Goals & Timeline"
      description="What do you want to achieve?"
      onNext={onNext}
      onPrevious={onPrevious}
      isValid={isValid}
    >
      <div className="space-y-4">
        <div>
          <Label>What are your main goals? (Select all that apply) *</Label>
          <div className="mt-2 space-y-2">
            {goalOptions.map((goal) => (
              <div key={goal} className="flex items-center space-x-2">
                <Checkbox
                  id={goal}
                  checked={data.goals.includes(goal)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setData({ ...data, goals: [...data.goals, goal] });
                    } else {
                      setData({ ...data, goals: data.goals.filter(g => g !== goal) });
                    }
                  }}
                />
                <Label htmlFor={goal}>{goal}</Label>
              </div>
            ))}
          </div>
        </div>
        <div>
          <Label>What's your target timeline? *</Label>
          <RadioGroup
            value={data.timeline}
            onValueChange={(value) => setData({ ...data, timeline: value })}
            className="mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="3-months" id="t1" />
              <Label htmlFor="t1">Within 3 months</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="6-months" id="t2" />
              <Label htmlFor="t2">3-6 months</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="12-months" id="t3" />
              <Label htmlFor="t3">6-12 months</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="flexible" id="t4" />
              <Label htmlFor="t4">I'm flexible</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </OnboardingStep>
  );
};

export default GoalsTimelineStep;
