import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import AICompanionCard from './components/AICompanionCard';
import PrayerTimesCard from './components/PrayerTimesCard';
import HalalCheckerCard from './components/HalalCheckerCard';
import ARSalahGuideCard from './components/ARSalahGuideCard';
import WellnessSurveyCard from './components/WellnessSurveyCard';
import IslamicContentPanel from './components/IslamicContentPanel';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');
  const [userName] = useState('Abdullah');
  const [todayStats] = useState({
    prayersCompleted: 3,
    totalPrayers: 5,
    dhikrSessions: 2,
    halalChecks: 5,
    wellnessScore: 78
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Set greeting based on time
    const hour = new Date()?.getHours();
    if (hour < 12) {
      setGreeting('Good Morning');
    } else if (hour < 17) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date?.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date) => {
    return date?.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const quickActions = [
    {
      id: 1,
      name: 'Emergency Dua',
      icon: 'Heart',
      color: 'bg-error text-error-foreground',
      action: () => console.log('Emergency dua support')
    },
    {
      id: 2,
      name: 'Qibla Direction',
      icon: 'Compass',
      color: 'bg-primary text-primary-foreground',
      action: () => console.log('Show qibla direction')
    },
    {
      id: 3,
      name: 'Quick Scan',
      icon: 'Camera',
      color: 'bg-success text-success-foreground',
      action: () => console.log('Quick halal scan')
    },
    {
      id: 4,
      name: 'Dhikr Counter',
      icon: 'Repeat',
      color: 'bg-accent text-accent-foreground',
      action: () => console.log('Start dhikr counter')
    }
  ];

  return (
    <>
      <Helmet>
        <title>Dashboard - IslamicWellnessAI</title>
        <meta name="description" content="Your Islamic spiritual guidance dashboard with AI companion, prayer times, halal checker, and wellness insights." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-16 pb-20 lg:pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Welcome Section */}
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="mb-4 lg:mb-0">
                  <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
                    {greeting}, {userName}
                  </h1>
                  <p className="font-caption text-muted-foreground">
                    {formatDate(currentTime)} • {formatTime(currentTime)}
                  </p>
                  <p className="font-caption text-sm text-muted-foreground mt-1">
                    May Allah bless your day with peace and guidance
                  </p>
                </div>
                
                {/* Today's Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
                  <div className="text-center p-3 bg-card rounded-lg shadow-islamic-subtle border border-border">
                    <p className="font-data text-lg font-bold text-primary">
                      {todayStats?.prayersCompleted}/{todayStats?.totalPrayers}
                    </p>
                    <p className="font-caption text-xs text-muted-foreground">Prayers</p>
                  </div>
                  <div className="text-center p-3 bg-card rounded-lg shadow-islamic-subtle border border-border">
                    <p className="font-data text-lg font-bold text-accent">{todayStats?.dhikrSessions}</p>
                    <p className="font-caption text-xs text-muted-foreground">Dhikr</p>
                  </div>
                  <div className="text-center p-3 bg-card rounded-lg shadow-islamic-subtle border border-border">
                    <p className="font-data text-lg font-bold text-success">{todayStats?.halalChecks}</p>
                    <p className="font-caption text-xs text-muted-foreground">Halal Checks</p>
                  </div>
                  <div className="text-center p-3 bg-card rounded-lg shadow-islamic-subtle border border-border">
                    <p className="font-data text-lg font-bold text-secondary">{todayStats?.wellnessScore}%</p>
                    <p className="font-caption text-xs text-muted-foreground">Wellness</p>
                  </div>
                  <div className="col-span-2 lg:col-span-1 text-center p-3 bg-primary/5 rounded-lg border border-primary/10">
                    <div className="flex items-center justify-center space-x-1">
                      <Icon name="Star" size={16} className="text-primary" />
                      <p className="font-data text-lg font-bold text-primary">4.8</p>
                    </div>
                    <p className="font-caption text-xs text-muted-foreground">Daily Score</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="font-heading text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions?.map((action) => (
                  <Button
                    key={action?.id}
                    variant="outline"
                    onClick={action?.action}
                    className="h-20 flex flex-col items-center justify-center space-y-2 hover:shadow-islamic-subtle transition-all duration-200"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${action?.color}`}>
                      <Icon name={action?.icon} size={18} />
                    </div>
                    <span className="text-sm font-medium">{action?.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Primary Features Column */}
              <div className="xl:col-span-2 space-y-8">
                {/* AI Companion & Prayer Times Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <AICompanionCard />
                  <PrayerTimesCard />
                </div>

                {/* Halal Checker & AR Guide Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <HalalCheckerCard />
                  <ARSalahGuideCard />
                </div>

                {/* Wellness Survey Full Width */}
                <WellnessSurveyCard />
              </div>

              {/* Islamic Content Panel */}
              <div className="xl:col-span-1">
                <IslamicContentPanel />
              </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="mt-12 p-6 bg-card rounded-xl shadow-islamic-moderate border border-border">
              <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
                <div className="text-center lg:text-left">
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-1">
                    Continue Your Spiritual Journey
                  </h3>
                  <p className="font-caption text-sm text-muted-foreground">
                    Explore more features to enhance your Islamic lifestyle and well-being
                  </p>
                </div>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => window.location.href = '/profile-settings'}
                    iconName="Settings"
                    iconPosition="left"
                  >
                    Settings
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => console.log('Explore features')}
                    iconName="Compass"
                    iconPosition="left"
                  >
                    Explore Features
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;