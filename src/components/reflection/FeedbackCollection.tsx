import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Share2, Plus, Star, MessageSquare, Calendar, User, Clock } from 'lucide-react';

const FeedbackCollection = () => {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [feedbackRequest, setFeedbackRequest] = useState({
    title: '',
    description: '',
    skills: '',
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

  const pendingRequests = [
    {
      id: 1,
      title: 'Review my NLP project',
      skills: ['NLP', 'Python', 'Transformers'],
      responses: 3,
      deadline: '2024-06-15'
    }
  ];

  const handleSubmitRequest = () => {
    console.log('Submitting feedback request:', feedbackRequest);
    setShowRequestForm(false);
    setFeedbackRequest({ title: '', description: '', skills: '', deadline: '' });
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
              <label className="block text-sm font-medium mb-1">Request Title</label>
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Skills to Review</label>
                <Input
                  placeholder="e.g., Python, Machine Learning"
                  value={feedbackRequest.skills}
                  onChange={(e) => setFeedbackRequest({...feedbackRequest, skills: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Deadline</label>
                <Input
                  type="date"
                  value={feedbackRequest.deadline}
                  onChange={(e) => setFeedbackRequest({...feedbackRequest, deadline: e.target.value})}
                />
              </div>
            </div>
            <div className="flex space-x-3">
              <Button onClick={handleSubmitRequest}>Submit Request</Button>
              <Button variant="outline" onClick={() => setShowRequestForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-orange-500" />
              <span>Pending Requests</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{request.title}</h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {request.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div>{request.responses} responses</div>
                      <div className="flex items-center mt-1">
                        <Calendar className="w-3 h-3 mr-1" />
                        {request.deadline}
                      </div>
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
