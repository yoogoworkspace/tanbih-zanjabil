import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const PersonalInfoSection = ({ userInfo, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(userInfo);
  const [loading, setLoading] = useState(false);

  const cityOptions = [
    { value: 'mecca', label: 'Mecca, Saudi Arabia' },
    { value: 'medina', label: 'Medina, Saudi Arabia' },
    { value: 'riyadh', label: 'Riyadh, Saudi Arabia' },
    { value: 'dubai', label: 'Dubai, UAE' },
    { value: 'doha', label: 'Doha, Qatar' },
    { value: 'kuwait', label: 'Kuwait City, Kuwait' },
    { value: 'cairo', label: 'Cairo, Egypt' },
    { value: 'istanbul', label: 'Istanbul, Turkey' },
    { value: 'karachi', label: 'Karachi, Pakistan' },
    { value: 'lahore', label: 'Lahore, Pakistan' },
    { value: 'dhaka', label: 'Dhaka, Bangladesh' },
    { value: 'jakarta', label: 'Jakarta, Indonesia' },
    { value: 'kuala_lumpur', label: 'Kuala Lumpur, Malaysia' },
    { value: 'london', label: 'London, UK' },
    { value: 'new_york', label: 'New York, USA' },
    { value: 'toronto', label: 'Toronto, Canada' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onUpdate(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(userInfo);
    setIsEditing(false);
  };

  return (
    <div className="bg-card rounded-lg shadow-islamic-subtle border border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary text-primary-foreground rounded-lg flex items-center justify-center">
              <Icon name="User" size={20} />
            </div>
            <div>
              <h3 className="font-heading text-lg font-semibold text-foreground">Personal Information</h3>
              <p className="font-caption text-sm text-muted-foreground">Manage your account details and location</p>
            </div>
          </div>
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              iconName="Edit2"
              iconPosition="left"
            >
              Edit
            </Button>
          )}
        </div>
      </div>
      <div className="p-6 space-y-6">
        {isEditing ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                type="text"
                placeholder="Enter your full name"
                value={formData?.name}
                onChange={(e) => handleInputChange('name', e?.target?.value)}
                required
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                value={formData?.email}
                onChange={(e) => handleInputChange('email', e?.target?.value)}
                required
              />
            </div>

            <Select
              label="City"
              description="Select your city for accurate prayer times"
              options={cityOptions}
              value={formData?.city}
              onChange={(value) => handleInputChange('city', value)}
              searchable
              required
            />

            <Input
              label="Phone Number (Optional)"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={formData?.phone}
              onChange={(e) => handleInputChange('phone', e?.target?.value)}
            />

            <div className="flex items-center space-x-3 pt-4">
              <Button
                variant="default"
                onClick={handleSave}
                loading={loading}
                iconName="Save"
                iconPosition="left"
              >
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="font-caption text-sm font-medium text-muted-foreground">Full Name</label>
                <p className="font-body text-foreground mt-1">{formData?.name}</p>
              </div>
              <div>
                <label className="font-caption text-sm font-medium text-muted-foreground">Email Address</label>
                <p className="font-body text-foreground mt-1">{formData?.email}</p>
              </div>
            </div>

            <div>
              <label className="font-caption text-sm font-medium text-muted-foreground">City</label>
              <p className="font-body text-foreground mt-1">
                {cityOptions?.find(city => city?.value === formData?.city)?.label || formData?.city}
              </p>
            </div>

            {formData?.phone && (
              <div>
                <label className="font-caption text-sm font-medium text-muted-foreground">Phone Number</label>
                <p className="font-body text-foreground mt-1">{formData?.phone}</p>
              </div>
            )}

            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Icon name="MapPin" size={16} />
              <span>Prayer times will be calculated based on your selected city</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalInfoSection;