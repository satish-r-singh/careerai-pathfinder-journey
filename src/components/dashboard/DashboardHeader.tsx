
import { Button } from '@/components/ui/button';
import { Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const DashboardHeader = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="relative z-10 glass-effect border-0 border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <img src="/lovable-uploads/a82513ec-4139-4f2f-814a-7a8db8a59228.png" alt="CareerAI" className="h-10 w-auto" />
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="hover:bg-white/20 transition-all duration-300">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="hover:bg-white/20 transition-all duration-300">
              <User className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="hover:bg-white/20 transition-all duration-300">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
