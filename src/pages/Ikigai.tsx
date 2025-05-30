
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import IkigaiDiscovery from '@/components/IkigaiDiscovery';
import { ArrowLeft, Sparkles } from 'lucide-react';

const Ikigai = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-200/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-200/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/introspection')}
            className="mb-6 bg-white/80 backdrop-blur-sm border-purple-200 hover:bg-purple-50 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Introspection
          </Button>
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm border border-purple-200/50 rounded-full text-sm font-medium text-purple-700 shadow-lg mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              Self-Discovery Journey
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Ikigai Discovery
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover your purpose through guided self-reflection and unlock your true potential in the AI industry
            </p>
          </div>
        </div>

        <IkigaiDiscovery />
      </div>
    </div>
  );
};

export default Ikigai;
