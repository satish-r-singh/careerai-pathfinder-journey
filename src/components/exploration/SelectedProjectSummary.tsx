
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Sparkles } from 'lucide-react';
import { getIconComponent } from '@/utils/iconUtils';

interface SelectedProjectSummaryProps {
  project: any;
}

const SelectedProjectSummary = ({ project }: SelectedProjectSummaryProps) => {
  if (!project) return null;

  const IconComponent = getIconComponent(project.iconName || 'Code');

  return (
    <Card className="premium-card animate-scale-in relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50/80 via-emerald-50/50 to-cyan-50/30" />
      
      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center space-x-3 text-xl gradient-text">
          <CheckCircle className="w-6 h-6 text-green-500" />
          <span>Selected Project</span>
          <Sparkles className="w-5 h-5 text-yellow-500" />
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="flex items-start space-x-6 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center shadow-md">
            <IconComponent className="w-8 h-8 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-xl text-gray-800 mb-2">{project.name}</h3>
            <p className="text-gray-700 mb-3 leading-relaxed">{project.description}</p>
            {project.reasoning && (
              <div className="p-4 bg-white/70 rounded-lg border border-green-100">
                <p className="text-sm text-green-800">
                  <span className="font-semibold">Perfect for you because:</span> {project.reasoning}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SelectedProjectSummary;
