import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Lightbulb, AlertTriangle, TrendingUp, TrendingDown, Brain, Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Delta4Response {
  id: string;
  category: 'friction' | 'delight';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  timestamp: string;
}

const Delta4Analysis = () => {
  const { toast } = useToast();
  const [responses, setResponses] = useState<Delta4Response[]>([
    {
      id: '1',
      category: 'friction',
      title: 'Application Process Too Complex',
      description: 'The application process for TechCorp requires 6 different steps and multiple document uploads, making it time-consuming and frustrating.',
      impact: 'high',
      actionable: true,
      timestamp: '2024-01-10T10:30:00Z'
    },
    {
      id: '2',
      category: 'delight',
      title: 'Excellent Interview Experience',
      description: 'The interview process at StartupXYZ was well-structured, transparent, and the interviewers were genuinely interested in my background.',
      impact: 'high',
      actionable: false,
      timestamp: '2024-01-09T14:15:00Z'
    },
    {
      id: '3',
      category: 'friction',
      title: 'Lack of Salary Transparency',
      description: 'Many job postings do not include salary ranges, making it difficult to assess if positions align with expectations.',
      impact: 'medium',
      actionable: true,
      timestamp: '2024-01-08T09:20:00Z'
    }
  ]);

  const [currentPrompt, setCurrentPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const delta4Prompts = [
    {
      category: 'Experience',
      prompt: "Describe a recent job search experience. What made it particularly smooth or frustrating?",
      icon: Brain
    },
    {
      category: 'Process',
      prompt: "Think about the application or interview process. What steps felt unnecessary or especially valuable?",
      icon: Target
    },
    {
      category: 'Communication',
      prompt: "How did companies communicate with you? What communication patterns delighted or frustrated you?",
      icon: Lightbulb
    },
    {
      category: 'Outcome',
      prompt: "Reflect on any rejections or offers. What surprised you (positively or negatively) about the experience?",
      icon: TrendingUp
    }
  ];

  const analyzeResponse = async () => {
    if (!currentPrompt.trim()) return;
    
    setIsAnalyzing(true);
    
    try {
      console.log('Sending response for Delta 4 analysis:', currentPrompt);
      
      const { data, error } = await supabase.functions.invoke('delta4-analysis', {
        body: { userResponse: currentPrompt }
      });

      if (error) throw error;

      console.log('Received analysis:', data);

      const analysis = data.analysis;
      const newResponse: Delta4Response = {
        id: Date.now().toString(),
        category: analysis.category,
        title: analysis.title,
        description: analysis.description,
        impact: analysis.impact,
        actionable: analysis.actionable,
        timestamp: new Date().toISOString()
      };
      
      setResponses([newResponse, ...responses]);
      setCurrentPrompt('');
      
      toast({
        title: "Analysis Complete",
        description: `Identified a ${analysis.category} point with ${analysis.impact} impact.`,
      });
    } catch (error) {
      console.error('Error analyzing response:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze your response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const frictionPoints = responses.filter(r => r.category === 'friction');
  const delightPoints = responses.filter(r => r.category === 'delight');

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Delta 4 Overview */}
      <Card className="premium-card">
        <CardHeader>
          <CardTitle className="gradient-text">Delta 4 Analysis</CardTitle>
          <CardDescription>
            Identify friction and delight points in your job search journey to optimize your approach
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-red-50 rounded-lg border border-red-100">
              <TrendingDown className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-600">{frictionPoints.length}</div>
              <div className="text-sm text-red-700">Friction Points</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{delightPoints.length}</div>
              <div className="text-sm text-green-700">Delight Points</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
              <Lightbulb className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">
                {responses.filter(r => r.actionable).length}
              </div>
              <div className="text-sm text-blue-700">Actionable Insights</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delta 4 Prompt Interface */}
      <Card className="premium-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5" />
            <span>Reflection Prompts</span>
          </CardTitle>
          <CardDescription>Use these prompts to identify patterns in your job search experience</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {delta4Prompts.map((prompt, index) => {
              const Icon = prompt.icon;
              return (
                <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow duration-200 border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Icon className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-sm mb-1">{prompt.category}</h4>
                        <p className="text-sm text-gray-600">{prompt.prompt}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="space-y-4">
            <Textarea
              placeholder="Share your thoughts about a recent job search experience. What frustrated you or brought you joy?"
              value={currentPrompt}
              onChange={(e) => setCurrentPrompt(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {currentPrompt.length}/500 characters
              </div>
              <Button 
                onClick={analyzeResponse}
                disabled={!currentPrompt.trim() || isAnalyzing}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {isAnalyzing ? (
                  <>
                    <Brain className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Analyze Response
                  </>
                )}
              </Button>
            </div>
            {isAnalyzing && (
              <div className="space-y-2">
                <div className="text-sm text-gray-600">AI is analyzing your response...</div>
                <Progress value={66} className="h-2" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Friction Points */}
        <Card className="premium-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-700">
              <AlertTriangle className="w-5 h-5" />
              <span>Friction Points</span>
            </CardTitle>
            <CardDescription>Areas causing frustration or obstacles in your job search</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {frictionPoints.map((point) => (
                <Card key={point.id} className="border-l-4 border-l-red-500">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-sm">{point.title}</h4>
                        <div className="flex space-x-2">
                          <Badge className={`text-xs ${getImpactColor(point.impact)}`}>
                            {point.impact} impact
                          </Badge>
                          {point.actionable && (
                            <Badge variant="outline" className="text-xs">
                              Actionable
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{point.description}</p>
                      <div className="text-xs text-gray-400">
                        {new Date(point.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {frictionPoints.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No friction points identified yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Delight Points */}
        <Card className="premium-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-700">
              <TrendingUp className="w-5 h-5" />
              <span>Delight Points</span>
            </CardTitle>
            <CardDescription>Positive experiences and successful patterns to replicate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {delightPoints.map((point) => (
                <Card key={point.id} className="border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-sm">{point.title}</h4>
                        <div className="flex space-x-2">
                          <Badge className={`text-xs ${getImpactColor(point.impact)}`}>
                            {point.impact} impact
                          </Badge>
                          {point.actionable && (
                            <Badge variant="outline" className="text-xs">
                              Actionable
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{point.description}</p>
                      <div className="text-xs text-gray-400">
                        {new Date(point.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {delightPoints.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No delight points identified yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Delta4Analysis;
