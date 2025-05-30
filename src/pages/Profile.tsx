
import { useState } from 'react';
import ProfileForm from '@/components/ProfileForm';
import ProfileDisplay from '@/components/ProfileDisplay';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Profile</h1>
          <p className="text-gray-600">
            Manage your profile information and career preferences
          </p>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <ProfileForm />
            <div className="text-center">
              <button
                onClick={() => setIsEditing(false)}
                className="text-primary hover:underline"
              >
                View Profile
              </button>
            </div>
          </div>
        ) : (
          <ProfileDisplay onEdit={() => setIsEditing(true)} />
        )}
      </div>
    </div>
  );
};

export default Profile;
