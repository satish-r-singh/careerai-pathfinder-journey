
import { useAuth } from '@/contexts/AuthContext';

interface WelcomeSectionProps {
  currentPhase: number;
  getCurrentPhaseName: () => string;
}

const WelcomeSection = ({ currentPhase, getCurrentPhaseName }: WelcomeSectionProps) => {
  const { user } = useAuth();

  return (
    <div className="mb-12 text-center relative overflow-hidden rounded-3xl">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1920&q=80')`
      }} />
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 via-blue-900/70 to-purple-900/80 backdrop-blur-sm" />
      
      <div className="relative z-10 py-16 px-8">
        <h1 className="text-5xl font-bold text-white mb-4 animate-fade-in drop-shadow-lg">
          Welcome back, {user?.user_metadata?.full_name || user?.email}! 👋
        </h1>
        <p className="text-xl text-white/90 max-w-3xl mx-auto animate-slide-up drop-shadow-md">
          You're in the <span className="font-semibold text-accent-foreground bg-accent/20 px-2 py-1 rounded-lg">{getCurrentPhaseName()}</span> phase. 
          {currentPhase === 1 ? " Let's continue building your AI career foundation." : currentPhase === 2 ? " Time to explore projects and build your skills!" : " You can now work on both reflection activities and job applications!"}
        </p>
      </div>
    </div>
  );
};

export default WelcomeSection;
