
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ExternalLink } from 'lucide-react';
import { TargetFirm } from '@/types/targetFirms';

interface TargetFirmCardProps {
  firm: TargetFirm;
  onToggleAlerts: (firmId: string) => void;
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-800 border-red-200';
    case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low': return 'bg-green-100 text-green-800 border-green-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const TargetFirmCard = ({ firm, onToggleAlerts }: TargetFirmCardProps) => {
  return (
    <Card className="border hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-sm">{firm.name}</h4>
              <p className="text-xs text-gray-600">{firm.industry} • {firm.size} employees</p>
              <p className="text-xs text-gray-500">{firm.location}</p>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <Badge className={`text-xs ${getPriorityColor(firm.priority)}`}>
                {firm.priority} priority
              </Badge>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={firm.alertsEnabled}
                  onCheckedChange={() => onToggleAlerts(firm.id)}
                />
                <span className="text-xs text-gray-500">Alerts</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Last updated: {new Date(firm.lastUpdate).toLocaleDateString()}</span>
            {firm.website && (
              <a 
                href={firm.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Visit</span>
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TargetFirmCard;
