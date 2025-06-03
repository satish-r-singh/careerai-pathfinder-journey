
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LearningPlan } from '@/utils/learningPlanGeneration';
import { ExplorationProgressState } from '@/types/explorationProgress';
import { calculateProgressPercentage, getProjectProgress } from '@/utils/explorationProgressUtils';
import { 
  saveSelectedProject, 
  getSelectedProject, 
  removeSelectedProject,
  getPublicBuilding,
  removePublicBuilding
} from '@/utils/explorationLocalStorage';
import {
  loadLearningPlan,
  loadBuildingPlan,
  loadAllLearningPlans,
  loadAllBuildingPlans
} from '@/services/explorationProgressService';

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
      const savedProject = getSelectedProject(user.id);
      const savedPublicBuilding = getPublicBuilding(user.id);
      
      if (savedProject) setSelectedProject(savedProject);
      if (savedPublicBuilding) setPublicBuildingStarted(true);
      
      // Load progress for all projects
      await loadAllProjectsProgress();
      
      if (savedProject) {
        const learningPlan = await loadLearningPlan(user.id, savedProject);
        
        if (learningPlan) {
          setGeneratedLearningPlan(learningPlan.learning_plan_data as unknown as LearningPlan);
          setLearningPlanCreated(true);
          setShowLearningPlan(true);
        }

        const buildingPlan = await loadBuildingPlan(user.id, savedProject);
        if (buildingPlan) {
          setBuildingInPublicPlan(buildingPlan);
          setPublicBuildingStarted(true);
        }
      }
    } catch (error) {
      console.error('Error loading exploration progress:', error);
    }
  };

  const loadAllProjectsProgress = async () => {
    if (!user) return;

    try {
      const learningPlans = await loadAllLearningPlans(user.id);
      const buildingPlans = await loadAllBuildingPlans(user.id);

      const progress: Record<string, { learningPlan: boolean; buildingPlan: boolean }> = {};
      
      // Mark projects with learning plans
      learningPlans.forEach(plan => {
        if (!progress[plan.project_id]) {
          progress[plan.project_id] = { learningPlan: false, buildingPlan: false };
        }
        progress[plan.project_id].learningPlan = true;
      });

      // Mark projects with building plans
      buildingPlans.forEach(plan => {
        if (!progress[plan.project_id]) {
          progress[plan.project_id] = { learningPlan: false, buildingPlan: false };
        }
        progress[plan.project_id].buildingPlan = true;
      });

      setProjectProgress(progress);
    } catch (error) {
      console.error('Error loading all projects progress:', error);
    }
  };

  const checkLearningPlanForProject = async (projectId: string) => {
    if (!user) return;
    
    try {
      const learningPlan = await loadLearningPlan(user.id, projectId);
      
      if (learningPlan) {
        setGeneratedLearningPlan(learningPlan.learning_plan_data as unknown as LearningPlan);
        setLearningPlanCreated(true);
        setShowLearningPlan(true);
      }

      const buildingPlan = await loadBuildingPlan(user.id, projectId);
      if (buildingPlan) {
        setBuildingInPublicPlan(buildingPlan);
        setPublicBuildingStarted(true);
      }
    } catch (error) {
      console.error('Error checking learning plan for project:', error);
    }
  };

  const handleProjectSelect = (projectId: string) => {
    setSelectedProject(projectId);
    if (user) {
      saveSelectedProject(user.id, projectId);
    }
    
    setLearningPlanCreated(false);
    setShowLearningPlan(false);
    setGeneratedLearningPlan(null);
    setPublicBuildingStarted(false);
    setBuildingInPublicPlan(null);
    
    checkLearningPlanForProject(projectId);
  };

  const backToProjectSelection = () => {
    setSelectedProject(null);
    if (user) {
      removeSelectedProject(user.id);
      removePublicBuilding(user.id);
    }
    setLearningPlanCreated(false);
    setPublicBuildingStarted(false);
    setShowLearningPlan(false);
    setGeneratedLearningPlan(null);
    setBuildingInPublicPlan(null);
  };

  const resetExploration = () => {
    setSelectedProject(null);
    if (user) {
      removeSelectedProject(user.id);
      removePublicBuilding(user.id);
    }
    setLearningPlanCreated(false);
    setPublicBuildingStarted(false);
    setShowLearningPlan(false);
    setGeneratedLearningPlan(null);
    setBuildingInPublicPlan(null);
  };

  const getProgressPercentage = () => {
    return calculateProgressPercentage(
      selectedProject,
      learningPlanCreated,
      publicBuildingStarted,
      projectProgress
    );
  };

  const getProjectProgressPercentage = (projectId: string) => {
    return getProjectProgress(projectId, projectProgress);
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
    getProjectProgress: getProjectProgressPercentage,
    setGeneratedLearningPlan,
    setLearningPlanCreated,
    setShowLearningPlan,
    setBuildingInPublicPlan,
    setPublicBuildingStarted
  };
};
