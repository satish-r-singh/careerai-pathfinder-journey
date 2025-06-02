
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, FileText, Linkedin } from 'lucide-react';
import OnboardingStep from '@/components/OnboardingStep';
import { OnboardingData } from '@/types/onboarding';
import { useToast } from '@/hooks/use-toast';

interface DocumentUploadStepProps {
  data: OnboardingData;
  setData: (data: OnboardingData) => void;
  onNext: () => void;
  onPrevious: () => void;
  loading: boolean;
}

const DocumentUploadStep = ({ data, setData, onNext, onPrevious, loading }: DocumentUploadStepProps) => {
  const { toast } = useToast();

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

  return (
    <OnboardingStep
      stepNumber={5}
      totalSteps={5}
      title="Upload Your Documents"
      description="Help us personalize your experience (optional)"
      onNext={onNext}
      onPrevious={onPrevious}
      isValid={true}
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
};

export default DocumentUploadStep;
