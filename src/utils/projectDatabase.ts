
import { supabase } from '@/integrations/supabase/client';
import { ProjectOption } from '@/types/projects';

export const saveProjectsToDatabase = async (
  userId: string,
  projectsToSave: ProjectOption[],
  selectedProjectIds: Set<string>
) => {
  console.log('Saving projects to database...');
  
  // Delete existing project options for this user
  const { error: deleteError } = await supabase
    .from('project_options')
    .delete()
    .eq('user_id', userId);

  if (deleteError) throw deleteError;

  // Insert new project options - exclude the icon component, only store serializable data
  const projectOptionsToInsert = projectsToSave.map(project => ({
    user_id: userId,
    project_data: {
      id: project.id,
      name: project.name,
      description: project.description,
      difficulty: project.difficulty,
      duration: project.duration,
      skills: project.skills,
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
};

export const loadProjectsFromDatabase = async (userId: string) => {
  console.log('Loading projects from database...');
  
  const { data: projectOptions, error } = await supabase
    .from('project_options')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) throw error;

  if (projectOptions && projectOptions.length > 0) {
    console.log('Found existing projects in database:', projectOptions.length);
    
    // Import icons dynamically
    const { getIconComponent } = await import('./iconUtils');
    
    // Create results arrays with explicit typing
    const loadedProjects: ProjectOption[] = [];
    const selectedIds: string[] = [];
    
    // Process each option individually to avoid complex type inference
    projectOptions.forEach(option => {
      const projectData = option.project_data as {
        id: string;
        name: string;
        description: string;
        difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
        duration: string;
        skills: string[];
        iconName?: string;
        reasoning: string;
      };
      
      const project: ProjectOption = {
        id: projectData.id,
        name: projectData.name,
        description: projectData.description,
        difficulty: projectData.difficulty,
        duration: projectData.duration,
        skills: projectData.skills,
        icon: getIconComponent(projectData.iconName || 'Code'),
        iconName: projectData.iconName,
        reasoning: projectData.reasoning
      };
      
      loadedProjects.push(project);
      
      if (option.is_selected) {
        selectedIds.push(projectData.id);
      }
    });
    
    return {
      projects: loadedProjects,
      selectedIds: new Set(selectedIds)
    };
  }
  
  return null;
};

export const updateProjectSelection = async (
  userId: string,
  projectId: string,
  isSelected: boolean
) => {
  // Simplify the query to avoid complex type inference
  const updateData = { is_selected: isSelected };
  
  const { error } = await supabase
    .from('project_options')
    .update(updateData)
    .eq('user_id', userId)
    .eq('project_data->id', projectId);

  if (error) throw error;
};
