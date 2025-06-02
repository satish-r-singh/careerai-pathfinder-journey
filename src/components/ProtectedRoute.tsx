
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileLoading, setProfileLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const checkProfile = async () => {
      if (user && !loading) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('full_name, user_role, experience')
            .eq('id', user.id)
            .single();

          if (error && error.code !== 'PGRST116') {
            console.error('Error fetching profile:', error);
          }

          // Check if user has completed basic onboarding info
          const profileComplete = data && data.full_name && data.user_role && data.experience;
          setHasProfile(!!profileComplete);

          // Redirect to onboarding if profile is incomplete and not already on onboarding page
          if (!profileComplete && location.pathname !== '/onboarding') {
            navigate('/onboarding');
          }
        } catch (error) {
          console.error('Error checking profile:', error);
        } finally {
          setProfileLoading(false);
        }
      }
    };

    checkProfile();
  }, [user, loading, navigate, location.pathname]);

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold">C</span>
          </div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Allow access to onboarding page even without complete profile
  if (location.pathname === '/onboarding') {
    return <>{children}</>;
  }

  // Require complete profile for all other protected routes
  if (!hasProfile) {
    return null; // Will be redirected to onboarding
  }

  return <>{children}</>;
};

export default ProtectedRoute;
