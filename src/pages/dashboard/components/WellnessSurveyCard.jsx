import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../lib/supabaseClient';
import { formatDistanceToNow } from 'date-fns';

const WellnessSurveyCard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [lastSurvey, setLastSurvey] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWellnessData = async () => {
      if (!user) return;
      setLoading(true);
      try {
        // Fetch last survey
        const { data: surveyData, error: surveyError } = await supabase
          .from('wellness_surveys')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (surveyError && surveyError.code !== 'PGRST116') throw surveyError;
        setLastSurvey(surveyData);

        // Fetch recommendations
        const { data: recData, error: recError } = await supabase
          .from('ai_recommendations')
          .select('*')
          .eq('user_id', user.id)
          .eq('category', 'wellness')
          .order('created_at', { ascending: false })
          .limit(2);

        if (recError) throw recError;
        setRecommendations(recData || []);

      } catch (error) {
        console.error("Error fetching wellness data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWellnessData();
  }, [user]);

  const wellnessScore = lastSurvey ? Math.round(((lastSurvey.mood_score + lastSurvey.stress_level + lastSurvey.spiritual_connection) / 3) * 10) : 0;

  const wellnessMetrics = [
    { label: 'Spiritual', value: lastSurvey?.spiritual_connection * 10 || 0, color: 'text-primary' },
    { label: 'Mental', value: lastSurvey?.stress_level * 10 || 0, color: 'text-accent' },
    { label: 'Physical', value: lastSurvey?.sleep_hours / 8 * 100 || 0, color: 'text-success' }
  ];

  const handleNavigateToSurvey = () => {
    navigate('/wellness-survey');
  };

  const handleTakeSurvey = () => {
    navigate('/wellness-survey');
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-error';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-error/10 text-error border-error/20';
      case 'medium':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'low':
        return 'bg-success/10 text-success border-success/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-border';
    }
  };

  const getRecommendationIcon = (type) => {
    switch (type) {
      case 'dhikr':
        return 'Repeat';
      case 'dua':
        return 'Heart';
      case 'surah':
        return 'BookOpen';
      default:
        return 'Star';
    }
  };

  return (
    <div className="bg-card rounded-2xl p-6 shadow-islamic-moderate border border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
            <Icon name="Heart" size={20} className="text-secondary-foreground" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">Wellness Survey</h3>
            <p className="font-caption text-sm text-muted-foreground">Spiritual Insights</p>
          </div>
        </div>
        <div className="text-right">
          <p className={`font-data text-2xl font-bold ${getScoreColor(wellnessScore)}`}>
            {loading ? '...' : wellnessScore}
          </p>
          <p className="font-caption text-xs text-muted-foreground">Wellness Score</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8"><p>Loading wellness data...</p></div>
      ) : (
        <>
          {/* Wellness Metrics */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {wellnessMetrics?.map((metric, index) => (
              <div key={index} className="text-center p-3 bg-muted/20 rounded-xl">
                <p className={`font-data text-lg font-bold ${metric?.color}`}>{Math.round(metric?.value)}</p>
                <p className="font-caption text-xs text-muted-foreground">{metric?.label}</p>
              </div>
            ))}
          </div>

          {/* Last Survey Info */}
          {lastSurvey ? (
            <div className="bg-secondary/5 rounded-xl p-4 mb-4 border border-secondary/10">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm text-foreground">Last Survey</h4>
                <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(lastSurvey.created_at), { addSuffix: true })}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-foreground capitalize">{lastSurvey.mood}</p>
                  <p className="text-xs text-muted-foreground">Current Mood</p>
                </div>
                <div>
                  <p className="text-sm text-foreground">{lastSurvey.spiritual_connection}/10</p>
                  <p className="text-xs text-muted-foreground">Spiritual Level</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 bg-muted/30 rounded-xl mb-4">
              <p className="text-sm text-muted-foreground">No survey taken yet.</p>
            </div>
          )}

          {/* Personalized Recommendations */}
          <div className="space-y-3 mb-4">
            <h4 className="font-medium text-sm text-foreground">Personalized Recommendations</h4>
            {recommendations.length > 0 ? recommendations.map((rec) => (
              <div
                key={rec.id}
                className="flex items-start space-x-3 p-3 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => console.log('View recommendation', rec.id)}
              >
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon name={getRecommendationIcon(rec.category)} size={14} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="text-sm font-medium text-foreground">{rec.title}</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(rec.priority)}`}>
                      {rec.priority}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{rec.content}</p>
                </div>
              </div>
            )) : (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">No recommendations available.</p>
              </div>
            )}
          </div>
          <div className="flex space-x-2">
            <Button
              variant="default"
              className="flex-1 rounded-xl"
              onClick={handleTakeSurvey}
              iconName="ClipboardList"
              iconPosition="left"
            >
              Take Survey
            </Button>
            <Button
              variant="outline"
              onClick={handleNavigateToSurvey}
              iconName="TrendingUp"
              iconPosition="left"
              className="rounded-xl"
            >
              View Insights
            </Button>
          </div>
          <div className="mt-4 p-3 bg-accent/5 rounded-xl border border-accent/10">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Brain" size={16} className="text-accent" />
              <span className="font-medium text-sm text-foreground">AI-Powered Analysis</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Receive personalized spiritual guidance based on your wellness patterns and Islamic teachings.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default WellnessSurveyCard;