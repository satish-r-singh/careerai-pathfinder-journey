
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
      console.log('Checking exploration progress for user:', user.id);
      
      // Load progress for all projects first
      await loadAllProjectsProgress();
      
      // Load state from database first
      const dbState = await loadExplorationState(user.id);
      console.log('Database state loaded:', dbState);
      
      // Only use database state for flags, don't auto-select a project
      const savedLearningPlan = dbState?.learningPlanCreated || false;
      const savedPublicBuilding = dbState?.publicBuildingStarted || false;
      
      console.log('Final state values:', { savedLearningPlan, savedPublicBuilding });
      
      setLearningPlanCreated(savedLearningPlan);
      setPublicBuildingStarted(savedPublicBuilding);
      
      // Don't automatically select a project - let user choose from the project selection screen
      setSelectedProject(null);
      
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

      console.log('Project progress loaded:', progress);
      setProjectProgress(progress);

      // Update exploration state based on actual progress
      await updateExplorationStateFromProgress(progress);
    } catch (error) {
      console.error('Error loading all projects progress:', error);
    }
  };

  const updateExplorationStateFromProgress = async (progress: Record<string, { learningPlan: boolean; buildingPlan: boolean }>) => {
    if (!user) return;

    try {
      const hasAnyLearningPlan = Object.values(progress).some(p => p.learningPlan);
      const hasAnyBuildingPlan = Object.values(progress).some(p => p.buildingPlan);

      console.log('Updating exploration state:', { hasAnyLearningPlan, hasAnyBuildingPlan });

      // Update local state
      if (hasAnyLearningPlan && !learningPlanCreated) {
        setLearningPlanCreated(true);
      }
      if (hasAnyBuildingPlan && !publicBuildingStarted) {
        setPublicBuildingStarted(true);
      }

      // Save to database
      await saveExplorationState(user.id, {
        selectedProject: selectedProject,
        learningPlanCreated: hasAnyLearningPlan,
        publicBuildingStarted: hasAnyBuildingPlan
      });
    } catch (error) {
      console.error('Error updating exploration state from progress:', error);
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
      try {
        await saveExplorationState(user.id, {
          selectedProject: projectId,
          learningPlanCreated,
          publicBuildingStarted
        });
      } catch (error) {
        console.error('Error saving exploration state on project select:', error);
      }
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
      try {
        await saveExplorationState(user.id, {
          selectedProject: null,
          learningPlanCreated,
          publicBuildingStarted
        });
      } catch (error) {
        console.error('Error saving exploration state on back to project selection:', error);
      }
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
      try {
        await saveExplorationState(user.id, {
          selectedProject: null,
          learningPlanCreated: false,
          publicBuildingStarted: false
        });
      } catch (error) {
        console.error('Error resetting exploration state:', error);
      }
    }
    setLearningPlanCreated(false);
    setPublicBuildingStarted(false);
    setShowLearningPlan(false);
    setGeneratedLearningPlan(null);
    setBuildingInPublicPlan(null);
  };

  // Function to refresh project progress - this will be called after learning plan creation
  const refreshProjectProgress = async () => {
    console.log('Refreshing project progress...');
    await loadAllProjectsProgress();
  };

  const getProgressPercentage = () => {
    const percentage = calculateProgressPercentage(projectProgress);
    console.log('Final progress percentage calculated:', percentage);
    return percentage;
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
    setPublicBuildingStarted,
    refreshProjectProgress
  };
};
