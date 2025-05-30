
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import IkigaiDiscovery from '@/components/IkigaiDiscovery';

const Ikigai = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/introspection')}
            className="mb-4"
          >
            ← Back to Introspection
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ikigai Discovery</h1>
          <p className="text-gray-600">
            Discover your purpose through guided self-reflection
          </p>
        </div>

        <IkigaiDiscovery />
      </div>
    </div>
  );
};

export default Ikigai;
