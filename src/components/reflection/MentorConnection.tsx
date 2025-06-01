
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, Search, MapPin, Calendar, Star, MessageSquare, Filter } from 'lucide-react';

const MentorConnection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');

  // Mock mentor data
  const mentors = [
    {
      id: 1,
      name: 'Dr. Emily Watson',
      title: 'AI Research Director',
      company: 'TechCorp',
      location: 'San Francisco, CA',
      specialties: ['Machine Learning', 'Computer Vision', 'Research'],
      rating: 4.9,
      reviews: 47,
      experience: '15+ years',
      availability: 'Available for mentoring',
      bio: 'Leading AI research with focus on computer vision and deep learning. Passionate about mentoring the next generation of AI professionals.',
      responseTime: '24 hours'
    },
    {
      id: 2,
      name: 'Marcus Johnson',
      title: 'Senior ML Engineer',
      company: 'DataFlow',
      location: 'New York, NY',
      specialties: ['MLOps', 'Python', 'Cloud Platforms'],
      rating: 4.7,
      reviews: 32,
      experience: '8+ years',
      availability: 'Limited availability',
      bio: 'Specialized in building scalable ML systems and MLOps practices. Love helping engineers transition into AI roles.',
      responseTime: '48 hours'
    },
    {
      id: 3,
      name: 'Sarah Kim',
      title: 'AI Product Manager',
      company: 'InnovateLabs',
      location: 'Seattle, WA',
      specialties: ['Product Management', 'AI Strategy', 'Business Development'],
      rating: 4.8,
      reviews: 28,
      experience: '10+ years',
      availability: 'Available for mentoring',
      bio: 'Bridge between technical teams and business stakeholders. Expert in AI product strategy and go-to-market.',
      responseTime: '12 hours'
    }
  ];

  const specialties = ['all', 'Machine Learning', 'MLOps', 'Product Management', 'Research', 'Computer Vision'];

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSpecialty = selectedSpecialty === 'all' || 
                            mentor.specialties.includes(selectedSpecialty);
    
    return matchesSearch && matchesSpecialty;
  });

  const handleConnect = (mentorId: number) => {
    console.log('Connecting with mentor:', mentorId);
    // This would send a connection request
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-purple-500" />
            <span>Find Mentors</span>
          </CardTitle>
          <CardDescription>
            Connect with experienced professionals to guide your AI career journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search mentors by name, title, or expertise..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty}>
                    {specialty === 'all' ? 'All Specialties' : specialty}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mentor Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredMentors.map((mentor) => (
          <Card key={mentor.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{mentor.name}</CardTitle>
                  <p className="text-sm text-gray-600">{mentor.title} at {mentor.company}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">{mentor.location}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{mentor.rating}</span>
                    <span className="text-xs text-gray-500">({mentor.reviews})</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 mb-3">{mentor.bio}</p>
              
              <div className="space-y-3 mb-4">
                <div className="flex flex-wrap gap-2">
                  {mentor.specialties.map((specialty) => (
                    <Badge key={specialty} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Experience: {mentor.experience}</span>
                  <span>Response: {mentor.responseTime}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    mentor.availability === 'Available for mentoring' ? 'bg-green-400' : 'bg-yellow-400'
                  }`} />
                  <span className="text-xs text-gray-600">{mentor.availability}</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  onClick={() => handleConnect(mentor.id)}
                  className="flex-1"
                  disabled={mentor.availability !== 'Available for mentoring'}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Connect
                </Button>
                <Button variant="outline" size="sm">
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMentors.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No mentors found</h3>
            <p className="text-gray-500">Try adjusting your search terms or filters</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MentorConnection;
