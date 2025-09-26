import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const VerificationResult = ({ result, onSaveToHistory, onAddNote }) => {
  if (!result) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'halal':
        return 'text-success bg-success/10 border-success/20';
      case 'haram':
        return 'text-error bg-error/10 border-error/20';
      case 'doubtful':
        return 'text-warning bg-warning/10 border-warning/20';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'halal':
        return 'CheckCircle';
      case 'haram':
        return 'XCircle';
      case 'doubtful':
        return 'AlertTriangle';
      default:
        return 'HelpCircle';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-success';
    if (confidence >= 60) return 'text-warning';
    return 'text-error';
  };

  return (
    <div className="bg-card rounded-lg shadow-islamic-subtle border border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-lg font-bold text-foreground">
            Verification Result
          </h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSaveToHistory(result)}
              iconName="Bookmark"
              iconPosition="left"
            >
              Save
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAddNote(result)}
              iconName="MessageSquare"
            >
              Note
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="mb-4">
          <h4 className="font-medium text-foreground mb-1">{result?.productName}</h4>
          {result?.barcode && (
            <p className="font-data text-sm text-muted-foreground">
              Barcode: {result?.barcode}
            </p>
          )}
        </div>

        {/* Status Badge */}
        <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg border ${getStatusColor(result?.status)} mb-4`}>
          <Icon name={getStatusIcon(result?.status)} size={20} />
          <span className="font-medium capitalize">{result?.status}</span>
          <span className={`font-data text-sm ${getConfidenceColor(result?.confidence)}`}>
            ({result?.confidence}% confidence)
          </span>
        </div>
      </div>
      <div className="p-6 space-y-6">
        {/* Ingredients List */}
        <div>
          <h5 className="font-medium text-foreground mb-3 flex items-center">
            <Icon name="List" size={16} className="mr-2" />
            Ingredients Analysis
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">All Ingredients:</p>
              <div className="flex flex-wrap gap-1">
                {result?.ingredients?.map((ingredient, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded"
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>
            
            {result?.problematicIngredients?.length > 0 && (
              <div>
                <p className="text-sm font-medium text-error mb-2">Problematic Ingredients:</p>
                <div className="space-y-1">
                  {result?.problematicIngredients?.map((ingredient, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 px-2 py-1 bg-error/10 text-error text-xs rounded"
                    >
                      <Icon name="AlertTriangle" size={12} />
                      <span>{ingredient}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Islamic References */}
        <div>
          <h5 className="font-medium text-foreground mb-3 flex items-center">
            <Icon name="Book" size={16} className="mr-2" />
            Islamic References
          </h5>
          <div className="space-y-3">
            {result?.references?.map((reference, index) => (
              <div
                key={index}
                className="bg-muted/50 rounded-lg p-4 border-l-4 border-primary"
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    reference?.type === 'quran' ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground'
                  }`}>
                    <Icon name={reference?.type === 'quran' ? 'Book' : 'Scroll'} size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground mb-2 italic">
                      "{reference?.text}"
                    </p>
                    <p className="font-data text-xs text-muted-foreground">
                      — {reference?.reference}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-muted/30 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={16} className="text-primary mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-foreground mb-1">Important Note:</p>
              <p className="text-muted-foreground">
                This analysis is based on available information and Islamic jurisprudence. 
                For complex cases, consult with qualified Islamic scholars. Always verify 
                halal certification from recognized authorities when available.
              </p>
            </div>
          </div>
        </div>

        {/* Timestamp */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border">
          <span>Checked on {new Date(result.timestamp)?.toLocaleString()}</span>
          <div className="flex items-center space-x-1">
            <Icon name="Shield" size={12} />
            <span>AI-Powered Analysis</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationResult;