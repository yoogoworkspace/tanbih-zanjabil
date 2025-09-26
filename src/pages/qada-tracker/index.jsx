import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { format } from 'date-fns';

const QadaTracker = () => {
  const { user } = useAuth();
  const [missedPrayers, setMissedPrayers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMissedPrayers = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('prayer_times')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'missed')
        .order('scheduled_time', { ascending: true });

      if (error) throw error;
      setMissedPrayers(data || []);
    } catch (error) {
      console.error('Error fetching missed prayers:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMissedPrayers();
  }, [fetchMissedPrayers]);

  const handleMarkAsCompleted = async (prayerId) => {
    try {
      const { error } = await supabase
        .from('prayer_times')
        .update({ status: 'completed', actual_time: new Date() })
        .eq('id', prayerId);

      if (error) throw error;
      setMissedPrayers(missedPrayers.filter(p => p.id !== prayerId));
    } catch (error) {
      console.error('Error updating prayer status:', error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Qada Salat Tracker - IslamicWellnessAI</title>
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16 pb-20 lg:pb-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-card rounded-2xl p-6 shadow-islamic-moderate border border-border">
              {/* Header */}
              <div className="mb-6 text-center">
                <h1 className="font-heading text-3xl font-bold text-foreground">Qada Salat Tracker</h1>
                <p className="text-muted-foreground mt-2">Keep track of and make up your missed prayers.</p>
              </div>

              {/* Prayer List */}
              {loading ? (
                <div className="text-center py-8"><p>Loading missed prayers...</p></div>
              ) : missedPrayers.length > 0 ? (
                <div className="space-y-3">
                  {missedPrayers.map(prayer => (
                    <div key={prayer.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
                      <div>
                        <p className="font-semibold text-foreground">{prayer.prayer_name}</p>
                        <p className="text-sm text-muted-foreground">{format(new Date(prayer.scheduled_time), 'MMMM d, yyyy')}</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleMarkAsCompleted(prayer.id)}
                      >
                        <Icon name="Check" size={16} className="mr-2" />
                        Mark as Completed
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Icon name="CheckCircle" size={48} className="mx-auto text-success" />
                  <h3 className="mt-4 text-lg font-medium text-foreground">All Caught Up!</h3>
                  <p className="mt-1 text-sm text-muted-foreground">You have no missed prayers to make up. Alhamdulillah!</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default QadaTracker;