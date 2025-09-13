import { useRef, useEffect, useState, useCallback } from 'react';
import * as faceapi from 'face-api.js';

interface Violation {
  timestamp: Date;
  faceCount: number;
  screenshot: string;
  type: 'multiple_faces' | 'face_mismatch' | 'no_face';
}

interface UseFaceDetectionOptions {
  enabled?: boolean;
  interval?: number;
  minConfidence?: number;
}

interface UseFaceDetectionReturn {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isInitialized: boolean;
  currentFaceCount: number;
  isViolating: boolean;
  violations: Violation[];
  referenceFace: Float32Array | null;
  isModelsLoaded: boolean;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  captureReferenceFace: () => Promise<boolean>;
  startMonitoring: () => void;
}

export const useFaceDetection = (
  enabled: boolean = false
): UseFaceDetectionReturn => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isInitialized, setIsInitialized] = useState(false);
  const [currentFaceCount, setCurrentFaceCount] = useState(0);
  const [isViolating, setIsViolating] = useState(false);
  const [violations, setViolations] = useState<Violation[]>([]);
  const [referenceFace, setReferenceFace] = useState<Float32Array | null>(null);
  const [isModelsLoaded, setIsModelsLoaded] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(false);

  // Load face-api.js models
  const loadModels = useCallback(async () => {
    console.log('Starting to load face-api.js models...');
    
    try {
      console.log('Attempting to load models from local /models directory...');
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.faceExpressionNet.loadFromUri('/models')
      ]);
      setIsModelsLoaded(true);
      console.log('✅ Face-api.js models loaded successfully from local directory');
      
      // Test model loading
      console.log('Testing model availability...');
      console.log('TinyFaceDetector loaded:', !!faceapi.nets.tinyFaceDetector.isLoaded);
      console.log('FaceLandmark68Net loaded:', !!faceapi.nets.faceLandmark68Net.isLoaded);
      console.log('FaceRecognitionNet loaded:', !!faceapi.nets.faceRecognitionNet.isLoaded);
      console.log('FaceExpressionNet loaded:', !!faceapi.nets.faceExpressionNet.isLoaded);
      
    } catch (error) {
      console.error('❌ Error loading face-api.js models from local:', error);
      console.log('Attempting to load models from CDN...');
      
      // Fallback: try loading from CDN
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models'),
          faceapi.nets.faceRecognitionNet.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models'),
          faceapi.nets.faceExpressionNet.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models')
        ]);
        setIsModelsLoaded(true);
        console.log('✅ Face-api.js models loaded from CDN successfully');
        
        // Test model loading
        console.log('Testing CDN model availability...');
        console.log('TinyFaceDetector loaded:', !!faceapi.nets.tinyFaceDetector.isLoaded);
        console.log('FaceLandmark68Net loaded:', !!faceapi.nets.faceLandmark68Net.isLoaded);
        console.log('FaceRecognitionNet loaded:', !!faceapi.nets.faceRecognitionNet.isLoaded);
        console.log('FaceExpressionNet loaded:', !!faceapi.nets.faceExpressionNet.isLoaded);
        
      } catch (cdnError) {
        console.error('❌ Error loading models from CDN:', cdnError);
        console.log('All model loading attempts failed. Face detection will not work.');
      }
    }
  }, []);

  const detectFaces = useCallback(async (): Promise<{ faceCount: number; violationType?: 'multiple_faces' | 'face_mismatch' | 'no_face'; confidence?: number }> => {
    const video = videoRef.current;

    if (!video || !isModelsLoaded || video.videoWidth === 0 || video.videoHeight === 0) {
      console.log('Face detection skipped - video or models not ready:', {
        video: !!video,
        modelsLoaded: isModelsLoaded,
        videoWidth: video?.videoWidth,
        videoHeight: video?.videoHeight
      });
      return { faceCount: 0 };
    }

    try {
      console.log('Starting face detection with video dimensions:', video.videoWidth, 'x', video.videoHeight);
      
      // Try multiple detection options for better compatibility
      const options = [
        new faceapi.TinyFaceDetectorOptions({
          inputSize: 224, // Even smaller for better performance
          scoreThreshold: 0.1 // Very low threshold
        }),
        new faceapi.TinyFaceDetectorOptions({
          inputSize: 320,
          scoreThreshold: 0.2
        }),
        new faceapi.TinyFaceDetectorOptions({
          inputSize: 416,
          scoreThreshold: 0.3
        })
      ];

      let detections: any[] = [];
      let usedOption = 0;

      // Try each option until we get results
      for (let i = 0; i < options.length; i++) {
        try {
          console.log(`Trying detection option ${i + 1} with inputSize: ${options[i].inputSize}, threshold: ${options[i].scoreThreshold}`);
          
          detections = await faceapi
            .detectAllFaces(video, options[i])
            .withFaceLandmarks()
            .withFaceDescriptors();
          
          usedOption = i + 1;
          console.log(`Detection option ${usedOption} found ${detections.length} faces`);
          
          if (detections.length > 0) break; // Use first successful detection
        } catch (err) {
          console.log(`Detection option ${i + 1} failed:`, err);
        }
      }

      console.log(`Final face detection result: ${detections.length} faces detected using option ${usedOption}`);

      // Check for multiple faces
      if (detections.length > 1) {
        console.log('Violation: Multiple faces detected');
        return { faceCount: detections.length, violationType: 'multiple_faces' };
      }

      // Check for no faces
      if (detections.length === 0) {
        console.log('No faces detected - trying fallback detection...');
        
        // Fallback: try without landmarks and descriptors
        try {
          const fallbackDetections = await faceapi.detectAllFaces(video, options[0]);
          console.log(`Fallback detection found ${fallbackDetections.length} faces`);
          return { faceCount: fallbackDetections.length };
        } catch (fallbackErr) {
          console.log('Fallback detection also failed:', fallbackErr);
          return { faceCount: 0, violationType: 'no_face' };
        }
      }

      // Check face match if reference face exists
      if (detections.length === 1 && referenceFace) {
        const distance = faceapi.euclideanDistance(referenceFace, detections[0].descriptor);
        const threshold = 0.8; // Even higher threshold for more tolerance
        
        console.log(`Face distance: ${distance.toFixed(3)}, threshold: ${threshold}`);
        
        if (distance > threshold) {
          console.log('Violation: Face mismatch');
          return { faceCount: 1, violationType: 'face_mismatch', confidence: distance };
        }
      }

      // No violations detected
      return { faceCount: detections.length };
    } catch (error) {
      console.error('Error during face detection:', error);
      return { faceCount: 0 };
    }
  }, [isModelsLoaded, referenceFace]);

  // Capture reference face
  const captureReferenceFace = useCallback(async (): Promise<boolean> => {
    const video = videoRef.current;

    if (!video || !isModelsLoaded) {
      console.log('Video or models not ready for reference capture:', {
        video: !!video,
        modelsLoaded: isModelsLoaded,
        videoWidth: video?.videoWidth,
        videoHeight: video?.videoHeight
      });
      return false;
    }

    try {
      console.log('Starting reference face capture with video dimensions:', video.videoWidth, 'x', video.videoHeight);
      
      // Try multiple detection options for reference capture
      const options = [
        new faceapi.TinyFaceDetectorOptions({
          inputSize: 224,
          scoreThreshold: 0.1
        }),
        new faceapi.TinyFaceDetectorOptions({
          inputSize: 320,
          scoreThreshold: 0.2
        }),
        new faceapi.TinyFaceDetectorOptions({
          inputSize: 416,
          scoreThreshold: 0.3
        })
      ];

      let detections: any[] = [];
      let usedOption = 0;

      // Try each option until we get results
      for (let i = 0; i < options.length; i++) {
        try {
          console.log(`Reference capture - trying option ${i + 1} with inputSize: ${options[i].inputSize}, threshold: ${options[i].scoreThreshold}`);
          
          detections = await faceapi
            .detectAllFaces(video, options[i])
            .withFaceLandmarks()
            .withFaceDescriptors();
          
          usedOption = i + 1;
          console.log(`Reference capture option ${usedOption} found ${detections.length} faces`);
          
          if (detections.length > 0) break; // Use first successful detection
        } catch (err) {
          console.log(`Reference capture option ${i + 1} failed:`, err);
        }
      }

      console.log(`Reference capture final result: ${detections.length} faces detected using option ${usedOption}`);

      if (detections.length === 1) {
        setReferenceFace(detections[0].descriptor);
        console.log('Reference face captured successfully');
        return true;
      } else if (detections.length === 0) {
        console.log('No face detected for reference - trying fallback...');
        
        // Fallback: try without landmarks and descriptors
        try {
          const fallbackDetections = await faceapi.detectAllFaces(video, options[0]);
          console.log(`Reference capture fallback found ${fallbackDetections.length} faces`);
          
          if (fallbackDetections.length === 1) {
            // For fallback, we can't get descriptors, so we'll use a dummy reference
            console.log('Using fallback reference face (no descriptor available)');
            setReferenceFace(new Float32Array(128).fill(0)); // Dummy descriptor
            return true;
          }
        } catch (fallbackErr) {
          console.log('Reference capture fallback also failed:', fallbackErr);
        }
        
        console.log('No face detected for reference - please ensure your face is visible');
        return false;
      } else {
        console.log('Multiple faces detected for reference - please ensure only you are in frame');
        return false;
      }
    } catch (error) {
      console.error('Error capturing reference face:', error);
      return false;
    }
  }, [isModelsLoaded]);

  // Start monitoring with reference face
  const startMonitoring = useCallback(() => {
    if (!isModelsLoaded || !referenceFace) return;
    setIsMonitoring(true);
  }, [isModelsLoaded, referenceFace]);

  const captureScreenshot = useCallback((): string => {
    const canvas = canvasRef.current;
    if (!canvas) return '';
    
    return canvas.toDataURL('image/jpeg', 0.8);
  }, []);

  const startCamera = useCallback(async () => {
    try {
      // Load models first
      if (!isModelsLoaded) {
        await loadModels();
      }

      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsInitialized(true);
      }

          // Start detection loop for preview (always) or monitoring
      detectionIntervalRef.current = setInterval(async () => {
        try {
          const result = await detectFaces();
          setCurrentFaceCount(result.faceCount);
          
          // Only record violations if monitoring is active
          if (isMonitoring) {
            const isCurrentlyViolating = result.violationType !== undefined;
            setIsViolating(isCurrentlyViolating);
            
            // Record violation if detected
            if (isCurrentlyViolating && result.violationType) {
              const screenshot = captureScreenshot();
              const violation: Violation = {
                timestamp: new Date(),
                faceCount: result.faceCount,
                screenshot,
                type: result.violationType
              };
              
              setViolations(prev => [...prev, violation]);
            }
          }
        } catch (err) {
          console.error('Face detection error:', err);
        }
      }, 1000); // Check every 1 second for better responsiveness

    } catch (err) {
      console.error('Camera access error:', err);
      throw err;
    }
  }, [detectFaces, captureScreenshot, loadModels, isModelsLoaded, isMonitoring]);

  const stopCamera = useCallback(() => {
    setIsInitialized(false);
    setCurrentFaceCount(0);
    setIsViolating(false);
    setIsMonitoring(false);

    // Clear detection interval
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }

    // Stop video stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // Clear video element
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Load models on mount
  useEffect(() => {
    loadModels();
  }, [loadModels]);

  // Auto-start/stop detection when enabled changes
  useEffect(() => {
    if (enabled) {
      startCamera().catch(console.error);
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [enabled, startCamera, stopCamera]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    videoRef,
    canvasRef,
    isInitialized,
    currentFaceCount,
    isViolating,
    violations,
    referenceFace,
    isModelsLoaded,
    startCamera,
    stopCamera,
    captureReferenceFace,
    startMonitoring
  };
};