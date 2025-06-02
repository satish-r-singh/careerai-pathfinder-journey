
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, CheckCircle, Clock, TrendingUp } from 'lucide-react';

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
    <div className="relative">
      {/* Background overlay for premium effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-blue-50/50 rounded-xl" />
      
      <div className="relative z-10">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-3 text-2xl gradient-text">
            <TrendingUp className="w-6 h-6 text-primary" />
            <span>Exploration Progress</span>
          </CardTitle>
          <CardDescription className="text-lg">
            Complete these three key activities to finish the Exploration phase
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">Overall Progress</span>
            <span className="font-bold text-xl gradient-text">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded-full h-4 mb-6 shadow-inner">
            <div 
              className="bg-gradient-to-r from-primary via-accent to-primary h-4 rounded-full transition-all duration-700 ease-out shadow-lg"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className={`group p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-xl ${
              selectedProject 
                ? 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg transform hover:scale-[1.02]' 
                : 'border-gray-200 hover:border-primary/30 hover:bg-white/50'
            }`}>
              <div className="flex items-center space-x-3 mb-3">
                {selectedProject ? (
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Clock className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                  </div>
                )}
                <span className="font-semibold text-lg">Choose Project</span>
              </div>
              <p className="text-sm text-gray-600">Select your focus project from personalized recommendations</p>
            </div>
            
            <div className={`group p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-xl ${
              learningPlanCreated 
                ? 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg transform hover:scale-[1.02]' 
                : selectedProject 
                  ? 'border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 hover:border-primary/50' 
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300'
            }`}>
              <div className="flex items-center space-x-3 mb-3">
                {learningPlanCreated ? (
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                ) : selectedProject ? (
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <Clock className="w-5 h-5 text-blue-500" />
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-gray-400" />
                  </div>
                )}
                <span className="font-semibold text-lg">Build Learning Plan</span>
              </div>
              <p className="text-sm text-gray-600">Create your AI-powered skill development roadmap</p>
            </div>
            
            <div className={`group p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-xl ${
              publicBuildingStarted 
                ? 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg transform hover:scale-[1.02]' 
                : learningPlanCreated 
                  ? 'border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 hover:border-primary/50' 
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300'
            }`}>
              <div className="flex items-center space-x-3 mb-3">
                {publicBuildingStarted ? (
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                ) : learningPlanCreated ? (
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <Clock className="w-5 h-5 text-blue-500" />
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-gray-400" />
                  </div>
                )}
                <span className="font-semibold text-lg">Start Building in Public</span>
              </div>
              <p className="text-sm text-gray-600">Begin documenting and sharing your learning journey</p>
            </div>
          </div>
        </CardContent>
      </div>
    </div>
  );
};

export default ExplorationProgress;
