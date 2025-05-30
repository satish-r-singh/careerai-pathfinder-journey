
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Users, Brain, Target, ArrowRight, Sparkles, Zap, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const features = [
    {
      icon: <Brain className="w-8 h-8 text-primary" />,
      title: "AI-Powered Personalization",
      description: "Get tailored guidance based on your background, goals, and learning style with cutting-edge AI technology."
    },
    {
      icon: <Target className="w-8 h-8 text-primary" />,
      title: "Structured 4-Phase Journey",
      description: "Progress through scientifically designed phases: Introspection, Exploration, Reflection, and Action."
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Community & Mentorship",
      description: "Connect with industry leaders and peers for personalized feedback and career guidance."
    }
  ];

  const phases = [
    {
      number: 1,
      name: "Introspection",
      description: "Discover your ikigai and align your career goals with AI opportunities through deep self-reflection.",
      duration: "1-2 weeks",
      color: "from-purple-500 to-pink-500"
    },
    {
      number: 2,
      name: "Exploration", 
      description: "Research cutting-edge projects and build domain expertise in your target AI specialization.",
      duration: "2-3 weeks",
      color: "from-blue-500 to-cyan-500"
    },
    {
      number: 3,
      name: "Reflection",
      description: "Receive expert feedback from industry mentors to validate and enhance your skillset.",
      duration: "3-4 weeks",
      color: "from-green-500 to-emerald-500"
    },
    {
      number: 4,
      name: "Action",
      description: "Apply for your dream roles with confidence and track your journey to success.",
      duration: "Ongoing",
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 overflow-hidden">
      <Header />
      
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-200/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      {/* Hero Section */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center space-y-10">
            <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm border border-purple-200/50 rounded-full text-sm font-medium text-purple-700 shadow-lg">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Career Transformation
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black leading-tight">
              Your AI Career
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent block">
                Journey Awaits
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Transform your career with our revolutionary AI-powered platform. 
              <span className="font-semibold text-purple-700"> Join 10,000+ professionals</span> who've successfully 
              transitioned into high-impact AI roles.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg px-10 py-4 rounded-xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
                onClick={() => navigate('/auth')}
              >
                Start Your Transformation
                <ArrowRight className="ml-3 w-6 h-6" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-10 py-4 rounded-xl border-2 border-purple-200 bg-white/80 backdrop-blur-sm hover:bg-purple-50 transition-all duration-300"
              >
                <Globe className="mr-3 w-6 h-6" />
                Explore Success Stories
              </Button>
            </div>
            
            <div className="flex justify-center items-center space-x-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-700">10k+</div>
                <div className="text-sm text-gray-600">Career Transitions</div>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-700">95%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-700">$150k</div>
                <div className="text-sm text-gray-600">Average Salary</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-sm font-medium text-blue-700 mb-6">
              <Zap className="w-4 h-4 mr-2" />
              Revolutionary Features
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-purple-800 bg-clip-text text-transparent mb-6">
              Why CareerAI Leads the Industry
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the next generation of career guidance with our AI-powered platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {features.map((feature, index) => (
              <Card key={index} className="group relative overflow-hidden border-0 bg-white/60 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="text-center relative z-10">
                  <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <CardDescription className="text-center text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-gradient-to-br from-gray-50 to-purple-50/30 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full text-sm font-medium text-gray-700 mb-6">
              <Target className="w-4 h-4 mr-2" />
              Proven Methodology
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-6">
              Your Transformation Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A scientifically designed 4-phase methodology that has helped thousands transition successfully
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {phases.map((phase, index) => (
              <Card key={index} className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <div className={`absolute inset-0 bg-gradient-to-br ${phase.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                <CardHeader className="text-center relative z-10">
                  <div className={`mx-auto w-16 h-16 bg-gradient-to-r ${phase.color} rounded-2xl flex items-center justify-center text-white font-bold text-xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {phase.number}
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-900">{phase.name}</CardTitle>
                  <CardDescription className="text-sm font-medium text-purple-600 bg-purple-100 px-3 py-1 rounded-full inline-block">
                    {phase.duration}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-sm text-gray-600 text-center leading-relaxed">
                    {phase.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-purple-900 via-blue-900 to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-purple-100 mb-10 leading-relaxed">
            Join thousands of professionals who've successfully transitioned into high-impact AI roles
          </p>
          <Button 
            size="lg" 
            className="bg-white text-purple-900 hover:bg-gray-100 text-lg px-12 py-4 rounded-xl font-semibold shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:scale-105"
            onClick={() => navigate('/auth')}
          >
            Begin Your AI Journey Today
            <ArrowRight className="ml-3 w-6 h-6" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="ml-3 text-2xl font-bold">CareerAI</span>
            </div>
            <p className="text-gray-400 text-lg">
              Empowering your transformation into AI careers
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
