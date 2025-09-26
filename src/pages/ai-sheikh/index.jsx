import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';
import { useAuth } from '../../contexts/AuthContext';

const AISheikh = () => {
  const { userProfile } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    setMessages([
      {
        role: 'assistant',
        content: `As-salamu alaykum, ${userProfile?.full_name || 'friend'}. I am your AI Sheikh, here to provide guidance from an Islamic perspective. How may I help you today?`,
      },
    ]);
  }, [userProfile]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'openai/gpt-3.5-turbo', // using a faster model for now
          messages: [...messages, userMessage],
        },
        {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const assistantMessage = response.data.choices[0].message;
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'I am sorry, but I am unable to respond at this moment.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>AI Sheikh - IslamicWellnessAI</title>
      </Helmet>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col pt-16">
          <div className="flex-1 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-3xl h-full flex flex-col bg-card rounded-2xl shadow-islamic-moderate border border-border">
              {/* Chat Header */}
              <div className="p-4 border-b border-border flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <Icon name="Sparkles" size={24} className="text-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-heading text-xl font-bold text-foreground">AI Sheikh</h1>
                  <p className="text-sm text-muted-foreground">Your Guide to Islamic Knowledge</p>
                </div>
              </div>
              {/* Messages Area */}
              <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                         <Icon name="Sparkles" size={16} className="text-primary" />
                      </div>
                    )}
                    <div className={`max-w-md p-3 rounded-2xl ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-start gap-3 justify-start">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon name="Sparkles" size={16} className="text-primary" />
                    </div>
                    <div className="max-w-md p-3 rounded-2xl bg-muted">
                      <p className="text-sm animate-pulse">AI Sheikh is thinking...</p>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              {/* Input Form */}
              <div className="p-4 border-t border-border">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                  <Input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about Islam, seek advice, or discuss a topic..."
                    className="flex-1 h-12 rounded-xl"
                    disabled={isLoading}
                  />
                  <Button type="submit" size="icon" className="h-12 w-12 rounded-xl" disabled={isLoading}>
                    <Icon name="Send" size={20} />
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default AISheikh;