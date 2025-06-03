
export interface ExplorationProgressState {
  selectedProject: string | null;
  learningPlanCreated: boolean;
  publicBuildingStarted: boolean;
  showLearningPlan: boolean;
  generatedLearningPlan: any | null;
  buildingInPublicPlan: any | null;
  projectProgress: Record<string, { learningPlan: boolean; buildingPlan: boolean }>;
}

export interface ProjectProgressData {
  learningPlan: boolean;
  buildingPlan: boolean;
}
