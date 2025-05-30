
import { useState, useEffect, useCallback, useRef } from 'react';
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
  const previousStepRef = useRef<string>('');
  const isInitializedRef = useRef(false);

  // Initialize responses only when step category changes or on first load
  useEffect(() => {
    if (step.category !== previousStepRef.current || !isInitializedRef.current) {
      console.log('IkigaiStep: Initializing responses for category:', step.category, 'with data:', initialData);
      setResponses(initialData || []);
      setCurrentResponse(''); // Clear the current input when switching steps
      previousStepRef.current = step.category;
      isInitializedRef.current = true;
    }
  }, [step.category, initialData]);

  // Call onDataChange when responses change, but not during initialization
  useEffect(() => {
    if (isInitializedRef.current && responses.length >= 0) {
      const responsesString = JSON.stringify(responses);
      const initialDataString = JSON.stringify(initialData || []);
      
      // Only call onDataChange if the responses are different from initialData
      if (responsesString !== initialDataString) {
        console.log('IkigaiStep: Calling onDataChange for category:', step.category, 'with responses:', responses);
        onDataChange(responses);
      }
    }
  }, [responses, onDataChange, step.category, initialData]);

  const addResponse = useCallback(() => {
    if (currentResponse.trim()) {
      const newResponses = [...responses, currentResponse.trim()];
      console.log('Adding new response:', currentResponse.trim(), 'to category:', step.category);
      setResponses(newResponses);
      setCurrentResponse('');
    }
  }, [currentResponse, responses, step.category]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      addResponse();
    }
  }, [addResponse]);

  const removeResponse = useCallback((index: number) => {
    const newResponses = responses.filter((_, i) => i !== index);
    console.log('Removing response at index:', index, 'from category:', step.category);
    setResponses(newResponses);
  }, [responses, step.category]);

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

        {/* Display existing responses */}
        {responses.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Your responses:</h4>
            <div className="space-y-2">
              {responses.map((response, index) => (
                <div key={index} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg border">
                  <span className="text-gray-700 flex-1">{response}</span>
                  <button
                    onClick={() => removeResponse(index)}
                    className="text-red-500 hover:text-red-700 ml-2 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="font-medium">Add your thoughts and insights:</label>
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
