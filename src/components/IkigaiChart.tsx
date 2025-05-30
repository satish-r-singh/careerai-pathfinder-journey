
import React from 'react';
import { Heart, Globe, Star, DollarSign } from 'lucide-react';

const IkigaiChart = () => {
  return (
    <div className="flex justify-center mb-8">
      <div className="relative w-80 h-80">
        {/* What You Love - Top Left */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-red-100 rounded-full flex items-center justify-center border-2 border-red-200">
          <div className="text-center p-2">
            <Heart className="w-6 h-6 text-red-500 mx-auto mb-1" />
            <div className="text-xs font-medium text-red-700">What You Love</div>
            <div className="text-xs text-red-600">Passion</div>
          </div>
        </div>

        {/* What the World Needs - Top Right */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-green-100 rounded-full flex items-center justify-center border-2 border-green-200">
          <div className="text-center p-2">
            <Globe className="w-6 h-6 text-green-500 mx-auto mb-1" />
            <div className="text-xs font-medium text-green-700">What the World Needs</div>
            <div className="text-xs text-green-600">Mission</div>
          </div>
        </div>

        {/* What You're Good At - Bottom Left */}
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-100 rounded-full flex items-center justify-center border-2 border-blue-200">
          <div className="text-center p-2">
            <Star className="w-6 h-6 text-blue-500 mx-auto mb-1" />
            <div className="text-xs font-medium text-blue-700">What You're Good At</div>
            <div className="text-xs text-blue-600">Profession</div>
          </div>
        </div>

        {/* What You Can Be Paid For - Bottom Right */}
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-100 rounded-full flex items-center justify-center border-2 border-purple-200">
          <div className="text-center p-2">
            <DollarSign className="w-6 h-6 text-purple-500 mx-auto mb-1" />
            <div className="text-xs font-medium text-purple-700">What You Can Be Paid For</div>
            <div className="text-xs text-purple-600">Vocation</div>
          </div>
        </div>

        {/* Center - Ikigai */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white rounded-full flex items-center justify-center border-2 border-gray-300 shadow-lg">
          <div className="text-center">
            <div className="text-sm font-bold text-gray-800">IKIGAI</div>
            <div className="text-xs text-gray-600">Your Purpose</div>
          </div>
        </div>

        {/* Intersection Labels */}
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-yellow-100 px-2 py-1 rounded text-xs font-medium text-yellow-800">
          Satisfaction
        </div>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-orange-100 px-2 py-1 rounded text-xs font-medium text-orange-800">
          Excitement
        </div>
        <div className="absolute left-10 top-1/2 transform -translate-y-1/2 bg-pink-100 px-2 py-1 rounded text-xs font-medium text-pink-800">
          Delight
        </div>
        <div className="absolute right-10 top-1/2 transform -translate-y-1/2 bg-indigo-100 px-2 py-1 rounded text-xs font-medium text-indigo-800">
          Comfort
        </div>
      </div>
    </div>
  );
};

export default IkigaiChart;
