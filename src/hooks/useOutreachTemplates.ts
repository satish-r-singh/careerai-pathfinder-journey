
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface IkigaiData {
  passion: string[];
  mission: string[];
  profession: string[];
  vocation: string[];
}

interface OutreachTemplate {
  id: string;
  template_content: string;
  template_type: string;
  job_description: string | null;
  ikigai_data: IkigaiData;
  created_at: string;
  updated_at: string;
}

export const useOutreachTemplates = (ikigaiData: IkigaiData, jobDescription: string) => {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadStoredTemplates = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('outreach_templates')
        .select('*')
        .eq('user_id', user.id)
        .eq('job_description', jobDescription || null)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;

      if (data && data.length > 0) {
        const templateContents = data.map((template: OutreachTemplate) => template.template_content);
        setTemplates(templateContents);
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Error loading stored templates:', error);
      return false;
    }
  };

  const saveTemplates = async (newTemplates: string[]) => {
    if (!user || newTemplates.length === 0) return;

    try {
      setLoading(true);
      
      // Delete existing templates for this job description (if any)
      await supabase
        .from('outreach_templates')
        .delete()
        .eq('user_id', user.id)
        .eq('job_description', jobDescription || null);

      // Insert new templates
      const templateData = newTemplates.map((template, index) => ({
        user_id: user.id,
        template_content: template,
        template_type: index === 0 ? 'general' : index === 1 ? 'targeted' : 'follow_up',
        job_description: jobDescription || null,
        ikigai_data: ikigaiData as any
      }));

      const { error } = await supabase
        .from('outreach_templates')
        .insert(templateData);

      if (error) throw error;

      console.log('Templates saved successfully');
      toast({
        title: "Templates saved!",
        description: "Your outreach templates have been saved.",
      });
    } catch (error: any) {
      console.error('Error saving templates:', error);
      toast({
        title: "Error",
        description: "Failed to save templates. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateAndSaveTemplates = async () => {
    const passions = ikigaiData.passion.slice(0, 2);
    const skills = ikigaiData.profession.slice(0, 2);
    const missions = ikigaiData.mission.slice(0, 1);
    const vocations = ikigaiData.vocation.slice(0, 1);

    const hasJobDescription = jobDescription.trim().length > 0;

    const newTemplates = [
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

    setTemplates(newTemplates);
    await saveTemplates(newTemplates);
  };

  return {
    templates,
    loading,
    loadStoredTemplates,
    generateAndSaveTemplates
  };
};
