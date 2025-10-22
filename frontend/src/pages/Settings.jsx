import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Cog6ToothIcon,
  PaintBrushIcon,
  BellIcon,
  ShieldCheckIcon,
  KeyIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ComputerDesktopIcon,
  SunIcon,
  MoonIcon,
  LanguageIcon
} from '@heroicons/react/24/outline';
import { Button, Card, Badge, Loading, Input } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import api from '../utils/api';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  
  const [settings, setSettings] = useState({
    // General Settings
    theme: user?.preferences?.theme || 'dark',
    language: user?.preferences?.language || 'javascript',
    interfaceLanguage: i18n.language || 'en',
    autoSave: true,
    wordWrap: true,
    minimap: true,
    fontSize: 14,
    tabSize: 2,
    
    // Notifications
    emailNotifications: user?.preferences?.notifications?.email || true,
    pushNotifications: user?.preferences?.notifications?.push || true,
    newFeatureUpdates: true,
    achievementNotifications: true,
    weeklyProgress: true,
    
    // Security
    twoFactorEnabled: false,
    sessionTimeout: 30,
    
    // Privacy
    profileVisibility: 'public',
    showProgress: true,
    showAchievements: true
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Icon mapping function to prevent object rendering
  const getIconComponent = (iconType) => {
    const iconMap = {
      cog: Cog6ToothIcon,
      paintbrush: PaintBrushIcon,
      bell: BellIcon,
      shield: ShieldCheckIcon,
      key: KeyIcon,
      sun: SunIcon,
      moon: MoonIcon,
      computer: ComputerDesktopIcon,
    };
    return iconMap[iconType] || Cog6ToothIcon;
  };

  const tabs = [
    { id: 'general', name: t('settings.general'), iconType: 'cog' },
    { id: 'appearance', name: t('settings.appearance'), iconType: 'paintbrush' },
    { id: 'notifications', name: t('settings.notifications'), iconType: 'bell' },
    { id: 'security', name: t('settings.security'), iconType: 'shield' },
    { id: 'account', name: t('settings.account'), iconType: 'key' }
  ];

  const themes = [
    { id: 'light', name: t('settings.light'), iconType: 'sun' },
    { id: 'dark', name: t('settings.dark'), iconType: 'moon' },
    { id: 'system', name: t('settings.system'), iconType: 'computer' }
  ];

  const languages = [
    { id: 'javascript', name: 'JavaScript' },
    { id: 'python', name: 'Python' },
    { id: 'typescript', name: 'TypeScript' },
    { id: 'java', name: 'Java' }
  ];

  const interfaceLanguages = [
    { id: 'en', name: t('languages.en') },
    { id: 'es', name: t('languages.es') },
    { id: 'fr', name: t('languages.fr') },
    { id: 'de', name: t('languages.de') },
    { id: 'zh', name: t('languages.zh') },
    { id: 'ja', name: t('languages.ja') },
    { id: 'ar', name: t('languages.ar') },
    { id: 'ru', name: t('languages.ru') },
    { id: 'pt', name: t('languages.pt') },
    { id: 'it', name: t('languages.it') }
  ];

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));

    // Handle interface language change immediately
    if (key === 'interfaceLanguage') {
      i18n.changeLanguage(value);
      toast.success(t('settings.settingsSaved'));
    }
  };

  const handleSaveSettings = async () => {
    try {
      setLoading(true);

      const response = await api.put('/auth/preferences', settings);

      if (response.data) {
        toast.success(t('settings.settingsSaved'));
        // Update user context with new preferences
        updateUser({ ...user, preferences: settings });
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      toast.error(t('settings.errorSaving') + ': ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwords.new !== passwords.confirm) {
      toast.error(t('settings.passwordsDoNotMatch'));
      return;
    }

    if (passwords.new.length < 8) {
      toast.error(t('settings.passwordTooShort'));
      return;
    }

    try {
      setLoading(true);

      const response = await api.post('/auth/change-password', {
        currentPassword: passwords.current,
        newPassword: passwords.new
      });

      if (response.data) {
        toast.success(t('settings.passwordChanged'));
        setPasswords({ current: '', new: '', confirm: '' });
      } else {
        throw new Error('Failed to change password');
      }
    } catch (error) {
      toast.error('Error changing password: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);

      const response = await api.delete('/auth/delete-account');

      if (response.data) {
        toast.success(t('settings.accountDeleted'));
        // Logout and redirect
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else {
        throw new Error('Failed to delete account');
      }
    } catch (error) {
      toast.error('Error deleting account: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-secondary-900 mb-4">{t('settings.interfaceLanguage')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              {t('settings.language')}
            </label>
            <select
              value={settings.interfaceLanguage}
              onChange={(e) => handleSettingChange('interfaceLanguage', e.target.value)}
              className="w-full border border-secondary-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {interfaceLanguages.map(lang => (
                <option key={lang.id} value={lang.id}>{lang.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-secondary-900 mb-4">{t('settings.editorPreferences')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              {t('settings.defaultLanguage')}
            </label>
            <select
              value={settings.language}
              onChange={(e) => handleSettingChange('language', e.target.value)}
              className="w-full border border-secondary-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {languages.map(lang => (
                <option key={lang.id} value={lang.id}>{lang.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              {t('settings.fontSize')}
            </label>
            <input
              type="number"
              min="10"
              max="24"
              value={settings.fontSize}
              onChange={(e) => handleSettingChange('fontSize', parseInt(e.target.value))}
              className="w-full border border-secondary-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              {t('settings.tabSize')}
            </label>
            <select
              value={settings.tabSize}
              onChange={(e) => handleSettingChange('tabSize', parseInt(e.target.value))}
              className="w-full border border-secondary-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
              <option value={8}>8 spaces</option>
            </select>
          </div>
        </div>
        
        <div className="mt-6 space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.autoSave}
              onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
              className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-secondary-700">{t('settings.autoSave')}</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.wordWrap}
              onChange={(e) => handleSettingChange('wordWrap', e.target.checked)}
              className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-secondary-700">{t('settings.wordWrap')}</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.minimap}
              onChange={(e) => handleSettingChange('minimap', e.target.checked)}
              className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-secondary-700">{t('settings.minimap')}</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-secondary-900 mb-4">{t('settings.theme')}</h3>
        <div className="grid grid-cols-3 gap-4">
          {themes.map(theme => (
            <button
              key={theme.id}
              onClick={() => handleSettingChange('theme', theme.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                settings.theme === theme.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-secondary-200 hover:border-secondary-300'
              }`}
            >
              {(() => {
                const IconComponent = getIconComponent(theme.iconType);
                return <IconComponent className="w-8 h-8 mx-auto mb-2 text-secondary-600" />;
              })()}
              <div className="text-sm font-medium">{theme.name}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-secondary-900 mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-secondary-700">Email Notifications</span>
              <p className="text-sm text-secondary-500">Receive updates via email</p>
            </div>
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
              className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
            />
          </label>
          
          <label className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-secondary-700">Push Notifications</span>
              <p className="text-sm text-secondary-500">Browser push notifications</p>
            </div>
            <input
              type="checkbox"
              checked={settings.pushNotifications}
              onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
              className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
            />
          </label>
          
          <label className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-secondary-700">Achievement Notifications</span>
              <p className="text-sm text-secondary-500">Get notified when you earn achievements</p>
            </div>
            <input
              type="checkbox"
              checked={settings.achievementNotifications}
              onChange={(e) => handleSettingChange('achievementNotifications', e.target.checked)}
              className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
            />
          </label>
          
          <label className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-secondary-700">Weekly Progress Report</span>
              <p className="text-sm text-secondary-500">Weekly summary of your coding activity</p>
            </div>
            <input
              type="checkbox"
              checked={settings.weeklyProgress}
              onChange={(e) => handleSettingChange('weeklyProgress', e.target.checked)}
              className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
            />
          </label>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-secondary-900 mb-4">Change Password</h3>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <Input
            type="password"
            label="Current Password"
            value={passwords.current}
            onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
            required
          />
          <Input
            type="password"
            label="New Password"
            value={passwords.new}
            onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
            required
            minLength={8}
          />
          <Input
            type="password"
            label="Confirm New Password"
            value={passwords.confirm}
            onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
            required
          />
          <Button type="submit" variant="primary" loading={loading}>
            Change Password
          </Button>
        </form>
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-secondary-900 mb-4">Session Settings</h3>
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Session Timeout (minutes)
          </label>
          <select
            value={settings.sessionTimeout}
            onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
            className="w-full border border-secondary-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={60}>1 hour</option>
            <option value={120}>2 hours</option>
            <option value={0}>Never</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderAccountSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-secondary-900 mb-4">Privacy Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Profile Visibility
            </label>
            <select
              value={settings.profileVisibility}
              onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
              className="w-full border border-secondary-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="public">Public</option>
              <option value="friends">Friends Only</option>
              <option value="private">Private</option>
            </select>
          </div>
          
          <label className="flex items-center justify-between">
            <span className="text-sm font-medium text-secondary-700">Show Progress Publicly</span>
            <input
              type="checkbox"
              checked={settings.showProgress}
              onChange={(e) => handleSettingChange('showProgress', e.target.checked)}
              className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
            />
          </label>
          
          <label className="flex items-center justify-between">
            <span className="text-sm font-medium text-secondary-700">Show Achievements Publicly</span>
            <input
              type="checkbox"
              checked={settings.showAchievements}
              onChange={(e) => handleSettingChange('showAchievements', e.target.checked)}
              className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
            />
          </label>
        </div>
      </div>
      
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-red-600 mb-4 flex items-center">
          <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
          Danger Zone
        </h3>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-medium text-red-800 mb-2">Delete Account</h4>
          <p className="text-sm text-red-600 mb-4">
            This action is irreversible. All your data, including progress, code history, and achievements will be permanently deleted.
          </p>
          {!showDeleteConfirm ? (
            <Button
              variant="danger"
              icon={TrashIcon}
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete Account
            </Button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm font-medium text-red-800">
                Are you absolutely sure? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <Button
                  variant="danger"
                  onClick={handleDeleteAccount}
                  loading={loading}
                >
                  Yes, Delete My Account
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'appearance':
        return renderAppearanceSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'security':
        return renderSecuritySettings();
      case 'account':
        return renderAccountSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">{t('settings.title')}</h1>
          <p className="text-secondary-600">{t('settings.subtitle')}</p>
        </div>
        
        <Button
          variant="primary"
          icon={CheckCircleIcon}
          onClick={handleSaveSettings}
          loading={loading}
        >
          {t('settings.saveChanges')}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-100 text-primary-700 border-l-4 border-primary-500'
                    : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100'
                }`}
              >
                {(() => {
                  const IconComponent = getIconComponent(tab.iconType);
                  return <IconComponent className="w-5 h-5 mr-3" />;
                })()}
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <Card className="p-6">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              {renderTabContent()}
            </motion.div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;