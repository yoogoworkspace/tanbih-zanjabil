import React, { useRef, useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CameraFeed = ({ 
  isActive, 
  onPoseDetected, 
  currentPosture, 
  poseAccuracy,
  onCameraError 
}) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [posePoints, setPosePoints] = useState([]);

  // Mock pose detection points for demonstration
  const mockPosePoints = {
    qiyam: [
      { x: 320, y: 100, label: 'head' },
      { x: 320, y: 180, label: 'shoulders' },
      { x: 320, y: 300, label: 'hips' },
      { x: 320, y: 450, label: 'knees' },
      { x: 320, y: 580, label: 'feet' }
    ],
    ruku: [
      { x: 320, y: 120, label: 'head' },
      { x: 320, y: 200, label: 'shoulders' },
      { x: 320, y: 250, label: 'hips' },
      { x: 320, y: 400, label: 'knees' },
      { x: 320, y: 580, label: 'feet' }
    ],
    sujood: [
      { x: 320, y: 400, label: 'head' },
      { x: 300, y: 420, label: 'hands' },
      { x: 340, y: 420, label: 'hands' },
      { x: 320, y: 450, label: 'knees' },
      { x: 320, y: 480, label: 'feet' }
    ]
  };

  useEffect(() => {
    if (isActive) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isActive]);

  useEffect(() => {
    if (isActive && currentPosture) {
      // Simulate pose detection with mock data
      const points = mockPosePoints?.[currentPosture?.toLowerCase()] || mockPosePoints?.qiyam;
      setPosePoints(points);
      
      // Simulate pose accuracy calculation
      const accuracy = Math.random() * 30 + 70; // 70-100% accuracy
      onPoseDetected({
        posture: currentPosture,
        accuracy: Math.round(accuracy),
        points: points
      });
    }
  }, [currentPosture, isActive]);

  const startCamera = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const mediaStream = await navigator.mediaDevices?.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false
      });

      if (videoRef?.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
      }
    } catch (err) {
      const errorMessage = err?.name === 'NotAllowedError' ?'Camera permission denied. Please allow camera access to use AR guidance.' :'Unable to access camera. Please check your camera settings.';
      
      setError(errorMessage);
      onCameraError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream?.getTracks()?.forEach(track => track?.stop());
      setStream(null);
    }
    setPosePoints([]);
  };

  const drawPoseOverlay = () => {
    const canvas = canvasRef?.current;
    const video = videoRef?.current;
    
    if (!canvas || !video || posePoints?.length === 0) return;

    const ctx = canvas?.getContext('2d');
    canvas.width = video?.videoWidth || 640;
    canvas.height = video?.videoHeight || 480;
    
    ctx?.clearRect(0, 0, canvas?.width, canvas?.height);

    // Draw pose points
    posePoints?.forEach((point, index) => {
      ctx?.beginPath();
      ctx?.arc(point?.x, point?.y, 8, 0, 2 * Math.PI);
      ctx.fillStyle = poseAccuracy > 80 ? '#059669' : poseAccuracy > 60 ? '#D97706' : '#DC2626';
      ctx?.fill();
      
      // Draw connections between points
      if (index < posePoints?.length - 1) {
        const nextPoint = posePoints?.[index + 1];
        ctx?.beginPath();
        ctx?.moveTo(point?.x, point?.y);
        ctx?.lineTo(nextPoint?.x, nextPoint?.y);
        ctx.strokeStyle = ctx?.fillStyle;
        ctx.lineWidth = 3;
        ctx?.stroke();
      }
    });

    // Draw accuracy indicator
    ctx.font = '16px Inter';
    ctx.fillStyle = '#FAFAF9';
    ctx?.fillText(`Accuracy: ${poseAccuracy}%`, 20, 30);
  };

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(drawPoseOverlay, 100);
      return () => clearInterval(interval);
    }
  }, [posePoints, poseAccuracy, isActive]);

  if (error) {
    return (
      <div className="relative w-full h-full bg-muted rounded-lg flex items-center justify-center">
        <div className="text-center p-8">
          <Icon name="CameraOff" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium text-foreground mb-2">Camera Access Required</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-sm">{error}</p>
          <Button onClick={startCamera} variant="outline">
            <Icon name="Camera" size={16} className="mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-card rounded-lg overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 bg-muted/80 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Starting camera...</p>
          </div>
        </div>
      )}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
        onLoadedMetadata={() => {
          if (videoRef?.current) {
            videoRef?.current?.play();
          }
        }}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ mixBlendMode: 'multiply' }}
      />
      {/* Pose Accuracy Indicator */}
      {isActive && poseAccuracy > 0 && (
        <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              poseAccuracy > 80 ? 'bg-success' : 
              poseAccuracy > 60 ? 'bg-warning' : 'bg-error'
            }`}></div>
            <span className="font-data text-sm text-foreground">
              {poseAccuracy}% Accurate
            </span>
          </div>
          <div className="mt-2">
            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${
                  poseAccuracy > 80 ? 'bg-success' : 
                  poseAccuracy > 60 ? 'bg-warning' : 'bg-error'
                }`}
                style={{ width: `${poseAccuracy}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}
      {/* Current Posture Indicator */}
      {currentPosture && (
        <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm text-primary-foreground rounded-lg px-3 py-2">
          <span className="font-medium text-sm">{currentPosture}</span>
        </div>
      )}
      {/* Camera Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center space-x-2 bg-background/90 backdrop-blur-sm rounded-full px-4 py-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={stopCamera}
            className="rounded-full"
          >
            <Icon name="Square" size={16} />
          </Button>
          <div className="w-px h-6 bg-border"></div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
          >
            <Icon name="RotateCcw" size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CameraFeed;