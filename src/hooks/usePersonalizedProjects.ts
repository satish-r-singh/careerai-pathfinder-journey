
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ProjectOption } from '@/types/projects';
import { getDefaultProjects } from '@/utils/defaultProjects';
import { 
  saveProjectsToDatabase, 
  loadProjectsFromDatabase, 
  updateProjectSelection 
} from '@/utils/projectDatabase';
import { generatePersonalizedProjectsAPI } from '@/utils/projectGeneration';

export const usePersonalizedProjects = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set());
  const [regeneratingProjects, setRegeneratingProjects] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (user) {
      loadProjectsFromDatabaseHandler();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadProjectsFromDatabaseHandler = async () => {
    if (!user) return;

    try {
      const result = await loadProjectsFromDatabase(user.id);
      
      if (result) {
        setProjects(result.projects);
        setSelectedProjects(result.selectedIds);
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

  const generatePersonalizedProjects = async (keepSelected = false) => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      if (!keepSelected) {
        setLoading(true);
      } else {
        const projectsToRegenerate = new Set(
          projects.filter(p => !selectedProjects.has(p.id)).map(p => p.id)
        );
        setRegeneratingProjects(projectsToRegenerate);
      }
      
      console.log('Generating personalized projects...');

      let projectsToKeep: ProjectOption[] = [];
      let numberOfProjectsToGenerate = 4;

      if (keepSelected && selectedProjects.size > 0) {
        projectsToKeep = projects.filter(p => selectedProjects.has(p.id));
        numberOfProjectsToGenerate = 4 - projectsToKeep.length;
      }

      if (numberOfProjectsToGenerate > 0) {
        const generatedProjects = await generatePersonalizedProjectsAPI(
          user.id,
          numberOfProjectsToGenerate,
          projectsToKeep.map(p => ({ id: p.id, name: p.name }))
        );

        if (generatedProjects) {
          const newProjects = [...projectsToKeep, ...generatedProjects];
          setProjects(newProjects);
          const newSelectedProjects = new Set<string>();
          setSelectedProjects(newSelectedProjects);
          await saveProjectsToDatabase(user.id, newProjects, newSelectedProjects);
        } else {
          console.log('No personalized projects generated, using default');
          const defaultProjects = getDefaultProjects();
          setProjects(defaultProjects);
          const newSelectedProjects = new Set<string>();
          setSelectedProjects(newSelectedProjects);
          await saveProjectsToDatabase(user.id, defaultProjects, newSelectedProjects);
        }
      } else {
        setProjects(projectsToKeep);
        const newSelectedProjects = new Set<string>();
        setSelectedProjects(newSelectedProjects);
        await saveProjectsToDatabase(user.id, projectsToKeep, newSelectedProjects);
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
      await saveProjectsToDatabase(user.id, defaultProjects, newSelectedProjects);
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
    
    if (user) {
      try {
        await updateProjectSelection(user.id, projectId, newSelectedProjects.has(projectId));
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
      generatePersonalizedProjects(false);
    } else {
      generatePersonalizedProjects(true);
    }
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
