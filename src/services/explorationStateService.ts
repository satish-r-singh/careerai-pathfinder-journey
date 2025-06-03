
import { supabase } from '@/integrations/supabase/client';

export interface ExplorationState {
  selectedProject: string | null;
  learningPlanCreated: boolean;
  publicBuildingStarted: boolean;
}

export const saveExplorationState = async (userId: string, state: ExplorationState) => {
  try {
    const { error } = await supabase
      .from('exploration_state')
      .upsert({
        user_id: userId,
        selected_project: state.selectedProject,
        learning_plan_created: state.learningPlanCreated,
        public_building_started: state.publicBuildingStarted,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error saving exploration state:', error);
    }
  } catch (error) {
    console.error('Error saving exploration state:', error);
  }
};

export const loadExplorationState = async (userId: string): Promise<ExplorationState | null> => {
  try {
    const { data, error } = await supabase
      .from('exploration_state')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      selectedProject: data.selected_project,
      learningPlanCreated: data.learning_plan_created,
      publicBuildingStarted: data.public_building_started
    };
  } catch (error) {
    console.error('Error loading exploration state:', error);
    return null;
  }
};
