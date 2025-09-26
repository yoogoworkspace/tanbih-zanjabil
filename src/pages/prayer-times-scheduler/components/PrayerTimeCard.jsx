import React from 'react';
import Icon from '../../../components/AppIcon';

const PrayerTimeCard = ({ prayer, isNext, isActive, onNotificationToggle }) => {
  const getStatusColor = () => {
    if (isActive) return 'bg-success text-success-foreground';
    if (isNext) return 'bg-warning text-warning-foreground';
    return 'bg-muted text-muted-foreground';
  };

  const getStatusIcon = () => {
    if (isActive) return 'CheckCircle';
    if (isNext) return 'Clock';
    return 'Circle';
  };

  return (
    <div className={`relative p-6 rounded-xl border transition-all duration-300 ${
      isNext ? 'border-warning bg-warning/5 shadow-islamic-moderate' : 
      isActive ? 'border-success bg-success/5' : 'border-border bg-card'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor()}`}>
            <Icon name={getStatusIcon()} size={20} />
          </div>
          <div>
            <h3 className="font-heading text-lg font-semibold text-foreground">{prayer?.name}</h3>
            <p className="font-caption text-sm text-muted-foreground">{prayer?.arabicName}</p>
          </div>
        </div>
        <button
          onClick={() => onNotificationToggle(prayer?.id)}
          className={`p-2 rounded-lg transition-colors ${
            prayer?.notificationEnabled 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          <Icon name="Bell" size={16} />
        </button>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-data text-2xl font-bold text-foreground">{prayer?.time}</span>
          {prayer?.countdown && (
            <div className="text-right">
              <p className="font-data text-sm text-muted-foreground">in</p>
              <p className="font-data text-lg font-semibold text-foreground">{prayer?.countdown}</p>
            </div>
          )}
        </div>

        {prayer?.jamaat && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Users" size={14} />
            <span>Jamaat: {prayer?.jamaat}</span>
          </div>
        )}

        {isNext && (
          <div className="mt-4 p-3 bg-warning/10 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} className="text-warning" />
              <span className="text-sm font-medium text-warning">Next Prayer</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrayerTimeCard;