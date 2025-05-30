
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, ExternalLink, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Profile {
  id: string;
  full_name: string | null;
  user_role: string | null;
  experience: string | null;
  background: string | null;
  ai_interest: string | null;
  goals: string[] | null;
  timeline: string | null;
  linkedin_url: string | null;
  created_at: string;
  updated_at: string;
}

interface ProfileDisplayProps {
  onEdit: () => void;
}

const ProfileDisplay = ({ onEdit }: ProfileDisplayProps) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

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

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center">Loading profile...</div>
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Profile Not Found</CardTitle>
          <CardDescription>
            Complete your profile to get personalized recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={onEdit}>
            <User className="w-4 h-4 mr-2" />
            Create Profile
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>{profile.full_name || 'Anonymous User'}</span>
            </CardTitle>
            <CardDescription>
              {profile.user_role && `${profile.user_role} • `}
              {profile.experience && `${profile.experience} experience`}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {profile.background && (
          <div>
            <h4 className="font-semibold mb-2">Professional Background</h4>
            <p className="text-gray-600">{profile.background}</p>
          </div>
        )}

        {profile.ai_interest && (
          <div>
            <h4 className="font-semibold mb-2">AI Interest</h4>
            <p className="text-gray-600">{profile.ai_interest}</p>
          </div>
        )}

        {profile.goals && profile.goals.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">Career Goals</h4>
            <div className="flex flex-wrap gap-2">
              {profile.goals.map((goal, index) => (
                <Badge key={index} variant="secondary">
                  {goal}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {profile.timeline && (
          <div>
            <h4 className="font-semibold mb-2">Timeline</h4>
            <Badge variant="outline">{profile.timeline}</Badge>
          </div>
        )}

        {profile.linkedin_url && (
          <div>
            <h4 className="font-semibold mb-2">LinkedIn</h4>
            <Button variant="outline" size="sm" asChild>
              <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Profile
              </a>
            </Button>
          </div>
        )}

        <div className="text-sm text-gray-500 pt-4 border-t">
          <p>Profile created: {new Date(profile.created_at).toLocaleDateString()}</p>
          <p>Last updated: {new Date(profile.updated_at).toLocaleDateString()}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileDisplay;
