
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { generateLearningPlan, LearningPlan as LearningPlanType } from '@/utils/learningPlanGeneration';
import LearningPlan from '@/components/LearningPlan';

interface LearningPlanSectionProps {
  selectedProject: any;
  learningPlanCreated: boolean;
  showLearningPlan: boolean;
  generatedLearningPlan: LearningPlanType | null;
  onLearningPlanCreated: (plan: LearningPlanType) => void;
}

const LearningPlanSection = ({
  selectedProject,
  learningPlanCreated,
  showLearningPlan,
  generatedLearningPlan,
  onLearningPlanCreated
}: LearningPlanSectionProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [generatingPlan, setGeneratingPlan] = useState(false);

  const handleCreateLearningPlan = async () => {
    if (!selectedProject || !user) return;

    setGeneratingPlan(true);
    
    try {
      const userProfile = undefined;
      const ikigaiData = undefined;
      
      const aiLearningPlan = await generateLearningPlan(
        selectedProject,
        userProfile,
        ikigaiData
      );
      
      if (aiLearningPlan) {
        const { error } = await supabase
          .from('learning_plans')
          .insert({
            user_id: user.id,
            project_id: selectedProject.id,
            project_name: selectedProject.name,
            learning_plan_data: aiLearningPlan as any
          });

        if (error) {
          console.error('Error saving learning plan to database:', error);
          toast({
            title: "Error saving learning plan",
            description: "The plan was generated but couldn't be saved. Please try again.",
            variant: "destructive",
          });
        } else {
          onLearningPlanCreated(aiLearningPlan);
          localStorage.setItem(`learning_plan_${user.id}`, 'true');
          
          toast({
            title: "Learning plan created!",
            description: "Your personalized AI learning plan has been generated and saved.",
          });
        }
      } else {
        throw new Error('Failed to generate learning plan');
      }
    } catch (error) {
      console.error('Error generating learning plan:', error);
      toast({
        title: "Error generating learning plan",
        description: "There was an issue creating your personalized learning plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGeneratingPlan(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {learningPlanCreated ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <BookOpen className="w-5 h-5 text-primary" />
          )}
          <span>AI-Generated Learning Plan</span>
        </CardTitle>
        <CardDescription>
          Create a personalized learning plan powered by AI based on your selected project and profile
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!learningPlanCreated ? (
          <div className="space-y-4">
            <p className="text-gray-600">
              Our AI will analyze your selected project, background, and goals to create a completely personalized learning plan that includes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Customized learning phases based on your experience level</li>
              <li>Project-specific skill development roadmap</li>
              <li>Curated resources and tutorials for your exact needs</li>
              <li>Personalized building-in-public strategy</li>
              <li>Success metrics tailored to your goals</li>
            </ul>
            <Button 
              onClick={handleCreateLearningPlan} 
              className="w-full"
              disabled={generatingPlan}
            >
              {generatingPlan ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating Your AI Learning Plan...
                </>
              ) : (
                'Generate My AI Learning Plan'
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-medium text-green-800">AI Learning Plan Generated & Saved!</span>
              </div>
              <p className="text-green-700">Your personalized learning plan has been created using AI and saved to your account. You can access it anytime.</p>
            </div>
            
            {showLearningPlan && generatedLearningPlan && (
              <LearningPlan 
                projectName={selectedProject?.name || ''}
                learningPlan={generatedLearningPlan}
              />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LearningPlanSection;
