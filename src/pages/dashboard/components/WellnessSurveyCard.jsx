import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WellnessSurveyCard = () => {
  const navigate = useNavigate();
  const [wellnessScore] = useState(78);
  const [lastSurvey] = useState({
    date: '3 days ago',
    mood: 'Peaceful',
    spiritualLevel: 'Growing',
    recommendations: 3
  });

  const recommendations = [
    {
      id: 1,
      type: 'dhikr',
      title: 'Morning Dhikr Routine',
      description: 'Recite Tasbih 33 times after Fajr prayer',
      priority: 'high'
    },
    {
      id: 2,
      type: 'dua',
      title: 'Stress Relief Dua',
      description: 'Dua for anxiety and peace of mind',
      priority: 'medium'
    },
    {
      id: 3,
      type: 'surah',
      title: 'Surah Al-Mulk',
      description: 'Recite before sleep for protection',
      priority: 'low'
    }
  ];

  const wellnessMetrics = [
    { label: 'Spiritual', value: 82, color: 'text-primary' },
    { label: 'Mental', value: 75, color: 'text-accent' },
    { label: 'Physical', value: 77, color: 'text-success' }
  ];

  const handleNavigateToSurvey = () => {
    navigate('/wellness-survey');
  };

  const handleTakeSurvey = () => {
    console.log('Starting wellness survey');
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
    <div className="bg-card rounded-xl p-6 shadow-islamic-moderate border border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
            <Icon name="Heart" size={20} className="text-secondary-foreground" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">Wellness Survey</h3>
            <p className="font-caption text-sm text-muted-foreground">Spiritual Insights</p>
          </div>
        </div>
        <div className="text-right">
          <p className={`font-data text-2xl font-bold ${getScoreColor(wellnessScore)}`}>
            {wellnessScore}
          </p>
          <p className="font-caption text-xs text-muted-foreground">Wellness Score</p>
        </div>
      </div>
      {/* Wellness Metrics */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {wellnessMetrics?.map((metric, index) => (
          <div key={index} className="text-center p-3 bg-muted/20 rounded-lg">
            <p className={`font-data text-lg font-bold ${metric?.color}`}>{metric?.value}</p>
            <p className="font-caption text-xs text-muted-foreground">{metric?.label}</p>
          </div>
        ))}
      </div>
      {/* Last Survey Info */}
      <div className="bg-secondary/5 rounded-lg p-4 mb-4 border border-secondary/10">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-sm text-foreground">Last Survey</h4>
          <span className="text-xs text-muted-foreground">{lastSurvey?.date}</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-foreground">{lastSurvey?.mood}</p>
            <p className="text-xs text-muted-foreground">Current Mood</p>
          </div>
          <div>
            <p className="text-sm text-foreground">{lastSurvey?.spiritualLevel}</p>
            <p className="text-xs text-muted-foreground">Spiritual Level</p>
          </div>
        </div>
      </div>
      {/* Personalized Recommendations */}
      <div className="space-y-3 mb-4">
        <h4 className="font-medium text-sm text-foreground">Personalized Recommendations</h4>
        {recommendations?.slice(0, 2)?.map((rec) => (
          <div
            key={rec?.id}
            className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
            onClick={() => console.log('View recommendation', rec?.id)}
          >
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name={getRecommendationIcon(rec?.type)} size={14} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <p className="text-sm font-medium text-foreground">{rec?.title}</p>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(rec?.priority)}`}>
                  {rec?.priority}
                </span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">{rec?.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <Button
          variant="default"
          className="flex-1"
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
        >
          View Insights
        </Button>
      </div>
      <div className="mt-4 p-3 bg-accent/5 rounded-lg border border-accent/10">
        <div className="flex items-center space-x-2 mb-2">
          <Icon name="Brain" size={16} className="text-accent" />
          <span className="font-medium text-sm text-foreground">AI-Powered Analysis</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Receive personalized spiritual guidance based on your wellness patterns and Islamic teachings.
        </p>
      </div>
    </div>
  );
};

export default WellnessSurveyCard;