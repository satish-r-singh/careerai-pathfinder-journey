
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Lock, Sparkles, ArrowRight, MessageSquare, Users, Award, Briefcase, Calendar, Network } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivityIndicators {
  feedbackCollected?: number;
  mentorsConnected?: number;
  skillsValidated?: number;
  applicationsSubmitted?: number;
  interviewsScheduled?: number;
  networkingActivities?: number;
}

interface PhaseCardProps {
  phase: {
    id: number;
    name: string;
    description: string;
    status: 'completed' | 'current' | 'locked';
    progress: number | null;
    estimatedTime: string;
    keyActivities: string[];
    activityIndicators?: ActivityIndicators | null;
  };
  onClick?: () => void;
}

const PhaseCard = ({ phase, onClick }: PhaseCardProps) => {
  const isAccessible = phase.status === 'completed' || phase.status === 'current';
  
  const getStatusIcon = () => {
    switch (phase.status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'current':
        return <Sparkles className="w-6 h-6 text-primary animate-pulse" />;
      case 'locked':
        return <Lock className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusBadge = () => {
    switch (phase.status) {
      case 'completed':
        return <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300 font-semibold">✨ Completed</Badge>;
      case 'current':
        return <Badge className="bg-gradient-to-r from-primary/10 to-accent/10 text-primary border-primary/30 font-semibold animate-pulse">🚀 In Progress</Badge>;
      case 'locked':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-500">🔒 Locked</Badge>;
    }
  };

  const getButtonText = () => {
    if (phase.status === 'completed') return 'Review Phase';
    if (phase.status === 'current') return 'Continue Journey';
    return 'Coming Soon';
  };

  const getCardBackground = () => {
    switch (phase.status) {
      case 'completed':
        return 'bg-gradient-to-br from-green-50 via-white to-green-50/30';
      case 'current':
        return 'bg-gradient-to-br from-blue-50 via-white to-purple-50/30';
      case 'locked':
        return 'bg-gradient-to-br from-gray-50 via-white to-gray-50/30';
      default:
        return 'bg-white';
    }
  };

  const renderActivityIndicators = () => {
    if (!phase.activityIndicators) return null;

    const indicators = phase.activityIndicators;
    
    if (phase.id === 3) {
      return (
        <div className="space-y-3">
          <div className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span>Recent Activity:</span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-800">Feedback Collected</span>
              </div>
              <span className="text-sm font-bold text-blue-900">{indicators.feedbackCollected}</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-800">Mentors Connected</span>
              </div>
              <span className="text-sm font-bold text-green-900">{indicators.mentorsConnected}</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-purple-800">Skills Validated</span>
              </div>
              <span className="text-sm font-bold text-purple-900">{indicators.skillsValidated}</span>
            </div>
          </div>
        </div>
      );
    }

    if (phase.id === 4) {
      return (
        <div className="space-y-3">
          <div className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span>Recent Activity:</span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Briefcase className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-800">Applications</span>
              </div>
              <span className="text-sm font-bold text-blue-900">{indicators.applicationsSubmitted}</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-800">Interviews</span>
              </div>
              <span className="text-sm font-bold text-green-900">{indicators.interviewsScheduled}</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Network className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-purple-800">Networking</span>
              </div>
              <span className="text-sm font-bold text-purple-900">{indicators.networkingActivities}</span>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderProgressSection = () => {
    // Show progress bar for phases 1 and 2
    if (phase.progress !== null && phase.status !== 'locked') {
      return (
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 font-medium">Progress</span>
            <span className="font-bold text-gray-800">{phase.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className={cn(
                "h-3 rounded-full transition-all duration-1000 relative overflow-hidden",
                phase.status === 'completed' 
                  ? "bg-gradient-to-r from-green-400 to-green-600" 
                  : "bg-gradient-to-r from-primary to-accent"
              )}
              style={{ width: `${phase.progress}%` }}
            >
              {phase.progress > 0 && (
                <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Show activity indicators for phases 3 and 4
    return renderActivityIndicators();
  };

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-500 border-2 h-full",
        getCardBackground(),
        isAccessible ? "hover:shadow-2xl hover:-translate-y-2 border-primary/20 hover:border-primary/40" : "opacity-70 cursor-not-allowed border-gray-200",
        phase.status === 'current' ? "ring-2 ring-primary/30 border-primary/50 shadow-lg" : "",
        phase.status === 'completed' ? "ring-2 ring-green-300/30 border-green-300/50" : ""
      )}
      onClick={isAccessible ? onClick : undefined}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            {getStatusIcon()}
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {phase.name}
            </CardTitle>
          </div>
          {getStatusBadge()}
        </div>
        <CardDescription className="text-base text-gray-600 leading-relaxed">
          {phase.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {phase.status !== 'locked' && renderProgressSection()}
        
        <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50/50 rounded-lg p-3">
          <Clock className="w-4 h-4 text-primary" />
          <span className="font-medium">Duration:</span>
          <span className="font-semibold text-gray-800">{phase.estimatedTime}</span>
        </div>
        
        <div className="space-y-3">
          <div className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span>Key Activities:</span>
          </div>
          <ul className="space-y-2">
            {phase.keyActivities.map((activity, index) => (
              <li key={index} className="flex items-start space-x-3 text-sm">
                <div className="w-1.5 h-1.5 bg-gradient-to-r from-primary to-accent rounded-full mt-2 flex-shrink-0" />
                <span className="text-gray-700 leading-relaxed">{activity}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {isAccessible && (
          <Button 
            className={cn(
              "w-full font-semibold text-base py-3 transition-all duration-300 group",
              phase.status === 'current' 
                ? "bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl" 
                : "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800"
            )}
          >
            <span>{getButtonText()}</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default PhaseCard;
