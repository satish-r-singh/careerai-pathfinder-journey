
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useDashboardProgress = () => {
  const { user } = useAuth();
  const [currentPhase, setCurrentPhase] = useState(1);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [ikigaiCompleted, setIkigaiCompleted] = useState(false);
  const [industryResearchCompleted, setIndustryResearchCompleted] = useState(false);
  const [careerRoadmapCompleted, setCareerRoadmapCompleted] = useState(false);
  const [ikigaiLoading, setIkigaiLoading] = useState(true);
  const [explorationProject, setExplorationProject] = useState<string | null>(null);
  const [explorationLearningPlan, setExplorationLearningPlan] = useState(false);
  const [explorationPublicBuilding, setExplorationPublicBuilding] = useState(false);

  useEffect(() => {
    loadProgressData();
  }, [user]);

  const loadProgressData = async () => {
    if (!user) {
      setIkigaiLoading(false);
      return;
    }
    try {
      console.log('Loading progress data for dashboard...');
      await loadIntrospectionProgress();
      await loadExplorationProgress();
    } catch (error) {
      console.error('Error loading progress data:', error);
    } finally {
      setIkigaiLoading(false);
    }
  };

  const loadIntrospectionProgress = async () => {
    try {
      const { data: ikigaiData, error: ikigaiError } = await supabase
        .from('ikigai_progress')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (ikigaiError) {
        console.error('Error loading ikigai progress:', ikigaiError);
        return;
      }

      console.log('Dashboard - Ikigai progress data:', ikigaiData);
      const isIkigaiCompleted = ikigaiData?.is_completed || false;
      console.log('Dashboard - Setting ikigaiCompleted to:', isIkigaiCompleted);
      setIkigaiCompleted(isIkigaiCompleted);

      const { data: researchData, error: researchError } = await supabase
        .from('industry_research')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (researchError) {
        console.error('Error checking Industry Research status:', researchError);
      } else {
        const isResearchCompleted = !!researchData;
        console.log('Dashboard - Setting industryResearchCompleted to:', isResearchCompleted);
        setIndustryResearchCompleted(isResearchCompleted);
      }

      const { data: roadmapData, error: roadmapError } = await supabase
        .from('career_roadmaps')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (roadmapError) {
        console.error('Error checking Career Roadmap status:', roadmapError);
      } else {
        const isRoadmapCompleted = !!roadmapData;
        console.log('Dashboard - Setting careerRoadmapCompleted to:', isRoadmapCompleted);
        setCareerRoadmapCompleted(isRoadmapCompleted);
      }
    } catch (error) {
      console.error('Error loading introspection progress:', error);
    }
  };

  const loadExplorationProgress = async () => {
    try {
      // Always check actual database state for exploration progress
      const { data: learningPlans, error: learningError } = await supabase
        .from('learning_plans')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);

      const hasLearningPlan = !learningError && learningPlans && learningPlans.length > 0;

      const { data: buildingPlans, error: buildingError } = await supabase
        .from('building_in_public_plans')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);

      const hasBuildingPlan = !buildingError && buildingPlans && buildingPlans.length > 0;

      // Set the actual completion state based on database data
      setExplorationLearningPlan(hasLearningPlan);
      setExplorationPublicBuilding(hasBuildingPlan);

      console.log('Dashboard - Exploration progress from database:', {
        hasLearningPlan,
        hasBuildingPlan
      });

      // Also load the current selected project for context
      const { data: explorationState, error: stateError } = await supabase
        .from('exploration_state')
        .select('selected_project')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!stateError && explorationState) {
        setExplorationProject(explorationState.selected_project);
      } else {
        // Fallback to localStorage only if no database state
        const savedProject = localStorage.getItem(`exploration_project_${user.id}`);
        setExplorationProject(savedProject);
      }

    } catch (error) {
      console.error('Error loading exploration progress:', error);
    }
  };

  const calculateCurrentPhaseAndProgress = () => {
    const introspectionComplete = ikigaiCompleted && industryResearchCompleted && careerRoadmapCompleted;
    if (!introspectionComplete) {
      let totalProgress = 0;
      if (ikigaiCompleted) totalProgress += 33;
      if (industryResearchCompleted) totalProgress += 33;
      if (careerRoadmapCompleted) totalProgress += 34;
      return { phase: 1, progress: Math.round(totalProgress) };
    }

    // Use the actual database state for exploration completion
    const explorationComplete = explorationLearningPlan && explorationPublicBuilding;
    console.log('Dashboard - Exploration progress check:', {
      explorationLearningPlan,
      explorationPublicBuilding,
      explorationComplete
    });
    
    if (!explorationComplete) {
      let totalProgress = 0;
      if (explorationLearningPlan) totalProgress += 50;
      if (explorationPublicBuilding) totalProgress += 50;
      console.log('Dashboard - Exploration progress calculation:', totalProgress);
      return { phase: 2, progress: Math.round(totalProgress) };
    }

    return { phase: 3, progress: 0 };
  };

  const { phase, progress } = calculateCurrentPhaseAndProgress();

  useEffect(() => {
    setCurrentPhase(phase);
    setPhaseProgress(progress);
  }, [phase, progress]);

  const getCurrentPhaseName = () => {
    // Use the consistent exploration completion logic
    const explorationComplete = explorationLearningPlan && explorationPublicBuilding;
    if (currentPhase === 1) return 'Introspection';
    if (currentPhase === 2) return 'Exploration';
    if (explorationComplete) return 'Reflection & Action';
    const phases = [
      { id: 1, name: 'Introspection' },
      { id: 2, name: 'Exploration' },
      { id: 3, name: 'Reflection' },
      { id: 4, name: 'Action' }
    ];
    const currentPhaseData = phases.find(p => p.id === currentPhase);
    return currentPhaseData?.name || 'Introspection';
  };

  return {
    currentPhase,
    phaseProgress,
    ikigaiCompleted,
    industryResearchCompleted,
    careerRoadmapCompleted,
    ikigaiLoading,
    explorationProject,
    explorationLearningPlan,
    explorationPublicBuilding,
    getCurrentPhaseName
  };
};
