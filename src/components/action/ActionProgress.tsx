
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Users, Target, TrendingUp } from 'lucide-react';

const ActionProgress = () => {
  // Mock data - in real app this would come from actual application data
  const stats = {
    applicationsSubmitted: 8,
    interviewsScheduled: 3,
    networkContacts: 15,
    responseRate: 25, // percentage
    weeklyGoal: 10,
    currentWeekApplications: 6
  };

  const weeklyProgress = (stats.currentWeekApplications / stats.weeklyGoal) * 100;

  const progressItems = [
    {
      label: 'Weekly Application Goal',
      current: stats.currentWeekApplications,
      target: stats.weeklyGoal,
      progress: weeklyProgress,
      icon: Target,
      color: 'text-green-600'
    },
    {
      label: 'Response Rate',
      current: stats.responseRate,
      target: 30,
      progress: (stats.responseRate / 30) * 100,
      icon: TrendingUp,
      color: 'text-blue-600',
      suffix: '%'
    }
  ];

  const achievements = [
    {
      title: 'First Application',
      description: 'Submitted your first job application',
      completed: true,
      icon: Briefcase
    },
    {
      title: 'Network Builder',
      description: 'Added 10+ professional contacts',
      completed: stats.networkContacts >= 10,
      icon: Users
    },
    {
      title: 'Interview Ready',
      description: 'Scheduled your first interview',
      completed: stats.interviewsScheduled > 0,
      icon: Target
    }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900">Key Metrics</h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.applicationsSubmitted}</div>
            <div className="text-xs text-gray-600">Applications</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.interviewsScheduled}</div>
            <div className="text-xs text-gray-600">Interviews</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{stats.networkContacts}</div>
            <div className="text-xs text-gray-600">Contacts</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{stats.responseRate}%</div>
            <div className="text-xs text-gray-600">Response Rate</div>
          </div>
        </div>
      </div>

      {/* Progress Tracking */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900">Progress Tracking</h4>
        
        {progressItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Icon className={`w-4 h-4 ${item.color}`} />
                  <span className="font-medium">{item.label}</span>
                </div>
                <span className="text-gray-600">
                  {item.current}{item.suffix || ''} / {item.target}{item.suffix || ''}
                </span>
              </div>
              <Progress value={item.progress} className="h-2" />
            </div>
          );
        })}
      </div>

      {/* Achievements */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900">Achievements</h4>
        
        <div className="space-y-3">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <div key={index} className="flex items-start space-x-3">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  ${achievement.completed 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-gray-100 text-gray-400'
                  }
                `}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h5 className={`text-sm font-medium ${
                      achievement.completed ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      {achievement.title}
                    </h5>
                    {achievement.completed && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                        Completed
                      </Badge>
                    )}
                  </div>
                  <p className={`text-xs ${
                    achievement.completed ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {achievement.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weekly Goal Status */}
      <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-gray-900">This Week's Goal</h4>
          <Badge variant={weeklyProgress >= 100 ? "default" : "secondary"}>
            {Math.round(weeklyProgress)}%
          </Badge>
        </div>
        <div className="text-sm text-gray-600 mb-2">
          {stats.currentWeekApplications} of {stats.weeklyGoal} applications submitted
        </div>
        <Progress value={weeklyProgress} className="h-2" />
        <div className="text-xs text-gray-500 mt-1">
          {weeklyProgress >= 100 
            ? '🎉 Goal achieved! Keep up the great work!' 
            : `${stats.weeklyGoal - stats.currentWeekApplications} more applications to reach your goal`
          }
        </div>
      </div>
    </div>
  );
};

export default ActionProgress;
