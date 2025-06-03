
export const saveSelectedProject = (userId: string, projectId: string) => {
  localStorage.setItem(`exploration_project_${userId}`, projectId);
};

export const getSelectedProject = (userId: string): string | null => {
  return localStorage.getItem(`exploration_project_${userId}`);
};

export const removeSelectedProject = (userId: string) => {
  localStorage.removeItem(`exploration_project_${userId}`);
};

export const savePublicBuilding = (userId: string) => {
  localStorage.setItem(`public_building_${userId}`, 'true');
};

export const getPublicBuilding = (userId: string): boolean => {
  return localStorage.getItem(`public_building_${userId}`) === 'true';
};

export const removePublicBuilding = (userId: string) => {
  localStorage.removeItem(`public_building_${userId}`);
};
