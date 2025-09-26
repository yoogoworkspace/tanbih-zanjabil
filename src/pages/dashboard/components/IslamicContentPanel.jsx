import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../lib/supabaseClient';

const IslamicContentPanel = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [islamicDate, setIslamicDate] = useState('15 Rabi\' al-Awwal 1446');
  const [dailyVerse, setDailyVerse] = useState(null);
  const [featuredHadith, setFeaturedHadith] = useState(null);
  const [dhikrReminders, setDhikrReminders] = useState([]);

  const islamicEvents = [
    {
      id: 1,
      name: "Laylat al-Qadr",
      date: "Expected in last 10 nights of Ramadan",
      type: "special_night",
      description: "The Night of Power, better than a thousand months"
    },
    {
      id: 2,
      name: "Jumu\'ah Prayer",
      date: "Every Friday",
      type: "weekly",
      description: "Congregational Friday prayer"
    },
    {
      id: 3,
      name: "Day of Arafah",
      date: "9th Dhul Hijjah",
      type: "hajj",
      description: "Most important day of Hajj pilgrimage"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000); // Update every minute

    const fetchContent = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('ai_recommendations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data) {
        setDailyVerse(data.find(item => item.category === 'spiritual'));
        setFeaturedHadith(data.find(item => item.category === 'wellness'));
        setDhikrReminders(data.filter(item => item.category === 'prayer').slice(0, 3));
      }
    };

    fetchContent();

    return () => clearInterval(timer);
  }, [user]);

  const formatDate = (date) => {
    return date?.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Islamic Calendar */}
      <div className="bg-card rounded-xl p-6 shadow-islamic-moderate border border-border">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="Calendar" size={20} className="text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">Islamic Calendar</h3>
            <p className="font-caption text-sm text-muted-foreground">Today's Date</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
            <p className="font-data text-lg text-foreground">{formatDate(currentDate)}</p>
            <p className="font-heading text-sm text-primary mt-1">{islamicDate}</p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-foreground">Upcoming Events</h4>
            {islamicEvents?.slice(0, 2)?.map((event) => (
              <div key={event?.id} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
                <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{event?.name}</p>
                  <p className="text-xs text-muted-foreground">{event?.date}</p>
                  <p className="text-xs text-muted-foreground mt-1">{event?.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Daily Verse */}
      <div className="bg-card rounded-xl p-6 shadow-islamic-moderate border border-border">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
            <Icon name="BookOpen" size={20} className="text-accent-foreground" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">Daily Verse</h3>
            <p className="font-caption text-sm text-muted-foreground">Qur'an Reflection</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {dailyVerse ? (
            <>
              <div className="p-4 bg-accent/5 rounded-lg border border-accent/10">
                <p className="text-sm text-foreground mb-2">"{dailyVerse.content}"</p>
                <p className="text-xs text-primary font-medium">{dailyVerse.title}</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" iconName="Share" iconPosition="left">
                  Share
                </Button>
                <Button variant="ghost" size="sm" iconName="Bookmark" iconPosition="left">
                  Save
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">No verse available today.</p>
            </div>
          )}
        </div>
      </div>
      {/* Featured Hadith */}
      <div className="bg-card rounded-xl p-6 shadow-islamic-moderate border border-border">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
            <Icon name="Scroll" size={20} className="text-secondary-foreground" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">Featured Hadith</h3>
            <p className="font-caption text-sm text-muted-foreground">Prophetic Guidance</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {featuredHadith ? (
            <div className="p-4 bg-secondary/5 rounded-lg border border-secondary/10">
              <p className="text-sm text-foreground mb-2">"{featuredHadith.content}"</p>
              <p className="text-xs text-secondary font-medium">{featuredHadith.title}</p>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">No hadith available today.</p>
            </div>
          )}
        </div>
      </div>
      {/* Dhikr Reminders */}
      <div className="bg-card rounded-xl p-6 shadow-islamic-moderate border border-border">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-success rounded-lg flex items-center justify-center">
            <Icon name="Repeat" size={20} className="text-success-foreground" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">Dhikr Reminders</h3>
            <p className="font-caption text-sm text-muted-foreground">Daily Remembrance</p>
          </div>
        </div>
        
        <div className="space-y-3">
          {dhikrReminders.length > 0 ? (
            dhikrReminders.map((dhikr) => (
              <div key={dhikr.id} className="flex items-center justify-between p-3 bg-success/5 rounded-lg border border-success/10">
                <div>
                  <p className="font-medium text-sm text-foreground">{dhikr.title}</p>
                  <p className="text-xs text-muted-foreground">{dhikr.content}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">No dhikr reminders available.</p>
            </div>
          )}
        </div>
        
        <Button variant="outline" className="w-full mt-4" iconName="Play" iconPosition="left">
          Start Dhikr Session
        </Button>
      </div>
    </div>
  );
};

export default IslamicContentPanel;