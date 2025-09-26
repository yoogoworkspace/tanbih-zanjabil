import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ConnectedAccountsSection = ({ connectedAccounts, onUpdate }) => {
  const [loading, setLoading] = useState({});

  const socialProviders = [
    {
      id: 'google',
      name: 'Google',
      icon: 'Mail',
      description: 'Sign in with your Google account',
      connected: connectedAccounts?.google
    },
    {
      id: 'apple',
      name: 'Apple',
      icon: 'Smartphone',
      description: 'Sign in with your Apple ID',
      connected: connectedAccounts?.apple
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: 'Users',
      description: 'Connect your Facebook account',
      connected: connectedAccounts?.facebook
    }
  ];

  const handleToggleConnection = async (providerId, isConnected) => {
    setLoading(prev => ({ ...prev, [providerId]: true }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const updatedAccounts = {
        ...connectedAccounts,
        [providerId]: !isConnected
      };
      
      onUpdate(updatedAccounts);
      
      if (!isConnected) {
        alert(`Successfully connected to ${providerId?.charAt(0)?.toUpperCase() + providerId?.slice(1)}`);
      } else {
        alert(`Successfully disconnected from ${providerId?.charAt(0)?.toUpperCase() + providerId?.slice(1)}`);
      }
    } catch (error) {
      console.error(`Error toggling ${providerId} connection:`, error);
      alert(`Failed to ${isConnected ? 'disconnect from' : 'connect to'} ${providerId}`);
    } finally {
      setLoading(prev => ({ ...prev, [providerId]: false }));
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-islamic-subtle border border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-secondary text-secondary-foreground rounded-lg flex items-center justify-center">
            <Icon name="Link" size={20} />
          </div>
          <div>
            <h3 className="font-heading text-lg font-semibold text-foreground">Connected Accounts</h3>
            <p className="font-caption text-sm text-muted-foreground">Manage your social login connections</p>
          </div>
        </div>
      </div>
      <div className="p-6 space-y-4">
        {socialProviders?.map((provider) => (
          <div
            key={provider?.id}
            className="flex items-center justify-between p-4 bg-muted rounded-lg border border-border"
          >
            <div className="flex items-center space-x-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                provider?.connected 
                  ? 'bg-success text-success-foreground' 
                  : 'bg-muted-foreground/20 text-muted-foreground'
              }`}>
                <Icon name={provider?.icon} size={20} />
              </div>
              <div>
                <h4 className="font-body font-medium text-foreground">{provider?.name}</h4>
                <p className="font-caption text-sm text-muted-foreground">{provider?.description}</p>
                {provider?.connected && (
                  <div className="flex items-center space-x-1 mt-1">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="font-caption text-xs text-success">Connected</span>
                  </div>
                )}
              </div>
            </div>
            
            <Button
              variant={provider?.connected ? "outline" : "default"}
              size="sm"
              onClick={() => handleToggleConnection(provider?.id, provider?.connected)}
              loading={loading?.[provider?.id]}
              iconName={provider?.connected ? "Unlink" : "Link"}
              iconPosition="left"
            >
              {provider?.connected ? 'Disconnect' : 'Connect'}
            </Button>
          </div>
        ))}

        <div className="mt-6 p-4 bg-background border border-border rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={18} className="text-primary mt-0.5" />
            <div>
              <h4 className="font-body font-medium text-foreground mb-2">About Connected Accounts</h4>
              <ul className="font-caption text-sm text-muted-foreground space-y-1">
                <li>• Connected accounts allow you to sign in quickly without entering your password</li>
                <li>• We only access basic profile information (name, email) from connected accounts</li>
                <li>• You can disconnect any account at any time without losing your data</li>
                <li>• Ensure you have at least one sign-in method available before disconnecting</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-warning/10 border border-warning/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="AlertTriangle" size={18} className="text-warning mt-0.5" />
            <div>
              <h4 className="font-body font-medium text-foreground mb-1">Security Notice</h4>
              <p className="font-caption text-sm text-muted-foreground">
                If you disconnect all social accounts, make sure you remember your email and password 
                to access your IslamicWellnessAI account.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectedAccountsSection;