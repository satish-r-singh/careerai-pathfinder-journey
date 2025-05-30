
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MessageSquare, Copy, RefreshCw, Briefcase, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useOutreachTemplates } from '@/hooks/useOutreachTemplates';

interface IkigaiData {
  passion: string[];
  mission: string[];
  profession: string[];
  vocation: string[];
}

interface PersonalizedOutreachCardProps {
  ikigaiData: IkigaiData;
}

const PersonalizedOutreachCard = ({ ikigaiData }: PersonalizedOutreachCardProps) => {
  const [currentTemplate, setCurrentTemplate] = useState(0);
  const [jobDescription, setJobDescription] = useState('');
  const { toast } = useToast();

  const {
    templates,
    loading,
    loadStoredTemplates,
    generateAndSaveTemplates
  } = useOutreachTemplates(ikigaiData, jobDescription);

  useEffect(() => {
    const hasCompleteData = Object.values(ikigaiData).some(arr => arr.length > 0);
    if (hasCompleteData) {
      const loadTemplates = async () => {
        const hasStored = await loadStoredTemplates();
        if (!hasStored) {
          await generateAndSaveTemplates();
        }
      };
      loadTemplates();
    }
  }, [ikigaiData, jobDescription]);

  const copyToClipboard = () => {
    if (templates[currentTemplate]) {
      navigator.clipboard.writeText(templates[currentTemplate]);
      toast({
        title: "Template copied!",
        description: "The outreach template has been copied to your clipboard.",
      });
    }
  };

  const nextTemplate = () => {
    setCurrentTemplate((prev) => (prev + 1) % templates.length);
  };

  const regenerateTemplates = async () => {
    await generateAndSaveTemplates();
    setCurrentTemplate(0);
  };

  const hasData = Object.values(ikigaiData).some(arr => arr.length > 0);

  if (!hasData) {
    return (
      <div className="p-6 border rounded-xl bg-gray-50/50 border-gray-200 opacity-60">
        <div className="flex items-center space-x-3 mb-4">
          <MessageSquare className="w-8 h-8 text-gray-400" />
          <h3 className="text-lg font-semibold">Personalised Outreach</h3>
        </div>
        <p className="text-gray-600 mb-4">
          Complete your Ikigai discovery to generate personalized outreach templates.
        </p>
        <Button className="w-full" disabled variant="outline">
          Templates Available After Ikigai
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 border rounded-xl transition-all duration-300 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 border-indigo-200 hover:shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <MessageSquare className="w-8 h-8 text-indigo-500" />
          <h3 className="text-lg font-semibold">Personalised Outreach</h3>
        </div>
        {templates.length > 0 && (
          <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">
            Template {currentTemplate + 1} of {templates.length}
          </span>
        )}
      </div>
      
      <p className="text-gray-600 mb-4">
        AI-generated outreach templates based on your Ikigai insights. Add a job description for more targeted messaging.
      </p>

      {/* Job Description Input */}
      <div className="mb-4">
        <Label htmlFor="job-description" className="text-sm font-medium text-gray-700 mb-2 flex items-center">
          <Briefcase className="w-4 h-4 mr-2" />
          Job Description (Optional)
        </Label>
        <Textarea
          id="job-description"
          placeholder="Paste the job description here to generate more targeted outreach templates..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          className="min-h-[100px] text-sm"
        />
      </div>

      {templates.length > 0 && (
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-700">
              {currentTemplate === 0 && (jobDescription ? "Targeted Application Template" : "General Networking Template")}
              {currentTemplate === 1 && (jobDescription ? "Detailed Interest Template" : "Opportunity Inquiry Template")}
              {currentTemplate === 2 && (jobDescription ? "Application Follow-up Template" : "Follow-up Template")}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Textarea
              value={templates[currentTemplate]}
              readOnly
              className="min-h-[300px] text-sm leading-relaxed"
            />
          </CardContent>
        </Card>
      )}

      <div className="flex gap-2">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={nextTemplate}
          disabled={templates.length <= 1 || loading}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Next Template
        </Button>
        <Button 
          variant="outline"
          className="flex-1"
          onClick={regenerateTemplates}
          disabled={loading}
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Generating...' : 'Regenerate'}
        </Button>
        <Button 
          className="flex-1"
          onClick={copyToClipboard}
          disabled={templates.length === 0 || loading}
        >
          <Copy className="w-4 h-4 mr-2" />
          Copy Template
        </Button>
      </div>
    </div>
  );
};

export default PersonalizedOutreachCard;
