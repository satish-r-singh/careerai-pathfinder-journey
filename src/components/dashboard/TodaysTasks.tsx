
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';
import { useTodaysTasks } from '@/hooks/useTodaysTasks';
import { useNavigate } from 'react-router-dom';

interface TodaysTasksProps {
  currentPhase: number;
  ikigaiCompleted: boolean;
  industryResearchCompleted: boolean;
  careerRoadmapCompleted: boolean;
  explorationProject: string | null;
  explorationLearningPlan: boolean;
  explorationPublicBuilding: boolean;
}

const TodaysTasks = ({
  currentPhase,
  ikigaiCompleted,
  industryResearchCompleted,
  careerRoadmapCompleted,
  explorationProject,
  explorationLearningPlan,
  explorationPublicBuilding
}: TodaysTasksProps) => {
  const navigate = useNavigate();
  const { tasks: todaysTasks, completedTasks, handleTaskToggle } = useTodaysTasks(
    currentPhase,
    ikigaiCompleted,
    industryResearchCompleted,
    careerRoadmapCompleted,
    explorationProject,
    explorationLearningPlan,
    explorationPublicBuilding
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleTaskClick = (task: any) => {
    if (task.navigationPath) {
      navigate(task.navigationPath);
    }
  };

  return (
    <Card className="premium-card animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center space-x-3 text-xl gradient-text">
          <CheckCircle className="w-5 h-5 text-primary" />
          <span>Today's Focus</span>
        </CardTitle>
        <CardDescription className="text-base">
          {currentPhase === 1 && "Complete these introspection tasks to build your career foundation"}
          {currentPhase === 2 && "Focus on exploration and skill building activities"}
          {currentPhase >= 3 && "Balance reflection activities with active job searching"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {todaysTasks.map((task) => (
            <div
              key={task.id}
              className={`group flex items-start gap-4 p-6 border border-white/20 rounded-xl transition-all duration-300 backdrop-blur-sm ${
                task.navigationPath ? 'hover:bg-white/30 hover:shadow-xl cursor-pointer' : 'hover:bg-white/20'
              }`}
              onClick={() => task.navigationPath && handleTaskClick(task)}
            >
              <input
                type="checkbox"
                className="w-5 h-5 mt-1 rounded border-2 border-primary/30 text-primary focus:ring-primary/20 transition-all duration-200 flex-shrink-0"
                checked={completedTasks.includes(task.id)}
                onChange={(e) => {
                  e.stopPropagation();
                  handleTaskToggle(task.id);
                }}
              />
              
              <div className="flex-1 min-w-0">
                <p className={`font-medium text-lg transition-all duration-200 ${
                  completedTasks.includes(task.id) ? 'line-through text-gray-500' : 'text-gray-800'
                }`}>
                  {task.task}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <p className="text-sm text-gray-500">Estimated: {task.estimated}</p>
                  <p className="text-xs text-gray-400">Phase {task.phase}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 flex-shrink-0">
                {task.navigationPath && (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-sm text-primary font-medium whitespace-nowrap">
                    Click to start →
                  </div>
                )}
                <Badge className={`${getPriorityColor(task.priority)} px-3 py-1 text-sm font-medium`}>
                  {task.priority}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TodaysTasks;
