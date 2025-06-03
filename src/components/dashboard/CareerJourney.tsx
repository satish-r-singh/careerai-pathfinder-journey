
import PhaseCard from '@/components/PhaseCard';
import { useNavigate } from 'react-router-dom';

interface CareerJourneyProps {
  currentPhase: number;
  phaseProgress: number;
  ikigaiCompleted: boolean;
  ikigaiLoading: boolean;
  explorationProject: string | null;
  explorationLearningPlan: boolean;
  explorationPublicBuilding: boolean;
}

const CareerJourney = ({ 
  currentPhase, 
  phaseProgress, 
  ikigaiCompleted, 
  ikigaiLoading,
  explorationProject,
  explorationLearningPlan,
  explorationPublicBuilding
}: CareerJourneyProps) => {
  const navigate = useNavigate();

  const handleIntrospectionClick = () => {
    console.log('Introspection clicked - ikigaiCompleted:', ikigaiCompleted, 'ikigaiLoading:', ikigaiLoading);
    if (ikigaiLoading) {
      return;
    }
    navigate('/introspection');
  };

  const handlePhaseClick = (phase: any) => {
    console.log(`Navigate to ${phase.name} phase`);
    switch (phase.name) {
      case 'Introspection':
        handleIntrospectionClick();
        break;
      case 'Exploration':
        if (phase.status === 'current' || phase.status === 'completed') {
          navigate('/exploration');
        }
        break;
      case 'Reflection':
        if (phase.status === 'current' || phase.status === 'completed') {
          navigate('/reflection');
        }
        break;
      case 'Action':
        if (phase.status === 'current' || phase.status === 'completed') {
          navigate('/action');
        }
        break;
      default:
        console.log(`Unknown phase: ${phase.name}`);
    }
  };

  const getPhaseStatus = (phaseId: number): 'completed' | 'current' | 'locked' => {
    // For phases 1 and 2, use traditional progression logic
    if (phaseId <= 2) {
      if (phaseId < currentPhase) return 'completed';
      if (phaseId === currentPhase) return 'current';
      return 'locked';
    }

    // Check if Exploration is complete
    const explorationComplete = explorationProject && explorationLearningPlan && explorationPublicBuilding;
    
    // For phases 3 and 4, they become available once Exploration is complete
    if (phaseId === 3 || phaseId === 4) {
      if (explorationComplete) {
        return 'current'; // Both phases are ongoing/available
      } else {
        return 'locked';
      }
    }
    
    return 'locked';
  };

  const getPhaseProgress = (phaseId: number) => {
    // For phases 1 and 2, use traditional progress
    if (phaseId <= 2) {
      return currentPhase > phaseId ? 100 : currentPhase === phaseId ? phaseProgress : 0;
    }
    
    // For phases 3 and 4, return null to indicate activity-based tracking
    return null;
  };

  const getActivityIndicators = (phaseId: number) => {
    if (phaseId === 3) {
      return {
        feedbackCollected: 2,
        mentorsConnected: 1,
        skillsValidated: 3
      };
    }
    if (phaseId === 4) {
      return {
        applicationsSubmitted: 8,
        interviewsScheduled: 2,
        networkingActivities: 5
      };
    }
    return null;
  };

  const phases = [
    {
      id: 1,
      name: 'Introspection',
      description: 'Self-discovery and career alignment',
      status: getPhaseStatus(1),
      progress: getPhaseProgress(1),
      estimatedTime: '1-2 weeks',
      keyActivities: ['Complete Ikigai assessment', 'Research AI Industry and relevant roles', 'Career Roadmap and Personalized Outreach'],
      activityIndicators: null
    },
    {
      id: 2,
      name: 'Exploration',
      description: 'Project identification and knowledge building',
      status: getPhaseStatus(2),
      progress: getPhaseProgress(2),
      estimatedTime: '2-3 weeks',
      keyActivities: ['Choose project topic', 'Build learning plan', 'Start building in public'],
      activityIndicators: null
    },
    {
      id: 3,
      name: 'Reflection',
      description: 'Skill validation through feedback',
      status: getPhaseStatus(3),
      progress: getPhaseProgress(3),
      estimatedTime: 'Ongoing',
      keyActivities: ['Get peer feedback', 'Connect with mentors', 'Validate skills'],
      activityIndicators: getActivityIndicators(3)
    },
    {
      id: 4,
      name: 'Action',
      description: 'Active job hunting and applications',
      status: getPhaseStatus(4),
      progress: getPhaseProgress(4),
      estimatedTime: 'Ongoing',
      keyActivities: ['Apply to positions', 'Network with recruiters', 'Track applications'],
      activityIndicators: getActivityIndicators(4)
    }
  ];

  return (
    <div className="mb-12 animate-slide-up">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold gradient-text mb-4">Your Career Journey</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Navigate through our comprehensive 4-phase program designed to accelerate your AI career transition
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        {phases.map((phase, index) => (
          <div key={phase.id} className="animate-fade-in transform hover:scale-[1.02] transition-all duration-300" style={{
            animationDelay: `${index * 0.15}s`
          }}>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
              
              <div className="relative">
                <PhaseCard phase={phase} onClick={() => handlePhaseClick(phase)} />
              </div>
              
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                {phase.id}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CareerJourney;
