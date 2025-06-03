
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ProgressBar from '@/components/ProgressBar';
import { TrendingUp } from 'lucide-react';

interface ProgressOverviewProps {
  currentPhase: number;
}

const ProgressOverview = ({ currentPhase }: ProgressOverviewProps) => {
  return (
    <Card className="mb-12 premium-card animate-scale-in relative overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10" style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1920&q=80')`
      }} />
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-blue-50/50" />
      
      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center space-x-3 text-2xl gradient-text">
          <TrendingUp className="w-6 h-6 text-primary" />
          <span>Your Progress</span>
        </CardTitle>
        <CardDescription className="text-lg">
          Track your journey through the 4-phase career transition program
        </CardDescription>
      </CardHeader>
      <CardContent className="relative z-10">
        <ProgressBar currentPhase={currentPhase} totalPhases={4} />
      </CardContent>
    </Card>
  );
};

export default ProgressOverview;
