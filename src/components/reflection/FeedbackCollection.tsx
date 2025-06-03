
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Share2, Plus, Star, MessageSquare, Calendar, User, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const FeedbackCollection = () => {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [projects, setProjects] = useState([]);
  const [feedbackRequests, setFeedbackRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  
  const [feedbackRequest, setFeedbackRequest] = useState({
    title: '',
    description: '',
    projectId: '',
    projectName: '',
    publicLink: '',
    githubLink: '',
    deadline: ''
  });

  // Mock data for existing feedback
  const feedbackReceived = [
    {
      id: 1,
      from: 'Sarah Chen',
      role: 'Senior ML Engineer',
      rating: 4,
      feedback: 'Great understanding of machine learning concepts. Your project shows solid technical skills. Consider diving deeper into model optimization.',
      skills: ['Machine Learning', 'Python'],
      date: '2024-05-28'
    },
    {
      id: 2,
      from: 'Mike Rodriguez',
      role: 'AI Product Manager',
      rating: 5,
      feedback: 'Excellent communication of technical concepts. Your presentation was clear and well-structured. Keep up the great work!',
      skills: ['Communication', 'Presentation'],
      date: '2024-05-25'
    }
  ];

  useEffect(() => {
    if (user) {
      fetchUserProjects();
      fetchFeedbackRequests();
    }
  }, [user]);

  const fetchUserProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('project_options')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_selected', true);

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchFeedbackRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('feedback_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFeedbackRequests(data || []);
    } catch (error) {
      console.error('Error fetching feedback requests:', error);
    }
  };

  const handleProjectSelect = (projectId) => {
    const selectedProject = projects.find(p => p.id === projectId);
    setFeedbackRequest({
      ...feedbackRequest,
      projectId: projectId,
      projectName: selectedProject?.project_data?.name || ''
    });
  };

  const handleSubmitRequest = async () => {
    if (!user) {
      toast.error('You must be logged in to submit a feedback request');
      return;
    }

    if (!feedbackRequest.title.trim()) {
      toast.error('Please provide a title for your feedback request');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('feedback_requests')
        .insert({
          user_id: user.id,
          title: feedbackRequest.title,
          description: feedbackRequest.description,
          project_id: feedbackRequest.projectId || null,
          project_name: feedbackRequest.projectName || null,
          public_link: feedbackRequest.publicLink || null,
          github_link: feedbackRequest.githubLink || null,
          deadline: feedbackRequest.deadline || null,
          status: 'pending'
        });

      if (error) throw error;

      toast.success('Feedback request submitted successfully!');
      setShowRequestForm(false);
      setFeedbackRequest({
        title: '',
        description: '',
        projectId: '',
        projectName: '',
        publicLink: '',
        githubLink: '',
        deadline: ''
      });
      fetchFeedbackRequests();
    } catch (error) {
      console.error('Error submitting feedback request:', error);
      toast.error('Failed to submit feedback request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Request Feedback Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Share2 className="w-5 h-5 text-blue-500" />
                <span>Request Feedback</span>
              </CardTitle>
              <CardDescription>
                Get valuable insights from peers on your projects and skills
              </CardDescription>
            </div>
            <Button onClick={() => setShowRequestForm(!showRequestForm)}>
              <Plus className="w-4 h-4 mr-2" />
              New Request
            </Button>
          </div>
        </CardHeader>
        {showRequestForm && (
          <CardContent className="space-y-4 border-t pt-4">
            <div>
              <label className="block text-sm font-medium mb-1">Request Title *</label>
              <Input
                placeholder="e.g., Review my AI chatbot project"
                value={feedbackRequest.title}
                onChange={(e) => setFeedbackRequest({...feedbackRequest, title: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Textarea
                placeholder="Describe what you'd like feedback on..."
                value={feedbackRequest.description}
                onChange={(e) => setFeedbackRequest({...feedbackRequest, description: e.target.value})}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Select Project (Optional)</label>
                <Select value={feedbackRequest.projectId} onValueChange={handleProjectSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.project_data?.name || 'Unnamed Project'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Deadline (Optional)</label>
                <Input
                  type="date"
                  value={feedbackRequest.deadline}
                  onChange={(e) => setFeedbackRequest({...feedbackRequest, deadline: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Public Link (Optional)</label>
                <Input
                  placeholder="https://your-project-demo.com"
                  value={feedbackRequest.publicLink}
                  onChange={(e) => setFeedbackRequest({...feedbackRequest, publicLink: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">GitHub Repository (Optional)</label>
                <Input
                  placeholder="https://github.com/username/repo"
                  value={feedbackRequest.githubLink}
                  onChange={(e) => setFeedbackRequest({...feedbackRequest, githubLink: e.target.value})}
                />
              </div>
            </div>
            <div className="flex space-x-3">
              <Button onClick={handleSubmitRequest} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Request'}
              </Button>
              <Button variant="outline" onClick={() => setShowRequestForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Pending Requests */}
      {feedbackRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-orange-500" />
              <span>Your Feedback Requests</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {feedbackRequests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{request.title}</h4>
                      {request.description && (
                        <p className="text-sm text-gray-600 mt-1">{request.description}</p>
                      )}
                      {request.project_name && (
                        <div className="mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {request.project_name}
                          </Badge>
                        </div>
                      )}
                      <div className="flex gap-2 mt-2">
                        {request.public_link && (
                          <a
                            href={request.public_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline"
                          >
                            View Demo
                          </a>
                        )}
                        {request.github_link && (
                          <a
                            href={request.github_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline"
                          >
                            GitHub Repo
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div className="capitalize">{request.status}</div>
                      {request.deadline && (
                        <div className="flex items-center mt-1">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(request.deadline).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Received Feedback */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-green-500" />
            <span>Feedback Received</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {feedbackReceived.map((feedback) => (
              <div key={feedback.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      <h4 className="font-medium">{feedback.from}</h4>
                      <p className="text-sm text-gray-500">{feedback.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < feedback.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-3">{feedback.feedback}</p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {feedback.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">{feedback.date}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackCollection;
