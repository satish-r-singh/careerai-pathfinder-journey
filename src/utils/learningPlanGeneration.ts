
import { supabase } from '@/integrations/supabase/client';

export interface LearningPlan {
  overview: {
    estimatedDuration: string;
    weeklyCommitment: string;
    difficultyProgression: string;
  };
  phases: Array<{
    phase: number;
    title: string;
    duration: string;
    focusSkills: string[];
    learningObjectives: string[];
    keyActivities: string[];
    milestones: string[];
    resources: {
      tutorials: string[];
      documentation: string[];
      practice: string[];
    };
  }>;
  buildingInPublic: {
    platforms: string[];
    contentIdeas: string[];
    milestoneSharing: string[];
    networkingTips: string[];
  };
  successMetrics: string[];
  additionalResources: {
    communities: string[];
    tools: string[];
    books: string[];
  };
}

export const generateLearningPlan = async (
  project: any,
  userProfile?: any,
  ikigaiData?: any
): Promise<LearningPlan | null> => {
  try {
    console.log('Generating AI-powered learning plan for project:', project.name);
    
    const { data, error } = await supabase.functions.invoke('generate-learning-plan', {
      body: {
        project,
        userProfile,
        ikigaiData
      }
    });

    if (error) {
      console.error('Error generating learning plan:', error);
      return null;
    }

    return data as LearningPlan;
  } catch (error) {
    console.error('Error calling learning plan generation:', error);
    return null;
  }
};
