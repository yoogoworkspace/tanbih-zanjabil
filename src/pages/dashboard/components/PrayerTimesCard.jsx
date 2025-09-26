import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PrayerTimesCard = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextPrayer, setNextPrayer] = useState({ name: 'Maghrib', time: '18:45', remaining: '2h 15m' });
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const prayerTimes = [
    { name: 'Fajr', time: '05:30', status: 'completed', arabic: 'الفجر' },
    { name: 'Dhuhr', time: '12:45', status: 'completed', arabic: 'الظهر' },
    { name: 'Asr', time: '16:20', status: 'completed', arabic: 'العصر' },
    { name: 'Maghrib', time: '18:45', status: 'upcoming', arabic: 'المغرب' },
    { name: 'Isha', time: '20:15', status: 'pending', arabic: 'العشاء' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date?.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const handleNavigateToScheduler = () => {
    navigate('/prayer-times-scheduler');
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  return (
    <div className="bg-card rounded-xl p-6 shadow-islamic-moderate border border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="Clock" size={20} className="text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">Prayer Times</h3>
            <p className="font-caption text-sm text-muted-foreground">Today's Salah Schedule</p>
          </div>
        </div>
        <Button
          variant={notificationsEnabled ? "default" : "outline"}
          size="icon"
          onClick={toggleNotifications}
        >
          <Icon name={notificationsEnabled ? "Bell" : "BellOff"} size={16} />
        </Button>
      </div>
      {/* Current Time & Next Prayer */}
      <div className="bg-primary/5 rounded-lg p-4 mb-4 border border-primary/10">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-data text-2xl font-bold text-foreground">{formatTime(currentTime)}</p>
            <p className="font-caption text-sm text-muted-foreground">Current Time</p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-warning rounded-full animate-pulse"></div>
              <p className="font-medium text-foreground">{nextPrayer?.name} in {nextPrayer?.remaining}</p>
            </div>
            <p className="font-data text-lg text-primary">{nextPrayer?.time}</p>
          </div>
        </div>
      </div>
      {/* Prayer Times List */}
      <div className="space-y-2 mb-4">
        {prayerTimes?.map((prayer, index) => (
          <div
            key={index}
            className={`flex items-center justify-between p-3 rounded-lg transition-all ${
              prayer?.status === 'upcoming' ?'bg-warning/10 border border-warning/20' 
                : prayer?.status === 'completed' ?'bg-success/10 border border-success/20' :'bg-muted/30 border border-border'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                prayer?.status === 'upcoming' ? 'bg-warning text-warning-foreground' :
                prayer?.status === 'completed' ? 'bg-success text-success-foreground' :
                'bg-muted text-muted-foreground'
              }`}>
                <Icon 
                  name={prayer?.status === 'completed' ? 'Check' : 'Clock'} 
                  size={14} 
                />
              </div>
              <div>
                <p className="font-medium text-foreground">{prayer?.name}</p>
                <p className="font-caption text-xs text-muted-foreground">{prayer?.arabic}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-data text-foreground">{prayer?.time}</p>
              {prayer?.status === 'upcoming' && (
                <p className="text-xs text-warning">Next Prayer</p>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <Button
          variant="default"
          className="flex-1"
          onClick={handleNavigateToScheduler}
          iconName="Calendar"
          iconPosition="left"
        >
          View Scheduler
        </Button>
        <Button
          variant="outline"
          onClick={() => console.log('Qibla direction')}
          iconName="Compass"
          iconPosition="left"
        >
          Qibla
        </Button>
      </div>
    </div>
  );
};

export default PrayerTimesCard;