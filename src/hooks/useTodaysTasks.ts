
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface TodaysTask {
  id: string;
  task: string;
  priority: 'high' | 'medium' | 'low';
  estimated: string;
  phase: number;
  action?: () => void;
  navigationPath?: string;
}

export const useTodaysTasks = (
  currentPhase: number,
  ikigaiCompleted: boolean,
  industryResearchCompleted: boolean,
  careerRoadmapCompleted: boolean,
  explorationProject: string | null,
  explorationLearningPlan: boolean,
  explorationPublicBuilding: boolean
) => {
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const { user } = useAuth();

  // Load completed tasks from localStorage
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`completed_tasks_${user.id}`);
      if (saved) {
        setCompletedTasks(JSON.parse(saved));
      }
    }
  }, [user]);

  // Save completed tasks to localStorage
  useEffect(() => {
    if (user && completedTasks.length > 0) {
      localStorage.setItem(`completed_tasks_${user.id}`, JSON.stringify(completedTasks));
    }
  }, [completedTasks, user]);

  const generateTasks = (): TodaysTask[] => {
    const tasks: TodaysTask[] = [];

    // Phase 1: Introspection tasks
    if (currentPhase === 1) {
      if (!ikigaiCompleted) {
        tasks.push({
          id: 'ikigai-assessment',
          task: 'Complete your Ikigai self-discovery assessment',
          priority: 'high',
          estimated: '30 min',
          phase: 1,
          navigationPath: '/ikigai'
        });
      }

      if (ikigaiCompleted && !industryResearchCompleted) {
        tasks.push({
          id: 'industry-research',
          task: 'Research AI industry trends and opportunities',
          priority: 'high',
          estimated: '45 min',
          phase: 1,
          navigationPath: '/industry-research'
        });
      }

      if (ikigaiCompleted && industryResearchCompleted && !careerRoadmapCompleted) {
        tasks.push({
          id: 'career-roadmap',
          task: 'Generate your personalized AI career roadmap',
          priority: 'high',
          estimated: '20 min',
          phase: 1,
          navigationPath: '/ai-career-integration'
        });
      }

      // Add supporting tasks
      if (ikigaiCompleted) {
        tasks.push({
          id: 'review-ikigai',
          task: 'Review your Ikigai insights and reflect on key findings',
          priority: 'medium',
          estimated: '15 min',
          phase: 1,
          navigationPath: '/ikigai'
        });
      }
    }

    // Phase 2: Exploration tasks
    if (currentPhase === 2) {
      if (!explorationProject) {
        tasks.push({
          id: 'select-project',
          task: 'Choose your AI learning project',
          priority: 'high',
          estimated: '30 min',
          phase: 2,
          navigationPath: '/exploration'
        });
      }

      if (explorationProject && !explorationLearningPlan) {
        tasks.push({
          id: 'create-learning-plan',
          task: 'Create your personalized learning plan',
          priority: 'high',
          estimated: '25 min',
          phase: 2,
          navigationPath: '/exploration'
        });
      }

      if (explorationProject && explorationLearningPlan && !explorationPublicBuilding) {
        tasks.push({
          id: 'build-in-public-plan',
          task: 'Set up your building in public strategy',
          priority: 'high',
          estimated: '20 min',
          phase: 2,
          navigationPath: '/exploration'
        });
      }

      // Add supporting tasks for exploration
      if (explorationProject) {
        tasks.push({
          id: 'daily-learning',
          task: 'Complete today\'s learning milestone',
          priority: 'medium',
          estimated: '60 min',
          phase: 2
        });
      }
    }

    // Phase 3: Reflection tasks
    if (currentPhase >= 3) {
      tasks.push({
        id: 'reflection-feedback',
        task: 'Gather feedback on your project progress',
        priority: 'medium',
        estimated: '30 min',
        phase: 3,
        navigationPath: '/reflection'
      });

      tasks.push({
        id: 'mentor-connection',
        task: 'Connect with AI industry mentors',
        priority: 'medium',
        estimated: '45 min',
        phase: 3,
        navigationPath: '/reflection'
      });
    }

    // Phase 4: Action tasks
    if (currentPhase >= 3) { // Available after exploration
      tasks.push({
        id: 'job-applications',
        task: 'Apply to 2-3 AI positions today',
        priority: 'high',
        estimated: '90 min',
        phase: 4,
        navigationPath: '/action'
      });

      tasks.push({
        id: 'network-outreach',
        task: 'Send personalized outreach messages',
        priority: 'medium',
        estimated: '30 min',
        phase: 4,
        navigationPath: '/action'
      });
    }

    // General ongoing tasks
    if (currentPhase >= 1) {
      tasks.push({
        id: 'industry-news',
        task: 'Read latest AI industry news and trends',
        priority: 'low',
        estimated: '15 min',
        phase: currentPhase
      });
    }

    // Limit to top 4 most relevant tasks
    return tasks.slice(0, 4);
  };

  const tasks = generateTasks();

  const handleTaskToggle = (taskId: string) => {
    setCompletedTasks(prev => {
      if (prev.includes(taskId)) {
        return prev.filter(id => id !== taskId);
      } else {
        return [...prev, taskId];
      }
    });
  };

  return {
    tasks,
    completedTasks,
    handleTaskToggle
  };
};
