import { User, Edit, Mail, Phone, Building2, MapPin } from 'lucide-react';
import { UserData } from './types';

interface ProfileSectionProps {
  user: UserData;
}

export const ProfileSection = ({ user }: ProfileSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
          <Edit className="h-4 w-4" />
          <span>Edit Profile</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture & Basic Info */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="text-center">
            <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {user.profileImage ? (
                <img src={user.profileImage} alt="Profile" className="h-24 w-24 rounded-full object-cover" />
              ) : (
                <User className="h-12 w-12 text-green-600" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{user.fullName}</h3>
            <p className="text-sm text-gray-500 mb-2">{user.email}</p>
            <div className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
              {user.plan} Plan
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <p className="text-sm text-gray-900">{user.fullName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <p className="text-sm text-gray-900">{user.email}</p>
              </div>
            </div>
            {user.phone && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <p className="text-sm text-gray-900">{user.phone}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Company Information */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
          <div className="space-y-4">
            {user.companyName && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <div className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4 text-gray-400" />
                  <p className="text-sm text-gray-900">{user.companyName}</p>
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Type</label>
              <p className="text-sm text-gray-900 capitalize">{user.companyType.replace('_', ' ')}</p>
            </div>
            {user.industry && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                <p className="text-sm text-gray-900">{user.industry}</p>
              </div>
            )}
            {user.address && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <p className="text-sm text-gray-900">
                    {[user.address.city, user.address.state, user.address.country].filter(Boolean).join(', ')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
