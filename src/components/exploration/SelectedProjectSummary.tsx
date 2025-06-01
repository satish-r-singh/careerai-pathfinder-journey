
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { getIconComponent } from '@/utils/iconUtils';

interface SelectedProjectSummaryProps {
  project: any;
}

const SelectedProjectSummary = ({ project }: SelectedProjectSummaryProps) => {
  if (!project) return null;

  const IconComponent = getIconComponent(project.iconName || 'Code');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <span>Selected Project</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <IconComponent className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{project.name}</h3>
            <p className="text-gray-600">{project.description}</p>
            {project.reasoning && (
              <p className="text-sm text-green-700 mt-1">
                <strong>Perfect for you because:</strong> {project.reasoning}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SelectedProjectSummary;
