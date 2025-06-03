
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, ArrowLeft } from 'lucide-react';
import { getIconComponent } from '@/utils/iconUtils';

interface SelectedProjectSummaryProps {
  project: any;
  onBackToProjects?: () => void;
}

const SelectedProjectSummary = ({ project, onBackToProjects }: SelectedProjectSummaryProps) => {
  if (!project) return null;

  const IconComponent = getIconComponent(project.iconName || 'Code');

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="premium-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Selected Project</CardTitle>
            <CardDescription>
              Your chosen project for the exploration phase
            </CardDescription>
          </div>
          {onBackToProjects && (
            <Button 
              variant="outline"
              onClick={onBackToProjects}
              className="border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Project Selection
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
            <IconComponent className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-xl text-gray-900">{project.name}</h3>
              <Badge className={getDifficultyColor(project.difficulty)}>
                {project.difficulty}
              </Badge>
            </div>
            <p className="text-gray-600 mb-4">{project.description}</p>
            
            {project.reasoning && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-1">Why this project fits you:</h4>
                <p className="text-blue-800 text-sm">{project.reasoning}</p>
              </div>
            )}
            
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-2" />
                {project.duration}
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Skills you'll develop:</h4>
                <div className="flex flex-wrap gap-2">
                  {project.skills.map((skill, index) => (
                    <span key={index} className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SelectedProjectSummary;
