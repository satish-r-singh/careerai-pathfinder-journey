
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
  const [projectProgress, setProjectProgress] = useState<Record<string, { learningPlan: boolean; buildingPlan: boolean }>>({});

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
      
      // Load progress for all projects
      await loadAllProjectsProgress();
      
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

  const loadAllProjectsProgress = async () => {
    if (!user) return;

    try {
      // Load all learning plans for this user
      const { data: learningPlans, error: learningError } = await supabase
        .from('learning_plans')
        .select('project_id')
        .eq('user_id', user.id);

      // Load all building plans for this user
      const { data: buildingPlans, error: buildingError } = await supabase
        .from('building_in_public_plans')
        .select('project_id')
        .eq('user_id', user.id);

      if (!learningError && !buildingError) {
        const progress: Record<string, { learningPlan: boolean; buildingPlan: boolean }> = {};
        
        // Mark projects with learning plans
        learningPlans?.forEach(plan => {
          if (!progress[plan.project_id]) {
            progress[plan.project_id] = { learningPlan: false, buildingPlan: false };
          }
          progress[plan.project_id].learningPlan = true;
        });

        // Mark projects with building plans
        buildingPlans?.forEach(plan => {
          if (!progress[plan.project_id]) {
            progress[plan.project_id] = { learningPlan: false, buildingPlan: false };
          }
          progress[plan.project_id].buildingPlan = true;
        });

        setProjectProgress(progress);
      }
    } catch (error) {
      console.error('Error loading all projects progress:', error);
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

  const backToProjectSelection = () => {
    setSelectedProject(null);
    localStorage.removeItem(`exploration_project_${user.id}`);
    setLearningPlanCreated(false);
    setPublicBuildingStarted(false);
    setShowLearningPlan(false);
    setGeneratedLearningPlan(null);
    setBuildingInPublicPlan(null);
    localStorage.removeItem(`public_building_${user.id}`);
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
    // Check if user has any learning plans across all projects
    const hasAnyLearningPlan = Object.values(projectProgress).some(progress => progress.learningPlan);
    
    // Check if user has any building plans across all projects
    const hasAnyBuildingPlan = Object.values(projectProgress).some(progress => progress.buildingPlan);
    
    // Check if user has explored any projects (has progress on any project)
    const hasExploredAnyProject = Object.keys(projectProgress).length > 0;

    let completed = 0;
    if (selectedProject || hasExploredAnyProject) completed += 33;
    if (hasAnyLearningPlan || learningPlanCreated) completed += 33;
    if (hasAnyBuildingPlan || publicBuildingStarted) completed += 34;
    return completed;
  };

  const getProjectProgress = (projectId: string) => {
    const progress = projectProgress[projectId];
    if (!progress) return 0;
    
    let completed = 0;
    if (progress.learningPlan) completed += 50;
    if (progress.buildingPlan) completed += 50;
    return completed;
  };

  return {
    selectedProject,
    learningPlanCreated,
    publicBuildingStarted,
    showLearningPlan,
    generatedLearningPlan,
    buildingInPublicPlan,
    projectProgress,
    handleProjectSelect,
    backToProjectSelection,
    resetExploration,
    getProgressPercentage,
    getProjectProgress,
    setGeneratedLearningPlan,
    setLearningPlanCreated,
    setShowLearningPlan,
    setBuildingInPublicPlan,
    setPublicBuildingStarted
  };
};
