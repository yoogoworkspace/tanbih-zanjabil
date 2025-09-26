import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import Header from '../../components/ui/Header';
import PersonalInfoSection from './components/PersonalInfoSection';
import IslamicPreferencesSection from './components/IslamicPreferencesSection';
import NotificationSettings from './components/NotificationSettings';
import PrivacySecuritySection from './components/PrivacySecuritySection';
import ConnectedAccountsSection from './components/ConnectedAccountsSection';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const ProfileSettings = () => {
  const { user, userProfile, loading: authLoading, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [userInfo, setUserInfo] = useState(null);
  const [notificationSettings, setNotificationSettings] = useState(null);

  useEffect(() => {
    if (userProfile) {
      setUserInfo({
        name: userProfile.full_name,
        email: userProfile.email,
        city: userProfile.location,
        phone: userProfile.phone,
      });
      setNotificationSettings(userProfile.notification_preferences);
    }
  }, [userProfile]);

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: 'User' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'privacy', label: 'Privacy & Security', icon: 'Shield' },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleUserInfoUpdate = async (updatedInfo) => {
    await updateProfile({
      full_name: updatedInfo.name,
      location: updatedInfo.city,
      phone: updatedInfo.phone,
    });
    setUserInfo(updatedInfo);
  };

  const handleNotificationUpdate = async (updatedNotifications) => {
    await updateProfile({ notification_preferences: updatedNotifications });
    setNotificationSettings(updatedNotifications);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          userInfo && <PersonalInfoSection
            userInfo={userInfo}
            onUpdate={handleUserInfoUpdate}
          />
        );
      case 'notifications':
        return (
          notificationSettings && <NotificationSettings
            notifications={notificationSettings}
            onUpdate={handleNotificationUpdate}
          />
        );
      case 'privacy':
        return (
          <PrivacySecuritySection
            privacy={{}}
            onUpdate={() => {}}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 pb-20 lg:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.history?.back()}
                className="lg:hidden"
              >
                <Icon name="ArrowLeft" size={20} />
              </Button>
              <div>
                <h1 className="font-heading text-3xl font-bold text-foreground">Profile Settings</h1>
                <p className="font-caption text-muted-foreground mt-1">
                  Customize your Islamic spiritual guidance experience
                </p>
              </div>
            </div>
            
            {/* Breadcrumb */}
            <nav className="hidden lg:flex items-center space-x-2 text-sm">
              <a href="/dashboard" className="text-muted-foreground hover:text-foreground">
                Dashboard
              </a>
              <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
              <span className="text-foreground">Profile Settings</span>
            </nav>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg shadow-islamic-subtle border border-border p-4 sticky top-24">
                <nav className="space-y-2">
                  {tabs?.map((tab) => (
                    <button
                      key={tab?.id}
                      onClick={() => setActiveTab(tab?.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ease-islamic ${
                        activeTab === tab?.id
                          ? 'bg-primary text-primary-foreground shadow-islamic-subtle'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon name={tab?.icon} size={18} />
                      <span className="font-body text-sm font-medium">{tab?.label}</span>
                    </button>
                  ))}
                </nav>

                {/* Quick Actions */}
                <div className="mt-6 pt-6 border-t border-border">
                  <h4 className="font-body font-medium text-foreground mb-3">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      iconName="Download"
                      iconPosition="left"
                      onClick={() => setActiveTab('privacy')}
                    >
                      Export Data
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      iconName="RefreshCw"
                      iconPosition="left"
                      onClick={() => window.location?.reload()}
                    >
                      Reset Settings
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      iconName="HelpCircle"
                      iconPosition="left"
                      onClick={() => window.open('/help', '_blank')}
                    >
                      Get Help
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="space-y-6">
                {renderTabContent()}
              </div>
            </div>
          </div>

          {/* Mobile Tab Navigation */}
          <div className="lg:hidden fixed bottom-16 left-0 right-0 bg-background border-t border-border z-30">
            <div className="flex items-center justify-around py-2 px-4 overflow-x-auto">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 ease-islamic min-w-0 ${
                    activeTab === tab?.id
                      ? 'text-primary' :'text-muted-foreground'
                  }`}
                >
                  <Icon name={tab?.icon} size={18} />
                  <span className="text-xs font-caption truncate">{tab?.label?.split(' ')?.[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileSettings;