import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SessionHistory = ({ onSessionReplay }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  
  const mockSessions = [
    {
      id: 1,
      prayer: 'Fajr',
      date: '2025-09-26',
      time: '05:30',
      duration: '8:45',
      accuracy: 92,
      rakahs: 2,
      improvements: ['Excellent Ruku posture', 'Perfect Sujood alignment'],
      areas: ['Maintain focus during Qiyam']
    },
    {
      id: 2,
      prayer: 'Dhuhr',
      date: '2025-09-25',
      time: '12:15',
      duration: '12:30',
      accuracy: 88,
      rakahs: 4,
      improvements: ['Good overall posture', 'Consistent timing'],
      areas: ['Improve Ruku depth', 'Steady breathing']
    },
    {
      id: 3,
      prayer: 'Asr',
      date: '2025-09-25',
      time: '15:45',
      duration: '11:20',
      accuracy: 85,
      rakahs: 4,
      improvements: ['Better Sujood positioning'],
      areas: ['Work on Qiyam stability', 'Focus on recitation pace']
    },
    {
      id: 4,
      prayer: 'Maghrib',
      date: '2025-09-24',
      time: '18:30',
      duration: '9:15',
      accuracy: 90,
      rakahs: 3,
      improvements: ['Excellent session overall', 'Great concentration'],
      areas: ['Minor Ruku adjustments needed']
    },
    {
      id: 5,
      prayer: 'Isha',
      date: '2025-09-24',
      time: '20:00',
      duration: '13:45',
      accuracy: 87,
      rakahs: 4,
      improvements: ['Consistent posture', 'Good timing'],
      areas: ['Improve transition smoothness']
    }
  ];

  const periods = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'Last 3 Months' }
  ];

  const prayerIcons = {
    Fajr: 'Sunrise',
    Dhuhr: 'Sun',
    Asr: 'CloudSun',
    Maghrib: 'Sunset',
    Isha: 'Moon'
  };

  const getAccuracyColor = (accuracy) => {
    if (accuracy >= 90) return 'text-success';
    if (accuracy >= 80) return 'text-primary';
    if (accuracy >= 70) return 'text-warning';
    return 'text-error';
  };

  const getAccuracyBg = (accuracy) => {
    if (accuracy >= 90) return 'bg-success/10 border-success/20';
    if (accuracy >= 80) return 'bg-primary/10 border-primary/20';
    if (accuracy >= 70) return 'bg-warning/10 border-warning/20';
    return 'bg-error/10 border-error/20';
  };

  const calculateStats = () => {
    const totalSessions = mockSessions?.length;
    const averageAccuracy = Math.round(
      mockSessions?.reduce((sum, session) => sum + session?.accuracy, 0) / totalSessions
    );
    const totalPrayerTime = mockSessions?.reduce((total, session) => {
      const [minutes, seconds] = session?.duration?.split(':')?.map(Number);
      return total + minutes + seconds / 60;
    }, 0);
    
    return {
      totalSessions,
      averageAccuracy,
      totalPrayerTime: Math.round(totalPrayerTime)
    };
  };

  const stats = calculateStats();

  return (
    <div className="bg-card rounded-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading text-lg font-bold text-foreground">
            Session History
          </h3>
          <p className="text-sm text-muted-foreground">
            Track your prayer posture improvements
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {periods?.map((period) => (
            <Button
              key={period?.value}
              variant={selectedPeriod === period?.value ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedPeriod(period?.value)}
            >
              {period?.label}
            </Button>
          ))}
        </div>
      </div>
      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-muted/50 rounded-lg p-4 text-center">
          <div className="font-data text-2xl font-bold text-primary mb-1">
            {stats?.totalSessions}
          </div>
          <p className="text-xs text-muted-foreground">Sessions</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-4 text-center">
          <div className="font-data text-2xl font-bold text-success mb-1">
            {stats?.averageAccuracy}%
          </div>
          <p className="text-xs text-muted-foreground">Avg Accuracy</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-4 text-center">
          <div className="font-data text-2xl font-bold text-accent mb-1">
            {stats?.totalPrayerTime}m
          </div>
          <p className="text-xs text-muted-foreground">Total Time</p>
        </div>
      </div>
      {/* Session List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {mockSessions?.map((session) => (
          <div
            key={session?.id}
            className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Icon 
                    name={prayerIcons?.[session?.prayer]} 
                    size={20} 
                    className="text-primary" 
                  />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">
                    {session?.prayer} Prayer
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {session?.date} at {session?.time}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`font-data text-lg font-bold ${getAccuracyColor(session?.accuracy)}`}>
                  {session?.accuracy}%
                </div>
                <p className="text-xs text-muted-foreground">
                  {session?.duration} • {session?.rakahs} Rakahs
                </p>
              </div>
            </div>

            {/* Accuracy Badge */}
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-3 ${getAccuracyBg(session?.accuracy)}`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${
                session?.accuracy >= 90 ? 'bg-success' :
                session?.accuracy >= 80 ? 'bg-primary' :
                session?.accuracy >= 70 ? 'bg-warning' : 'bg-error'
              }`}></div>
              {session?.accuracy >= 90 ? 'Excellent' :
               session?.accuracy >= 80 ? 'Very Good' :
               session?.accuracy >= 70 ? 'Good' : 'Needs Improvement'}
            </div>

            {/* Improvements and Areas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <div>
                <h5 className="text-xs font-medium text-success mb-1 flex items-center">
                  <Icon name="CheckCircle" size={12} className="mr-1" />
                  Improvements
                </h5>
                <ul className="space-y-1">
                  {session?.improvements?.map((improvement, index) => (
                    <li key={index} className="text-xs text-muted-foreground flex items-start">
                      <div className="w-1 h-1 bg-success rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                      {improvement}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h5 className="text-xs font-medium text-warning mb-1 flex items-center">
                  <Icon name="Target" size={12} className="mr-1" />
                  Focus Areas
                </h5>
                <ul className="space-y-1">
                  {session?.areas?.map((area, index) => (
                    <li key={index} className="text-xs text-muted-foreground flex items-start">
                      <div className="w-1 h-1 bg-warning rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                      {area}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSessionReplay(session)}
              >
                <Icon name="Play" size={14} className="mr-1" />
                Replay
              </Button>
              <Button
                variant="ghost"
                size="sm"
              >
                <Icon name="Share" size={14} className="mr-1" />
                Share
              </Button>
            </div>
          </div>
        ))}
      </div>
      {/* Progress Insights */}
      <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="TrendingUp" size={16} className="text-accent mt-0.5" />
          <div>
            <p className="text-sm text-foreground font-medium mb-1">
              Weekly Progress
            </p>
            <p className="text-xs text-muted-foreground">
              Your average accuracy has improved by 5% this week. Keep focusing on Ruku posture for even better results. MashaAllah!
            </p>
          </div>
        </div>
      </div>
      {/* Export Options */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          {mockSessions?.length} sessions recorded
        </p>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Icon name="Download" size={14} className="mr-1" />
            Export
          </Button>
          <Button variant="ghost" size="sm">
            <Icon name="Trash2" size={14} className="mr-1" />
            Clear History
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SessionHistory;