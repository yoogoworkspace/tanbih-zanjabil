import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import axios from 'axios';
import { format, differenceInMilliseconds, addMinutes } from 'date-fns';

const PrayerTimesCard = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [prayerTimes, setPrayerTimes] = useState([]);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  const prayerNames = {
    Fajr: 'الفجر',
    Dhuhr: 'الظهر',
    Asr: 'العصر',
    Maghrib: 'المغرب',
    Isha: 'العشاء',
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const fetchPrayerTimes = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://api.aladhan.com/v1/timingsByCity', {
          params: {
            city: 'London',
            country: 'United Kingdom',
            method: 2 // ISNA
          }
        });
        const timings = response.data.data.timings;
        const formattedPrayers = Object.entries(timings)
          .filter(([key]) => prayerNames[key])
          .map(([name, time]) => ({
            name,
            time,
            arabic: prayerNames[name],
            status: 'pending'
          }));
        setPrayerTimes(formattedPrayers);
      } catch (error) {
        console.error("Error fetching prayer times:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrayerTimes();

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (prayerTimes.length > 0) {
      const now = new Date();
      let nextPrayerFound = null;

      const sortedPrayers = prayerTimes.map(p => {
        const [hour, minute] = p.time.split(':');
        const prayerDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute);
        return { ...p, prayerDate };
      }).sort((a, b) => a.prayerDate - b.prayerDate);

      for (const prayer of sortedPrayers) {
        if (prayer.prayerDate > now) {
          const remaining = differenceInMilliseconds(prayer.prayerDate, now);
          const hours = Math.floor(remaining / (1000 * 60 * 60));
          const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
          nextPrayerFound = {
            name: prayer.name,
            time: prayer.time,
            remaining: `${hours}h ${minutes}m`,
            date: prayer.prayerDate,
          };
          break;
        }
      }
      setNextPrayer(nextPrayerFound);

      // Update statuses
      setPrayerTimes(currentPrayers => currentPrayers.map(p => {
        const [hour, minute] = p.time.split(':');
        const prayerDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute);
        if (nextPrayerFound && p.name === nextPrayerFound.name) {
          return { ...p, status: 'upcoming' };
        }
        if (prayerDate < now) {
          return { ...p, status: 'completed' };
        }
        return { ...p, status: 'pending' };
      }));
    }
  }, [currentTime, prayerTimes.length]);

  useEffect(() => {
    if (nextPrayer && notificationsEnabled && 'serviceWorker' in navigator && 'Notification' in window && Notification.permission === 'granted') {
      const notificationTime = addMinutes(nextPrayer.date, -1);
      const now = new Date();

      if (notificationTime > now) {
        const timeout = differenceInMilliseconds(notificationTime, now);
        const timerId = setTimeout(() => {
          navigator.serviceWorker.getRegistration().then(reg => {
            reg.showNotification('Prayer Time Reminder', {
              body: `${nextPrayer.name} prayer is in 1 minute.`,
              icon: '/favicon.ico',
            });
          });
        }, timeout);

        return () => clearTimeout(timerId);
      }
    }
  }, [nextPrayer, notificationsEnabled]);

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

  const toggleNotifications = async () => {
    if (notificationsEnabled) {
      setNotificationsEnabled(false);
    } else {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          setNotificationsEnabled(true);
          // You would typically save this preference to the user's profile in the database
        }
      } else {
        alert('This browser does not support desktop notification');
      }
    }
  };

  return (
    <div className="bg-card rounded-2xl p-6 shadow-islamic-moderate border border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
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
          className="rounded-xl"
        >
          <Icon name={notificationsEnabled ? "Bell" : "BellOff"} size={16} />
        </Button>
      </div>
      {/* Current Time & Next Prayer */}
      <div className="bg-primary/5 rounded-xl p-4 mb-4 border border-primary/10">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-data text-2xl font-bold text-foreground">{format(currentTime, 'p')}</p>
            <p className="font-caption text-sm text-muted-foreground">Current Time</p>
          </div>
          {nextPrayer && (
            <div className="text-right">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-warning rounded-full animate-pulse"></div>
                <p className="font-medium text-foreground">{nextPrayer.name} in {nextPrayer.remaining}</p>
              </div>
              <p className="font-data text-lg text-primary">{nextPrayer.time}</p>
            </div>
          )}
        </div>
      </div>
      {/* Prayer Times List */}
      <div className="space-y-2 mb-4">
        {loading ? (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">Loading prayer times...</p>
          </div>
        ) : prayerTimes.length > 0 ? (
          prayerTimes.map((prayer, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                prayer.status === 'upcoming' ? 'bg-warning/10 border border-warning/20'
                  : prayer.status === 'completed' ? 'bg-success/10 border border-success/20'
                  : 'bg-muted/30 border border-border'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  prayer.status === 'upcoming' ? 'bg-warning text-warning-foreground'
                    : prayer.status === 'completed' ? 'bg-success text-success-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  <Icon name={prayer.status === 'completed' ? 'Check' : 'Clock'} size={14} />
                </div>
                <div>
                  <p className="font-medium text-foreground">{prayer.name}</p>
                  <p className="font-caption text-xs text-muted-foreground">{prayer.arabic}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-data text-foreground">{prayer.time}</p>
                {prayer.status === 'upcoming' && (
                  <p className="text-xs text-warning">Next Prayer</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">Could not load prayer times.</p>
          </div>
        )}
      </div>
      <div className="flex space-x-2">
        <Button
          variant="default"
          className="flex-1 rounded-xl"
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
          className="rounded-xl"
        >
          Qibla
        </Button>
      </div>
    </div>
  );
};

export default PrayerTimesCard;