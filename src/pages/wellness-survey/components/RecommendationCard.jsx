import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecommendationCard = ({ recommendation, onImplement, onSaveToSchedule }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isImplemented, setIsImplemented] = useState(false);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'dhikr': return 'Heart';
      case 'dua': return 'MessageCircle';
      case 'surah': return 'Book';
      case 'practice': return 'Target';
      default: return 'Lightbulb';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'dhikr': return 'text-primary bg-primary/10';
      case 'dua': return 'text-accent bg-accent/10';
      case 'surah': return 'text-secondary bg-secondary/10';
      case 'practice': return 'text-success bg-success/10';
      default: return 'text-muted-foreground bg-muted/10';
    }
  };

  const handleImplement = () => {
    setIsImplemented(true);
    onImplement?.(recommendation);
  };

  return (
    <div className="bg-card rounded-xl shadow-islamic-subtle border border-border hover:shadow-islamic-moderate transition-all duration-200">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${getTypeColor(recommendation?.type)}`}>
              <Icon name={getTypeIcon(recommendation?.type)} size={20} />
            </div>
            <div>
              <h3 className="font-heading font-bold text-foreground">
                {recommendation?.title}
              </h3>
              <p className="text-sm text-muted-foreground capitalize">
                {recommendation?.type} • {recommendation?.difficulty || 'Beginner'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {recommendation?.priority === 'high' && (
              <div className="px-2 py-1 bg-error/10 text-error text-xs rounded-full">
                High Priority
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={16} />
            </Button>
          </div>
        </div>

        <p className="text-muted-foreground mb-4">
          {recommendation?.description}
        </p>

        {/* Quick Stats */}
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          {recommendation?.duration && (
            <div className="flex items-center space-x-1">
              <Icon name="Clock" size={14} />
              <span>{recommendation?.duration}</span>
            </div>
          )}
          {recommendation?.frequency && (
            <div className="flex items-center space-x-1">
              <Icon name="Repeat" size={14} />
              <span>{recommendation?.frequency}</span>
            </div>
          )}
          {recommendation?.benefits && (
            <div className="flex items-center space-x-1">
              <Icon name="Star" size={14} />
              <span>{recommendation?.benefits?.length} benefits</span>
            </div>
          )}
        </div>
      </div>
      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-6 pb-4 border-t border-border pt-4">
          {/* Arabic Text */}
          {recommendation?.arabicText && (
            <div className="mb-4 p-4 bg-muted/30 rounded-lg">
              <div className="text-right font-heading text-lg text-foreground mb-2" dir="rtl">
                {recommendation?.arabicText}
              </div>
              {recommendation?.transliteration && (
                <div className="text-sm text-muted-foreground italic mb-2">
                  {recommendation?.transliteration}
                </div>
              )}
              {recommendation?.translation && (
                <div className="text-sm text-foreground">
                  <strong>Translation:</strong> {recommendation?.translation}
                </div>
              )}
            </div>
          )}

          {/* Benefits */}
          {recommendation?.benefits && recommendation?.benefits?.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium text-foreground mb-2">Benefits:</h4>
              <ul className="space-y-1">
                {recommendation?.benefits?.map((benefit, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm text-muted-foreground">
                    <Icon name="Check" size={14} className="text-success mt-0.5 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Instructions */}
          {recommendation?.instructions && (
            <div className="mb-4">
              <h4 className="font-medium text-foreground mb-2">How to Practice:</h4>
              <div className="text-sm text-muted-foreground space-y-2">
                {recommendation?.instructions?.split('\n')?.map((instruction, index) => (
                  <p key={index}>{instruction}</p>
                ))}
              </div>
            </div>
          )}

          {/* References */}
          {recommendation?.references && recommendation?.references?.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium text-foreground mb-2">Islamic References:</h4>
              <div className="space-y-2">
                {recommendation?.references?.map((reference, index) => (
                  <div key={index} className="text-sm text-muted-foreground p-2 bg-muted/20 rounded">
                    <div className="font-medium">{reference?.source}</div>
                    <div className="italic">"{reference?.text}"</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {/* Action Buttons */}
      <div className="px-6 pb-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {isImplemented && (
            <div className="flex items-center space-x-1 text-success text-sm">
              <Icon name="Check" size={14} />
              <span>Implemented</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSaveToSchedule?.(recommendation)}
            iconName="Calendar"
            iconPosition="left"
          >
            Schedule
          </Button>
          <Button
            variant={isImplemented ? "secondary" : "default"}
            size="sm"
            onClick={handleImplement}
            disabled={isImplemented}
            iconName={isImplemented ? "Check" : "Play"}
            iconPosition="left"
          >
            {isImplemented ? "Implemented" : "Try Now"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;