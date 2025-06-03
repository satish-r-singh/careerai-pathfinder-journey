
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

const ResourcesSection = () => {
  return (
    <Card className="premium-card animate-slide-up">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 gradient-text">
          <BookOpen className="w-5 h-5" />
          <span>Recommended</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 hover:shadow-lg transition-all duration-300 cursor-pointer group">
          <p className="font-medium text-primary group-hover:text-purple-700 transition-colors">
            AI Career Transition Guide
          </p>
          <p className="text-sm text-gray-600 mt-1">Essential reading for Phase 1</p>
        </div>
        <div className="p-4 rounded-lg bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-100 hover:shadow-lg transition-all duration-300 cursor-pointer group">
          <p className="font-medium text-primary group-hover:text-blue-700 transition-colors">
            Industry Trends Report 2024
          </p>
          <p className="text-sm text-gray-600 mt-1">Latest AI job market insights</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourcesSection;
