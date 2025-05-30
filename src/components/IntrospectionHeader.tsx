
import { Button } from '@/components/ui/button';
import { Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const IntrospectionHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      <Button 
        variant="outline" 
        onClick={() => navigate('/dashboard')}
        className="mb-6 bg-white/80 backdrop-blur-sm border-purple-200 hover:bg-purple-50 transition-all duration-300"
      >
        ← Back to Dashboard
      </Button>
      
      <div className="text-center mb-8">
        <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm border border-purple-200/50 rounded-full text-sm font-medium text-purple-700 shadow-lg mb-4">
          <Target className="w-4 h-4 mr-2" />
          Phase 1: Self-Discovery
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
          Introspection Journey
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover your purpose and align your career path through guided self-reflection
        </p>
      </div>
    </div>
  );
};

export default IntrospectionHeader;
