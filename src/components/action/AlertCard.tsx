
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import { Alert } from '@/types/targetFirms';

interface AlertCardProps {
  alert: Alert;
  onMarkAsRead: (alertId: string) => void;
}

const getAlertIcon = (type: string) => {
  switch (type) {
    case 'job_posting': return '💼';
    case 'news': return '📰';
    case 'people_update': return '👥';
    case 'funding': return '💰';
    default: return '🔔';
  }
};

const getAlertColor = (type: string) => {
  switch (type) {
    case 'job_posting': return 'bg-green-50 border-green-200 text-green-800';
    case 'news': return 'bg-blue-50 border-blue-200 text-blue-800';
    case 'people_update': return 'bg-purple-50 border-purple-200 text-purple-800';
    case 'funding': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    default: return 'bg-gray-50 border-gray-200 text-gray-800';
  }
};

const AlertCard = ({ alert, onMarkAsRead }: AlertCardProps) => {
  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 ${
        alert.isRead ? 'opacity-75' : 'border-l-4 border-l-blue-500 shadow-sm'
      }`}
      onClick={() => onMarkAsRead(alert.id)}
    >
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-2">
              <span className="text-lg">{getAlertIcon(alert.type)}</span>
              <div>
                <h4 className="font-medium text-sm">{alert.title}</h4>
                <p className="text-xs text-gray-600">{alert.description}</p>
              </div>
            </div>
            <Badge className={`text-xs ${getAlertColor(alert.type)}`}>
              {alert.type.replace('_', ' ')}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>{alert.firmName}</span>
            <div className="flex items-center space-x-2">
              <span>{new Date(alert.timestamp).toLocaleDateString()}</span>
              {alert.actionUrl && (
                <a 
                  href={alert.actionUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertCard;
