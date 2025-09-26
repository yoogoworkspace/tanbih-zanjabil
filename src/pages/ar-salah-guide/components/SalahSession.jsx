import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SalahSession = ({ 
  selectedPrayer, 
  onSessionStart, 
  onSessionEnd, 
  isActive,
  currentStep,
  onStepChange 
}) => {
  const [sessionTime, setSessionTime] = useState(0);
  const [currentRakah, setCurrentRakah] = useState(1);
  const [isReciting, setIsReciting] = useState(false);

  const prayerDetails = {
    fajr: { name: 'Fajr', rakahs: 2, sunnah: 2, icon: 'Sunrise' },
    dhuhr: { name: 'Dhuhr', rakahs: 4, sunnah: 4, icon: 'Sun' },
    asr: { name: 'Asr', rakahs: 4, sunnah: 0, icon: 'CloudSun' },
    maghrib: { name: 'Maghrib', rakahs: 3, sunnah: 2, icon: 'Sunset' },
    isha: { name: 'Isha', rakahs: 4, sunnah: 2, icon: 'Moon' }
  };

  const salahSteps = [
    { id: 1, name: 'Takbir', posture: 'qiyam', duration: 3, recitation: 'Allahu Akbar' },
    { id: 2, name: 'Al-Fatiha', posture: 'qiyam', duration: 30, recitation: 'Surah Al-Fatiha' },
    { id: 3, name: 'Surah', posture: 'qiyam', duration: 20, recitation: 'Additional Surah' },
    { id: 4, name: 'Ruku', posture: 'ruku', duration: 10, recitation: 'Subhana Rabbiyal Azeem' },
    { id: 5, name: 'I\'tidal', posture: 'qiyam', duration: 5, recitation: 'Sami\'a Allahu liman hamidah' },
    { id: 6, name: 'Sujood 1', posture: 'sujood', duration: 10, recitation: 'Subhana Rabbiyal A\'la' },
    { id: 7, name: 'Jalsa', posture: 'qiyam', duration: 5, recitation: 'Rabbighfir li' },
    { id: 8, name: 'Sujood 2', posture: 'sujood', duration: 10, recitation: 'Subhana Rabbiyal A\'la' }
  ];

  const currentPrayer = prayerDetails?.[selectedPrayer] || prayerDetails?.fajr;
  const currentStepData = salahSteps?.[currentStep - 1] || salahSteps?.[0];

  useEffect(() => {
    let interval;
    if (isActive) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins?.toString()?.padStart(2, '0')}:${secs?.toString()?.padStart(2, '0')}`;
  };

  const handleNextStep = () => {
    if (currentStep < salahSteps?.length) {
      onStepChange(currentStep + 1);
    } else if (currentRakah < currentPrayer?.rakahs) {
      setCurrentRakah(prev => prev + 1);
      onStepChange(1);
    } else {
      onSessionEnd();
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      onStepChange(currentStep - 1);
    } else if (currentRakah > 1) {
      setCurrentRakah(prev => prev - 1);
      onStepChange(salahSteps?.length);
    }
  };

  const getProgressPercentage = () => {
    const totalSteps = currentPrayer?.rakahs * salahSteps?.length;
    const completedSteps = (currentRakah - 1) * salahSteps?.length + currentStep - 1;
    return Math.round((completedSteps / totalSteps) * 100);
  };

  return (
    <div className="bg-card rounded-lg p-6 space-y-6">
      {/* Session Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon name={currentPrayer?.icon} size={24} className="text-primary" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-bold text-foreground">
              {currentPrayer?.name} Prayer
            </h3>
            <p className="text-sm text-muted-foreground">
              Rakah {currentRakah} of {currentPrayer?.rakahs}
            </p>
          </div>
        </div>
        
        {isActive && (
          <div className="text-right">
            <div className="font-data text-lg font-bold text-foreground">
              {formatTime(sessionTime)}
            </div>
            <p className="text-xs text-muted-foreground">Session Time</p>
          </div>
        )}
      </div>
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium text-foreground">{getProgressPercentage()}%</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
      </div>
      {/* Current Step */}
      <div className="bg-muted/50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-foreground">
            Step {currentStep}: {currentStepData?.name}
          </h4>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              currentStepData?.posture === 'qiyam' ? 'bg-primary' :
              currentStepData?.posture === 'ruku' ? 'bg-accent' : 'bg-secondary'
            }`}></div>
            <span className="text-sm text-muted-foreground capitalize">
              {currentStepData?.posture}
            </span>
          </div>
        </div>
        
        <div className="bg-background rounded-lg p-3 mb-3">
          <p className="font-data text-sm text-foreground text-center">
            {currentStepData?.recitation}
          </p>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Duration: ~{currentStepData?.duration}s</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsReciting(!isReciting)}
            className="h-auto py-1"
          >
            <Icon name={isReciting ? 'VolumeX' : 'Volume2'} size={14} className="mr-1" />
            {isReciting ? 'Mute' : 'Audio'}
          </Button>
        </div>
      </div>
      {/* Session Controls */}
      {!isActive ? (
        <Button 
          onClick={onSessionStart}
          className="w-full"
          size="lg"
        >
          <Icon name="Play" size={20} className="mr-2" />
          Start {currentPrayer?.name} Session
        </Button>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          <Button
            variant="outline"
            onClick={handlePreviousStep}
            disabled={currentStep === 1 && currentRakah === 1}
          >
            <Icon name="ChevronLeft" size={16} className="mr-1" />
            Previous
          </Button>
          
          <Button
            variant="destructive"
            onClick={onSessionEnd}
          >
            <Icon name="Square" size={16} className="mr-1" />
            End
          </Button>
          
          <Button
            variant="default"
            onClick={handleNextStep}
          >
            Next
            <Icon name="ChevronRight" size={16} className="ml-1" />
          </Button>
        </div>
      )}
      {/* Rakah Overview */}
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: currentPrayer?.rakahs }, (_, i) => (
          <div
            key={i}
            className={`p-2 rounded-lg text-center text-xs font-medium ${
              i + 1 < currentRakah ? 'bg-success text-success-foreground' :
              i + 1 === currentRakah ? 'bg-primary text-primary-foreground': 'bg-muted text-muted-foreground'
            }`}
          >
            Rakah {i + 1}
          </div>
        ))}
      </div>
      {/* Islamic Guidance */}
      <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="BookOpen" size={16} className="text-accent mt-0.5" />
          <div>
            <p className="text-sm text-foreground font-medium mb-1">
              Guidance for {currentStepData?.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {currentStepData?.posture === 'qiyam' && 
                "Stand with humility and focus. Let your heart be present with Allah (SWT)."}
              {currentStepData?.posture === 'ruku' && "Bow with reverence. Remember Allah's greatness as you humble yourself."}
              {currentStepData?.posture === 'sujood' && 
                "Prostrate with complete submission. This is the closest position to Allah (SWT)."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalahSession;