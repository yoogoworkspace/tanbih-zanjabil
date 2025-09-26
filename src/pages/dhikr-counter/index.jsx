import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';

const DhikrCounter = () => {
  const { user } = useAuth();
  const [count, setCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const increment = () => setCount(prev => prev + 1);
  const reset = () => setCount(0);

  const saveSession = async () => {
    if (!user || count === 0) return;
    setIsSaving(true);
    try {
      const { error } = await supabase.from('spiritual_activities').insert({
        user_id: user.id,
        activity_type: 'dhikr',
        notes: `Completed a session of ${count} dhikr.`,
        duration_minutes: Math.ceil(count / 100) * 2, // Approximate duration
      });
      if (error) throw error;
      alert('Dhikr session saved successfully!');
      reset();
    } catch (error) {
      console.error('Error saving dhikr session:', error);
      alert('Could not save your session. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Dhikr Counter - IslamicWellnessAI</title>
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16 pb-20 lg:pb-8 flex items-center justify-center">
          <div className="w-full max-w-md mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-card rounded-2xl p-8 shadow-islamic-prominent border border-border text-center">
              <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Dhikr Counter</h1>
              <p className="text-muted-foreground mb-8">Focus on your remembrance of Allah.</p>

              <div className="mb-8">
                <p className="font-data text-9xl font-bold text-primary">{count}</p>
              </div>

              <div className="mb-6">
                <Button
                  onClick={increment}
                  className="w-full h-24 rounded-2xl text-2xl font-bold"
                >
                  Tap to Count
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" onClick={reset} className="rounded-xl">
                  <Icon name="RefreshCw" size={16} className="mr-2" />
                  Reset
                </Button>
                <Button variant="outline" onClick={saveSession} disabled={isSaving || count === 0} className="rounded-xl">
                  <Icon name="Save" size={16} className="mr-2" />
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default DhikrCounter;