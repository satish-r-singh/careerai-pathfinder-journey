
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { LearningPlan } from '@/utils/learningPlanGeneration';

export const useExplorationProgress = () => {
  const { user } = useAuth();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [learningPlanCreated, setLearningPlanCreated] = useState(false);
  const [publicBuildingStarted, setPublicBuildingStarted] = useState(false);
  const [showLearningPlan, setShowLearningPlan] = useState(false);
  const [generatedLearningPlan, setGeneratedLearningPlan] = useState<LearningPlan | null>(null);
  const [buildingInPublicPlan, setBuildingInPublicPlan] = useState<any>(null);

  useEffect(() => {
    checkExplorationProgress();
  }, [user]);

  const checkExplorationProgress = async () => {
    if (!user) return;
    
    try {
      const savedProject = localStorage.getItem(`exploration_project_${user.id}`);
      const savedPublicBuilding = localStorage.getItem(`public_building_${user.id}`);
      
      if (savedProject) setSelectedProject(savedProject);
      if (savedPublicBuilding) setPublicBuildingStarted(true);
      
      if (savedProject) {
        const { data: learningPlan, error } = await supabase
          .from('learning_plans')
          .select('*')
          .eq('user_id', user.id)
          .eq('project_id', savedProject)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error('Error loading learning plan:', error);
        } else if (learningPlan) {
          setGeneratedLearningPlan(learningPlan.learning_plan_data as unknown as LearningPlan);
          setLearningPlanCreated(true);
          setShowLearningPlan(true);
        }

        try {
          const { data: buildingPlan, error: buildingError } = await supabase
            .from('building_in_public_plans')
            .select('*')
            .eq('user_id', user.id)
            .eq('project_id', savedProject)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (!buildingError && buildingPlan) {
            setBuildingInPublicPlan(buildingPlan.plan_data);
            setPublicBuildingStarted(true);
          }
        } catch (buildingQueryError) {
          console.error('Error loading building in public plan for project:', buildingQueryError);
        }
      }
    } catch (error) {
      console.error('Error loading exploration progress:', error);
    }
  };

  const checkLearningPlanForProject = async (projectId: string) => {
    if (!user) return;
    
    try {
      const { data: learningPlan, error } = await supabase
        .from('learning_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error loading learning plan for project:', error);
      } else if (learningPlan) {
        setGeneratedLearningPlan(learningPlan.learning_plan_data as unknown as LearningPlan);
        setLearningPlanCreated(true);
        setShowLearningPlan(true);
      }

      try {
        const { data: buildingPlan, error: buildingError } = await supabase
          .from('building_in_public_plans')
          .select('*')
          .eq('user_id', user.id)
          .eq('project_id', projectId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!buildingError && buildingPlan) {
          setBuildingInPublicPlan(buildingPlan.plan_data);
          setPublicBuildingStarted(true);
        }
      } catch (buildingQueryError) {
        console.error('Error loading building in public plan for project:', buildingQueryError);
      }
    } catch (error) {
      console.error('Error checking learning plan for project:', error);
    }
  };

  const handleProjectSelect = (projectId: string) => {
    setSelectedProject(projectId);
    localStorage.setItem(`exploration_project_${user.id}`, projectId);
    
    setLearningPlanCreated(false);
    setShowLearningPlan(false);
    setGeneratedLearningPlan(null);
    setPublicBuildingStarted(false);
    setBuildingInPublicPlan(null);
    
    checkLearningPlanForProject(projectId);
  };

  const resetExploration = () => {
    setSelectedProject(null);
    localStorage.removeItem(`exploration_project_${user.id}`);
    setLearningPlanCreated(false);
    setPublicBuildingStarted(false);
    setShowLearningPlan(false);
    setGeneratedLearningPlan(null);
    setBuildingInPublicPlan(null);
    localStorage.removeItem(`public_building_${user.id}`);
  };

  const getProgressPercentage = () => {
    let completed = 0;
    if (selectedProject) completed += 33;
    if (learningPlanCreated) completed += 33;
    if (publicBuildingStarted) completed += 34;
    return completed;
  };

  return {
    selectedProject,
    learningPlanCreated,
    publicBuildingStarted,
    showLearningPlan,
    generatedLearningPlan,
    buildingInPublicPlan,
    handleProjectSelect,
    resetExploration,
    getProgressPercentage,
    setGeneratedLearningPlan,
    setLearningPlanCreated,
    setShowLearningPlan,
    setBuildingInPublicPlan,
    setPublicBuildingStarted
  };
};
