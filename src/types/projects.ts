
import { LucideIcon } from 'lucide-react';

export interface IkigaiData {
  passion: string[];
  mission: string[];
  profession: string[];
  vocation: string[];
}

export interface ProjectOption {
  id: string;
  name: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  skills: string[];
  icon: LucideIcon;
  iconName?: string;
  reasoning: string;
}

export interface ProjectData {
  id: string;
  user_id: string;
  project_data: any;
  is_selected: boolean;
  created_at: string;
}
