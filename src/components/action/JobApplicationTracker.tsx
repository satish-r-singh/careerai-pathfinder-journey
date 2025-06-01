
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Building, Calendar, DollarSign, MapPin, ExternalLink, Edit, Trash2 } from 'lucide-react';

interface JobApplication {
  id: string;
  company: string;
  position: string;
  location: string;
  salary?: string;
  status: 'applied' | 'screening' | 'interview' | 'offer' | 'rejected';
  appliedDate: string;
  notes?: string;
  jobUrl?: string;
}

const JobApplicationTracker = () => {
  const [applications, setApplications] = useState<JobApplication[]>([
    {
      id: '1',
      company: 'TechCorp',
      position: 'AI Engineer',
      location: 'San Francisco, CA',
      salary: '$120k - $150k',
      status: 'interview',
      appliedDate: '2024-01-15',
      notes: 'Waiting for technical interview next week',
      jobUrl: 'https://example.com/job1'
    },
    {
      id: '2',
      company: 'DataFlow Inc',
      position: 'Machine Learning Specialist',
      location: 'Remote',
      salary: '$100k - $130k',
      status: 'applied',
      appliedDate: '2024-01-12',
      notes: 'Applied through LinkedIn',
      jobUrl: 'https://example.com/job2'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newApplication, setNewApplication] = useState({
    company: '',
    position: '',
    location: '',
    salary: '',
    status: 'applied' as const,
    notes: '',
    jobUrl: ''
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'bg-blue-100 text-blue-800';
      case 'screening': return 'bg-yellow-100 text-yellow-800';
      case 'interview': return 'bg-purple-100 text-purple-800';
      case 'offer': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddApplication = () => {
    if (newApplication.company && newApplication.position) {
      const application: JobApplication = {
        id: Date.now().toString(),
        ...newApplication,
        appliedDate: new Date().toISOString().split('T')[0]
      };
      
      setApplications([application, ...applications]);
      setNewApplication({
        company: '',
        position: '',
        location: '',
        salary: '',
        status: 'applied',
        notes: '',
        jobUrl: ''
      });
      setShowAddForm(false);
    }
  };

  const handleStatusUpdate = (id: string, newStatus: string) => {
    setApplications(applications.map(app => 
      app.id === id ? { ...app, status: newStatus as JobApplication['status'] } : app
    ));
  };

  const handleDeleteApplication = (id: string) => {
    setApplications(applications.filter(app => app.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Job Applications</h2>
          <p className="text-gray-600">Track your job applications and their progress</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Application
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Applications', value: applications.length, color: 'bg-blue-500' },
          { label: 'Applied', value: applications.filter(a => a.status === 'applied').length, color: 'bg-blue-500' },
          { label: 'In Process', value: applications.filter(a => ['screening', 'interview'].includes(a.status)).length, color: 'bg-purple-500' },
          { label: 'Offers', value: applications.filter(a => a.status === 'offer').length, color: 'bg-green-500' },
          { label: 'Rejected', value: applications.filter(a => a.status === 'rejected').length, color: 'bg-red-500' }
        ].map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${stat.color} mr-2`}></div>
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Application Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Application</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  value={newApplication.company}
                  onChange={(e) => setNewApplication({...newApplication, company: e.target.value})}
                  placeholder="Company name"
                />
              </div>
              <div>
                <Label htmlFor="position">Position *</Label>
                <Input
                  id="position"
                  value={newApplication.position}
                  onChange={(e) => setNewApplication({...newApplication, position: e.target.value})}
                  placeholder="Job title"
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newApplication.location}
                  onChange={(e) => setNewApplication({...newApplication, location: e.target.value})}
                  placeholder="Location or Remote"
                />
              </div>
              <div>
                <Label htmlFor="salary">Salary Range</Label>
                <Input
                  id="salary"
                  value={newApplication.salary}
                  onChange={(e) => setNewApplication({...newApplication, salary: e.target.value})}
                  placeholder="e.g., $100k - $120k"
                />
              </div>
              <div>
                <Label htmlFor="jobUrl">Job URL</Label>
                <Input
                  id="jobUrl"
                  value={newApplication.jobUrl}
                  onChange={(e) => setNewApplication({...newApplication, jobUrl: e.target.value})}
                  placeholder="Link to job posting"
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={newApplication.status} onValueChange={(value) => setNewApplication({...newApplication, status: value as JobApplication['status']})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="applied">Applied</SelectItem>
                    <SelectItem value="screening">Screening</SelectItem>
                    <SelectItem value="interview">Interview</SelectItem>
                    <SelectItem value="offer">Offer</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={newApplication.notes}
                onChange={(e) => setNewApplication({...newApplication, notes: e.target.value})}
                placeholder="Additional notes about this application..."
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddApplication} className="bg-green-600 hover:bg-green-700">
                Add Application
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Applications List */}
      <div className="space-y-4">
        {applications.map((app) => (
          <Card key={app.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{app.position}</h3>
                    <Badge className={getStatusColor(app.status)}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <Building className="w-4 h-4 mr-1" />
                      {app.company}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {app.location}
                    </div>
                    {app.salary && (
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {app.salary}
                      </div>
                    )}
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Applied {new Date(app.appliedDate).toLocaleDateString()}
                    </div>
                  </div>
                  
                  {app.notes && (
                    <p className="text-sm text-gray-700 mb-3">{app.notes}</p>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <Select value={app.status} onValueChange={(value) => handleStatusUpdate(app.id, value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="applied">Applied</SelectItem>
                        <SelectItem value="screening">Screening</SelectItem>
                        <SelectItem value="interview">Interview</SelectItem>
                        <SelectItem value="offer">Offer</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    {app.jobUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={app.jobUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          View Job
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDeleteApplication(app.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {applications.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Applications Yet</h3>
              <p className="text-gray-600 mb-4">Start tracking your job applications to monitor your progress</p>
              <Button onClick={() => setShowAddForm(true)} className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Application
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default JobApplicationTracker;
