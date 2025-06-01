
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, CheckCircle, Clock } from 'lucide-react';

interface ExplorationProgressProps {
  selectedProject: string | null;
  learningPlanCreated: boolean;
  publicBuildingStarted: boolean;
  progressPercentage: number;
}

const ExplorationProgress = ({ 
  selectedProject, 
  learningPlanCreated, 
  publicBuildingStarted, 
  progressPercentage 
}: ExplorationProgressProps) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-primary" />
          <span>Exploration Progress</span>
        </CardTitle>
        <CardDescription>
          Complete these three key activities to finish the Exploration phase
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-600">Overall Progress</span>
          <span className="font-semibold">{progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
          <div 
            className="bg-gradient-to-r from-primary to-accent h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg border-2 transition-all ${selectedProject ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
            <div className="flex items-center space-x-2 mb-2">
              {selectedProject ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <Clock className="w-5 h-5 text-gray-400" />
              )}
              <span className="font-medium">Choose Project</span>
            </div>
            <p className="text-sm text-gray-600">Select your focus project</p>
          </div>
          
          <div className={`p-4 rounded-lg border-2 transition-all ${learningPlanCreated ? 'border-green-200 bg-green-50' : selectedProject ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}>
            <div className="flex items-center space-x-2 mb-2">
              {learningPlanCreated ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : selectedProject ? (
                <Clock className="w-5 h-5 text-blue-500" />
              ) : (
                <Clock className="w-5 h-5 text-gray-400" />
              )}
              <span className="font-medium">Build Learning Plan</span>
            </div>
            <p className="text-sm text-gray-600">Create your skill development roadmap</p>
          </div>
          
          <div className={`p-4 rounded-lg border-2 transition-all ${publicBuildingStarted ? 'border-green-200 bg-green-50' : learningPlanCreated ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}>
            <div className="flex items-center space-x-2 mb-2">
              {publicBuildingStarted ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : learningPlanCreated ? (
                <Clock className="w-5 h-5 text-blue-500" />
              ) : (
                <Clock className="w-5 h-5 text-gray-400" />
              )}
              <span className="font-medium">Start Building in Public</span>
            </div>
            <p className="text-sm text-gray-600">Begin documenting your journey</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExplorationProgress;
