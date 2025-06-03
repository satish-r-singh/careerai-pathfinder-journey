
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

const UpcomingSection = () => {
  return (
    <Card className="premium-card animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 gradient-text">
          <Calendar className="w-5 h-5" />
          <span className="py-[4px]">Upcoming</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100">
          <p className="font-medium text-gray-800">Phase Assessment</p>
          <p className="text-sm text-gray-600 mt-1">Due in 5 days</p>
        </div>
        <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-blue-50 border border-green-100">
          <p className="font-medium text-gray-800">Mentor Check-in</p>
          <p className="text-sm text-gray-600 mt-1">Scheduled for Friday</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingSection;
