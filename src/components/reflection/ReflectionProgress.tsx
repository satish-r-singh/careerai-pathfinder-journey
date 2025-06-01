
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, Users, MessageSquare } from 'lucide-react';

const ReflectionProgress = () => {
  // This would be loaded from the database in a real implementation
  const progress = {
    feedbackCollected: 2,
    targetFeedback: 5,
    mentorsConnected: 0,
    targetMentors: 3,
    skillsValidated: 1,
    targetSkills: 4
  };

  const overallProgress = Math.round(
    ((progress.feedbackCollected / progress.targetFeedback) * 33) +
    ((progress.mentorsConnected / progress.targetMentors) * 33) +
    ((progress.skillsValidated / progress.targetSkills) * 34)
  );

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
          <span className="text-sm text-gray-500">{overallProgress}%</span>
        </div>
        <Progress value={overallProgress} className="h-2" />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-600">Peer Feedback</span>
          </div>
          <span className="text-sm font-medium">
            {progress.feedbackCollected}/{progress.targetFeedback}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-600">Mentor Connections</span>
          </div>
          <span className="text-sm font-medium">
            {progress.mentorsConnected}/{progress.targetMentors}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-purple-500" />
            <span className="text-sm text-gray-600">Skills Validated</span>
          </div>
          <span className="text-sm font-medium">
            {progress.skillsValidated}/{progress.targetSkills}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ReflectionProgress;
