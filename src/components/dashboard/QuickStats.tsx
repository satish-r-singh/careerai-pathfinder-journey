
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface QuickStatsProps {
  completedTasksCount: number;
  totalTasksCount: number;
  getCurrentPhaseName: () => string;
}

const QuickStats = ({ completedTasksCount, totalTasksCount, getCurrentPhaseName }: QuickStatsProps) => {
  return (
    <Card className="premium-card animate-scale-in">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 gradient-text">
          <TrendingUp className="w-5 h-5" />
          <span>Quick Stats</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">Tasks Completed</p>
          <p className="font-medium text-gray-800">{completedTasksCount} / {totalTasksCount}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">Current Phase</p>
          <p className="font-medium text-gray-800">{getCurrentPhaseName()}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickStats;
