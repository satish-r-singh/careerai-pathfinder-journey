
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Users, Brain, Target, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Brain className="w-8 h-8 text-primary" />,
      title: "AI-Powered Personalization",
      description: "Get tailored guidance based on your background, goals, and learning style."
    },
    {
      icon: <Target className="w-8 h-8 text-primary" />,
      title: "Structured 4-Phase Journey",
      description: "Progress through Introspection, Exploration, Reflection, and Action phases."
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Community & Mentorship",
      description: "Connect with peers and industry experts for feedback and guidance."
    }
  ];

  const phases = [
    {
      number: 1,
      name: "Introspection",
      description: "Discover your ikigai and align your career goals with AI opportunities.",
      duration: "1-2 weeks"
    },
    {
      number: 2,
      name: "Exploration", 
      description: "Research projects and build knowledge in your target AI domain.",
      duration: "2-3 weeks"
    },
    {
      number: 3,
      name: "Reflection",
      description: "Get feedback from peers and mentors to validate your skills.",
      duration: "3-4 weeks"
    },
    {
      number: 4,
      name: "Action",
      description: "Apply for roles with confidence and track your progress.",
      duration: "Ongoing"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Your AI Career Journey
              <span className="gradient-text block">Starts Here</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transform your career with personalized guidance, structured learning, 
              and community support. Join thousands who've successfully transitioned into AI roles.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-lg px-8 py-3"
                onClick={() => navigate('/onboarding')}
              >
                Start Your Journey
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
              Why Choose CareerAI?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We combine cutting-edge AI technology with proven career transition methodologies
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="card-hover border-0 shadow-md">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
              Your 4-Phase Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A structured path from career confusion to AI professional
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {phases.map((phase, index) => (
              <Card key={index} className="glass-effect card-hover">
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-lg mb-4">
                    {phase.number}
                  </div>
                  <CardTitle className="text-lg">{phase.name}</CardTitle>
                  <CardDescription className="text-sm text-primary font-medium">
                    {phase.duration}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 text-center">
                    {phase.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join our community of successful AI career transitioners
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            className="text-lg px-8 py-3"
            onClick={() => navigate('/onboarding')}
          >
            Start Your Journey Today
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="ml-2 text-xl font-bold">CareerAI</span>
            </div>
            <p className="text-gray-400">
              Empowering your transition into AI careers
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
