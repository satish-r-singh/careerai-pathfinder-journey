
import { supabase } from '@/integrations/supabase/client';
import { ProjectOption } from '@/types/projects';

export const generatePersonalizedProjectsAPI = async (
  userId: string,
  numberOfProjects: number,
  existingProjects: { id: string; name: string }[] = []
) => {
  // Get user's Ikigai data
  const { data: ikigaiData, error: ikigaiError } = await supabase
    .from('ikigai_progress')
    .select('ikigai_data')
    .eq('user_id', userId)
    .maybeSingle();

  if (ikigaiError) throw ikigaiError;

  // Get user's industry research
  const { data: industryData, error: industryError } = await supabase
    .from('industry_research')
    .select('research_data')
    .eq('user_id', userId)
    .maybeSingle();

  if (industryError) throw industryError;

  // Get user profile for additional context
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('experience, background, goals')
    .eq('id', userId)
    .maybeSingle();

  if (profileError) throw profileError;

  if (!ikigaiData?.ikigai_data) {
    return null;
  }

  // Call edge function to generate personalized projects
  const { data: projectsResponse, error: projectsError } = await supabase.functions.invoke('generate-personalized-projects', {
    body: {
      ikigaiData: ikigaiData.ikigai_data,
      industryData: industryData?.research_data || null,
      profileData: profileData || null,
      numberOfProjects,
      existingProjects
    }
  });

  if (projectsError) throw projectsError;

  return projectsResponse?.projects || null;
};
