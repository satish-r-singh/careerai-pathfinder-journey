
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, CheckCircle, Lightbulb } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { LearningPlan } from '@/utils/learningPlanGeneration';

interface BuildingInPublicSectionProps {
  selectedProject: any;
  learningPlanCreated: boolean;
  publicBuildingStarted: boolean;
  buildingInPublicPlan: any;
  generatedLearningPlan: LearningPlan | null;
  onBuildingPlanCreated: (plan: any) => void;
}

const BuildingInPublicSection = ({
  selectedProject,
  learningPlanCreated,
  publicBuildingStarted,
  buildingInPublicPlan,
  generatedLearningPlan,
  onBuildingPlanCreated
}: BuildingInPublicSectionProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [generatingBuildingPlan, setGeneratingBuildingPlan] = useState(false);

  const handleStartPublicBuilding = async () => {
    if (!selectedProject || !user) return;

    setGeneratingBuildingPlan(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-building-plan', {
        body: {
          project: selectedProject,
          learningPlan: generatedLearningPlan
        }
      });

      if (error) {
        throw error;
      }

      if (data) {
        const { error: saveError } = await supabase
          .from('building_in_public_plans')
          .insert({
            user_id: user.id,
            project_id: selectedProject.id,
            project_name: selectedProject.name,
            plan_data: data as any
          });

        if (saveError) {
          console.error('Error saving building in public plan to database:', saveError);
          toast({
            title: "Error saving building plan",
            description: "The plan was generated but couldn't be saved. Please try again.",
            variant: "destructive",
          });
        } else {
          onBuildingPlanCreated(data);
          localStorage.setItem(`public_building_${user.id}`, 'true');
          
          toast({
            title: "Building in public plan created!",
            description: "Your personalized building strategy has been generated and saved.",
          });
        }
      } else {
        throw new Error('Failed to generate building in public plan');
      }
    } catch (error) {
      console.error('Error generating building in public plan:', error);
      toast({
        title: "Error generating building plan",
        description: "There was an issue creating your building in public strategy. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGeneratingBuildingPlan(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {publicBuildingStarted ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <Users className="w-5 h-5 text-primary" />
          )}
          <span>AI-Generated Building in Public Strategy</span>
        </CardTitle>
        <CardDescription>
          Get a personalized strategy for documenting and sharing your learning journey
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!publicBuildingStarted ? (
          <div className="space-y-4">
            <p className="text-gray-600">
              Our AI will create a customized building-in-public strategy based on your project and learning plan:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Personalized content calendar and posting schedule</li>
              <li>Platform-specific content recommendations</li>
              <li>Milestone celebration ideas tailored to your project</li>
              <li>Networking strategies for your specific field</li>
              <li>Templates for sharing progress updates</li>
            </ul>
            <Button 
              onClick={handleStartPublicBuilding} 
              className="w-full"
              disabled={!learningPlanCreated || generatingBuildingPlan}
            >
              {generatingBuildingPlan ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating Your Building Strategy...
                </>
              ) : learningPlanCreated ? (
                'Generate My Building in Public Strategy'
              ) : (
                'Complete Learning Plan First'
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-medium text-green-800">Building in Public Strategy Generated!</span>
              </div>
              <p className="text-green-700">Your personalized building strategy has been created and saved to your account.</p>
            </div>
            
            {buildingInPublicPlan && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Recommended Platforms</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {buildingInPublicPlan.platforms?.map((platform: string, index: number) => (
                        <Badge key={index} variant="outline">{platform}</Badge>
                      ))}
                    </div>
                    
                    <h4 className="font-medium mb-3">Content Strategy</h4>
                    <ul className="space-y-2">
                      {buildingInPublicPlan.contentStrategy?.map((item: string, index: number) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                          <Lightbulb className="w-3 h-3 mt-1 text-yellow-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Posting Schedule</h4>
                    <div className="bg-blue-50 p-3 rounded-lg mb-4">
                      <p className="text-sm text-blue-800">{buildingInPublicPlan.postingSchedule}</p>
                    </div>
                    
                    <h4 className="font-medium mb-3">Networking Tips</h4>
                    <ul className="space-y-2">
                      {buildingInPublicPlan.networkingTips?.map((tip: string, index: number) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                          <Users className="w-3 h-3 mt-1 text-purple-500" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                {buildingInPublicPlan.milestoneIdeas && (
                  <div>
                    <h4 className="font-medium mb-3">Milestone Celebration Ideas</h4>
                    <div className="grid md:grid-cols-3 gap-3">
                      {buildingInPublicPlan.milestoneIdeas.map((idea: string, index: number) => (
                        <div key={index} className="p-3 bg-green-50 rounded-lg">
                          <p className="text-sm text-green-800">{idea}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BuildingInPublicSection;
