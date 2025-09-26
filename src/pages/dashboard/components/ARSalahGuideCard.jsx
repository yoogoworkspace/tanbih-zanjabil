import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ARSalahGuideCard = () => {
  const navigate = useNavigate();
  const [cameraPermission, setCameraPermission] = useState('granted');
  const [lastSession] = useState({
    date: 'Today',
    prayer: 'Dhuhr',
    accuracy: 92,
    improvements: ['Ruku posture', 'Sujood alignment']
  });

  const postureStats = [
    { name: 'Qiyam', accuracy: 95, status: 'excellent' },
    { name: 'Ruku', accuracy: 88, status: 'good' },
    { name: 'Sujood', accuracy: 92, status: 'excellent' },
    { name: 'Jalsa', accuracy: 85, status: 'good' }
  ];

  const handleNavigateToGuide = () => {
    navigate('/ar-salah-guide');
  };

  const handleStartSession = () => {
    console.log('Starting AR Salah session');
  };

  const getAccuracyColor = (accuracy) => {
    if (accuracy >= 90) return 'text-success';
    if (accuracy >= 75) return 'text-warning';
    return 'text-error';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent':
        return 'bg-success/10 text-success border-success/20';
      case 'good':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'needs-improvement':
        return 'bg-error/10 text-error border-error/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-border';
    }
  };

  return (
    <div className="bg-card rounded-xl p-6 shadow-islamic-moderate border border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
            <Icon name="Eye" size={20} className="text-accent-foreground" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">AR Salah Guide</h3>
            <p className="font-caption text-sm text-muted-foreground">Posture Analysis</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            cameraPermission === 'granted' ? 'bg-success' : 'bg-error'
          }`}></div>
          <span className="text-xs text-muted-foreground">
            {cameraPermission === 'granted' ? 'Ready' : 'Camera Access Needed'}
          </span>
        </div>
      </div>
      {/* Last Session Summary */}
      <div className="bg-accent/5 rounded-lg p-4 mb-4 border border-accent/10">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-sm text-foreground">Last Session</h4>
          <span className="text-xs text-muted-foreground">{lastSession?.date}</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-foreground">{lastSession?.prayer} Prayer</p>
            <p className="text-xs text-muted-foreground">Overall Performance</p>
          </div>
          <div className="text-right">
            <p className={`font-data text-lg font-bold ${getAccuracyColor(lastSession?.accuracy)}`}>
              {lastSession?.accuracy}%
            </p>
            <p className="text-xs text-muted-foreground">Accuracy</p>
          </div>
        </div>
      </div>
      {/* Posture Statistics */}
      <div className="space-y-2 mb-4">
        <h4 className="font-medium text-sm text-foreground">Posture Analysis</h4>
        {postureStats?.map((posture, index) => (
          <div key={index} className="flex items-center justify-between p-2 bg-muted/20 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-primary">{posture?.name?.[0]}</span>
              </div>
              <span className="text-sm text-foreground">{posture?.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`font-data text-sm ${getAccuracyColor(posture?.accuracy)}`}>
                {posture?.accuracy}%
              </span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(posture?.status)}`}>
                {posture?.status}
              </span>
            </div>
          </div>
        ))}
      </div>
      {/* Improvements */}
      <div className="mb-4">
        <h4 className="font-medium text-sm text-foreground mb-2">Focus Areas</h4>
        <div className="flex flex-wrap gap-2">
          {lastSession?.improvements?.map((improvement, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 bg-warning/10 text-warning rounded-full text-xs font-medium border border-warning/20"
            >
              <Icon name="Target" size={12} className="mr-1" />
              {improvement}
            </span>
          ))}
        </div>
      </div>
      <div className="flex space-x-2">
        <Button
          variant="default"
          className="flex-1"
          onClick={handleStartSession}
          iconName="Play"
          iconPosition="left"
          disabled={cameraPermission !== 'granted'}
        >
          Start Session
        </Button>
        <Button
          variant="outline"
          onClick={handleNavigateToGuide}
          iconName="Settings"
          iconPosition="left"
        >
          Guide
        </Button>
      </div>
      <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/10">
        <div className="flex items-center space-x-2 mb-2">
          <Icon name="Shield" size={16} className="text-primary" />
          <span className="font-medium text-sm text-foreground">Privacy Protected</span>
        </div>
        <p className="text-xs text-muted-foreground">
          All analysis is performed locally on your device. No video data is stored or transmitted.
        </p>
      </div>
    </div>
  );
};

export default ARSalahGuideCard;