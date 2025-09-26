import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AICompanionCard = () => {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);

  const recentConversations = [
    {
      id: 1,
      preview: "What are the benefits of reciting Surah Al-Fatiha?",
      timestamp: "2 hours ago",
      type: "question"
    },
    {
      id: 2,
      preview: "Stress relief duas for work anxiety",
      timestamp: "Yesterday",
      type: "support"
    },
    {
      id: 3,
      preview: "Explanation of Tahajjud prayer timing",
      timestamp: "2 days ago",
      type: "guidance"
    }
  ];

  const handleVoiceToggle = () => {
    setIsListening(!isListening);
    // Voice input logic would be implemented here
  };

  const handleStartChat = () => {
    // Navigate to AI chat interface
    console.log('Starting AI chat session');
  };

  return (
    <div className="bg-card rounded-2xl p-6 shadow-islamic-moderate border border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Icon name="MessageCircle" size={20} className="text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">AI Companion</h3>
            <p className="font-caption text-sm text-muted-foreground">Islamic Guidance Assistant</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={isListening ? "default" : "outline"}
            size="icon"
            onClick={handleVoiceToggle}
            className="relative"
          >
            <Icon name={isListening ? "MicOff" : "Mic"} size={16} />
            {isListening && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-pulse"></div>
            )}
          </Button>
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
        </div>
      </div>
      <div className="space-y-3 mb-4">
        <h4 className="font-medium text-sm text-foreground">Recent Conversations</h4>
        {recentConversations?.map((conversation) => (
          <div
            key={conversation?.id}
            className="flex items-start space-x-3 p-3 bg-muted/50 rounded-xl hover:bg-muted transition-colors cursor-pointer"
            onClick={handleStartChat}
          >
            <div className={`w-2 h-2 rounded-full mt-2 ${
              conversation?.type === 'question' ? 'bg-primary' :
              conversation?.type === 'support' ? 'bg-warning' : 'bg-accent'
            }`}></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground line-clamp-2">{conversation?.preview}</p>
              <p className="text-xs text-muted-foreground mt-1">{conversation?.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <Button
          variant="default"
          className="flex-1 rounded-xl"
          onClick={handleStartChat}
          iconName="MessageSquare"
          iconPosition="left"
        >
          Start New Chat
        </Button>
        <Button
          variant="outline"
          onClick={() => console.log('Emergency support')}
          iconName="Heart"
          iconPosition="left"
          className="rounded-xl"
        >
          Emergency Support
        </Button>
      </div>
      <div className="mt-4 p-3 bg-accent/10 rounded-xl border border-accent/20">
        <div className="flex items-center space-x-2 mb-2">
          <Icon name="Sparkles" size={16} className="text-accent" />
          <span className="font-medium text-sm text-foreground">Quick Actions</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" size="xs" onClick={() => console.log('Stress relief')} className="rounded-lg">
            Stress Relief Duas
          </Button>
          <Button variant="ghost" size="xs" onClick={() => console.log('Dhikr reminder')} className="rounded-lg">
            Dhikr Reminders
          </Button>
          <Button variant="ghost" size="xs" onClick={() => console.log('Prayer guidance')} className="rounded-lg">
            Prayer Guidance
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AICompanionCard;