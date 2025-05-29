
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PhaseCardProps {
  phase: {
    id: number;
    name: string;
    description: string;
    status: 'completed' | 'current' | 'locked';
    progress: number;
    estimatedTime: string;
    keyActivities: string[];
  };
  onClick?: () => void;
}

const PhaseCard = ({ phase, onClick }: PhaseCardProps) => {
  const isAccessible = phase.status === 'completed' || phase.status === 'current';
  
  const getStatusIcon = () => {
    switch (phase.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'current':
        return <Clock className="w-5 h-5 text-primary" />;
      case 'locked':
        return <Lock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = () => {
    switch (phase.status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'current':
        return <Badge className="bg-primary/10 text-primary">In Progress</Badge>;
      case 'locked':
        return <Badge variant="secondary">Locked</Badge>;
    }
  };

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-300",
        isAccessible ? "hover:shadow-lg hover:-translate-y-1" : "opacity-60 cursor-not-allowed",
        phase.status === 'current' ? "ring-2 ring-primary/20 border-primary/30" : ""
      )}
      onClick={isAccessible ? onClick : undefined}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <CardTitle className="text-lg">{phase.name}</CardTitle>
          </div>
          {getStatusBadge()}
        </div>
        <CardDescription className="text-sm">
          {phase.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {phase.status !== 'locked' && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium">{phase.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-500"
                style={{ width: `${phase.progress}%` }}
              />
            </div>
          </div>
        )}
        
        <div className="text-sm text-gray-600">
          <strong>Estimated time:</strong> {phase.estimatedTime}
        </div>
        
        <div>
          <div className="text-sm font-medium text-gray-700 mb-2">Key Activities:</div>
          <ul className="text-sm text-gray-600 space-y-1">
            {phase.keyActivities.map((activity, index) => (
              <li key={index} className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                <span>{activity}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {isAccessible && (
          <Button 
            className="w-full" 
            variant={phase.status === 'current' ? 'default' : 'outline'}
          >
            {phase.status === 'current' ? 'Continue' : 'Review'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default PhaseCard;
