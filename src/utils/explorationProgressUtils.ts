export const calculateProgressPercentage = (
  projectProgress: Record<string, { learningPlan: boolean; buildingPlan: boolean }>
) => {
  console.log('=== PROGRESS CALCULATION DEBUG ===');
  console.log('projectProgress:', projectProgress);
  
  // Check if user has any learning plans across all projects
  const hasAnyLearningPlan = Object.values(projectProgress).some(progress => progress.learningPlan);
  console.log('hasAnyLearningPlan:', hasAnyLearningPlan);
  
  // Check if user has any building plans across all projects
  const hasAnyBuildingPlan = Object.values(projectProgress).some(progress => progress.buildingPlan);
  console.log('hasAnyBuildingPlan:', hasAnyBuildingPlan);
  
  // Check if user has explored any projects (has progress on any project)
  const hasExploredAnyProject = Object.keys(projectProgress).length > 0;
  console.log('hasExploredAnyProject:', hasExploredAnyProject);

  let completed = 0;
  
  // Step 1: Project exploration - completed if user has explored any project
  const step1Complete = hasExploredAnyProject;
  console.log('Step 1 (Project exploration) complete:', step1Complete);
  if (step1Complete) {
    completed += 33;
  }
  
  // Step 2: Learning plan - completed if user has ANY learning plan across all projects
  const step2Complete = hasAnyLearningPlan;
  console.log('Step 2 (Learning plan) complete:', step2Complete);
  if (step2Complete) {
    completed += 33;
  }
  
  // Step 3: Building in public - completed if user has ANY building plan across all projects
  const step3Complete = hasAnyBuildingPlan;
  console.log('Step 3 (Building in public) complete:', step3Complete);
  if (step3Complete) {
    completed += 34;
  }
  
  console.log('Final calculated progress:', completed);
  console.log('=== END PROGRESS CALCULATION DEBUG ===');
  
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
