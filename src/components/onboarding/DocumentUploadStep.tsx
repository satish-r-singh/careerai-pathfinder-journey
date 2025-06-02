
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, FileText, CheckCircle, Info } from 'lucide-react';
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
      // Validate file type - only PDF allowed
      if (file.type !== 'application/pdf') {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file only.",
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

  // Resume is now mandatory
  const hasResume = Boolean(data.resumeFile) || hasExistingResume;
  const isValid = hasResume;

  return (
    <OnboardingStep
      stepNumber={5}
      totalSteps={5}
      title="Upload Your Resume"
      description="Please upload your resume/CV in PDF format (required)"
      onNext={onNext}
      onPrevious={onPrevious}
      isValid={isValid}
      nextLabel={loading ? "Completing..." : "Complete Setup"}
    >
      <div className="space-y-6">
        {!isValid && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-amber-800 text-sm">
              ⚠️ Please upload your resume in PDF format to continue.
            </p>
          </div>
        )}

        {/* LinkedIn PDF Download Instructions */}
        <Card className="bg-blue-50 border border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-900 mb-2">
                  How to download your LinkedIn profile as PDF:
                </h4>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Click the <strong>Me</strong> icon at the top of your LinkedIn homepage</li>
                  <li>Click <strong>View profile</strong></li>
                  <li>Click the <strong>More</strong> button in the introduction section</li>
                  <li>Select <strong>Save to PDF</strong> from the dropdown</li>
                  <li>Upload the downloaded PDF file below</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-dashed border-2 border-gray-300 hover:border-primary transition-colors">
          <CardContent className="p-6">
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <div className="space-y-2">
                <h3 className="text-lg font-medium flex items-center justify-center gap-2">
                  Upload Resume/CV (PDF Required)
                  {(data.resumeFile || hasExistingResume) && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </h3>
                <p className="text-sm text-gray-500">
                  PDF format only, up to 10MB
                </p>
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('resume-upload')?.click()}
                  disabled={loading}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  {data.resumeFile ? 'Change File' : hasExistingResume ? 'Replace File' : 'Choose PDF File'}
                </Button>
                <input
                  id="resume-upload"
                  type="file"
                  accept=".pdf"
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
      </div>
    </OnboardingStep>
  );
};

export default DocumentUploadStep;
