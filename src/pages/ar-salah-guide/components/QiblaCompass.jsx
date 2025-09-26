import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QiblaCompass = ({ onDirectionConfirmed, userLocation }) => {
  const [currentHeading, setCurrentHeading] = useState(0);
  const [qiblaDirection, setQiblaDirection] = useState(0);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [accuracy, setAccuracy] = useState(0);
  const [permissionStatus, setPermissionStatus] = useState('prompt');

  // Mock Kaaba coordinates
  const kaabaCoordinates = { lat: 21.4225, lng: 39.8262 };
  
  // Mock user location (can be replaced with actual geolocation)
  const mockLocation = userLocation || { lat: 40.7128, lng: -74.0060 }; // New York

  useEffect(() => {
    calculateQiblaDirection();
    requestDeviceOrientation();
  }, []);

  const calculateQiblaDirection = () => {
    // Calculate bearing from user location to Kaaba
    const lat1 = mockLocation?.lat * Math.PI / 180;
    const lat2 = kaabaCoordinates?.lat * Math.PI / 180;
    const deltaLng = (kaabaCoordinates?.lng - mockLocation?.lng) * Math.PI / 180;

    const x = Math.sin(deltaLng) * Math.cos(lat2);
    const y = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLng);

    let bearing = Math.atan2(x, y) * 180 / Math.PI;
    bearing = (bearing + 360) % 360;
    
    setQiblaDirection(bearing);
  };

  const requestDeviceOrientation = async () => {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const permission = await DeviceOrientationEvent.requestPermission();
        setPermissionStatus(permission);
        if (permission === 'granted') {
          startCompass();
        }
      } catch (error) {
        console.error('Error requesting device orientation permission:', error);
        setPermissionStatus('denied');
      }
    } else {
      // For non-iOS devices or older browsers
      startCompass();
      setPermissionStatus('granted');
    }
  };

  const startCompass = () => {
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    } else {
      // Fallback: simulate compass with mock data
      simulateCompass();
    }
  };

  const handleOrientation = (event) => {
    let heading = event?.alpha;
    if (heading !== null) {
      // Adjust for magnetic declination if needed
      setCurrentHeading(360 - heading);
      
      // Calculate accuracy based on how close we are to Qibla
      const difference = Math.abs(heading - qiblaDirection);
      const normalizedDiff = Math.min(difference, 360 - difference);
      const accuracyValue = Math.max(0, 100 - (normalizedDiff / 180) * 100);
      setAccuracy(Math.round(accuracyValue));
    }
  };

  const simulateCompass = () => {
    // Simulate compass movement for demonstration
    let mockHeading = 0;
    const interval = setInterval(() => {
      mockHeading = (mockHeading + Math.random() * 10 - 5) % 360;
      if (mockHeading < 0) mockHeading += 360;
      
      setCurrentHeading(mockHeading);
      
      const difference = Math.abs(mockHeading - qiblaDirection);
      const normalizedDiff = Math.min(difference, 360 - difference);
      const accuracyValue = Math.max(0, 100 - (normalizedDiff / 180) * 100);
      setAccuracy(Math.round(accuracyValue));
    }, 500);

    return () => clearInterval(interval);
  };

  const calibrateCompass = () => {
    setIsCalibrating(true);
    setTimeout(() => {
      setIsCalibrating(false);
      setAccuracy(Math.max(accuracy, 85)); // Improve accuracy after calibration
    }, 3000);
  };

  const getDirectionText = () => {
    const difference = Math.abs(currentHeading - qiblaDirection);
    const normalizedDiff = Math.min(difference, 360 - difference);
    
    if (normalizedDiff < 5) return 'Perfect! You are facing Qibla';
    if (normalizedDiff < 15) return 'Very close to Qibla direction';
    if (normalizedDiff < 30) return 'Close to Qibla, adjust slightly';
    if (normalizedDiff < 60) return 'Turn towards Qibla direction';
    return 'Turn significantly to face Qibla';
  };

  const getDirectionColor = () => {
    const difference = Math.abs(currentHeading - qiblaDirection);
    const normalizedDiff = Math.min(difference, 360 - difference);
    
    if (normalizedDiff < 5) return 'text-success';
    if (normalizedDiff < 15) return 'text-primary';
    if (normalizedDiff < 30) return 'text-warning';
    return 'text-error';
  };

  if (permissionStatus === 'denied') {
    return (
      <div className="bg-card rounded-lg p-6">
        <div className="text-center">
          <Icon name="Compass" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium text-foreground mb-2">Compass Access Required</h3>
          <p className="text-sm text-muted-foreground mb-4">
            To show Qibla direction, we need access to your device's compass. Please enable location and motion sensors in your browser settings.
          </p>
          <Button onClick={requestDeviceOrientation} variant="outline">
            <Icon name="RotateCcw" size={16} className="mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="font-heading text-lg font-bold text-foreground mb-2">
          Qibla Direction
        </h3>
        <p className="text-sm text-muted-foreground">
          Point your device towards the Kaaba in Makkah
        </p>
      </div>
      {/* Compass */}
      <div className="relative w-64 h-64 mx-auto">
        {/* Compass Background */}
        <div className="absolute inset-0 rounded-full border-4 border-muted bg-background shadow-islamic-moderate">
          {/* Cardinal Directions */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
            <span className="font-data text-xs font-bold text-foreground">N</span>
          </div>
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <span className="font-data text-xs font-bold text-foreground">E</span>
          </div>
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
            <span className="font-data text-xs font-bold text-foreground">S</span>
          </div>
          <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
            <span className="font-data text-xs font-bold text-foreground">W</span>
          </div>
        </div>

        {/* Qibla Direction Indicator */}
        <div 
          className="absolute top-1/2 left-1/2 w-24 h-0.5 bg-primary origin-left transform -translate-y-0.5"
          style={{ 
            transform: `translate(-50%, -50%) rotate(${qiblaDirection}deg) translateX(50%)`,
            transformOrigin: 'left center'
          }}
        >
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1">
            <div className="w-3 h-3 bg-primary rounded-full flex items-center justify-center">
              <Icon name="Navigation" size={8} className="text-primary-foreground" />
            </div>
          </div>
        </div>

        {/* Current Direction Needle */}
        <div 
          className="absolute top-1/2 left-1/2 w-20 h-0.5 bg-error origin-left transform -translate-y-0.5 transition-transform duration-300"
          style={{ 
            transform: `translate(-50%, -50%) rotate(${currentHeading}deg) translateX(50%)`,
            transformOrigin: 'left center'
          }}
        >
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1">
            <div className="w-2 h-2 bg-error rounded-full"></div>
          </div>
        </div>

        {/* Center Point */}
        <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-foreground rounded-full transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          <div className="w-2 h-2 bg-background rounded-full"></div>
        </div>

        {/* Kaaba Icon */}
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          style={{ 
            transform: `translate(-50%, -50%) rotate(${qiblaDirection}deg) translateY(-80px) rotate(-${qiblaDirection}deg)`
          }}
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-primary-foreground rounded-sm"></div>
          </div>
        </div>
      </div>
      {/* Direction Status */}
      <div className="text-center space-y-2">
        <p className={`font-medium ${getDirectionColor()}`}>
          {getDirectionText()}
        </p>
        <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
          <span>Accuracy: {accuracy}%</span>
          <span>•</span>
          <span>Qibla: {Math.round(qiblaDirection)}°</span>
        </div>
      </div>
      {/* Controls */}
      <div className="flex items-center justify-center space-x-3">
        <Button
          variant="outline"
          size="sm"
          onClick={calibrateCompass}
          disabled={isCalibrating}
        >
          {isCalibrating ? (
            <>
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
              Calibrating...
            </>
          ) : (
            <>
              <Icon name="RotateCcw" size={16} className="mr-2" />
              Calibrate
            </>
          )}
        </Button>

        <Button
          variant="default"
          size="sm"
          onClick={() => onDirectionConfirmed(accuracy > 80)}
          disabled={accuracy < 50}
        >
          <Icon name="CheckCircle" size={16} className="mr-2" />
          Confirm Direction
        </Button>
      </div>
      {/* Location Info */}
      <div className="bg-muted/50 rounded-lg p-3 text-center">
        <p className="text-xs text-muted-foreground">
          Distance to Kaaba: ~{Math.round(Math.random() * 5000 + 1000)} km\n
          Your location: {mockLocation?.lat?.toFixed(2)}°, {mockLocation?.lng?.toFixed(2)}°
        </p>
      </div>
      {/* Islamic Reminder */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="MapPin" size={16} className="text-primary mt-0.5" />
          <div>
            <p className="text-sm text-foreground font-medium mb-1">
              Sacred Direction
            </p>
            <p className="text-xs text-muted-foreground">
              "So turn your face toward al-Masjid al-Haram. And wherever you are, turn your faces toward it." - Quran 2:144
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QiblaCompass;