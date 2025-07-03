import React, { useState, useEffect } from 'react';
import { authService } from '../utils/auth';
import { Building2, User, MapPin, Tag, Lock, Eye, EyeOff, Save, Camera } from 'lucide-react';

const SupplierProfilePage: React.FC = () => {
  const [supplier, setSupplier] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Profile form state
  const [profileData, setProfileData] = useState({
    companyName: '',
    companyDescription: '',
    companyLogo: '',
    address: {
      country: '',
      city: '',
      state: '',
    },
    categories: [] as string[],
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    fetchSupplierData();
  }, []);

  const fetchSupplierData = async () => {
    try {
      setLoading(true);
      const supplier = await authService.getProfile();
      setSupplier(supplier);
      setProfileData({
        companyName: supplier.companyName || '',
        companyDescription: supplier.companyDescription || '',
        companyLogo: supplier.companyLogo || '',
        address: {
          country: supplier.address?.country || '',
          city: supplier.address?.city || '',
          state: supplier.address?.state || '',
        },
        categories: supplier.categories || [],
      });
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to fetch profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await authService.updateProfile(profileData);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    try {
      setChangingPassword(true);
      await authService.changePassword(passwordData.currentPassword, passwordData.newPassword);
      setSuccess('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setProfileData({
        ...profileData,
        categories: [...profileData.categories, category],
      });
    } else {
      setProfileData({
        ...profileData,
        categories: profileData.categories.filter(c => c !== category),
      });
    }
  };

  const availableCategories = [
    'Bottles & Containers',
    'Food Packaging',
    'Beauty & Personal Care',
    'Industrial Packaging',
    'Sustainable Materials',
    'Custom Packaging',
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-10 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">Manage your supplier account information</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Company Information</h2>
              
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                {/* Company Name */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Building2 className="w-4 h-4" />
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={profileData.companyName}
                    onChange={(e) => setProfileData({...profileData, companyName: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Company Description */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4" />
                    Company Description
                  </label>
                  <textarea
                    value={profileData.companyDescription}
                    onChange={(e) => setProfileData({...profileData, companyDescription: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell customers about your company..."
                  />
                </div>

                {/* Company Logo */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Camera className="w-4 h-4" />
                    Company Logo URL
                  </label>
                  <input
                    type="url"
                    value={profileData.companyLogo}
                    onChange={(e) => setProfileData({...profileData, companyLogo: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/logo.png"
                  />
                </div>

                {/* Address */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-4 h-4" />
                      Country
                    </label>
                    <input
                      type="text"
                      value={profileData.address.country}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        address: {...profileData.address, country: e.target.value}
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">State</label>
                    <input
                      type="text"
                      value={profileData.address.state}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        address: {...profileData.address, state: e.target.value}
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">City</label>
                    <input
                      type="text"
                      value={profileData.address.city}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        address: {...profileData.address, city: e.target.value}
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                    <Tag className="w-4 h-4" />
                    Business Categories
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {availableCategories.map((category) => (
                      <label key={category} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={profileData.categories.includes(category)}
                          onChange={(e) => handleCategoryChange(category, e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Info */}
            {supplier && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500">Email:</span>
                    <p className="font-medium">{supplier.email}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Username:</span>
                    <p className="font-medium">{supplier.username}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Account Status:</span>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      supplier.accountStatus === 'approved' ? 'bg-green-100 text-green-800' :
                      supplier.accountStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {supplier.accountStatus}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Change Password */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
              
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={changingPassword}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {changingPassword ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Lock className="w-4 h-4" />
                  )}
                  {changingPassword ? 'Changing...' : 'Change Password'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierProfilePage;
