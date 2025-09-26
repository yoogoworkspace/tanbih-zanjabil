import React, { useState } from 'react';
import { Checkbox } from '../../../components/ui/Checkbox';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const PrivacySecuritySection = ({ privacy, onUpdate }) => {
  const [formData, setFormData] = useState(privacy);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleCheckboxChange = (field, checked) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onUpdate(formData);
    } catch (error) {
      console.error('Error updating privacy settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (passwordData?.newPassword !== passwordData?.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    setPasswordLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordChange(false);
      alert('Password updated successfully');
    } catch (error) {
      console.error('Error updating password:', error);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDataExport = async () => {
    try {
      // Simulate data export
      const exportData = {
        prayerHistory: 'Prayer tracking data from last 12 months',
        dhikrProgress: 'Daily dhikr completion records',
        halalChecks: 'Halal verification history',
        surveyResponses: 'Wellness survey responses',
        chatHistory: 'AI companion conversation logs'
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'islamic-wellness-data-export.json';
      link?.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  const handleAccountDeletion = () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.'
    );
    
    if (confirmed) {
      const finalConfirm = window.confirm(
        'This is your final warning. Deleting your account will remove all prayer history, dhikr progress, and personal data. Type "DELETE" in the next prompt to confirm.'
      );
      
      if (finalConfirm) {
        const deleteConfirmation = prompt('Type "DELETE" to confirm account deletion:');
        if (deleteConfirmation === 'DELETE') {
          alert('Account deletion request submitted. You will receive a confirmation email within 24 hours.');
        }
      }
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-islamic-subtle border border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-error text-error-foreground rounded-lg flex items-center justify-center">
            <Icon name="Shield" size={20} />
          </div>
          <div>
            <h3 className="font-heading text-lg font-semibold text-foreground">Privacy & Security</h3>
            <p className="font-caption text-sm text-muted-foreground">Manage your data and account security</p>
          </div>
        </div>
      </div>
      <div className="p-6 space-y-8">
        {/* Data Privacy */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Icon name="Database" size={18} className="text-primary" />
            <h4 className="font-body font-medium text-foreground">Data Management</h4>
          </div>
          
          <div className="space-y-3 pl-6">
            <Checkbox
              label="Save Chat History"
              description="Store AI companion conversations for personalized responses"
              checked={formData?.saveChatHistory}
              onChange={(e) => handleCheckboxChange('saveChatHistory', e?.target?.checked)}
            />
            <Checkbox
              label="Store Survey Responses"
              description="Keep wellness survey data for progress tracking"
              checked={formData?.storeSurveyData}
              onChange={(e) => handleCheckboxChange('storeSurveyData', e?.target?.checked)}
            />
            <Checkbox
              label="Halal Check History"
              description="Maintain record of halal verification searches"
              checked={formData?.saveHalalHistory}
              onChange={(e) => handleCheckboxChange('saveHalalHistory', e?.target?.checked)}
            />
            <Checkbox
              label="Prayer Analytics"
              description="Track prayer consistency and timing patterns"
              checked={formData?.prayerAnalytics}
              onChange={(e) => handleCheckboxChange('prayerAnalytics', e?.target?.checked)}
            />
          </div>
        </div>

        {/* Account Security */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Icon name="Lock" size={18} className="text-warning" />
            <h4 className="font-body font-medium text-foreground">Account Security</h4>
          </div>
          
          <div className="space-y-4 pl-6">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="font-body text-foreground">Password</p>
                <p className="font-caption text-sm text-muted-foreground">Last changed 3 months ago</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPasswordChange(!showPasswordChange)}
                iconName="Edit2"
                iconPosition="left"
              >
                Change Password
              </Button>
            </div>

            {showPasswordChange && (
              <div className="space-y-4 p-4 bg-background rounded-lg border border-border">
                <Input
                  label="Current Password"
                  type="password"
                  placeholder="Enter current password"
                  value={passwordData?.currentPassword}
                  onChange={(e) => handlePasswordChange('currentPassword', e?.target?.value)}
                  required
                />
                <Input
                  label="New Password"
                  type="password"
                  placeholder="Enter new password"
                  value={passwordData?.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e?.target?.value)}
                  required
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  placeholder="Confirm new password"
                  value={passwordData?.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e?.target?.value)}
                  required
                />
                <div className="flex items-center space-x-3">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handlePasswordUpdate}
                    loading={passwordLoading}
                  >
                    Update Password
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPasswordChange(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="font-body text-foreground">Two-Factor Authentication</p>
                <p className="font-caption text-sm text-muted-foreground">
                  {formData?.twoFactorEnabled ? 'Enabled via SMS' : 'Not enabled'}
                </p>
              </div>
              <Button
                variant={formData?.twoFactorEnabled ? "outline" : "default"}
                size="sm"
                onClick={() => handleCheckboxChange('twoFactorEnabled', !formData?.twoFactorEnabled)}
              >
                {formData?.twoFactorEnabled ? 'Disable' : 'Enable'}
              </Button>
            </div>
          </div>
        </div>

        {/* Data Export & Deletion */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Icon name="Download" size={18} className="text-success" />
            <h4 className="font-body font-medium text-foreground">Data Export & Account</h4>
          </div>
          
          <div className="space-y-4 pl-6">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="font-body text-foreground">Export Your Data</p>
                <p className="font-caption text-sm text-muted-foreground">Download all your Islamic practice data</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDataExport}
                iconName="Download"
                iconPosition="left"
              >
                Export Data
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-error/10 border border-error/20 rounded-lg">
              <div>
                <p className="font-body text-foreground">Delete Account</p>
                <p className="font-caption text-sm text-muted-foreground">Permanently remove your account and all data</p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleAccountDeletion}
                iconName="Trash2"
                iconPosition="left"
              >
                Delete Account
              </Button>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Button
            variant="default"
            onClick={handleSave}
            loading={loading}
            iconName="Save"
            iconPosition="left"
          >
            Save Privacy Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PrivacySecuritySection;