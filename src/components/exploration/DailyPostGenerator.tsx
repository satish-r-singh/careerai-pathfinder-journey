
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Share2, Linkedin, Twitter, RefreshCw, Copy } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { usePersonalizedProjects } from '@/hooks/usePersonalizedProjects';
import { supabase } from '@/integrations/supabase/client';

interface DailyPostGeneratorProps {
  projectProgress: Record<string, { learningPlan: boolean; buildingPlan: boolean }>;
}

const DailyPostGenerator = ({ projectProgress }: DailyPostGeneratorProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { projects } = usePersonalizedProjects();
  const [generatingPosts, setGeneratingPosts] = useState(false);
  const [linkedinPost, setLinkedinPost] = useState('');
  const [twitterPost, setTwitterPost] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<'linkedin' | 'twitter' | 'both'>('both');

  const getProjectsWithProgress = () => {
    return projects.filter(project => projectProgress[project.id]);
  };

  const handleGeneratePosts = async () => {
    if (!user) return;

    const projectsWithProgress = getProjectsWithProgress();
    if (projectsWithProgress.length === 0) {
      toast({
        title: "No projects in progress",
        description: "Start exploring projects to generate build-in-public posts.",
        variant: "destructive",
      });
      return;
    }

    setGeneratingPosts(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-daily-posts', {
        body: {
          projects: projectsWithProgress,
          projectProgress,
          platform: selectedPlatform
        }
      });

      if (error) {
        throw error;
      }

      if (data) {
        if (data.linkedinPost) setLinkedinPost(data.linkedinPost);
        if (data.twitterPost) setTwitterPost(data.twitterPost);
        
        toast({
          title: "Posts generated successfully!",
          description: "Your daily build-in-public posts are ready to share.",
        });
      }
    } catch (error) {
      console.error('Error generating posts:', error);
      toast({
        title: "Error generating posts",
        description: "There was an issue creating your posts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGeneratingPosts(false);
    }
  };

  const copyToClipboard = async (text: string, platform: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: `${platform} post copied!`,
        description: "The post has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard. Please select and copy manually.",
        variant: "destructive",
      });
    }
  };

  const projectsWithProgress = getProjectsWithProgress();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Share2 className="w-5 h-5 text-primary" />
          <span>Daily Build-in-Public Post Generator</span>
        </CardTitle>
        <CardDescription>
          Generate AI-powered social media posts about your project progress to share with your network
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {projectsWithProgress.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Projects in Progress</h3>
            <p className="text-gray-600">
              Start exploring projects above to generate personalized build-in-public posts about your journey.
            </p>
          </div>
        ) : (
          <>
            {/* Projects in Progress */}
            <div>
              <h4 className="font-medium mb-3">Projects You're Building</h4>
              <div className="flex flex-wrap gap-2">
                {projectsWithProgress.map((project) => {
                  const progress = projectProgress[project.id];
                  return (
                    <Badge key={project.id} variant="outline" className="flex items-center space-x-2">
                      <span>{project.name}</span>
                      {progress.learningPlan && <span className="text-green-600">📚</span>}
                      {progress.buildingPlan && <span className="text-blue-600">🚀</span>}
                    </Badge>
                  );
                })}
              </div>
            </div>

            {/* Platform Selection */}
            <div>
              <h4 className="font-medium mb-3">Select Platform</h4>
              <div className="flex space-x-2">
                <Button
                  variant={selectedPlatform === 'linkedin' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedPlatform('linkedin')}
                  className="flex items-center space-x-2"
                >
                  <Linkedin className="w-4 h-4" />
                  <span>LinkedIn</span>
                </Button>
                <Button
                  variant={selectedPlatform === 'twitter' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedPlatform('twitter')}
                  className="flex items-center space-x-2"
                >
                  <Twitter className="w-4 h-4" />
                  <span>Twitter</span>
                </Button>
                <Button
                  variant={selectedPlatform === 'both' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedPlatform('both')}
                >
                  Both
                </Button>
              </div>
            </div>

            {/* Generate Button */}
            <Button 
              onClick={handleGeneratePosts} 
              disabled={generatingPosts}
              className="w-full"
            >
              {generatingPosts ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Generating Posts...
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 mr-2" />
                  Generate Daily Posts
                </>
              )}
            </Button>

            {/* Generated Posts */}
            {(linkedinPost || twitterPost) && (
              <div className="space-y-4">
                {linkedinPost && (selectedPlatform === 'linkedin' || selectedPlatform === 'both') && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium flex items-center space-x-2">
                        <Linkedin className="w-4 h-4 text-blue-600" />
                        <span>LinkedIn Post</span>
                      </h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(linkedinPost, 'LinkedIn')}
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </Button>
                    </div>
                    <Textarea
                      value={linkedinPost}
                      onChange={(e) => setLinkedinPost(e.target.value)}
                      placeholder="Your LinkedIn post will appear here..."
                      className="min-h-[120px]"
                    />
                  </div>
                )}

                {twitterPost && (selectedPlatform === 'twitter' || selectedPlatform === 'both') && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium flex items-center space-x-2">
                        <Twitter className="w-4 h-4 text-blue-400" />
                        <span>Twitter Post</span>
                      </h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(twitterPost, 'Twitter')}
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </Button>
                    </div>
                    <Textarea
                      value={twitterPost}
                      onChange={(e) => setTwitterPost(e.target.value)}
                      placeholder="Your Twitter post will appear here..."
                      className="min-h-[100px]"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Character count: {twitterPost.length}/280
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyPostGenerator;
