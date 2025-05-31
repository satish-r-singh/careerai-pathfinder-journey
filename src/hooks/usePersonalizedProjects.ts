import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Users, Target, Lightbulb, Code } from 'lucide-react';

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
  iconName?: string;
  reasoning: string;
}

export const usePersonalizedProjects = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set());
  const [regeneratingProjects, setRegeneratingProjects] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (user) {
      loadProjectsFromDatabase();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadProjectsFromDatabase = async () => {
    if (!user) return;

    try {
      console.log('Loading projects from database...');
      
      const { data: projectOptions, error } = await supabase
        .from('project_options')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (projectOptions && projectOptions.length > 0) {
        console.log('Found existing projects in database:', projectOptions.length);
        
        // Convert database records to project format with proper type casting
        const loadedProjects: ProjectOption[] = projectOptions.map(option => {
          // Cast through unknown first for safe type conversion
          const projectData = option.project_data as unknown as ProjectOption;
          return {
            id: projectData.id,
            name: projectData.name,
            description: projectData.description,
            difficulty: projectData.difficulty,
            duration: projectData.duration,
            skills: projectData.skills,
            icon: projectData.icon,
            iconName: projectData.iconName,
            reasoning: projectData.reasoning
          };
        });
        
        setProjects(loadedProjects);
        
        // Load selected projects
        const selectedIds: string[] = projectOptions
          .filter(option => option.is_selected)
          .map(option => {
            const projectData = option.project_data as unknown as ProjectOption;
            return projectData.id;
          });
        
        setSelectedProjects(new Set(selectedIds));
      } else {
        console.log('No existing projects found, generating new ones...');
        await generatePersonalizedProjects(false);
      }
    } catch (error: any) {
      console.error('Error loading projects from database:', error);
      toast({
        title: "Error loading projects",
        description: "Failed to load projects from database. Generating new ones.",
      });
      await generatePersonalizedProjects(false);
    } finally {
      setLoading(false);
    }
  };

  const saveProjectsToDatabase = async (projectsToSave: ProjectOption[], selectedProjectIds: Set<string>) => {
    if (!user) return;

    try {
      console.log('Saving projects to database...');
      
      // Delete existing project options for this user
      const { error: deleteError } = await supabase
        .from('project_options')
        .delete()
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      // Insert new project options
      const projectOptionsToInsert = projectsToSave.map(project => ({
        user_id: user.id,
        project_data: {
          id: project.id,
          name: project.name,
          description: project.description,
          difficulty: project.difficulty,
          duration: project.duration,
          skills: project.skills,
          icon: project.icon,
          iconName: project.iconName,
          reasoning: project.reasoning
        },
        is_selected: selectedProjectIds.has(project.id)
      }));

      const { error: insertError } = await supabase
        .from('project_options')
        .insert(projectOptionsToInsert);

      if (insertError) throw insertError;

      console.log('Projects saved to database successfully');
    } catch (error: any) {
      console.error('Error saving projects to database:', error);
      toast({
        title: "Error saving projects",
        description: "Failed to save projects to database.",
      });
    }
  };

  const generatePersonalizedProjects = async (keepSelected = false) => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      if (!keepSelected) {
        setLoading(true);
      } else {
        // Mark unselected projects as regenerating
        const projectsToRegenerate = new Set(
          projects.filter(p => !selectedProjects.has(p.id)).map(p => p.id)
        );
        setRegeneratingProjects(projectsToRegenerate);
      }
      
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
        const defaultProjects = getDefaultProjects();
        setProjects(defaultProjects);
        const newSelectedProjects = new Set<string>();
        setSelectedProjects(newSelectedProjects);
        await saveProjectsToDatabase(defaultProjects, newSelectedProjects);
        setLoading(false);
        setRegeneratingProjects(new Set());
        return;
      }

      let projectsToKeep: ProjectOption[] = [];
      let numberOfProjectsToGenerate = 4;

      if (keepSelected && selectedProjects.size > 0) {
        projectsToKeep = projects.filter(p => selectedProjects.has(p.id));
        numberOfProjectsToGenerate = 4 - projectsToKeep.length;
      }

      if (numberOfProjectsToGenerate > 0) {
        // Call edge function to generate personalized projects
        const { data: projectsResponse, error: projectsError } = await supabase.functions.invoke('generate-personalized-projects', {
          body: {
            ikigaiData: ikigaiData.ikigai_data,
            industryData: industryData?.research_data || null,
            profileData: profileData || null,
            numberOfProjects: numberOfProjectsToGenerate,
            existingProjects: projectsToKeep.map(p => ({ id: p.id, name: p.name }))
          }
        });

        if (projectsError) throw projectsError;

        if (projectsResponse?.projects) {
          const newProjects = [...projectsToKeep, ...projectsResponse.projects];
          setProjects(newProjects);
          const newSelectedProjects = new Set<string>();
          setSelectedProjects(newSelectedProjects);
          await saveProjectsToDatabase(newProjects, newSelectedProjects);
        } else {
          console.log('No personalized projects generated, using default');
          const defaultProjects = getDefaultProjects();
          setProjects(defaultProjects);
          const newSelectedProjects = new Set<string>();
          setSelectedProjects(newSelectedProjects);
          await saveProjectsToDatabase(defaultProjects, newSelectedProjects);
        }
      } else {
        // If we're keeping all selected projects, just keep them
        setProjects(projectsToKeep);
        const newSelectedProjects = new Set<string>();
        setSelectedProjects(newSelectedProjects);
        await saveProjectsToDatabase(projectsToKeep, newSelectedProjects);
      }
    } catch (error: any) {
      console.error('Error generating personalized projects:', error);
      toast({
        title: "Using default projects",
        description: "Unable to generate personalized projects. Using standard options.",
      });
      const defaultProjects = getDefaultProjects();
      setProjects(defaultProjects);
      const newSelectedProjects = new Set<string>();
      setSelectedProjects(newSelectedProjects);
      await saveProjectsToDatabase(defaultProjects, newSelectedProjects);
    } finally {
      setLoading(false);
      setRegeneratingProjects(new Set());
    }
  };

  const toggleProjectSelection = async (projectId: string) => {
    const newSelectedProjects = new Set(selectedProjects);
    if (newSelectedProjects.has(projectId)) {
      newSelectedProjects.delete(projectId);
    } else {
      newSelectedProjects.add(projectId);
    }
    
    setSelectedProjects(newSelectedProjects);
    
    // Update database with new selection state
    if (user) {
      try {
        const { error } = await supabase
          .from('project_options')
          .update({ is_selected: newSelectedProjects.has(projectId) })
          .eq('user_id', user.id)
          .eq('project_data->id', projectId);

        if (error) throw error;
      } catch (error: any) {
        console.error('Error updating project selection:', error);
        toast({
          title: "Error updating selection",
          description: "Failed to save project selection.",
        });
      }
    }
  };

  const regenerateUnselected = () => {
    if (selectedProjects.size === 0) {
      // If nothing is selected, regenerate all
      generatePersonalizedProjects(false);
    } else {
      // Regenerate only unselected projects
      generatePersonalizedProjects(true);
    }
  };

  const getDefaultProjects = (): ProjectOption[] => {
    return [
      {
        id: 'ai-chatbot',
        name: 'AI-Powered Customer Service Chatbot',
        description: 'Build an intelligent chatbot that can handle customer inquiries using natural language processing.',
        difficulty: 'Intermediate' as const,
        duration: '4-6 weeks',
        skills: ['Python/JavaScript', 'OpenAI API', 'Frontend Development', 'Database Management'],
        icon: Users,
        iconName: 'Users',
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
        iconName: 'Target',
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
        iconName: 'Lightbulb',
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
        iconName: 'Code',
        reasoning: 'Combines technical skills with business acumen, valuable for many AI roles.'
      }
    ];
  };

  return { 
    projects, 
    loading, 
    regenerateProjects: () => generatePersonalizedProjects(false),
    selectedProjects,
    toggleProjectSelection,
    regenerateUnselected,
    regeneratingProjects
  };
};
