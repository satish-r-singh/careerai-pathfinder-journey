
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';
import IkigaiStep from './IkigaiStep';
import IkigaiResults from './IkigaiResults';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface IkigaiData {
  passion: string[];
  mission: string[];
  profession: string[];
  vocation: string[];
}

const ikigaiQuestions = [
  {
    category: 'passion',
    title: 'What You Love',
    description: 'Discover your passions and what energizes you',
    questions: [
      'What activities make you lose track of time?',
      'What topics do you enjoy discussing for hours?',
      'What brings you the most joy in your daily life?',
      'What would you do if money wasn\'t a factor?'
    ]
  },
  {
    category: 'mission',
    title: 'What the World Needs',
    description: 'Identify how you can contribute to society',
    questions: [
      'What problems in the world concern you most?',
      'How do you want to make a positive impact?',
      'What social or environmental issues motivate you?',
      'What legacy do you want to leave behind?'
    ]
  },
  {
    category: 'profession',
    title: 'What You\'re Good At',
    description: 'Recognize your skills and talents',
    questions: [
      'What skills do people often compliment you on?',
      'What tasks do you complete more easily than others?',
      'What achievements are you most proud of?',
      'What do colleagues ask for your help with?'
    ]
  },
  {
    category: 'vocation',
    title: 'What You Can Be Paid For',
    description: 'Explore monetizable skills and opportunities',
    questions: [
      'What skills have market demand in your industry?',
      'What services could you provide that people would pay for?',
      'What career paths align with your expertise?',
      'What emerging opportunities excite you professionally?'
    ]
  }
];

const IkigaiDiscovery = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [ikigaiData, setIkigaiData] = useState<IkigaiData>({
    passion: [],
    mission: [],
    profession: [],
    vocation: []
  });
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSavedProgress();
  }, [user]);

  const loadSavedProgress = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('ikigai_progress')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (data) {
        // Safely cast the Json data to our IkigaiData interface
        const savedIkigaiData = data.ikigai_data as unknown as IkigaiData;
        setIkigaiData(savedIkigaiData || {
          passion: [],
          mission: [],
          profession: [],
          vocation: []
        });
        setCurrentStep(data.current_step || 0);
        setIsCompleted(data.is_completed || false);
      }
    } catch (error) {
      console.error('Error loading saved progress:', error);
    }
  };

  const saveProgress = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('ikigai_progress')
        .upsert({
          user_id: user.id,
          ikigai_data: ikigaiData as any,
          current_step: currentStep,
          is_completed: isCompleted,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Progress saved!",
        description: "Your Ikigai discovery progress has been saved.",
      });
    } catch (error: any) {
      toast({
        title: "Error saving progress",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStepData = (category: string, responses: string[]) => {
    setIkigaiData(prev => ({
      ...prev,
      [category]: responses
    }));
  };

  const nextStep = () => {
    if (currentStep < ikigaiQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
      saveProgress();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = ((currentStep + 1) / ikigaiQuestions.length) * 100;

  if (isCompleted) {
    return <IkigaiResults ikigaiData={ikigaiData} onRestart={() => setIsCompleted(false)} />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Ikigai Discovery Journey</span>
            <Button variant="outline" onClick={saveProgress} disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : 'Save Progress'}
            </Button>
          </CardTitle>
          <CardDescription>
            Discover your purpose by exploring the intersection of what you love, what you're good at, 
            what the world needs, and what you can be paid for.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Step {currentStep + 1} of {ikigaiQuestions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>

          <IkigaiStep
            step={ikigaiQuestions[currentStep]}
            initialData={ikigaiData[ikigaiQuestions[currentStep].category as keyof IkigaiData]}
            onDataChange={(responses) => handleStepData(ikigaiQuestions[currentStep].category, responses)}
          />

          <div className="flex justify-between pt-6">
            <Button 
              variant="outline" 
              onClick={prevStep} 
              disabled={currentStep === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            <Button onClick={nextStep}>
              {currentStep === ikigaiQuestions.length - 1 ? 'Complete Discovery' : 'Next'}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IkigaiDiscovery;
