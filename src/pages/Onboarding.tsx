
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardingStep from '@/components/OnboardingStep';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, FileText, Linkedin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface OnboardingData {
  fullName: string;
  email: string;
  currentRole: string;
  experience: string;
  background: string;
  aiInterest: string;
  goals: string[];
  timeline: string;
  resumeFile: File | null;
  linkedinUrl: string;
}

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    fullName: '',
    email: '',
    currentRole: '',
    experience: '',
    background: '',
    aiInterest: '',
    goals: [],
    timeline: '',
    resumeFile: null,
    linkedinUrl: ''
  });
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: data.fullName,
          email: data.email || user.email,
          user_role: data.currentRole,
          experience: data.experience,
          background: data.background,
          ai_interest: data.aiInterest,
          goals: data.goals,
          timeline: data.timeline,
          linkedin_url: data.linkedinUrl,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Welcome to CareerAI!",
        description: "Your personalized AI career journey begins now.",
      });
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error saving onboarding data:', error);
      toast({
        title: "Error saving profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setData({ ...data, resumeFile: file });
      toast({
        title: "Resume uploaded",
        description: `${file.name} has been uploaded successfully.`,
      });
    }
  };

  const isStepValid = (): boolean => {
    switch (currentStep) {
      case 1:
        return Boolean(data.fullName && data.email);
      case 2:
        return Boolean(data.currentRole && data.experience);
      case 3:
        return Boolean(data.background && data.aiInterest);
      case 4:
        return Boolean(data.goals.length > 0 && data.timeline);
      case 5:
        return true; // File upload is optional
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <OnboardingStep
            stepNumber={1}
            totalSteps={5}
            title="Let's Get Started"
            description="Tell us a bit about yourself"
            onNext={handleNext}
            isValid={isStepValid()}
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

      case 2:
        return (
          <OnboardingStep
            stepNumber={2}
            totalSteps={5}
            title="Your Professional Background"
            description="Help us understand your current situation"
            onNext={handleNext}
            onPrevious={handlePrevious}
            isValid={isStepValid()}
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

      case 3:
        return (
          <OnboardingStep
            stepNumber={3}
            totalSteps={5}
            title="AI Interest & Background"
            description="Tell us about your AI journey so far"
            onNext={handleNext}
            onPrevious={handlePrevious}
            isValid={isStepValid()}
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

      case 4:
        return (
          <OnboardingStep
            stepNumber={4}
            totalSteps={5}
            title="Your Goals & Timeline"
            description="What do you want to achieve?"
            onNext={handleNext}
            onPrevious={handlePrevious}
            isValid={isStepValid()}
          >
            <div className="space-y-4">
              <div>
                <Label>What are your main goals? (Select all that apply) *</Label>
                <div className="mt-2 space-y-2">
                  {[
                    'Land an AI/ML role at a tech company',
                    'Transition my current role to include AI',
                    'Start an AI-focused startup',
                    'Build AI expertise in my current industry',
                    'Learn AI for personal projects',
                    'Other'
                  ].map((goal) => (
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

      case 5:
        return (
          <OnboardingStep
            stepNumber={5}
            totalSteps={5}
            title="Upload Your Documents"
            description="Help us personalize your experience (optional)"
            onNext={handleNext}
            onPrevious={handlePrevious}
            isValid={isStepValid()}
            nextLabel={loading ? "Completing..." : "Complete Setup"}
          >
            <div className="space-y-6">
              <Card className="border-dashed border-2 border-gray-300 hover:border-primary transition-colors">
                <CardContent className="p-6">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Upload Resume/CV</h3>
                      <p className="text-sm text-gray-500">
                        PDF, DOC, or DOCX up to 10MB
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById('resume-upload')?.click()}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Choose File
                      </Button>
                      <input
                        id="resume-upload"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      {data.resumeFile && (
                        <p className="text-sm text-green-600 mt-2">
                          ✓ {data.resumeFile.name} uploaded
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div>
                <Label htmlFor="linkedinUrl">LinkedIn Profile (optional)</Label>
                <div className="mt-1 relative">
                  <Linkedin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="linkedinUrl"
                    value={data.linkedinUrl}
                    onChange={(e) => setData({ ...data, linkedinUrl: e.target.value })}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </OnboardingStep>
        );

      default:
        return null;
    }
  };

  return renderStep();
};

export default Onboarding;
