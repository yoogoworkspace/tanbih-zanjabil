import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import Select from '../../components/ui/Select';
import Input from '../../components/ui/Input';
import { useNavigate } from 'react-router-dom';

const WellnessSurvey = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mood, setMood] = useState('good');
  const [stressLevel, setStressLevel] = useState(5);
  const [sleepHours, setSleepHours] = useState(7.5);
  const [spiritualConnection, setSpiritualConnection] = useState(7);
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const moodOptions = [
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'okay', label: 'Okay' },
    { value: 'difficult', label: 'Difficult' },
    { value: 'struggling', label: 'Struggling' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);

    try {
      const { error } = await supabase.from('wellness_surveys').insert({
        user_id: user.id,
        mood,
        stress_level: stressLevel,
        sleep_hours: sleepHours,
        spiritual_connection: spiritualConnection,
        notes,
      });

      if (error) throw error;
      alert('Survey submitted successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting survey:', error);
      alert('Could not submit your survey. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Wellness Survey - IslamicWellnessAI</title>
      </Helmet>
      <div className="min-h-screen bg-background">
        <main className="pb-20 lg:pb-8">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-card rounded-2xl p-8 shadow-islamic-prominent border border-border">
              <div className="text-center mb-8">
                <Icon name="Heart" size={48} className="mx-auto text-primary" />
                <h1 className="font-heading text-3xl font-bold text-foreground mt-4">Daily Wellness Survey</h1>
                <p className="text-muted-foreground mt-2">Check in with yourself to track your spiritual and mental well-being.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">How are you feeling today?</label>
                  <Select
                    options={moodOptions}
                    value={mood}
                    onChange={value => setMood(value)}
                    className="h-12 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Stress Level (1-10)</label>
                  <Input
                    type="range"
                    min="1"
                    max="10"
                    value={stressLevel}
                    onChange={e => setStressLevel(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-muted-foreground mt-1">{stressLevel}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Hours of Sleep</label>
                  <Input
                    type="number"
                    step="0.5"
                    value={sleepHours}
                    onChange={e => setSleepHours(Number(e.target.value))}
                    className="h-12 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Spiritual Connection (1-10)</label>
                  <Input
                    type="range"
                    min="1"
                    max="10"
                    value={spiritualConnection}
                    onChange={e => setSpiritualConnection(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-muted-foreground mt-1">{spiritualConnection}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Notes or Reflections</label>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Any thoughts or feelings you want to record?"
                    className="w-full p-3 border border-input bg-background rounded-xl"
                    rows="4"
                  ></textarea>
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full h-12 rounded-xl"
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save Survey'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default WellnessSurvey;