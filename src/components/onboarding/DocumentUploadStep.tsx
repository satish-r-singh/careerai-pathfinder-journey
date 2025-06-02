
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, FileText, Linkedin, CheckCircle } from 'lucide-react';
import OnboardingStep from '@/components/OnboardingStep';
import { OnboardingData } from '@/types/onboarding';
import { useToast } from '@/hooks/use-toast';

interface DocumentUploadStepProps {
  data: OnboardingData;
  setData: (data: OnboardingData) => void;
  onNext: () => void;
  onPrevious: () => void;
  loading: boolean;
  hasExistingResume?: boolean;
}

const DocumentUploadStep = ({ 
  data, 
  setData, 
  onNext, 
  onPrevious, 
  loading, 
  hasExistingResume = false 
}: DocumentUploadStepProps) => {
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF, DOC, or DOCX file.",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 10MB.",
          variant: "destructive",
        });
        return;
      }

      setData({ ...data, resumeFile: file });
      toast({
        title: "Resume uploaded",
        description: `${file.name} has been uploaded successfully.`,
      });
    }
  };

  // Check if at least one document is provided
  const hasResume = data.resumeFile || hasExistingResume;
  const hasLinkedIn = data.linkedinUrl && data.linkedinUrl.trim() !== '';
  const isValid = hasResume || hasLinkedIn;

  return (
    <OnboardingStep
      stepNumber={5}
      totalSteps={5}
      title="Upload Your Documents"
      description="Please provide at least one: Resume/CV OR LinkedIn profile URL"
      onNext={onNext}
      onPrevious={onPrevious}
      isValid={isValid}
      nextLabel={loading ? "Completing..." : "Complete Setup"}
    >
      <div className="space-y-6">
        {!isValid && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-amber-800 text-sm">
              ⚠️ Please provide at least one: Resume/CV or LinkedIn profile URL to continue.
            </p>
          </div>
        )}

        <Card className="border-dashed border-2 border-gray-300 hover:border-primary transition-colors">
          <CardContent className="p-6">
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <div className="space-y-2">
                <h3 className="text-lg font-medium flex items-center justify-center gap-2">
                  Upload Resume/CV
                  {(data.resumeFile || hasExistingResume) && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </h3>
                <p className="text-sm text-gray-500">
                  PDF, DOC, or DOCX up to 10MB
                </p>
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('resume-upload')?.click()}
                  disabled={loading}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  {data.resumeFile ? 'Change File' : hasExistingResume ? 'Replace File' : 'Choose File'}
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
                    ✓ {data.resumeFile.name} selected
                  </p>
                )}
                {hasExistingResume && !data.resumeFile && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ Resume already uploaded
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">OR</span>
          </div>
        </div>

        <div>
          <Label htmlFor="linkedinUrl" className="flex items-center gap-2">
            LinkedIn Profile URL
            {hasLinkedIn && <CheckCircle className="h-4 w-4 text-green-500" />}
          </Label>
          <div className="mt-1 relative">
            <Linkedin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="linkedinUrl"
              value={data.linkedinUrl}
              onChange={(e) => setData({ ...data, linkedinUrl: e.target.value })}
              placeholder="https://linkedin.com/in/yourprofile"
              className="pl-10"
              disabled={loading}
            />
          </div>
          {hasLinkedIn && (
            <p className="text-sm text-green-600 mt-1">
              ✓ LinkedIn profile provided
            </p>
          )}
        </div>
      </div>
    </OnboardingStep>
  );
};

export default DocumentUploadStep;
