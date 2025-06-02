
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
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (user && !loading) {
        try {
          // Check onboarding progress table first
          const { data: onboardingProgress, error: onboardingError } = await supabase
            .from('onboarding_progress')
            .select('is_completed')
            .eq('user_id', user.id)
            .maybeSingle();

          if (onboardingError && onboardingError.code !== 'PGRST116') {
            console.error('Error fetching onboarding progress:', onboardingError);
          }

          // If onboarding is explicitly completed, allow access
          if (onboardingProgress?.is_completed) {
            setHasCompletedOnboarding(true);
            setProfileLoading(false);
            return;
          }

          // Fallback: Check if profile has basic required fields
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('full_name, user_role, experience')
            .eq('id', user.id)
            .maybeSingle();

          if (profileError && profileError.code !== 'PGRST116') {
            console.error('Error fetching profile:', profileError);
          }

          // Check if user has completed basic onboarding info
          const profileComplete = profile && profile.full_name && profile.user_role && profile.experience;
          
          if (profileComplete) {
            setHasCompletedOnboarding(true);
          } else if (location.pathname !== '/onboarding') {
            // Redirect to onboarding if profile is incomplete and not already on onboarding page
            navigate('/onboarding');
          }
        } catch (error) {
          console.error('Error checking onboarding status:', error);
        } finally {
          setProfileLoading(false);
        }
      }
    };

    checkOnboardingStatus();
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

  // Require completed onboarding for all other protected routes
  if (!hasCompletedOnboarding) {
    return null; // Will be redirected to onboarding
  }

  return <>{children}</>;
};

export default ProtectedRoute;
