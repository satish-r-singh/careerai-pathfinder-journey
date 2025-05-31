
import { Users, Target, Lightbulb, Code, LucideIcon } from 'lucide-react';

const iconMap: { [key: string]: LucideIcon } = {
  Users,
  Target,
  Lightbulb,
  Code
};

export const getIconComponent = (iconName: string): LucideIcon => {
  return iconMap[iconName] || Code;
};
