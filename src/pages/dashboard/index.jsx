import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import AICompanionCard from './components/AICompanionCard';
import PrayerTimesCard from './components/PrayerTimesCard';
import HalalCheckerCard from './components/HalalCheckerCard';
import WellnessSurveyCard from './components/WellnessSurveyCard';
import IslamicContentPanel from './components/IslamicContentPanel';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';

const Dashboard = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');
  const [todayStats, setTodayStats] = useState({
    prayersCompleted: 0,
    totalPrayers: 5,
    dhikrSessions: 0,
    halalChecks: 0,
    wellnessScore: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good Morning');
    } else if (hour < 17) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }

    const fetchTodayStats = async () => {
      if (!userProfile?.id) return;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const { data: prayers, error: prayersError } = await supabase
        .from('prayer_times')
        .select('status')
        .eq('user_id', userProfile.id)
        .gte('scheduled_time', today.toISOString())
        .lt('scheduled_time', tomorrow.toISOString());

      const { data: dhikr, error: dhikrError } = await supabase
        .from('spiritual_activities')
        .select('id')
        .eq('user_id', userProfile.id)
        .eq('activity_type', 'dhikr')
        .gte('completed_at', today.toISOString())
        .lt('completed_at', tomorrow.toISOString());

      const { data: halal, error: halalError } = await supabase
        .from('halal_products')
        .select('id')
        .eq('user_id', userProfile.id)
        .gte('created_at', today.toISOString())
        .lt('created_at', tomorrow.toISOString());

      const { data: wellness, error: wellnessError } = await supabase
        .from('wellness_surveys')
        .select('spiritual_connection')
        .eq('user_id', userProfile.id)
        .gte('created_at', today.toISOString())
        .lt('created_at', tomorrow.toISOString());

      const prayersCompleted = prayers?.filter(p => p.status === 'completed').length || 0;
      const totalPrayersToday = prayers?.length || 0;
      const dhikrSessions = dhikr?.length || 0;
      const halalChecks = halal?.length || 0;

      let wellnessScore = 0;
      if (wellness && wellness.length > 0) {
        const totalSpiritualConnection = wellness.reduce((acc, curr) => acc + curr.spiritual_connection, 0);
        const avgSpiritualConnection = totalSpiritualConnection / wellness.length;
        wellnessScore = Math.round(avgSpiritualConnection * 10);
      }

      setTodayStats({
        prayersCompleted: prayersCompleted,
        totalPrayers: totalPrayersToday > 0 ? totalPrayersToday : 5,
        dhikrSessions: dhikrSessions,
        halalChecks: halalChecks,
        wellnessScore: wellnessScore,
      });
    };

    fetchTodayStats();

    return () => clearInterval(timer);
  }, [userProfile]);

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

  return (
    <>
      <Helmet>
        <title>Dashboard - IslamicWellnessAI</title>
        <meta name="description" content="Your Islamic spiritual guidance dashboard with AI companion, prayer times, halal checker, and wellness insights." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <main className="pb-20 lg:pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Welcome Section */}
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="mb-4 lg:mb-0">
                  <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
                    {greeting}, {userProfile?.full_name || 'User'}
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
                  <div className="text-center p-3 bg-card rounded-2xl shadow-islamic-subtle border border-border">
                    <p className="font-data text-lg font-bold text-primary">
                      {todayStats.prayersCompleted}/{todayStats.totalPrayers}
                    </p>
                    <p className="font-caption text-xs text-muted-foreground">Prayers</p>
                  </div>
                  <div className="text-center p-3 bg-card rounded-2xl shadow-islamic-subtle border border-border">
                    <p className="font-data text-lg font-bold text-accent">{todayStats.dhikrSessions}</p>
                    <p className="font-caption text-xs text-muted-foreground">Dhikr</p>
                  </div>
                  <div className="text-center p-3 bg-card rounded-2xl shadow-islamic-subtle border border-border">
                    <p className="font-data text-lg font-bold text-success">{todayStats.halalChecks}</p>
                    <p className="font-caption text-xs text-muted-foreground">Halal Checks</p>
                  </div>
                  <div className="text-center p-3 bg-card rounded-2xl shadow-islamic-subtle border border-border">
                    <p className="font-data text-lg font-bold text-secondary">{todayStats.wellnessScore}%</p>
                    <p className="font-caption text-xs text-muted-foreground">Wellness</p>
                  </div>
                  <div className="col-span-2 lg:col-span-1 text-center p-3 bg-primary/10 rounded-2xl border border-primary/20">
                    <div className="flex items-center justify-center space-x-1">
                      <Icon name="Star" size={16} className="text-primary" />
                      <p className="font-data text-lg font-bold text-primary">4.8</p>
                    </div>
                    <p className="font-caption text-xs text-muted-foreground">Daily Score</p>
                  </div>
                </div>
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

                {/* Halal Checker */}
                <HalalCheckerCard />

                {/* Wellness Survey Full Width */}
                <WellnessSurveyCard />
              </div>

              {/* Islamic Content Panel */}
              <div className="xl:col-span-1">
                <IslamicContentPanel />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;