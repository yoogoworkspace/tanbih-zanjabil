import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PostureGuidance = ({ 
  currentPosture, 
  poseAccuracy, 
  feedback, 
  onPostureChange,
  isSessionActive 
}) => {
  const postureGuides = {
    qiyam: {
      name: 'Qiyam (Standing)',
      description: 'Stand upright facing the Qibla with feet shoulder-width apart',
      instructions: [
        'Keep your back straight and shoulders relaxed',
        'Place hands at your sides or fold them over your chest',
        'Look down at the place of prostration',
        'Maintain calm and focused breathing'
      ],
      commonMistakes: [
        'Slouching or leaning to one side',
        'Looking around instead of focusing downward',
        'Tensing shoulders or fidgeting'
      ],
      icon: 'User',
      color: 'text-primary'
    },
    ruku: {
      name: 'Ruku (Bowing)',
      description: 'Bow down with hands on knees, back straight and parallel to ground',
      instructions: [
        'Place palms firmly on knees with fingers spread',
        'Keep back straight and parallel to the floor',
        'Head should be in line with your back',
        'Say "Subhana Rabbiyal Azeem" (3x minimum)'
      ],
      commonMistakes: [
        'Bending too little or too much',
        'Placing hands above or below knees',
        'Curving the back instead of keeping it straight'
      ],
      icon: 'ArrowDown',
      color: 'text-accent'
    },
    sujood: {
      name: 'Sujood (Prostration)',
      description: 'Prostrate with forehead, nose, palms, knees, and toes touching ground',
      instructions: [
        'Place forehead and nose firmly on the ground',
        'Keep palms flat beside your head',
        'Ensure knees and toes are touching the ground',
        'Say "Subhana Rabbiyal A\'la" (3x minimum)'
      ],
      commonMistakes: [
        'Not placing forehead properly on ground',
        'Lifting feet or knees off the ground',
        'Placing hands too far from the head'
      ],
      icon: 'ArrowDownToLine',
      color: 'text-secondary'
    }
  };

  const currentGuide = postureGuides?.[currentPosture?.toLowerCase()] || postureGuides?.qiyam;

  const getAccuracyColor = (accuracy) => {
    if (accuracy > 80) return 'text-success';
    if (accuracy > 60) return 'text-warning';
    return 'text-error';
  };

  const getAccuracyMessage = (accuracy) => {
    if (accuracy > 90) return 'Excellent posture! MashaAllah';
    if (accuracy > 80) return 'Very good positioning';
    if (accuracy > 70) return 'Good, minor adjustments needed';
    if (accuracy > 60) return 'Needs improvement';
    return 'Please adjust your posture';
  };

  return (
    <div className="bg-card rounded-lg p-6 space-y-6">
      {/* Current Posture Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg bg-muted ${currentGuide?.color}`}>
            <Icon name={currentGuide?.icon} size={24} />
          </div>
          <div>
            <h3 className="font-heading text-lg font-bold text-foreground">
              {currentGuide?.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {currentGuide?.description}
            </p>
          </div>
        </div>
        
        {isSessionActive && poseAccuracy > 0 && (
          <div className="text-right">
            <div className={`font-data text-2xl font-bold ${getAccuracyColor(poseAccuracy)}`}>
              {poseAccuracy}%
            </div>
            <p className="text-xs text-muted-foreground">
              {getAccuracyMessage(poseAccuracy)}
            </p>
          </div>
        )}
      </div>
      {/* Posture Selection */}
      <div className="grid grid-cols-3 gap-2">
        {Object.entries(postureGuides)?.map(([key, guide]) => (
          <Button
            key={key}
            variant={currentPosture?.toLowerCase() === key ? 'default' : 'outline'}
            size="sm"
            onClick={() => onPostureChange(key)}
            className="flex flex-col items-center space-y-1 h-auto py-3"
          >
            <Icon name={guide?.icon} size={16} />
            <span className="text-xs font-medium">{guide?.name?.split(' ')?.[0]}</span>
          </Button>
        ))}
      </div>
      {/* Instructions */}
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-foreground mb-2 flex items-center">
            <Icon name="CheckCircle" size={16} className="text-success mr-2" />
            Proper Technique
          </h4>
          <ul className="space-y-2">
            {currentGuide?.instructions?.map((instruction, index) => (
              <li key={index} className="flex items-start space-x-2 text-sm">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-muted-foreground">{instruction}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-foreground mb-2 flex items-center">
            <Icon name="AlertTriangle" size={16} className="text-warning mr-2" />
            Common Mistakes to Avoid
          </h4>
          <ul className="space-y-2">
            {currentGuide?.commonMistakes?.map((mistake, index) => (
              <li key={index} className="flex items-start space-x-2 text-sm">
                <div className="w-1.5 h-1.5 bg-warning rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-muted-foreground">{mistake}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Real-time Feedback */}
      {feedback && feedback?.length > 0 && (
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-medium text-foreground mb-2 flex items-center">
            <Icon name="MessageSquare" size={16} className="text-primary mr-2" />
            Live Feedback
          </h4>
          <div className="space-y-2">
            {feedback?.map((item, index) => (
              <div key={index} className="flex items-start space-x-2">
                <Icon 
                  name={item?.type === 'correction' ? 'ArrowRight' : 'CheckCircle'} 
                  size={14} 
                  className={item?.type === 'correction' ? 'text-warning' : 'text-success'} 
                />
                <span className="text-sm text-muted-foreground">{item?.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Islamic Reminder */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Heart" size={16} className="text-primary mt-0.5" />
          <div>
            <p className="text-sm text-foreground font-medium mb-1">
              Remember the Purpose
            </p>
            <p className="text-xs text-muted-foreground">
              "And establish prayer and give zakah and bow with those who bow." - Quran 2:43\n
              Focus on your connection with Allah (SWT) while maintaining proper posture.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostureGuidance;