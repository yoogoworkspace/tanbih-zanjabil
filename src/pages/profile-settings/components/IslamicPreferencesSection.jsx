import React, { useState } from 'react';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const IslamicPreferencesSection = ({ preferences, onUpdate }) => {
  const [formData, setFormData] = useState(preferences);
  const [loading, setLoading] = useState(false);

  const madhabOptions = [
    { value: 'hanafi', label: 'Hanafi' },
    { value: 'maliki', label: 'Maliki' },
    { value: 'shafii', label: 'Shafi\'i' },
    { value: 'hanbali', label: 'Hanbali' }
  ];

  const calculationMethodOptions = [
    { value: 'mwl', label: 'Muslim World League' },
    { value: 'isna', label: 'Islamic Society of North America' },
    { value: 'egypt', label: 'Egyptian General Authority of Survey' },
    { value: 'makkah', label: 'Umm Al-Qura University, Makkah' },
    { value: 'karachi', label: 'University of Islamic Sciences, Karachi' }
  ];

  const reciterOptions = [
    { value: 'mishary', label: 'Mishary Rashid Alafasy' },
    { value: 'sudais', label: 'Abdul Rahman Al-Sudais' },
    { value: 'husary', label: 'Mahmoud Khalil Al-Husary' },
    { value: 'minshawi', label: 'Mohamed Siddiq El-Minshawi' },
    { value: 'ajmi', label: 'Ahmed ibn Ali al-Ajmi' }
  ];

  const handleSelectChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckboxChange = (field, checked) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onUpdate(formData);
    } catch (error) {
      console.error('Error updating preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-islamic-subtle border border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-accent text-accent-foreground rounded-lg flex items-center justify-center">
            <Icon name="BookOpen" size={20} />
          </div>
          <div>
            <h3 className="font-heading text-lg font-semibold text-foreground">Islamic Preferences</h3>
            <p className="font-caption text-sm text-muted-foreground">Customize your spiritual guidance settings</p>
          </div>
        </div>
      </div>
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Madhab (School of Thought)"
            description="Select your preferred Islamic jurisprudence"
            options={madhabOptions}
            value={formData?.madhab}
            onChange={(value) => handleSelectChange('madhab', value)}
          />

          <Select
            label="Prayer Time Calculation"
            description="Method for calculating prayer times"
            options={calculationMethodOptions}
            value={formData?.calculationMethod}
            onChange={(value) => handleSelectChange('calculationMethod', value)}
          />
        </div>

        <Select
          label="Qur'an Recitation Voice"
          description="Choose your preferred reciter for audio playback"
          options={reciterOptions}
          value={formData?.reciter}
          onChange={(value) => handleSelectChange('reciter', value)}
        />

        <div className="space-y-4">
          <h4 className="font-body font-medium text-foreground">Display Preferences</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Checkbox
              label="Show Arabic Text"
              description="Display Qur'an verses and duas in Arabic"
              checked={formData?.showArabicText}
              onChange={(e) => handleCheckboxChange('showArabicText', e?.target?.checked)}
            />
            <Checkbox
              label="Show Transliteration"
              description="Display phonetic pronunciation guide"
              checked={formData?.showTransliteration}
              onChange={(e) => handleCheckboxChange('showTransliteration', e?.target?.checked)}
            />
            <Checkbox
              label="Islamic Calendar"
              description="Show Hijri dates alongside Gregorian"
              checked={formData?.showIslamicCalendar}
              onChange={(e) => handleCheckboxChange('showIslamicCalendar', e?.target?.checked)}
            />
            <Checkbox
              label="24-Hour Format"
              description="Display prayer times in 24-hour format"
              checked={formData?.use24HourFormat}
              onChange={(e) => handleCheckboxChange('use24HourFormat', e?.target?.checked)}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-body font-medium text-foreground">AI Companion Settings</h4>
          <div className="space-y-3">
            <Checkbox
              label="Personalized Responses"
              description="Allow AI to learn from your preferences for better guidance"
              checked={formData?.personalizedAI}
              onChange={(e) => handleCheckboxChange('personalizedAI', e?.target?.checked)}
            />
            <Checkbox
              label="Contextual Reminders"
              description="Receive relevant Islamic reminders based on time and activity"
              checked={formData?.contextualReminders}
              onChange={(e) => handleCheckboxChange('contextualReminders', e?.target?.checked)}
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
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IslamicPreferencesSection;