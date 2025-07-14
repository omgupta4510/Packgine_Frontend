import { Lock, Download, LogOut } from 'lucide-react';
import { UserData } from './types';

interface SettingsSectionProps {
  user: UserData;
}

export const SettingsSection = ({ user }: SettingsSectionProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-berlin-gray-900">Settings</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notification Settings */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-berlin-gray-200">
          <h3 className="text-lg font-semibold text-berlin-gray-900 mb-4">Notification Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-berlin-gray-700">Email Notifications</label>
                <p className="text-sm text-berlin-gray-500">Receive notifications via email</p>
              </div>
              <input
                type="checkbox"
                checked={user.preferences?.notifications?.email}
                className="h-4 w-4 text-berlin-red-600 focus:ring-berlin-red-500 border-berlin-gray-300 rounded"
                readOnly
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-berlin-gray-700">New Products</label>
                <p className="text-sm text-berlin-gray-500">Get notified about new products</p>
              </div>
              <input
                type="checkbox"
                checked={user.preferences?.notifications?.newProducts}
                className="h-4 w-4 text-berlin-red-600 focus:ring-berlin-red-500 border-berlin-gray-300 rounded"
                readOnly
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-berlin-gray-700">Price Alerts</label>
                <p className="text-sm text-berlin-gray-500">Get notified about price changes</p>
              </div>
              <input
                type="checkbox"
                checked={user.preferences?.notifications?.priceAlerts}
                className="h-4 w-4 text-berlin-red-600 focus:ring-berlin-red-500 border-berlin-gray-300 rounded"
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-berlin-gray-200">
          <h3 className="text-lg font-semibold text-berlin-gray-900 mb-4">Account Settings</h3>
          <div className="space-y-4">
            <button className="w-full px-4 py-2 border border-berlin-gray-300 rounded-lg hover:bg-berlin-gray-50 transition-colors flex items-center justify-start space-x-2">
              <Lock className="h-4 w-4" />
              <span>Change Password</span>
            </button>
            <button className="w-full px-4 py-2 border border-berlin-gray-300 rounded-lg hover:bg-berlin-gray-50 transition-colors flex items-center justify-start space-x-2">
              <Download className="h-4 w-4" />
              <span>Download Data</span>
            </button>
            <button className="w-full px-4 py-2 border border-berlin-gray-300 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-start space-x-2 text-red-600">
              <LogOut className="h-4 w-4" />
              <span>Delete Account</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
