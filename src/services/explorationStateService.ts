
import { supabase } from '@/integrations/supabase/client';

export interface ExplorationState {
  selectedProject: string | null;
  learningPlanCreated: boolean;
  publicBuildingStarted: boolean;
}

export const saveExplorationState = async (userId: string, state: ExplorationState) => {
  try {
    console.log('Saving exploration state:', { userId, state });
    
    const { error } = await supabase
      .from('exploration_state')
      .upsert({
        user_id: userId,
        selected_project: state.selectedProject,
        learning_plan_created: state.learningPlanCreated,
        public_building_started: state.publicBuildingStarted,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (error) {
      console.error('Error saving exploration state:', error);
      throw error;
    }
    
    console.log('Successfully saved exploration state');
  } catch (error) {
    console.error('Error saving exploration state:', error);
    throw error;
  }
};

export const loadExplorationState = async (userId: string): Promise<ExplorationState | null> => {
  try {
    console.log('Loading exploration state for user:', userId);
    
    const { data, error } = await supabase
      .from('exploration_state')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error loading exploration state:', error);
      return null;
    }

    if (!data) {
      console.log('No exploration state found for user');
      return null;
    }

    console.log('Loaded exploration state:', data);
    
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
