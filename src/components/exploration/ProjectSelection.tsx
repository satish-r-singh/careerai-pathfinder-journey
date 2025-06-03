
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Clock, RefreshCw, CheckCircle } from 'lucide-react';
import { usePersonalizedProjects } from '@/hooks/usePersonalizedProjects';
import { getIconComponent } from '@/utils/iconUtils';

interface ProjectSelectionProps {
  onProjectSelect: (projectId: string) => void;
  projectProgress: Record<string, { learningPlan: boolean; buildingPlan: boolean }>;
  getProjectProgress: (projectId: string) => number;
}

const ProjectSelection = ({ onProjectSelect, projectProgress, getProjectProgress }: ProjectSelectionProps) => {
  const { 
    projects, 
    loading: projectsLoading, 
    regenerateProjects,
    selectedProjects,
    toggleProjectSelection,
    regenerateUnselected,
    regeneratingProjects
  } = usePersonalizedProjects();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressStatus = (projectId: string) => {
    const progress = projectProgress[projectId];
    if (!progress) return { text: 'Not Started', color: 'text-gray-500' };
    
    if (progress.learningPlan && progress.buildingPlan) {
      return { text: 'Complete', color: 'text-green-600' };
    } else if (progress.learningPlan) {
      return { text: 'Learning Plan Created', color: 'text-blue-600' };
    } else {
      return { text: 'Not Started', color: 'text-gray-500' };
    }
  };

  const renderProjectCard = (project: any) => {
    const IconComponent = getIconComponent(project.iconName || 'Code');
    const isSelected = selectedProjects.has(project.id);
    const isRegenerating = regeneratingProjects.has(project.id);
    const progressPercentage = getProjectProgress(project.id);
    const progressStatus = getProgressStatus(project.id);

    if (isRegenerating) {
      return (
        <div key={project.id} className="p-6 border rounded-xl">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Generating new project...</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        key={project.id}
        className={`p-6 border rounded-xl transition-all relative ${
          isSelected 
            ? 'border-blue-300 bg-blue-50' 
            : 'hover:shadow-lg hover:border-primary/30'
        }`}
      >
        {/* Progress indicator */}
        {progressPercentage > 0 && (
          <div className="absolute top-4 right-4">
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
        )}

        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => toggleProjectSelection(project.id)}
              className="mt-1"
            />
            <span className="text-sm text-gray-600">Keep this project</span>
          </div>
        </div>
        
        <div 
          className="flex items-start space-x-4 cursor-pointer"
          onClick={() => onProjectSelect(project.id)}
        >
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <IconComponent className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg">{project.name}</h3>
              <Badge className={getDifficultyColor(project.difficulty)}>
                {project.difficulty}
              </Badge>
            </div>
            <p className="text-gray-600 mb-3">{project.description}</p>
            {project.reasoning && (
              <div className="mb-3 p-2 bg-blue-50 rounded text-sm text-blue-800">
                <strong>Why this fits you:</strong> {project.reasoning}
              </div>
            )}
            
            {/* Progress section */}
            <div className="mb-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Exploration Progress</span>
                <span className={`text-sm ${progressStatus.color}`}>{progressStatus.text}</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <div className="text-xs text-gray-500">
                {progressPercentage === 0 && "Click to start exploring this project"}
                {progressPercentage > 0 && progressPercentage < 100 && "Continue where you left off"}
                {progressPercentage === 100 && "Project fully explored"}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-2" />
                {project.duration}
              </div>
              <div className="flex flex-wrap gap-2">
                {project.skills.map((skill, index) => (
                  <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <Button className="w-full mt-4">
              {progressPercentage > 0 ? 'Continue Exploring' : 'Select This Project'}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Your Personalized AI Projects</CardTitle>
            <CardDescription>
              These projects are tailored to your Ikigai profile, skills, and career goals from your introspection phase.
              Progress bars show which projects you've already started exploring.
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            {selectedProjects.size > 0 && (
              <Button 
                variant="outline" 
                onClick={regenerateUnselected}
                disabled={projectsLoading || regeneratingProjects.size > 0}
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`w-4 h-4 ${regeneratingProjects.size > 0 ? 'animate-spin' : ''}`} />
                <span>Regenerate Others</span>
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={regenerateProjects}
              disabled={projectsLoading || regeneratingProjects.size > 0}
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${projectsLoading ? 'animate-spin' : ''}`} />
              <span>Regenerate All</span>
            </Button>
          </div>
        </div>
        {selectedProjects.size > 0 && (
          <p className="text-sm text-blue-600 mt-2">
            {selectedProjects.size} project(s) selected to keep. Click "Regenerate Others" to only replace unselected projects.
          </p>
        )}
      </CardHeader>
      <CardContent>
        {projectsLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Generating personalized projects based on your profile...</p>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project) => renderProjectCard(project))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectSelection;
