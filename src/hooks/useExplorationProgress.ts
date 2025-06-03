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
import { saveExplorationState, loadExplorationState } from '@/services/explorationStateService';

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
      // Load state from database first
      const dbState = await loadExplorationState(user.id);
      
      // Fallback to localStorage if no database state
      const savedProject = dbState?.selectedProject || getSelectedProject(user.id);
      const savedPublicBuilding = dbState?.publicBuildingStarted || getPublicBuilding(user.id);
      
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

  const handleProjectSelect = async (projectId: string) => {
    setSelectedProject(projectId);
    if (user) {
      saveSelectedProject(user.id, projectId);
      
      // Save state to database
      await saveExplorationState(user.id, {
        selectedProject: projectId,
        learningPlanCreated,
        publicBuildingStarted
      });
    }
    
    setLearningPlanCreated(false);
    setShowLearningPlan(false);
    setGeneratedLearningPlan(null);
    setPublicBuildingStarted(false);
    setBuildingInPublicPlan(null);
    
    checkLearningPlanForProject(projectId);
  };

  const backToProjectSelection = async () => {
    setSelectedProject(null);
    if (user) {
      removeSelectedProject(user.id);
      removePublicBuilding(user.id);
      
      // Update database state
      await saveExplorationState(user.id, {
        selectedProject: null,
        learningPlanCreated,
        publicBuildingStarted
      });
    }
    setLearningPlanCreated(false);
    setPublicBuildingStarted(false);
    setShowLearningPlan(false);
    setGeneratedLearningPlan(null);
    setBuildingInPublicPlan(null);
  };

  const resetExploration = async () => {
    setSelectedProject(null);
    if (user) {
      removeSelectedProject(user.id);
      removePublicBuilding(user.id);
      
      // Reset database state
      await saveExplorationState(user.id, {
        selectedProject: null,
        learningPlanCreated: false,
        publicBuildingStarted: false
      });
    }
    setLearningPlanCreated(false);
    setPublicBuildingStarted(false);
    setShowLearningPlan(false);
    setGeneratedLearningPlan(null);
    setBuildingInPublicPlan(null);
  };

  const getProgressPercentage = () => {
    return calculateProgressPercentage(projectProgress);
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
