
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Users, Plus, Calendar, MessageSquare, Building, MapPin, ExternalLink, Linkedin, Mail, Phone } from 'lucide-react';

interface NetworkContact {
  id: string;
  name: string;
  title: string;
  company: string;
  location?: string;
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  notes?: string;
  lastContact?: string;
  relationship: 'recruiter' | 'colleague' | 'mentor' | 'founder' | 'other';
  connectionStrength: 'weak' | 'medium' | 'strong';
}

const NetworkingTools = () => {
  const [contacts, setContacts] = useState<NetworkContact[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      title: 'Senior AI Recruiter',
      company: 'TechFlow Recruiting',
      location: 'San Francisco, CA',
      email: 'sarah.j@techflow.com',
      linkedinUrl: 'https://linkedin.com/in/sarahjohnson',
      notes: 'Met at AI conference. Very knowledgeable about ML roles.',
      lastContact: '2024-01-10',
      relationship: 'recruiter',
      connectionStrength: 'medium'
    },
    {
      id: '2',
      name: 'Alex Chen',
      title: 'AI Engineering Manager',
      company: 'DataCorp',
      location: 'Remote',
      email: 'alex.chen@datacorp.com',
      notes: 'Great conversation about computer vision projects.',
      lastContact: '2024-01-08',
      relationship: 'colleague',
      connectionStrength: 'strong'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    title: '',
    company: '',
    location: '',
    email: '',
    phone: '',
    linkedinUrl: '',
    notes: '',
    relationship: 'colleague' as const,
    connectionStrength: 'weak' as const
  });

  const getRelationshipColor = (relationship: string) => {
    switch (relationship) {
      case 'recruiter': return 'bg-blue-100 text-blue-800';
      case 'colleague': return 'bg-green-100 text-green-800';
      case 'mentor': return 'bg-purple-100 text-purple-800';
      case 'founder': return 'bg-yellow-100 text-yellow-800';
      case 'other': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConnectionStrengthColor = (strength: string) => {
    switch (strength) {
      case 'weak': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'strong': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddContact = () => {
    if (newContact.name && newContact.company) {
      const contact: NetworkContact = {
        id: Date.now().toString(),
        ...newContact,
        lastContact: new Date().toISOString().split('T')[0]
      };
      
      setContacts([contact, ...contacts]);
      setNewContact({
        name: '',
        title: '',
        company: '',
        location: '',
        email: '',
        phone: '',
        linkedinUrl: '',
        notes: '',
        relationship: 'colleague',
        connectionStrength: 'weak'
      });
      setShowAddForm(false);
    }
  };

  const outreachTemplates = [
    {
      title: 'Initial LinkedIn Connection',
      template: `Hi [Name],

I came across your profile and was impressed by your work in [specific area]. I'm currently transitioning into AI and would love to connect with professionals in the field.

Would you be open to connecting?

Best regards,
[Your Name]`
    },
    {
      title: 'Follow-up After Meeting',
      template: `Hi [Name],

It was great meeting you at [event/location]. I really enjoyed our conversation about [specific topic].

I'd love to stay in touch and learn more about your work at [Company]. Would you be open to a brief coffee chat sometime?

Thanks!
[Your Name]`
    },
    {
      title: 'Informational Interview Request',
      template: `Hello [Name],

I hope this message finds you well. I'm [Your Name], currently transitioning into the AI field, and I've been following your work at [Company].

I would be incredibly grateful if you could spare 15-20 minutes for an informational interview. I'm particularly interested in learning about your career path and any advice you might have for someone entering the field.

Would you be available for a brief call in the coming weeks?

Thank you for your time!

Best regards,
[Your Name]`
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Networking Tools</h2>
          <p className="text-gray-600">Build and manage your professional network</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Contact
        </Button>
      </div>

      {/* Network Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Contacts', value: contacts.length, color: 'bg-blue-500' },
          { label: 'Recruiters', value: contacts.filter(c => c.relationship === 'recruiter').length, color: 'bg-purple-500' },
          { label: 'Strong Connections', value: contacts.filter(c => c.connectionStrength === 'strong').length, color: 'bg-green-500' },
          { label: 'Recent Contacts', value: contacts.filter(c => c.lastContact && new Date(c.lastContact) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length, color: 'bg-yellow-500' }
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

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Contact Management */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Your Network</h3>
          
          {/* Add Contact Form */}
          {showAddForm && (
            <Card>
              <CardHeader>
                <CardTitle>Add New Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="contactName">Name *</Label>
                    <Input
                      id="contactName"
                      value={newContact.name}
                      onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                      placeholder="Full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactTitle">Title</Label>
                    <Input
                      id="contactTitle"
                      value={newContact.title}
                      onChange={(e) => setNewContact({...newContact, title: e.target.value})}
                      placeholder="Job title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactCompany">Company *</Label>
                    <Input
                      id="contactCompany"
                      value={newContact.company}
                      onChange={(e) => setNewContact({...newContact, company: e.target.value})}
                      placeholder="Company name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactEmail">Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={newContact.email}
                      onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactLinkedin">LinkedIn URL</Label>
                    <Input
                      id="contactLinkedin"
                      value={newContact.linkedinUrl}
                      onChange={(e) => setNewContact({...newContact, linkedinUrl: e.target.value})}
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactNotes">Notes</Label>
                    <Textarea
                      id="contactNotes"
                      value={newContact.notes}
                      onChange={(e) => setNewContact({...newContact, notes: e.target.value})}
                      placeholder="How you met, conversation topics, etc."
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddContact} className="bg-green-600 hover:bg-green-700">
                    Add Contact
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contacts List */}
          <div className="space-y-4">
            {contacts.map((contact) => (
              <Card key={contact.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-gray-900">{contact.name}</h4>
                        <Badge className={getRelationshipColor(contact.relationship)}>
                          {contact.relationship}
                        </Badge>
                        <Badge className={getConnectionStrengthColor(contact.connectionStrength)}>
                          {contact.connectionStrength}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <Building className="w-4 h-4 mr-2" />
                          {contact.title} at {contact.company}
                        </div>
                        {contact.location && (
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            {contact.location}
                          </div>
                        )}
                        {contact.lastContact && (
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            Last contact: {new Date(contact.lastContact).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                      
                      {contact.notes && (
                        <p className="text-sm text-gray-700 mb-3">{contact.notes}</p>
                      )}
                      
                      <div className="flex space-x-2">
                        {contact.email && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={`mailto:${contact.email}`}>
                              <Mail className="w-4 h-4 mr-1" />
                              Email
                            </a>
                          </Button>
                        )}
                        {contact.linkedinUrl && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={contact.linkedinUrl} target="_blank" rel="noopener noreferrer">
                              <Linkedin className="w-4 h-4 mr-1" />
                              LinkedIn
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {contacts.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Contacts Yet</h3>
                  <p className="text-gray-600 mb-4">Start building your professional network</p>
                  <Button onClick={() => setShowAddForm(true)} className="bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Contact
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Outreach Templates */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Outreach Templates</h3>
          
          <div className="space-y-4">
            {outreachTemplates.map((template, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-base">{template.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                      {template.template}
                    </pre>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(template.template)}
                  >
                    Copy Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkingTools;
