
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';

interface IkigaiStepProps {
  step: {
    category: string;
    title: string;
    description: string;
    questions: string[];
  };
  initialData: string[];
  onDataChange: (responses: string[]) => void;
}

const IkigaiStep = ({ step, initialData, onDataChange }: IkigaiStepProps) => {
  const [responses, setResponses] = useState<string[]>([]);
  const [currentResponse, setCurrentResponse] = useState('');

  // Initialize responses when step changes or initialData changes
  useEffect(() => {
    console.log('IkigaiStep: Initializing responses for category:', step.category, 'with data:', initialData);
    setResponses(initialData || []);
    setCurrentResponse(''); // Clear the current input when switching steps
  }, [step.category, JSON.stringify(initialData)]); // Use JSON.stringify for deep comparison

  // Only call onDataChange when responses actually change and are different from initialData
  useEffect(() => {
    const responsesString = JSON.stringify(responses);
    const initialDataString = JSON.stringify(initialData || []);
    
    if (responsesString !== initialDataString && responses.length >= 0) {
      console.log('IkigaiStep: Calling onDataChange for category:', step.category, 'with responses:', responses);
      onDataChange(responses);
    }
  }, [responses, initialData, onDataChange, step.category]);

  const addResponse = useCallback(() => {
    if (currentResponse.trim()) {
      const newResponses = [...responses, currentResponse.trim()];
      setResponses(newResponses);
      setCurrentResponse('');
    }
  }, [currentResponse, responses]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      addResponse();
    }
  }, [addResponse]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{step.title}</CardTitle>
        <p className="text-gray-600">{step.description}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-medium">Reflect on these questions:</h4>
          <ul className="space-y-2">
            {step.questions.map((question, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-medium mt-0.5 flex-shrink-0">
                  {index + 1}
                </span>
                <span className="text-gray-700">{question}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="font-medium">Your thoughts and insights:</label>
            <Textarea
              value={currentResponse}
              onChange={(e) => setCurrentResponse(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Share your thoughts, ideas, or specific examples..."
              className="min-h-[150px] resize-none"
            />
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">Press Ctrl+Enter to add</p>
              <Button onClick={addResponse} disabled={!currentResponse.trim()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Response
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IkigaiStep;
