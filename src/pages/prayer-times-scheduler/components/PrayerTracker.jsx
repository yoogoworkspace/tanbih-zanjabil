import React from 'react';
import Icon from '../../../components/AppIcon';

const PrayerTracker = ({ weeklyData, qiblaDirection, onMakeupSchedule }) => {
  const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const calculateConsistency = () => {
    const totalPrayers = weeklyData?.length * prayers?.length;
    const completedPrayers = weeklyData?.reduce((total, day) => {
      return total + prayers?.reduce((dayTotal, prayer) => {
        return dayTotal + (day?.prayers?.[prayer?.toLowerCase()]?.completed ? 1 : 0);
      }, 0);
    }, 0);
    return Math.round((completedPrayers / totalPrayers) * 100);
  };

  const getMissedPrayers = () => {
    const missed = [];
    weeklyData?.forEach((day, dayIndex) => {
      prayers?.forEach(prayer => {
        const prayerData = day?.prayers?.[prayer?.toLowerCase()];
        if (prayerData && !prayerData?.completed && prayerData?.missed) {
          missed?.push({
            prayer,
            day: days?.[dayIndex],
            date: day?.date,
            time: prayerData?.time
          });
        }
      });
    });
    return missed;
  };

  const getPrayerStatus = (day, prayer) => {
    const prayerData = day?.prayers?.[prayer?.toLowerCase()];
    if (!prayerData) return 'upcoming';
    if (prayerData?.completed) return 'completed';
    if (prayerData?.missed) return 'missed';
    return 'upcoming';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-success';
      case 'missed': return 'bg-error';
      default: return 'bg-muted';
    }
  };

  const consistency = calculateConsistency();
  const missedPrayers = getMissedPrayers();

  return (
    <div className="space-y-6">
      {/* Weekly Consistency */}
      <div className="p-6 bg-card border border-border rounded-xl shadow-islamic-subtle">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-lg font-semibold text-foreground">Weekly Prayer Consistency</h3>
          <div className="text-right">
            <div className="font-data text-2xl font-bold text-foreground">{consistency}%</div>
            <div className="text-sm text-muted-foreground">This week</div>
          </div>
        </div>

        <div className="space-y-3">
          {days?.map((day, dayIndex) => (
            <div key={day} className="flex items-center space-x-3">
              <div className="w-12 text-sm font-medium text-muted-foreground">{day}</div>
              <div className="flex space-x-1 flex-1">
                {prayers?.map(prayer => (
                  <div
                    key={prayer}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      getStatusColor(getPrayerStatus(weeklyData?.[dayIndex], prayer))
                    }`}
                    title={`${prayer} - ${getPrayerStatus(weeklyData?.[dayIndex], prayer)}`}
                  >
                    {getPrayerStatus(weeklyData?.[dayIndex], prayer) === 'completed' && (
                      <Icon name="Check" size={14} className="text-white" />
                    )}
                    {getPrayerStatus(weeklyData?.[dayIndex], prayer) === 'missed' && (
                      <Icon name="X" size={14} className="text-white" />
                    )}
                  </div>
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                {weeklyData?.[dayIndex]?.date}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success rounded"></div>
              <span className="text-muted-foreground">Completed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-error rounded"></div>
              <span className="text-muted-foreground">Missed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-muted rounded"></div>
              <span className="text-muted-foreground">Upcoming</span>
            </div>
          </div>
        </div>
      </div>
      {/* Missed Prayers Makeup */}
      {missedPrayers?.length > 0 && (
        <div className="p-6 bg-card border border-border rounded-xl shadow-islamic-subtle">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-lg font-semibold text-foreground">Makeup Prayers (Qada)</h3>
            <div className="flex items-center space-x-2 text-error">
              <Icon name="AlertTriangle" size={16} />
              <span className="text-sm font-medium">{missedPrayers?.length} missed</span>
            </div>
          </div>

          <div className="space-y-3">
            {missedPrayers?.slice(0, 5)?.map((missed, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-error/5 border border-error/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Icon name="Clock" size={16} className="text-error" />
                  <div>
                    <div className="font-medium text-foreground">{missed?.prayer}</div>
                    <div className="text-sm text-muted-foreground">{missed?.day}, {missed?.date} at {missed?.time}</div>
                  </div>
                </div>
                <button
                  onClick={() => onMakeupSchedule(missed)}
                  className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Schedule
                </button>
              </div>
            ))}
          </div>

          {missedPrayers?.length > 5 && (
            <div className="text-center mt-4">
              <button className="text-sm text-primary hover:text-primary/80 font-medium">
                View all {missedPrayers?.length} missed prayers
              </button>
            </div>
          )}
        </div>
      )}
      {/* Qibla Direction */}
      <div className="p-6 bg-card border border-border rounded-xl shadow-islamic-subtle">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-lg font-semibold text-foreground">Qibla Direction</h3>
          <div className="flex items-center space-x-2 text-primary">
            <Icon name="Compass" size={16} />
            <span className="text-sm font-medium">Makkah</span>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="relative w-32 h-32">
            <div className="absolute inset-0 border-4 border-border rounded-full"></div>
            <div className="absolute inset-2 border-2 border-muted rounded-full"></div>
            
            {/* Compass needle pointing to Qibla */}
            <div 
              className="absolute top-1/2 left-1/2 w-1 h-12 bg-primary origin-bottom transform -translate-x-1/2 -translate-y-full"
              style={{ transform: `translate(-50%, -100%) rotate(${qiblaDirection}deg)` }}
            >
              <div className="absolute -top-1 -left-1 w-3 h-3 bg-primary rounded-full"></div>
            </div>

            {/* Direction labels */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-sm font-medium text-muted-foreground">N</div>
            <div className="absolute top-1/2 -right-6 transform -translate-y-1/2 text-sm font-medium text-muted-foreground">E</div>
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-sm font-medium text-muted-foreground">S</div>
            <div className="absolute top-1/2 -left-6 transform -translate-y-1/2 text-sm font-medium text-muted-foreground">W</div>
          </div>
        </div>

        <div className="text-center mt-4">
          <div className="font-data text-lg font-semibold text-foreground">{qiblaDirection}°</div>
          <div className="text-sm text-muted-foreground">From your location</div>
        </div>
      </div>
      {/* Islamic Calendar */}
      <div className="p-6 bg-card border border-border rounded-xl shadow-islamic-subtle">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-lg font-semibold text-foreground">Islamic Calendar</h3>
          <Icon name="Calendar" size={20} className="text-primary" />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Today</span>
            <span className="font-data text-foreground">15 Rabi' al-Awwal 1446</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Gregorian</span>
            <span className="font-data text-foreground">September 26, 2025</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Season</span>
            <span className="text-foreground">Autumn</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center space-x-2 text-sm text-accent">
            <Icon name="Star" size={14} />
            <span>No special Islamic events today</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrayerTracker;