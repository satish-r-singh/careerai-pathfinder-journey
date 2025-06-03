
import { supabase } from '@/integrations/supabase/client';
import { LearningPlan } from '@/utils/learningPlanGeneration';

export const loadLearningPlan = async (userId: string, projectId: string) => {
  const { data: learningPlan, error } = await supabase
    .from('learning_plans')
    .select('*')
    .eq('user_id', userId)
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Error loading learning plan:', error);
    return null;
  }

  return learningPlan;
};

export const loadBuildingPlan = async (userId: string, projectId: string) => {
  try {
    const { data: buildingPlan, error } = await supabase
      .from('building_in_public_plans')
      .select('*')
      .eq('user_id', userId)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!error && buildingPlan) {
      return buildingPlan.plan_data;
    }
  } catch (error) {
    console.error('Error loading building in public plan for project:', error);
  }
  return null;
};

export const loadAllLearningPlans = async (userId: string) => {
  const { data: learningPlans, error } = await supabase
    .from('learning_plans')
    .select('project_id')
    .eq('user_id', userId);

  if (error) {
    console.error('Error loading learning plans:', error);
    return [];
  }

  return learningPlans || [];
};

export const loadAllBuildingPlans = async (userId: string) => {
  const { data: buildingPlans, error } = await supabase
    .from('building_in_public_plans')
    .select('project_id')
    .eq('user_id', userId);

  if (error) {
    console.error('Error loading building plans:', error);
    return [];
  }

  return buildingPlans || [];
};
