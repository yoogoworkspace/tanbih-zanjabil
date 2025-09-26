import React from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const SurveyQuestion = ({ question, answer, onAnswerChange, onNext, onPrevious, isFirst, isLast, currentIndex, totalQuestions }) => {
  const renderQuestionInput = () => {
    switch (question?.type) {
      case 'likert':
        return (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground mb-4">{question?.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {question?.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => onAnswerChange(option?.value)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 text-center ${
                    answer === option?.value
                      ? 'border-primary bg-primary/10 text-primary' :'border-border hover:border-primary/50 hover:bg-muted/50'
                  }`}
                >
                  <div className="font-medium text-sm">{option?.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">{option?.description}</div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'multiple-choice':
        return (
          <div className="space-y-3">
            {question?.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => onAnswerChange(option?.value)}
                className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  answer === option?.value
                    ? 'border-primary bg-primary/10 text-primary' :'border-border hover:border-primary/50 hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    answer === option?.value ? 'border-primary bg-primary' : 'border-muted-foreground'
                  }`}>
                    {answer === option?.value && (
                      <div className="w-full h-full rounded-full bg-primary-foreground scale-50"></div>
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{option?.label}</div>
                    {option?.description && (
                      <div className="text-sm text-muted-foreground">{option?.description}</div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        );

      case 'checkbox-multiple':
        return (
          <div className="space-y-3">
            {question?.options?.map((option, index) => {
              const isSelected = Array.isArray(answer) && answer?.includes(option?.value);
              return (
                <div key={index} className="flex items-start space-x-3">
                  <Checkbox
                    checked={isSelected}
                    onChange={(e) => {
                      const currentAnswers = Array.isArray(answer) ? answer : [];
                      if (e?.target?.checked) {
                        onAnswerChange([...currentAnswers, option?.value]);
                      } else {
                        onAnswerChange(currentAnswers?.filter(val => val !== option?.value));
                      }
                    }}
                  />
                  <div className="flex-1">
                    <label className="font-medium text-foreground cursor-pointer">
                      {option?.label}
                    </label>
                    {option?.description && (
                      <p className="text-sm text-muted-foreground">{option?.description}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        );

      case 'text':
        return (
          <Input
            type="text"
            placeholder={question?.placeholder || "Enter your response..."}
            value={answer || ''}
            onChange={(e) => onAnswerChange(e?.target?.value)}
            className="w-full"
          />
        );

      case 'textarea':
        return (
          <textarea
            placeholder={question?.placeholder || "Share your thoughts..."}
            value={answer || ''}
            onChange={(e) => onAnswerChange(e?.target?.value)}
            rows={4}
            className="w-full p-3 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
          />
        );

      default:
        return null;
    }
  };

  const isAnswered = () => {
    if (question?.type === 'checkbox-multiple') {
      return Array.isArray(answer) && answer?.length > 0;
    }
    return answer !== null && answer !== undefined && answer !== '';
  };

  return (
    <div className="bg-card rounded-xl shadow-islamic-moderate p-6 md:p-8">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-muted-foreground">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium text-primary">
            {Math.round(((currentIndex + 1) / totalQuestions) * 100)}%
          </span>
        </div>
      </div>
      {/* Question Content */}
      <div className="mb-8">
        <h3 className="text-xl font-heading font-bold text-foreground mb-3">
          {question?.question}
        </h3>
        {question?.subtitle && (
          <p className="text-muted-foreground mb-6">{question?.subtitle}</p>
        )}
        
        {renderQuestionInput()}
      </div>
      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-border">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={isFirst}
          iconName="ChevronLeft"
          iconPosition="left"
        >
          Previous
        </Button>

        <div className="flex items-center space-x-3">
          {question?.required && !isAnswered() && (
            <span className="text-sm text-muted-foreground">
              * This question is required
            </span>
          )}
          <Button
            variant="default"
            onClick={onNext}
            disabled={question?.required && !isAnswered()}
            iconName={isLast ? "Check" : "ChevronRight"}
            iconPosition="right"
          >
            {isLast ? "Complete Survey" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SurveyQuestion;