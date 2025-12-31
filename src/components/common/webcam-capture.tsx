"use client";

import { useRef, useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Video, VideoOff } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface WebcamCaptureProps {
  onCapture: (imageSrc: string) => void;
  onCameraError?: (error: string) => void;
}

export function WebcamCapture({ onCapture, onCameraError }: WebcamCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    setError(null);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setIsCameraOn(true);
        }
      } catch (err) {
        console.error("Error accessing camera: ", err);
        const errorMessage = "Could not access camera. Please check permissions and try again.";
        setError(errorMessage);
        if (onCameraError) onCameraError(errorMessage);
        setIsCameraOn(false);
      }
    } else {
        const errorMessage = "Your browser does not support camera access.";
        setError(errorMessage);
        if (onCameraError) onCameraError(errorMessage);
    }
  }, [onCameraError]);

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraOn(false);
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUri = canvas.toDataURL('image/jpeg');
        onCapture(dataUri);
        stopCamera();
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative w-full overflow-hidden rounded-lg border aspect-video bg-muted flex items-center justify-center">
        <video
          ref={videoRef}
          className={`w-full h-full object-cover ${isCameraOn ? '' : 'hidden'}`}
          playsInline
          muted
        />
        {!isCameraOn && !error && (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Video className="h-12 w-12" />
                <p>Starting camera...</p>
            </div>
        )}
        {error && (
            <div className="p-4">
                <Alert variant="destructive">
                    <VideoOff className="h-4 w-4" />
                    <AlertTitle>Camera Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        )}
      </div>
      <div className="flex justify-center gap-4">
        {isCameraOn ? (
            <Button onClick={handleCapture} size="lg">
                <Camera className="mr-2 h-4 w-4" />
                Capture Photo
            </Button>
        ) : (
             <Button onClick={startCamera} size="lg" disabled={!!error}>
                <Camera className="mr-2 h-4 w-4" />
                Retry Camera
            </Button>
        )}
      </div>
    </div>
  );
}
