
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MessageSquare, Copy, RefreshCw, Briefcase } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

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
  const [outreachTemplates, setOutreachTemplates] = useState<string[]>([]);
  const [currentTemplate, setCurrentTemplate] = useState(0);
  const [jobDescription, setJobDescription] = useState('');
  const { toast } = useToast();

  const generateOutreachTemplates = () => {
    const passions = ikigaiData.passion.slice(0, 2);
    const skills = ikigaiData.profession.slice(0, 2);
    const missions = ikigaiData.mission.slice(0, 1);
    const vocations = ikigaiData.vocation.slice(0, 1);

    const hasJobDescription = jobDescription.trim().length > 0;

    const templates = [
      // Template 1: General networking or job-specific
      hasJobDescription 
        ? `Hi [Name],

I hope this message finds you well. I came across the ${jobDescription.includes('role') || jobDescription.includes('position') ? '' : 'role/position '}${jobDescription.slice(0, 100)}${jobDescription.length > 100 ? '...' : ''} and was immediately drawn to the opportunity.

My passion for ${passions.join(' and ')} aligns perfectly with this role. My background in ${skills.join(' and ')} has given me a unique perspective on ${missions[0] || 'solving meaningful problems'}, which I believe would add significant value to your team.

I'd love to discuss how my experience and enthusiasm could contribute to your organization's goals. Would you be open to a brief conversation?

Thank you for your time!

Best regards,
[Your Name]`
        : `Hi [Name],

I hope this message finds you well. I came across your profile and was impressed by your work in the AI industry.

I'm currently transitioning into AI, driven by my passion for ${passions.join(' and ')}. My background in ${skills.join(' and ')} has given me a unique perspective on ${missions[0] || 'solving meaningful problems'}.

I'd love to connect and learn from your experience in the field. Would you be open to a brief conversation about your journey and any insights you might have for someone starting their AI career?

Thank you for your time!

Best regards,
[Your Name]`,

      // Template 2: Specific opportunity inquiry or targeted application
      hasJobDescription
        ? `Dear [Name],

I'm writing to express my strong interest in the opportunity described: ${jobDescription.slice(0, 150)}${jobDescription.length > 150 ? '...' : ''}

Through my Ikigai discovery process, I've identified that my sweet spot lies at the intersection of:
• What I love: ${passions.join(', ')}
• What I'm good at: ${skills.join(', ')}
• What the world needs: ${missions[0] || 'innovative solutions'}

This role appears to be perfectly aligned with my purpose and expertise. ${vocations[0] ? `My particular interest in ${vocations[0]}` : 'My passion for meaningful work'} makes this opportunity especially exciting.

I would welcome the chance to discuss how my unique perspective and skills could contribute to your team's success.

Warm regards,
[Your Name]`
        : `Dear [Name],

I'm reaching out regarding opportunities in AI that align with my purpose and expertise.

Through my Ikigai discovery process, I've identified that my sweet spot lies at the intersection of:
• What I love: ${passions.join(', ')}
• What I'm good at: ${skills.join(', ')}
• What the world needs: ${missions[0] || 'innovative solutions'}

${vocations[0] ? `I'm particularly interested in ${vocations[0]} opportunities` : 'I\'m excited about contributing to meaningful AI projects'} and would appreciate any guidance on how someone with my background might add value to your organization.

Would you be available for a brief conversation?

Warm regards,
[Your Name]`,

      // Template 3: Follow-up after meeting/event or application follow-up
      hasJobDescription
        ? `Hi [Name],

Thank you for taking the time to review my application for the ${jobDescription.includes('role') || jobDescription.includes('position') ? '' : 'position involving '}${jobDescription.slice(0, 100)}${jobDescription.length > 100 ? '...' : ''}.

I wanted to follow up and reiterate my enthusiasm for this opportunity. The role aligns perfectly with my passion for ${passions.join(' and ')} and my expertise in ${skills.join(' and ')}.

I'm particularly excited about the potential to contribute to ${missions[0] || 'meaningful initiatives'} within your organization. I believe my unique background and purpose-driven approach would bring valuable perspectives to your team.

I'd welcome the opportunity to discuss how I can contribute to your goals. Thank you for your consideration.

Best,
[Your Name]`
        : `Hi [Name],

It was wonderful meeting you at [Event/Location]. Our conversation about ${missions[0] || 'AI applications'} really resonated with me.

As I mentioned, I'm passionate about ${passions.join(' and ')} and have been developing my skills in ${skills.join(' and ')}. I'm actively seeking opportunities where I can contribute to ${missions[0] || 'meaningful AI initiatives'}.

I'd love to continue our conversation and explore how I might contribute to the exciting work at [Company]. Would you be open to a follow-up chat?

Looking forward to hearing from you!

Best,
[Your Name]`
    ];

    setOutreachTemplates(templates);
  };

  useEffect(() => {
    const hasCompleteData = Object.values(ikigaiData).some(arr => arr.length > 0);
    if (hasCompleteData) {
      generateOutreachTemplates();
    }
  }, [ikigaiData, jobDescription]);

  const copyToClipboard = () => {
    if (outreachTemplates[currentTemplate]) {
      navigator.clipboard.writeText(outreachTemplates[currentTemplate]);
      toast({
        title: "Template copied!",
        description: "The outreach template has been copied to your clipboard.",
      });
    }
  };

  const nextTemplate = () => {
    setCurrentTemplate((prev) => (prev + 1) % outreachTemplates.length);
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
        <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">
          Template {currentTemplate + 1} of {outreachTemplates.length}
        </span>
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

      {outreachTemplates.length > 0 && (
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
              value={outreachTemplates[currentTemplate]}
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
          disabled={outreachTemplates.length <= 1}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Next Template
        </Button>
        <Button 
          className="flex-1"
          onClick={copyToClipboard}
          disabled={outreachTemplates.length === 0}
        >
          <Copy className="w-4 h-4 mr-2" />
          Copy Template
        </Button>
      </div>
    </div>
  );
};

export default PersonalizedOutreachCard;
