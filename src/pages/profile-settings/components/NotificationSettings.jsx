import React, { useState } from 'react';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const NotificationSettings = ({ notifications, onUpdate }) => {
  const [formData, setFormData] = useState(notifications);
  const [loading, setLoading] = useState(false);

  const reminderTimeOptions = [
    { value: '5', label: '5 minutes before' },
    { value: '10', label: '10 minutes before' },
    { value: '15', label: '15 minutes before' },
    { value: '30', label: '30 minutes before' },
    { value: '60', label: '1 hour before' }
  ];

  const dhikrFrequencyOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'twice_daily', label: 'Twice Daily' },
    { value: 'after_prayers', label: 'After Each Prayer' },
    { value: 'custom', label: 'Custom Schedule' }
  ];

  const handleCheckboxChange = (category, field, checked) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev?.[category],
        [field]: checked
      }
    }));
  };

  const handleSelectChange = (category, field, value) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev?.[category],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onUpdate(formData);
    } catch (error) {
      console.error('Error updating notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-islamic-subtle border border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-warning text-warning-foreground rounded-lg flex items-center justify-center">
            <Icon name="Bell" size={20} />
          </div>
          <div>
            <h3 className="font-heading text-lg font-semibold text-foreground">Notification Settings</h3>
            <p className="font-caption text-sm text-muted-foreground">Manage your prayer and dhikr reminders</p>
          </div>
        </div>
      </div>
      <div className="p-6 space-y-8">
        {/* Prayer Notifications */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={18} className="text-primary" />
            <h4 className="font-body font-medium text-foreground">Prayer Notifications</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
            <Checkbox
              label="Fajr (Dawn Prayer)"
              description="Obligatory morning prayer"
              checked={formData?.prayers?.fajr}
              onChange={(e) => handleCheckboxChange('prayers', 'fajr', e?.target?.checked)}
            />
            <Checkbox
              label="Dhuhr (Noon Prayer)"
              description="Obligatory midday prayer"
              checked={formData?.prayers?.dhuhr}
              onChange={(e) => handleCheckboxChange('prayers', 'dhuhr', e?.target?.checked)}
            />
            <Checkbox
              label="Asr (Afternoon Prayer)"
              description="Obligatory afternoon prayer"
              checked={formData?.prayers?.asr}
              onChange={(e) => handleCheckboxChange('prayers', 'asr', e?.target?.checked)}
            />
            <Checkbox
              label="Maghrib (Sunset Prayer)"
              description="Obligatory evening prayer"
              checked={formData?.prayers?.maghrib}
              onChange={(e) => handleCheckboxChange('prayers', 'maghrib', e?.target?.checked)}
            />
            <Checkbox
              label="Isha (Night Prayer)"
              description="Obligatory night prayer"
              checked={formData?.prayers?.isha}
              onChange={(e) => handleCheckboxChange('prayers', 'isha', e?.target?.checked)}
            />
            <Checkbox
              label="Jumu'ah (Friday Prayer)"
              description="Congregational Friday prayer"
              checked={formData?.prayers?.jumah}
              onChange={(e) => handleCheckboxChange('prayers', 'jumah', e?.target?.checked)}
            />
          </div>

          <div className="pl-6">
            <Select
              label="Prayer Reminder Time"
              description="How early to receive prayer notifications"
              options={reminderTimeOptions}
              value={formData?.prayers?.reminderTime}
              onChange={(value) => handleSelectChange('prayers', 'reminderTime', value)}
            />
          </div>
        </div>

        {/* Sunnah Prayers */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Icon name="Star" size={18} className="text-accent" />
            <h4 className="font-body font-medium text-foreground">Sunnah & Nafl Prayers</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
            <Checkbox
              label="Rawatib (Sunnah Prayers)"
              description="Before and after obligatory prayers"
              checked={formData?.sunnah?.rawatib}
              onChange={(e) => handleCheckboxChange('sunnah', 'rawatib', e?.target?.checked)}
            />
            <Checkbox
              label="Tahajjud (Night Prayer)"
              description="Late night voluntary prayer"
              checked={formData?.sunnah?.tahajjud}
              onChange={(e) => handleCheckboxChange('sunnah', 'tahajjud', e?.target?.checked)}
            />
            <Checkbox
              label="Duha (Morning Prayer)"
              description="Mid-morning voluntary prayer"
              checked={formData?.sunnah?.duha}
              onChange={(e) => handleCheckboxChange('sunnah', 'duha', e?.target?.checked)}
            />
            <Checkbox
              label="Tarawih (Ramadan)"
              description="Special Ramadan night prayers"
              checked={formData?.sunnah?.tarawih}
              onChange={(e) => handleCheckboxChange('sunnah', 'tarawih', e?.target?.checked)}
            />
          </div>
        </div>

        {/* Dhikr Reminders */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Icon name="Heart" size={18} className="text-success" />
            <h4 className="font-body font-medium text-foreground">Dhikr Reminders</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
            <Checkbox
              label="Morning Adhkar"
              description="After Fajr prayer remembrance"
              checked={formData?.dhikr?.morning}
              onChange={(e) => handleCheckboxChange('dhikr', 'morning', e?.target?.checked)}
            />
            <Checkbox
              label="Evening Adhkar"
              description="After Maghrib prayer remembrance"
              checked={formData?.dhikr?.evening}
              onChange={(e) => handleCheckboxChange('dhikr', 'evening', e?.target?.checked)}
            />
            <Checkbox
              label="Sleep Duas"
              description="Before bedtime supplications"
              checked={formData?.dhikr?.sleep}
              onChange={(e) => handleCheckboxChange('dhikr', 'sleep', e?.target?.checked)}
            />
            <Checkbox
              label="Wake Up Duas"
              description="Upon waking supplications"
              checked={formData?.dhikr?.wakeup}
              onChange={(e) => handleCheckboxChange('dhikr', 'wakeup', e?.target?.checked)}
            />
          </div>

          <div className="pl-6">
            <Select
              label="Dhikr Frequency"
              description="How often to receive dhikr reminders"
              options={dhikrFrequencyOptions}
              value={formData?.dhikr?.frequency}
              onChange={(value) => handleSelectChange('dhikr', 'frequency', value)}
            />
          </div>
        </div>

        {/* Special Occasions */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Icon name="Calendar" size={18} className="text-secondary" />
            <h4 className="font-body font-medium text-foreground">Special Occasions</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
            <Checkbox
              label="Laylat al-Qadr"
              description="Night of Power during Ramadan"
              checked={formData?.special?.laylatAlQadr}
              onChange={(e) => handleCheckboxChange('special', 'laylatAlQadr', e?.target?.checked)}
            />
            <Checkbox
              label="Islamic Holidays"
              description="Eid and other Islamic celebrations"
              checked={formData?.special?.islamicHolidays}
              onChange={(e) => handleCheckboxChange('special', 'islamicHolidays', e?.target?.checked)}
            />
            <Checkbox
              label="Ramadan Reminders"
              description="Suhur, Iftar, and special prayers"
              checked={formData?.special?.ramadan}
              onChange={(e) => handleCheckboxChange('special', 'ramadan', e?.target?.checked)}
            />
            <Checkbox
              label="Hajj Season"
              description="Dhul Hijjah and Hajj-related reminders"
              checked={formData?.special?.hajj}
              onChange={(e) => handleCheckboxChange('special', 'hajj', e?.target?.checked)}
            />
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
            Save Notification Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;