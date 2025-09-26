import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import CameraFeed from './components/CameraFeed';
import PostureGuidance from './components/PostureGuidance';
import SalahSession from './components/SalahSession';
import QiblaCompass from './components/QiblaCompass';
import SessionHistory from './components/SessionHistory';

const ARSalahGuide = () => {
  const [activeTab, setActiveTab] = useState('guide');
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [selectedPrayer, setSelectedPrayer] = useState('fajr');
  const [currentPosture, setCurrentPosture] = useState('qiyam');
  const [currentStep, setCurrentStep] = useState(1);
  const [poseAccuracy, setPoseAccuracy] = useState(0);
  const [feedback, setFeedback] = useState([]);
  const [qiblaConfirmed, setQiblaConfirmed] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);

  const tabs = [
    { id: 'guide', label: 'AR Guide', icon: 'Eye' },
    { id: 'session', label: 'Session', icon: 'Play' },
    { id: 'qibla', label: 'Qibla', icon: 'Compass' },
    { id: 'history', label: 'History', icon: 'Clock' }
  ];

  const prayers = [
    { id: 'fajr', name: 'Fajr', time: '05:30', icon: 'Sunrise' },
    { id: 'dhuhr', name: 'Dhuhr', time: '12:15', icon: 'Sun' },
    { id: 'asr', name: 'Asr', time: '15:45', icon: 'CloudSun' },
    { id: 'maghrib', name: 'Maghrib', time: '18:30', icon: 'Sunset' },
    { id: 'isha', name: 'Isha', time: '20:00', icon: 'Moon' }
  ];

  useEffect(() => {
    // Generate mock feedback based on pose accuracy
    if (isSessionActive && poseAccuracy > 0) {
      const newFeedback = [];
      
      if (poseAccuracy < 70) {
        newFeedback?.push({
          type: 'correction',
          message: `Adjust your ${currentPosture} position for better alignment`
        });
      } else if (poseAccuracy > 85) {
        newFeedback?.push({
          type: 'positive',
          message: `Excellent ${currentPosture} posture! Keep it up`
        });
      }
      
      setFeedback(newFeedback);
    }
  }, [poseAccuracy, currentPosture, isSessionActive]);

  const handleSessionStart = () => {
    setIsSessionActive(true);
    setCameraActive(true);
    setCurrentStep(1);
    setPoseAccuracy(0);
    setFeedback([]);
  };

  const handleSessionEnd = () => {
    setIsSessionActive(false);
    setCameraActive(false);
    setCurrentStep(1);
    setPoseAccuracy(0);
    setFeedback([]);
  };

  const handlePoseDetected = (poseData) => {
    setPoseAccuracy(poseData?.accuracy);
    setCurrentPosture(poseData?.posture);
  };

  const handleCameraError = (error) => {
    console.error('Camera error:', error);
    setCameraActive(false);
  };

  const handleQiblaConfirmed = (isAccurate) => {
    setQiblaConfirmed(isAccurate);
    if (isAccurate) {
      setActiveTab('guide');
    }
  };

  const handleSessionReplay = (session) => {
    setSelectedPrayer(session?.prayer?.toLowerCase());
    setActiveTab('session');
  };

  return (
    <>
      <Helmet>
        <title>AR Salah Guide - IslamicWellnessAI</title>
        <meta name="description" content="Real-time prayer posture analysis using AR technology to improve your Salah quality with authentic Islamic guidance." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-16 pb-20 lg:pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Icon name="Eye" size={28} className="text-primary" />
                </div>
                <div>
                  <h1 className="font-heading text-3xl font-bold text-foreground">
                    AR Salah Guide
                  </h1>
                  <p className="text-muted-foreground">
                    Real-time prayer posture analysis with authentic Islamic guidance
                  </p>
                </div>
              </div>

              {/* Prayer Selection */}
              <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                {prayers?.map((prayer) => (
                  <Button
                    key={prayer?.id}
                    variant={selectedPrayer === prayer?.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedPrayer(prayer?.id)}
                    className="flex items-center space-x-2 whitespace-nowrap"
                  >
                    <Icon name={prayer?.icon} size={16} />
                    <span>{prayer?.name}</span>
                    <span className="text-xs opacity-70">{prayer?.time}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center space-x-1 mb-6 bg-muted rounded-lg p-1">
              {tabs?.map((tab) => (
                <Button
                  key={tab?.id}
                  variant={activeTab === tab?.id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab(tab?.id)}
                  className="flex items-center space-x-2 flex-1"
                >
                  <Icon name={tab?.icon} size={16} />
                  <span className="hidden sm:inline">{tab?.label}</span>
                </Button>
              ))}
            </div>

            {/* Status Bar */}
            {(isSessionActive || qiblaConfirmed) && (
              <div className="bg-card border border-border rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {qiblaConfirmed && (
                      <div className="flex items-center space-x-2 text-success">
                        <Icon name="CheckCircle" size={16} />
                        <span className="text-sm font-medium">Qibla Confirmed</span>
                      </div>
                    )}
                    {isSessionActive && (
                      <div className="flex items-center space-x-2 text-primary">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium">Session Active</span>
                      </div>
                    )}
                  </div>
                  
                  {isSessionActive && (
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>Prayer: {prayers?.find(p => p?.id === selectedPrayer)?.name}</span>
                      <span>•</span>
                      <span>Posture: {currentPosture}</span>
                      {poseAccuracy > 0 && (
                        <>
                          <span>•</span>
                          <span className={poseAccuracy > 80 ? 'text-success' : 'text-warning'}>
                            {poseAccuracy}% Accurate
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Primary Content Area */}
              <div className="lg:col-span-2 space-y-6">
                {activeTab === 'guide' && (
                  <div className="bg-card rounded-lg overflow-hidden">
                    <div className="aspect-video bg-muted">
                      <CameraFeed
                        isActive={cameraActive}
                        onPoseDetected={handlePoseDetected}
                        currentPosture={currentPosture}
                        poseAccuracy={poseAccuracy}
                        onCameraError={handleCameraError}
                      />
                    </div>
                    
                    {/* Camera Controls */}
                    <div className="p-4 border-t border-border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Button
                            variant={cameraActive ? 'destructive' : 'default'}
                            onClick={() => {
                              if (cameraActive) {
                                setCameraActive(false);
                              } else {
                                setCameraActive(true);
                              }
                            }}
                          >
                            <Icon name={cameraActive ? 'CameraOff' : 'Camera'} size={16} className="mr-2" />
                            {cameraActive ? 'Stop Camera' : 'Start Camera'}
                          </Button>
                          
                          {!qiblaConfirmed && (
                            <Button
                              variant="outline"
                              onClick={() => setActiveTab('qibla')}
                            >
                              <Icon name="Compass" size={16} className="mr-2" />
                              Check Qibla
                            </Button>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Icon name="Info" size={14} />
                          <span>Allow camera access for AR guidance</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'session' && (
                  <SalahSession
                    selectedPrayer={selectedPrayer}
                    onSessionStart={handleSessionStart}
                    onSessionEnd={handleSessionEnd}
                    isActive={isSessionActive}
                    currentStep={currentStep}
                    onStepChange={setCurrentStep}
                  />
                )}

                {activeTab === 'qibla' && (
                  <QiblaCompass
                    onDirectionConfirmed={handleQiblaConfirmed}
                    userLocation={{ lat: 40.7128, lng: -74.0060 }}
                  />
                )}

                {activeTab === 'history' && (
                  <SessionHistory
                    onSessionReplay={handleSessionReplay}
                  />
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <PostureGuidance
                  currentPosture={currentPosture}
                  poseAccuracy={poseAccuracy}
                  feedback={feedback}
                  onPostureChange={setCurrentPosture}
                  isSessionActive={isSessionActive}
                />

                {/* Quick Actions */}
                <div className="bg-card rounded-lg p-6 space-y-4">
                  <h3 className="font-medium text-foreground">Quick Actions</h3>
                  
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => setActiveTab('qibla')}
                    >
                      <Icon name="Compass" size={16} className="mr-2" />
                      Find Qibla Direction
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => setActiveTab('session')}
                    >
                      <Icon name="Play" size={16} className="mr-2" />
                      Start Prayer Session
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => setActiveTab('history')}
                    >
                      <Icon name="BarChart3" size={16} className="mr-2" />
                      View Progress
                    </Button>
                  </div>
                </div>

                {/* Islamic Guidance */}
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                  <div className="flex items-start space-x-3">
                    <Icon name="BookOpen" size={20} className="text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium text-foreground mb-2">
                        Prayer Etiquette
                      </h4>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>• Face the Qibla with humility and focus</p>
                        <p>• Maintain proper posture in each position</p>
                        <p>• Recite with contemplation and presence</p>
                        <p>• Remember Allah's greatness throughout</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Technical Requirements */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-medium text-foreground mb-2 flex items-center">
                    <Icon name="Settings" size={16} className="mr-2" />
                    Requirements
                  </h4>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <Icon name="Camera" size={12} />
                      <span>Camera access for pose detection</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="Compass" size={12} />
                      <span>Device orientation for Qibla</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="MapPin" size={12} />
                      <span>Location for accurate direction</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ARSalahGuide;