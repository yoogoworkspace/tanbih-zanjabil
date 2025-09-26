import React from 'react';
import Icon from '../../../components/AppIcon';

const SurveyProgress = ({ currentStep, totalSteps, completedSurveys, lastSurveyDate }) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-card rounded-xl shadow-islamic-subtle p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading font-bold text-foreground">
            Wellness Assessment Progress
          </h2>
          <p className="text-muted-foreground">
            Track your spiritual and mental well-being journey
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">
            {Math.round(progressPercentage)}%
          </div>
          <div className="text-sm text-muted-foreground">
            Complete
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            Question {currentStep} of {totalSteps}
          </span>
          <span className="text-sm text-muted-foreground">
            {totalSteps - currentStep} remaining
          </span>
        </div>
        <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Survey History */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon name="FileText" size={16} className="text-primary" />
          </div>
          <div>
            <div className="font-medium text-foreground">{completedSurveys || 0}</div>
            <div className="text-sm text-muted-foreground">Surveys Completed</div>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
          <div className="p-2 bg-accent/10 rounded-lg">
            <Icon name="Calendar" size={16} className="text-accent" />
          </div>
          <div>
            <div className="font-medium text-foreground">{formatDate(lastSurveyDate)}</div>
            <div className="text-sm text-muted-foreground">Last Assessment</div>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
          <div className="p-2 bg-success/10 rounded-lg">
            <Icon name="TrendingUp" size={16} className="text-success" />
          </div>
          <div>
            <div className="font-medium text-foreground">
              {completedSurveys > 0 ? 'Tracking' : 'Starting'}
            </div>
            <div className="text-sm text-muted-foreground">Progress Status</div>
          </div>
        </div>
      </div>

      {/* Motivational Message */}
      <div className="mt-6 p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
        <div className="flex items-start space-x-3">
          <Icon name="Heart" size={20} className="text-primary mt-0.5" />
          <div>
            <p className="text-sm text-foreground font-medium mb-1">
              Remember: This is a journey of self-reflection and growth
            </p>
            <p className="text-xs text-muted-foreground">
              Take your time with each question. Your honest responses help us provide better Islamic guidance tailored to your spiritual needs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyProgress;