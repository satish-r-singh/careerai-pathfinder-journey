
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const ProfileForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    user_role: '',
    experience: '',
    background: '',
    ai_interest: '',
    goals: [] as string[],
    timeline: '',
    linkedin_url: ''
  });

  const goalOptions = [
    'Transition to AI/ML Engineer',
    'Become a Data Scientist',
    'Learn AI fundamentals',
    'Build AI products',
    'Get promoted in current role',
    'Start an AI company'
  ];

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setFormData({
          full_name: data.full_name || '',
          user_role: data.user_role || '',
          experience: data.experience || '',
          background: data.background || '',
          ai_interest: data.ai_interest || '',
          goals: data.goals || [],
          timeline: data.timeline || '',
          linkedin_url: data.linkedin_url || ''
        });
      }
    } catch (error: any) {
      toast({
        title: "Error loading profile",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user?.id,
          ...formData,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Profile updated!",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoalChange = (goal: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      goals: checked 
        ? [...prev.goals, goal]
        : prev.goals.filter(g => g !== goal)
    }));
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Complete Your Profile</CardTitle>
        <CardDescription>
          Help us personalize your AI career journey by completing your profile
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                placeholder="Enter your full name"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="user_role">Current Role</Label>
              <Input
                id="user_role"
                value={formData.user_role}
                onChange={(e) => setFormData(prev => ({ ...prev, user_role: e.target.value }))}
                placeholder="e.g., Software Engineer, Marketing Manager"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="experience">Years of Experience</Label>
            <Select value={formData.experience} onValueChange={(value) => setFormData(prev => ({ ...prev, experience: value }))}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select your experience level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-2">0-2 years</SelectItem>
                <SelectItem value="3-5">3-5 years</SelectItem>
                <SelectItem value="6-10">6-10 years</SelectItem>
                <SelectItem value="10+">10+ years</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="background">Professional Background</Label>
            <Textarea
              id="background"
              value={formData.background}
              onChange={(e) => setFormData(prev => ({ ...prev, background: e.target.value }))}
              placeholder="Brief description of your professional background"
              className="mt-1"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="ai_interest">AI Interest</Label>
            <Textarea
              id="ai_interest"
              value={formData.ai_interest}
              onChange={(e) => setFormData(prev => ({ ...prev, ai_interest: e.target.value }))}
              placeholder="What aspects of AI interest you most?"
              className="mt-1"
              rows={3}
            />
          </div>

          <div>
            <Label>Career Goals</Label>
            <div className="grid md:grid-cols-2 gap-3 mt-2">
              {goalOptions.map((goal) => (
                <div key={goal} className="flex items-center space-x-2">
                  <Checkbox
                    id={goal}
                    checked={formData.goals.includes(goal)}
                    onCheckedChange={(checked) => handleGoalChange(goal, checked as boolean)}
                  />
                  <Label htmlFor={goal} className="text-sm font-normal">
                    {goal}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="timeline">Timeline for Career Transition</Label>
            <Select value={formData.timeline} onValueChange={(value) => setFormData(prev => ({ ...prev, timeline: value }))}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select your timeline" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3-months">Within 3 months</SelectItem>
                <SelectItem value="6-months">Within 6 months</SelectItem>
                <SelectItem value="1-year">Within 1 year</SelectItem>
                <SelectItem value="flexible">Flexible timeline</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="linkedin_url">LinkedIn Profile (Optional)</Label>
            <Input
              id="linkedin_url"
              type="url"
              value={formData.linkedin_url}
              onChange={(e) => setFormData(prev => ({ ...prev, linkedin_url: e.target.value }))}
              placeholder="https://linkedin.com/in/yourprofile"
              className="mt-1"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Updating...' : 'Update Profile'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
