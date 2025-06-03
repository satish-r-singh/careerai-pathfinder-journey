
export const calculateProgressPercentage = (
  selectedProject: string | null,
  learningPlanCreated: boolean,
  publicBuildingStarted: boolean,
  projectProgress: Record<string, { learningPlan: boolean; buildingPlan: boolean }>
) => {
  // Check if user has any learning plans across all projects
  const hasAnyLearningPlan = Object.values(projectProgress).some(progress => progress.learningPlan);
  
  // Check if user has any building plans across all projects
  const hasAnyBuildingPlan = Object.values(projectProgress).some(progress => progress.buildingPlan);
  
  // Check if user has explored any projects (has progress on any project)
  const hasExploredAnyProject = Object.keys(projectProgress).length > 0;

  let completed = 0;
  
  // Step 1: Project exploration - completed if user has explored any project OR has a currently selected project
  if (selectedProject || hasExploredAnyProject) {
    completed += 33;
  }
  
  // Step 2: Learning plan - completed if user has ANY learning plan across all projects OR current session has one
  if (hasAnyLearningPlan || learningPlanCreated) {
    completed += 33;
  }
  
  // Step 3: Building in public - completed if user has ANY building plan across all projects OR current session has one
  if (hasAnyBuildingPlan || publicBuildingStarted) {
    completed += 34;
  }
  
  return completed;
};

export const getProjectProgress = (
  projectId: string,
  projectProgress: Record<string, { learningPlan: boolean; buildingPlan: boolean }>
) => {
  const progress = projectProgress[projectId];
  if (!progress) return 0;
  
  let completed = 0;
  if (progress.learningPlan) completed += 50;
  if (progress.buildingPlan) completed += 50;
  return completed;
};
