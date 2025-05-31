
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface IkigaiData {
  passion: string[];
  mission: string[];
  profession: string[];
  vocation: string[];
}

interface ProjectOption {
  id: string;
  name: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  skills: string[];
  icon: any;
  reasoning: string;
}

export const usePersonalizedProjects = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generatePersonalizedProjects();
  }, [user]);

  const generatePersonalizedProjects = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      console.log('Generating personalized projects...');
      
      // Get user's Ikigai data
      const { data: ikigaiData, error: ikigaiError } = await supabase
        .from('ikigai_progress')
        .select('ikigai_data')
        .eq('user_id', user.id)
        .maybeSingle();

      if (ikigaiError) throw ikigaiError;

      // Get user's industry research
      const { data: industryData, error: industryError } = await supabase
        .from('industry_research')
        .select('research_data')
        .eq('user_id', user.id)
        .maybeSingle();

      if (industryError) throw industryError;

      // Get user profile for additional context
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('experience, background, goals')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) throw profileError;

      if (!ikigaiData?.ikigai_data) {
        console.log('No Ikigai data found, using default projects');
        setProjects(getDefaultProjects());
        setLoading(false);
        return;
      }

      // Call edge function to generate personalized projects
      const { data: projectsResponse, error: projectsError } = await supabase.functions.invoke('generate-personalized-projects', {
        body: {
          ikigaiData: ikigaiData.ikigai_data,
          industryData: industryData?.research_data || null,
          profileData: profileData || null
        }
      });

      if (projectsError) throw projectsError;

      if (projectsResponse?.projects) {
        setProjects(projectsResponse.projects);
      } else {
        console.log('No personalized projects generated, using default');
        setProjects(getDefaultProjects());
      }
    } catch (error: any) {
      console.error('Error generating personalized projects:', error);
      toast({
        title: "Using default projects",
        description: "Unable to generate personalized projects. Using standard options.",
      });
      setProjects(getDefaultProjects());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultProjects = (): ProjectOption[] => {
    const { Users, Target, Lightbulb, Code } = require('lucide-react');
    
    return [
      {
        id: 'ai-chatbot',
        name: 'AI-Powered Customer Service Chatbot',
        description: 'Build an intelligent chatbot that can handle customer inquiries using natural language processing.',
        difficulty: 'Intermediate' as const,
        duration: '4-6 weeks',
        skills: ['Python/JavaScript', 'OpenAI API', 'Frontend Development', 'Database Management'],
        icon: Users,
        reasoning: 'A versatile project that demonstrates practical AI application in business contexts.'
      },
      {
        id: 'recommendation-engine',
        name: 'Personalized Recommendation Engine',
        description: 'Create a machine learning system that provides personalized recommendations for e-commerce or content.',
        difficulty: 'Advanced' as const,
        duration: '6-8 weeks',
        skills: ['Machine Learning', 'Python', 'Data Analysis', 'Algorithm Design'],
        icon: Target,
        reasoning: 'Showcases advanced ML skills and data-driven decision making capabilities.'
      },
      {
        id: 'ai-content-generator',
        name: 'AI Content Generation Tool',
        description: 'Develop a tool that uses AI to generate blog posts, social media content, or marketing copy.',
        difficulty: 'Beginner' as const,
        duration: '3-4 weeks',
        skills: ['API Integration', 'Frontend Development', 'Content Strategy', 'UI/UX'],
        icon: Lightbulb,
        reasoning: 'Great starting point for those new to AI development with immediate practical value.'
      },
      {
        id: 'data-analysis-dashboard',
        name: 'AI-Enhanced Data Analytics Dashboard',
        description: 'Build a dashboard that uses AI to provide insights and predictions from business data.',
        difficulty: 'Intermediate' as const,
        duration: '5-7 weeks',
        skills: ['Data Visualization', 'Machine Learning', 'Database Design', 'Business Intelligence'],
        icon: Code,
        reasoning: 'Combines technical skills with business acumen, valuable for many AI roles.'
      }
    ];
  };

  return { projects, loading, regenerateProjects: generatePersonalizedProjects };
};
