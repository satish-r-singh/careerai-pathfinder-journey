
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ikigaiQuestions } from '@/constants/ikigaiQuestions';

interface IkigaiData {
  passion: string[];
  mission: string[];
  profession: string[];
  vocation: string[];
}

interface IkigaiSidebarProps {
  ikigaiData: IkigaiData;
  currentStep: number;
}

const IkigaiSidebar = ({ ikigaiData, currentStep }: IkigaiSidebarProps) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'passion':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'mission':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'profession':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'vocation':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="w-80 space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Your Journey Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ScrollArea className="h-[600px] pr-4">
            {ikigaiQuestions.map((step, index) => {
              const categoryData = ikigaiData[step.category as keyof IkigaiData] || [];
              const isCurrentStep = index === currentStep;
              const isCompleted = categoryData.length > 0;
              
              return (
                <div
                  key={step.category}
                  className={`mb-4 p-3 rounded-lg border transition-all ${
                    isCurrentStep 
                      ? 'border-primary bg-primary/5 shadow-sm' 
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        isCurrentStep 
                          ? 'bg-primary text-primary-foreground' 
                          : isCompleted 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-200 text-gray-600'
                      }`}>
                        {index + 1}
                      </span>
                      <h4 className={`font-medium text-sm ${
                        isCurrentStep ? 'text-primary' : 'text-gray-700'
                      }`}>
                        {step.title}
                      </h4>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getCategoryColor(step.category)}`}
                    >
                      {step.category}
                    </Badge>
                  </div>
                  
                  {categoryData.length > 0 ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Responses:</span>
                        <Badge variant="secondary" className="text-xs">
                          {categoryData.length}
                        </Badge>
                      </div>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {categoryData.map((response, responseIndex) => (
                          <div
                            key={responseIndex}
                            className="text-xs p-2 bg-gray-50 rounded border text-gray-700 leading-relaxed"
                          >
                            {response.length > 80 
                              ? `${response.substring(0, 80)}...` 
                              : response
                            }
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400 italic">
                      {isCurrentStep ? 'Add your responses above' : 'No responses yet'}
                    </div>
                  )}
                </div>
              );
            })}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default IkigaiSidebar;
