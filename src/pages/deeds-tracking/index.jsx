import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { format, addDays, subDays, isToday } from 'date-fns';

const DeedsTracking = () => {
  const { user } = useAuth();
  const [deeds, setDeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [progress, setProgress] = useState(0);
  const [isCheckingReward, setIsCheckingReward] = useState(false);
  const [rewardMessage, setRewardMessage] = useState('');

  const fetchDeeds = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_deeds')
        .select(`
          id,
          deed_name,
          is_completed,
          deed_templates (
            deed_category
          )
        `)
        .eq('user_id', user.id)
        .eq('due_date', format(currentDate, 'yyyy-MM-dd'));

      if (error) throw error;
      setDeeds(data || []);
    } catch (error) {
      console.error('Error fetching deeds:', error);
    } finally {
      setLoading(false);
    }
  }, [user, currentDate]);

  useEffect(() => {
    fetchDeeds();
  }, [fetchDeeds]);

  useEffect(() => {
    if (deeds.length > 0) {
      const completedCount = deeds.filter(d => d.is_completed).length;
      setProgress(Math.round((completedCount / deeds.length) * 100));
    } else {
      setProgress(0);
    }
  }, [deeds]);

  const handleToggleDeed = async (deedId, isCompleted) => {
    try {
      const { error } = await supabase
        .from('user_deeds')
        .update({ is_completed: !isCompleted, completed_at: !isCompleted ? new Date() : null })
        .eq('id', deedId);

      if (error) throw error;
      setDeeds(deeds.map(d => d.id === deedId ? { ...d, is_completed: !isCompleted } : d));
    } catch (error) {
      console.error('Error updating deed:', error);
    }
  };

  const changeDate = (direction) => {
    if (direction === 'next') {
      setCurrentDate(addDays(currentDate, 1));
    } else {
      setCurrentDate(subDays(currentDate, 1));
    }
  };

  const deedsByCategory = deeds.reduce((acc, deed) => {
    const category = deed.deed_templates?.deed_category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(deed);
    return acc;
  }, {});

  const handleCheckReward = async () => {
    if (!user) return;
    setIsCheckingReward(true);
    setRewardMessage('');
    try {
      const { data, error } = await supabase.rpc('check_and_award_monthly_deed_reward', { p_user_id: user.id });
      if (error) throw error;

      if (data) {
        setRewardMessage('Congratulations! You have earned a $2 reward for your consistent efforts this month.');
      } else {
        setRewardMessage('You have not yet met the threshold for this month\'s reward. Keep up the great work!');
      }
    } catch (error) {
      console.error('Error checking for reward:', error);
      setRewardMessage('Could not check for rewards at this time. Please try again later.');
    } finally {
      setIsCheckingReward(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Deeds Tracking - IslamicWellnessAI</title>
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16 pb-20 lg:pb-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-card rounded-2xl p-6 shadow-islamic-moderate border border-border">
              {/* Header */}
              <div className="flex flex-col md:flex-row items-center justify-between mb-6">
                <h1 className="font-heading text-3xl font-bold text-foreground mb-4 md:mb-0">Daily Deeds</h1>
                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="icon" onClick={() => changeDate('prev')} className="rounded-full">
                    <Icon name="ChevronLeft" size={20} />
                  </Button>
                  <div className="text-center">
                    <p className="font-medium text-lg text-foreground">{format(currentDate, 'MMMM d, yyyy')}</p>
                    <p className="text-sm text-primary">{isToday(currentDate) ? 'Today' : format(currentDate, 'eeee')}</p>
                  </div>
                  <Button variant="outline" size="icon" onClick={() => changeDate('next')} className="rounded-full">
                    <Icon name="ChevronRight" size={20} />
                  </Button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium text-muted-foreground">Daily Progress</p>
                  <p className="text-sm font-bold text-primary">{progress}%</p>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
              </div>

              {/* Reward Section */}
              <div className="mb-6 p-4 bg-secondary/10 rounded-xl border border-secondary/20 text-center">
                <h3 className="font-semibold text-foreground mb-2">Monthly Reward</h3>
                <p className="text-sm text-muted-foreground mb-4">Complete 80% of your deeds for 30 days to earn $2.</p>
                <Button onClick={handleCheckReward} disabled={isCheckingReward}>
                  {isCheckingReward ? 'Checking...' : 'Check My Eligibility'}
                </Button>
                {rewardMessage && (
                  <p className="mt-4 text-sm font-medium text-primary">{rewardMessage}</p>
                )}
              </div>

              {/* Deeds List */}
              {loading ? (
                <div className="text-center py-8"><p>Loading deeds...</p></div>
              ) : Object.keys(deedsByCategory).length > 0 ? (
                <div className="space-y-6">
                  {Object.entries(deedsByCategory).map(([category, deeds]) => (
                    <div key={category}>
                      <h2 className="font-semibold text-lg text-foreground mb-3">{category}</h2>
                      <div className="space-y-2">
                        {deeds.map(deed => (
                          <div
                            key={deed.id}
                            className={`flex items-center p-4 rounded-xl transition-colors ${
                              deed.is_completed ? 'bg-success/10' : 'bg-muted/30'
                            }`}
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleToggleDeed(deed.id, deed.is_completed)}
                              className="mr-4"
                            >
                              <Icon name={deed.is_completed ? "CheckCircle2" : "Circle"} size={24} className={deed.is_completed ? 'text-success' : 'text-muted-foreground'} />
                            </Button>
                            <span className={`flex-1 ${deed.is_completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                              {deed.deed_name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No deeds found for this day.</p>
                  <Button variant="outline" className="mt-4">Add a Deed</Button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default DeedsTracking;