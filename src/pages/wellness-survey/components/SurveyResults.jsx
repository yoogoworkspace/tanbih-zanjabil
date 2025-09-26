import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SurveyResults = ({ results, onRetakeSurvey, onViewRecommendations }) => {
  const wellnessData = [
    { category: 'Spiritual Connection', score: results?.spiritualScore, maxScore: 100 },
    { category: 'Prayer Consistency', score: results?.prayerScore, maxScore: 100 },
    { category: 'Mental Well-being', score: results?.mentalScore, maxScore: 100 },
    { category: 'Islamic Knowledge', score: results?.knowledgeScore, maxScore: 100 },
    { category: 'Community Connection', score: results?.communityScore, maxScore: 100 }
  ];

  const radarData = wellnessData?.map(item => ({
    subject: item?.category?.replace(' ', '\n'),
    score: item?.score,
    fullMark: 100
  }));

  const overallScore = Math.round(wellnessData?.reduce((sum, item) => sum + item?.score, 0) / wellnessData?.length);

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-error';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-success/10';
    if (score >= 60) return 'bg-warning/10';
    return 'bg-error/10';
  };

  const pieData = [
    { name: 'Strengths', value: results?.strengths?.length || 0, color: '#059669' },
    { name: 'Growth Areas', value: results?.growthAreas?.length || 0, color: '#D97706' },
    { name: 'Recommendations', value: results?.recommendations?.length || 0, color: '#2D5A5A' }
  ];

  return (
    <div className="space-y-8">
      {/* Overall Score Card */}
      <div className="bg-card rounded-xl shadow-islamic-moderate p-6 md:p-8 text-center">
        <div className="mb-6">
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${getScoreBgColor(overallScore)} mb-4`}>
            <span className={`text-3xl font-bold ${getScoreColor(overallScore)}`}>
              {overallScore}
            </span>
          </div>
          <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
            Overall Wellness Score
          </h2>
          <p className="text-muted-foreground">
            Based on your responses across spiritual, mental, and community dimensions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-success">{results?.strengths?.length || 0}</div>
            <div className="text-sm text-muted-foreground">Strengths Identified</div>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-warning">{results?.growthAreas?.length || 0}</div>
            <div className="text-sm text-muted-foreground">Growth Areas</div>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-primary">{results?.recommendations?.length || 0}</div>
            <div className="text-sm text-muted-foreground">Recommendations</div>
          </div>
        </div>
      </div>
      {/* Detailed Scores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <div className="bg-card rounded-xl shadow-islamic-moderate p-6">
          <h3 className="text-lg font-heading font-bold text-foreground mb-6">
            Wellness Dimensions
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wellnessData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="category" 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--color-popover)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="score" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="bg-card rounded-xl shadow-islamic-moderate p-6">
          <h3 className="text-lg font-heading font-bold text-foreground mb-6">
            Wellness Profile
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--color-border)" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: 'var(--color-muted-foreground)' }}
                />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="var(--color-primary)"
                  fill="var(--color-primary)"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* Strengths and Growth Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Strengths */}
        <div className="bg-card rounded-xl shadow-islamic-moderate p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Icon name="TrendingUp" size={20} className="text-success" />
            <h3 className="text-lg font-heading font-bold text-foreground">
              Your Strengths
            </h3>
          </div>
          <div className="space-y-3">
            {results?.strengths?.map((strength, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-success/10 rounded-lg">
                <Icon name="Check" size={16} className="text-success mt-0.5" />
                <div>
                  <div className="font-medium text-foreground">{strength?.title}</div>
                  <div className="text-sm text-muted-foreground">{strength?.description}</div>
                </div>
              </div>
            )) || (
              <p className="text-muted-foreground">No specific strengths identified in this assessment.</p>
            )}
          </div>
        </div>

        {/* Growth Areas */}
        <div className="bg-card rounded-xl shadow-islamic-moderate p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Icon name="Target" size={20} className="text-warning" />
            <h3 className="text-lg font-heading font-bold text-foreground">
              Growth Opportunities
            </h3>
          </div>
          <div className="space-y-3">
            {results?.growthAreas?.map((area, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-warning/10 rounded-lg">
                <Icon name="ArrowUp" size={16} className="text-warning mt-0.5" />
                <div>
                  <div className="font-medium text-foreground">{area?.title}</div>
                  <div className="text-sm text-muted-foreground">{area?.description}</div>
                </div>
              </div>
            )) || (
              <p className="text-muted-foreground">No specific growth areas identified in this assessment.</p>
            )}
          </div>
        </div>
      </div>
      {/* Islamic Recommendations Preview */}
      <div className="bg-card rounded-xl shadow-islamic-moderate p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Icon name="BookOpen" size={20} className="text-primary" />
            <h3 className="text-lg font-heading font-bold text-foreground">
              Personalized Islamic Guidance
            </h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onViewRecommendations}
            iconName="ExternalLink"
            iconPosition="right"
          >
            View All
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-primary/10 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Heart" size={16} className="text-primary" />
              <span className="font-medium text-foreground">Dhikr Practices</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {results?.dhikrRecommendations?.length || 0} personalized dhikr suggestions
            </p>
          </div>
          <div className="p-4 bg-accent/10 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="MessageCircle" size={16} className="text-accent" />
              <span className="font-medium text-foreground">Duas</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {results?.duaRecommendations?.length || 0} relevant duas for your situation
            </p>
          </div>
          <div className="p-4 bg-secondary/10 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Book" size={16} className="text-secondary" />
              <span className="font-medium text-foreground">Surah Recitations</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {results?.surahRecommendations?.length || 0} recommended surahs for reflection
            </p>
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          variant="outline"
          onClick={onRetakeSurvey}
          iconName="RotateCcw"
          iconPosition="left"
        >
          Retake Survey
        </Button>
        <Button
          variant="default"
          onClick={onViewRecommendations}
          iconName="ArrowRight"
          iconPosition="right"
        >
          View Detailed Recommendations
        </Button>
      </div>
    </div>
  );
};

export default SurveyResults;