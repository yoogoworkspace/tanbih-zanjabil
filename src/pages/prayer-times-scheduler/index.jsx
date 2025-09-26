import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import PrayerTimeCard from './components/PrayerTimeCard';
import TaskScheduler from './components/TaskScheduler';
import NotificationSettings from './components/NotificationSettings';
import PrayerTracker from './components/PrayerTracker';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const PrayerTimesScheduler = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('schedule');
  const [location] = useState({ city: 'New York', country: 'USA', lat: 40.7128, lng: -74.0060 });

  // Mock prayer times data
  const [prayerTimes] = useState([
    {
      id: 'fajr',
      name: 'Fajr',
      arabicName: 'الفجر',
      time: '05:45',
      countdown: '7h 39m',
      jamaat: '06:00',
      notificationEnabled: true,
      isNext: false,
      isActive: false
    },
    {
      id: 'dhuhr',
      name: 'Dhuhr',
      arabicName: 'الظهر',
      time: '12:30',
      countdown: '9h 24m',
      jamaat: '12:45',
      notificationEnabled: true,
      isNext: false,
      isActive: false
    },
    {
      id: 'asr',
      name: 'Asr',
      arabicName: 'العصر',
      time: '15:45',
      countdown: '12h 39m',
      jamaat: '16:00',
      notificationEnabled: true,
      isNext: false,
      isActive: false
    },
    {
      id: 'maghrib',
      name: 'Maghrib',
      arabicName: 'المغرب',
      time: '18:45',
      countdown: '2h 15m',
      jamaat: '18:50',
      notificationEnabled: true,
      isNext: true,
      isActive: false
    },
    {
      id: 'isha',
      name: 'Isha',
      arabicName: 'العشاء',
      time: '20:15',
      countdown: '3h 45m',
      jamaat: '20:30',
      notificationEnabled: true,
      isNext: false,
      isActive: false
    }
  ]);

  // Mock tasks data
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Morning Dhikr and Quran Reading',
      category: 'islamic',
      priority: 'high',
      duration: 30,
      requiresWudu: true,
      scheduledTime: '06:30',
      completed: false,
      createdAt: '2025-09-26T03:06:49.971Z'
    },
    {
      id: 2,
      title: 'Team Meeting - Project Review',
      category: 'work',
      priority: 'high',
      duration: 60,
      requiresWudu: false,
      scheduledTime: '10:00',
      completed: false,
      createdAt: '2025-09-26T03:06:49.971Z'
    },
    {
      id: 3,
      title: 'Grocery Shopping',
      category: 'personal',
      priority: 'medium',
      duration: 45,
      requiresWudu: false,
      scheduledTime: '16:30',
      completed: false,
      createdAt: '2025-09-26T03:06:49.971Z'
    },
    {
      id: 4,
      title: 'Family Dinner Preparation',
      category: 'family',
      priority: 'medium',
      duration: 90,
      requiresWudu: false,
      scheduledTime: '17:30',
      completed: true,
      createdAt: '2025-09-26T03:06:49.971Z'
    }
  ]);

  // Mock notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    prayers: {
      maktoobah: { enabled: true, advanceMinutes: 10, sound: 'adhan' },
      rawatib: { enabled: true, advanceMinutes: 5, sound: 'bell' },
      tahajjud: { enabled: false, advanceMinutes: 15, sound: 'chime' },
      duha: { enabled: true, advanceMinutes: 0, sound: 'bell' },
      tarawih: { enabled: false, advanceMinutes: 10, sound: 'adhan' },
      lailat_al_qadr: { enabled: true, advanceMinutes: 30, sound: 'adhan' }
    },
    dhikr: {
      sleep: { enabled: true, time: '22:00' },
      wake: { enabled: true, time: '05:30' },
      post_prayer: { enabled: true }
    },
    global: {
      doNotDisturb: true,
      dndStart: '22:00',
      dndEnd: '05:00'
    }
  });

  // Mock weekly prayer data
  const [weeklyData] = useState([
    {
      date: 'Sep 23',
      prayers: {
        fajr: { completed: true, time: '05:45' },
        dhuhr: { completed: true, time: '12:30' },
        asr: { completed: false, missed: true, time: '15:45' },
        maghrib: { completed: true, time: '18:45' },
        isha: { completed: true, time: '20:15' }
      }
    },
    {
      date: 'Sep 24',
      prayers: {
        fajr: { completed: false, missed: true, time: '05:46' },
        dhuhr: { completed: true, time: '12:29' },
        asr: { completed: true, time: '15:44' },
        maghrib: { completed: true, time: '18:44' },
        isha: { completed: true, time: '20:14' }
      }
    },
    {
      date: 'Sep 25',
      prayers: {
        fajr: { completed: true, time: '05:47' },
        dhuhr: { completed: true, time: '12:28' },
        asr: { completed: true, time: '15:43' },
        maghrib: { completed: true, time: '18:43' },
        isha: { completed: false, missed: true, time: '20:13' }
      }
    },
    {
      date: 'Sep 26',
      prayers: {
        fajr: { completed: true, time: '05:48' },
        dhuhr: { completed: true, time: '12:27' },
        asr: { completed: false, time: '15:42' },
        maghrib: { completed: false, time: '18:42' },
        isha: { completed: false, time: '20:12' }
      }
    },
    {
      date: 'Sep 27',
      prayers: {
        fajr: { completed: false, time: '05:49' },
        dhuhr: { completed: false, time: '12:26' },
        asr: { completed: false, time: '15:41' },
        maghrib: { completed: false, time: '18:41' },
        isha: { completed: false, time: '20:11' }
      }
    },
    {
      date: 'Sep 28',
      prayers: {
        fajr: { completed: false, time: '05:50' },
        dhuhr: { completed: false, time: '12:25' },
        asr: { completed: false, time: '15:40' },
        maghrib: { completed: false, time: '18:40' },
        isha: { completed: false, time: '20:10' }
      }
    },
    {
      date: 'Sep 29',
      prayers: {
        fajr: { completed: false, time: '05:51' },
        dhuhr: { completed: false, time: '12:24' },
        asr: { completed: false, time: '15:39' },
        maghrib: { completed: false, time: '18:39' },
        isha: { completed: false, time: '20:09' }
      }
    }
  ]);

  const [qiblaDirection] = useState(58); // Mock Qibla direction in degrees

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleNotificationToggle = (prayerId) => {
    console.log(`Toggle notification for ${prayerId}`);
  };

  const handleTaskUpdate = (action, task) => {
    switch (action) {
      case 'add':
        setTasks(prev => [...prev, task]);
        break;
      case 'toggle':
        setTasks(prev => prev?.map(t => t?.id === task?.id ? task : t));
        break;
      case 'delete':
        setTasks(prev => prev?.filter(t => t?.id !== task?.id));
        break;
      default:
        break;
    }
  };

  const handleTaskReorder = (taskId, newIndex) => {
    setTasks(prev => {
      const taskIndex = prev?.findIndex(t => t?.id === taskId);
      if (taskIndex === -1) return prev;
      
      const newTasks = [...prev];
      const [movedTask] = newTasks?.splice(taskIndex, 1);
      newTasks?.splice(newIndex, 0, movedTask);
      return newTasks;
    });
  };

  const handleMakeupSchedule = (missedPrayer) => {
    console.log('Schedule makeup prayer:', missedPrayer);
  };

  const tabs = [
    { id: 'schedule', label: 'Schedule', icon: 'Calendar' },
    { id: 'tasks', label: 'Tasks', icon: 'CheckSquare' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'tracker', label: 'Tracker', icon: 'BarChart3' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 pb-20 lg:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
                  Prayer Times & Scheduler
                </h1>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Icon name="MapPin" size={16} />
                    <span>{location?.city}, {location?.country}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Clock" size={16} />
                    <span>{currentTime?.toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      hour12: true 
                    })}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Calendar" size={16} />
                    <span>15 Rabi' al-Awwal 1446</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 lg:mt-0">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="RefreshCw"
                  iconPosition="left"
                  onClick={() => window.location?.reload()}
                >
                  Refresh Times
                </Button>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="border-b border-border">
              <nav className="flex space-x-8 overflow-x-auto">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                      activeTab === tab?.id
                        ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                    }`}
                  >
                    <Icon name={tab?.icon} size={16} />
                    <span>{tab?.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-8">
            {activeTab === 'schedule' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Prayer Times */}
                <div className="lg:col-span-2">
                  <h2 className="font-heading text-xl font-semibold text-foreground mb-6">Today's Prayer Times</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {prayerTimes?.map((prayer) => (
                      <PrayerTimeCard
                        key={prayer?.id}
                        prayer={prayer}
                        isNext={prayer?.isNext}
                        isActive={prayer?.isActive}
                        onNotificationToggle={handleNotificationToggle}
                      />
                    ))}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="space-y-6">
                  <div className="p-6 bg-card border border-border rounded-xl shadow-islamic-subtle">
                    <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Quick Stats</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Today's Progress</span>
                        <span className="font-data text-foreground">3/5</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Weekly Average</span>
                        <span className="font-data text-foreground">78%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Streak</span>
                        <span className="font-data text-foreground">5 days</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-card border border-border rounded-xl shadow-islamic-subtle">
                    <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Next Prayer</h3>
                    <div className="text-center">
                      <div className="font-heading text-2xl font-bold text-primary mb-2">Maghrib</div>
                      <div className="font-data text-lg text-foreground mb-2">18:45</div>
                      <div className="text-sm text-muted-foreground">in 2h 15m</div>
                      <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                        <div className="flex items-center justify-center space-x-2 text-primary">
                          <Icon name="Bell" size={16} />
                          <span className="text-sm font-medium">Notification Active</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tasks' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <TaskScheduler
                    tasks={tasks}
                    onTaskUpdate={handleTaskUpdate}
                    onTaskReorder={handleTaskReorder}
                  />
                </div>
                <div className="space-y-6">
                  <div className="p-6 bg-card border border-border rounded-xl shadow-islamic-subtle">
                    <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Task Summary</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total Tasks</span>
                        <span className="font-data text-foreground">{tasks?.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Completed</span>
                        <span className="font-data text-success">{tasks?.filter(t => t?.completed)?.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Pending</span>
                        <span className="font-data text-warning">{tasks?.filter(t => !t?.completed)?.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Require Wudu</span>
                        <span className="font-data text-primary">{tasks?.filter(t => t?.requiresWudu)?.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="max-w-4xl">
                <NotificationSettings
                  settings={notificationSettings}
                  onSettingsUpdate={setNotificationSettings}
                />
              </div>
            )}

            {activeTab === 'tracker' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <PrayerTracker
                    weeklyData={weeklyData}
                    qiblaDirection={qiblaDirection}
                    onMakeupSchedule={handleMakeupSchedule}
                  />
                </div>
                <div className="space-y-6">
                  <div className="p-6 bg-card border border-border rounded-xl shadow-islamic-subtle">
                    <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Prayer Insights</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Most Consistent</span>
                          <span className="font-medium text-success">Maghrib</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-success h-2 rounded-full" style={{ width: '95%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Needs Improvement</span>
                          <span className="font-medium text-warning">Fajr</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-warning h-2 rounded-full" style={{ width: '65%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrayerTimesScheduler;