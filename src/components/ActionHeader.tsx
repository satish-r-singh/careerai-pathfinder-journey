import { Button } from '@/components/ui/button';
import { Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const ActionHeader = () => {
  const navigate = useNavigate();
  return <div className="relative min-h-[60vh] overflow-hidden">
      {/* Hero Background Image */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
      backgroundImage: `url('https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80')`
    }}>
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/70 via-emerald-900/60 to-green-900/70"></div>
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-green-300/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-emerald-300/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 flex flex-col justify-center items-center h-full px-4 py-20">
        <div className="flex items-center justify-between w-full mb-8">
          <Button variant="outline" onClick={() => navigate('/dashboard')} className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 transition-all duration-300">
            ← Back to Dashboard
          </Button>
          
          
        </div>
        
        <div className="text-center mb-8 space-y-6">
          <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-sm font-medium text-white shadow-lg mb-6">
            <Briefcase className="w-5 h-5 mr-3" />
            Phase 4: Job Hunting
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Action
            <span className="block bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">
              Phase
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed">
            Apply to positions, network with professionals, and track your job search progress
          </p>
        </div>
      </div>
    </div>;
};
export default ActionHeader;