import React from 'react';
import Icon from '../../../components/AppIcon';

const NotificationSettings = ({ settings, onSettingsUpdate }) => {
  const notificationTypes = [
    {
      id: 'maktoobah',
      name: 'Obligatory Prayers (Maktoobah)',
      description: 'Fajr, Dhuhr, Asr, Maghrib, Isha',
      icon: 'Bell',
      color: 'text-primary'
    },
    {
      id: 'rawatib',
      name: 'Sunnah Prayers (Rawatib)',
      description: 'Before and after obligatory prayers',
      icon: 'Clock',
      color: 'text-accent'
    },
    {
      id: 'tahajjud',
      name: 'Tahajjud',
      description: 'Night prayer before Fajr',
      icon: 'Moon',
      color: 'text-secondary'
    },
    {
      id: 'duha',
      name: 'Duha',
      description: 'Morning prayer after sunrise',
      icon: 'Sun',
      color: 'text-warning'
    },
    {
      id: 'tarawih',
      name: 'Tarawih',
      description: 'Ramadan night prayers',
      icon: 'Star',
      color: 'text-success'
    },
    {
      id: 'lailat_al_qadr',
      name: 'Lailat al Qadr',
      description: 'Night of Power reminders',
      icon: 'Sparkles',
      color: 'text-primary'
    }
  ];

  const dhikrReminders = [
    {
      id: 'sleep',
      name: 'Sleep Dhikr',
      description: 'Before going to bed',
      defaultTime: '22:00'
    },
    {
      id: 'wake',
      name: 'Wake Dhikr',
      description: 'Upon waking up',
      defaultTime: '05:30'
    },
    {
      id: 'post_prayer',
      name: 'Post-Prayer Dhikr',
      description: 'After each prayer',
      defaultTime: null
    }
  ];

  const handleToggle = (type, id) => {
    const updatedSettings = {
      ...settings,
      [type]: {
        ...settings?.[type],
        [id]: {
          ...settings?.[type]?.[id],
          enabled: !settings?.[type]?.[id]?.enabled
        }
      }
    };
    onSettingsUpdate(updatedSettings);
  };

  const handleTimeUpdate = (type, id, time) => {
    const updatedSettings = {
      ...settings,
      [type]: {
        ...settings?.[type],
        [id]: {
          ...settings?.[type]?.[id],
          time: time
        }
      }
    };
    onSettingsUpdate(updatedSettings);
  };

  const handleAdvanceTimeUpdate = (type, id, minutes) => {
    const updatedSettings = {
      ...settings,
      [type]: {
        ...settings?.[type],
        [id]: {
          ...settings?.[type]?.[id],
          advanceMinutes: parseInt(minutes)
        }
      }
    };
    onSettingsUpdate(updatedSettings);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-semibold text-foreground mb-2">Notification Settings</h2>
        <p className="text-sm text-muted-foreground">Customize your prayer and dhikr reminders</p>
      </div>
      {/* Prayer Notifications */}
      <div className="space-y-4">
        <h3 className="font-medium text-foreground">Prayer Notifications</h3>
        <div className="space-y-3">
          {notificationTypes?.map((type) => (
            <div key={type?.id} className="p-4 bg-card border border-border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Icon name={type?.icon} size={20} className={type?.color} />
                  <div>
                    <h4 className="font-medium text-foreground">{type?.name}</h4>
                    <p className="text-sm text-muted-foreground">{type?.description}</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings?.prayers?.[type?.id]?.enabled || false}
                    onChange={() => handleToggle('prayers', type?.id)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-ring/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              {settings?.prayers?.[type?.id]?.enabled && (
                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      Advance Notice (minutes)
                    </label>
                    <select
                      value={settings?.prayers?.[type?.id]?.advanceMinutes || 10}
                      onChange={(e) => handleAdvanceTimeUpdate('prayers', type?.id, e?.target?.value)}
                      className="w-full px-2 py-1 text-sm border border-border rounded bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="0">At prayer time</option>
                      <option value="5">5 minutes before</option>
                      <option value="10">10 minutes before</option>
                      <option value="15">15 minutes before</option>
                      <option value="30">30 minutes before</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      Sound
                    </label>
                    <select
                      value={settings?.prayers?.[type?.id]?.sound || 'adhan'}
                      onChange={(e) => handleTimeUpdate('prayers', type?.id, e?.target?.value)}
                      className="w-full px-2 py-1 text-sm border border-border rounded bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="adhan">Adhan</option>
                      <option value="bell">Bell</option>
                      <option value="chime">Chime</option>
                      <option value="silent">Silent</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Dhikr Reminders */}
      <div className="space-y-4">
        <h3 className="font-medium text-foreground">Dhikr Reminders</h3>
        <div className="space-y-3">
          {dhikrReminders?.map((reminder) => (
            <div key={reminder?.id} className="p-4 bg-card border border-border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-medium text-foreground">{reminder?.name}</h4>
                  <p className="text-sm text-muted-foreground">{reminder?.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings?.dhikr?.[reminder?.id]?.enabled || false}
                    onChange={() => handleToggle('dhikr', reminder?.id)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-ring/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              {settings?.dhikr?.[reminder?.id]?.enabled && reminder?.defaultTime && (
                <div className="pt-3 border-t border-border">
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Reminder Time
                  </label>
                  <input
                    type="time"
                    value={settings?.dhikr?.[reminder?.id]?.time || reminder?.defaultTime}
                    onChange={(e) => handleTimeUpdate('dhikr', reminder?.id, e?.target?.value)}
                    className="px-2 py-1 text-sm border border-border rounded bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Global Settings */}
      <div className="p-4 bg-card border border-border rounded-lg">
        <h3 className="font-medium text-foreground mb-3">Global Settings</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-foreground">Do Not Disturb</h4>
              <p className="text-xs text-muted-foreground">Pause all notifications during sleep hours</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings?.global?.doNotDisturb || false}
                onChange={() => handleToggle('global', 'doNotDisturb')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-ring/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          {settings?.global?.doNotDisturb && (
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">From</label>
                <input
                  type="time"
                  value={settings?.global?.dndStart || '22:00'}
                  onChange={(e) => handleTimeUpdate('global', 'dndStart', e?.target?.value)}
                  className="w-full px-2 py-1 text-sm border border-border rounded bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">To</label>
                <input
                  type="time"
                  value={settings?.global?.dndEnd || '05:00'}
                  onChange={(e) => handleTimeUpdate('global', 'dndEnd', e?.target?.value)}
                  className="w-full px-2 py-1 text-sm border border-border rounded bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;