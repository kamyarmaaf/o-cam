// hooks/useFaceDetection.ts
import { useRef, useEffect, useState, useCallback } from 'react';
import * as faceapi from 'face-api.js';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';

export type ViolationType = 'multiple_faces' | 'face_mismatch' | 'no_face';

export interface Violation {
  timestamp: Date;
  faceCount: number;
  screenshot: string;
  type: ViolationType;
  distance?: number;
}

export interface UseFaceDetectionOptions {
  detectFps?: number;
  threshold?: number;
  drawOverlay?: boolean;
  drawLandmarks?: boolean;
}

export interface UseFaceDetectionReturn {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  overlayCanvasRef: React.RefObject<HTMLCanvasElement>;

  isInitialized: boolean;
  currentFaceCount: number;
  isViolating: boolean;
  violations: Violation[];
  referenceFace: Float32Array | null;
  isModelsLoaded: boolean;
  isMonitoring: boolean;
  cameraError: boolean;

  lastDistance?: number;
  fps?: number;

  startCamera: () => Promise<void>;
  stopCamera: () => void;
  captureReferenceFace: () => Promise<boolean>;
  startMonitoring: () => void;
}

type DetectionResult = {
  faceCount: number;
  violationType: ViolationType | null;
  distance?: number;
};

export const useFaceDetection = (
  enabled: boolean = false,
  options: UseFaceDetectionOptions = {}
): UseFaceDetectionReturn => {
  const {
    detectFps = 8,
    threshold = 0.6,
    drawOverlay = true,
    drawLandmarks = false
  } = options;

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const detectionInProgressRef = useRef<boolean>(false);

  const [isInitialized, setIsInitialized] = useState(false);
  const [currentFaceCount, setCurrentFaceCount] = useState(0);
  const [isViolating, setIsViolating] = useState(false);
  const [violations, setViolations] = useState<Violation[]>([]);
  const [referenceFace, setReferenceFace] = useState<Float32Array | null>(null);
  const [isModelsLoaded, setIsModelsLoaded] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [cameraError, setCameraError] = useState(false);

  const [lastDistance, setLastDistance] = useState<number | undefined>(undefined);
  const [fps, setFps] = useState<number | undefined>(undefined);

  const referenceFaceRef = useRef<Float32Array | null>(null);
  useEffect(() => { referenceFaceRef.current = referenceFace; }, [referenceFace]);

  const isMonitoringRef = useRef<boolean>(false);
  useEffect(() => { isMonitoringRef.current = isMonitoring; }, [isMonitoring]);

  useEffect(() => {
    (async () => {
      try {
        await tf.setBackend('webgl');
        await tf.ready();
        console.log('TF backend:', tf.getBackend());
      } catch (e) {
        console.warn('TF backend set failed, fallback to default', e);
      }
    })();
  }, []);

  const loadModels = useCallback(async () => {
    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
      ]);
      setIsModelsLoaded(true);
      console.log('face-api models loaded from /models');
    } catch (err) {
      console.error('Local model load failed, trying CDN...', err);
      try {
        const base = 'https://justadudewhohacks.github.io/face-api.js/models';
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(base),
          faceapi.nets.faceLandmark68Net.loadFromUri(base),
          faceapi.nets.faceRecognitionNet.loadFromUri(base),
        ]);
        setIsModelsLoaded(true);
        console.log('face-api models loaded from CDN');
      } catch (cdnErr) {
        console.error('CDN model load failed:', cdnErr);
        setIsModelsLoaded(false);
      }
    }
  }, []);

  // ویدیو را «واقعاً» آماده کن
  const waitForVideoReady = useCallback(async (timeoutMs = 8000): Promise<boolean> => {
    const video = videoRef.current;
    const stream = streamRef.current;
    if (!video || !stream) return false;

    // مطمئن شو ویژگی‌های ضروری روی تگ ست شده‌اند
    (video as any).playsInline = true;
    video.muted = true;

    const isReady = () => video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0;

    // یک تلاش مجدد برای play
    try { await video.play(); } catch {}

    if (isReady()) return true;

    return await new Promise<boolean>((resolve) => {
      let settled = false;

      const onReady = () => {
        if (settled) return;
        if (isReady()) {
          settled = true;
          cleanup();
          resolve(true);
        }
      };

      const cleanup = () => {
        ['loadedmetadata','loadeddata','canplay','playing','resize'].forEach(ev => {
          video.removeEventListener(ev, onReady);
        });
        const track = stream.getVideoTracks()[0];
        if (track && (track as any).removeEventListener) {
          (track as any).removeEventListener('unmute', onReady as any);
        }
      };

      ['loadedmetadata','loadeddata','canplay','playing','resize'].forEach(ev => {
        video.addEventListener(ev, onReady);
      });

      // بعضی مرورگرها (Safari) با unmute ترک ویدیو آماده می‌شوند
      const track = stream.getVideoTracks()[0];
      if (track && (track as any).addEventListener) {
        (track as any).addEventListener('unmute', onReady as any, { once: true });
      }

      setTimeout(() => {
        if (settled) return;
        settled = true;
        cleanup();
        resolve(isReady());
      }, timeoutMs);
    });
  }, []);

  const drawFrameToCanvas = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const w = video.videoWidth;
    const h = video.videoHeight;
    if (!w || !h) return;

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(video, -w, 0, w, h);
    ctx.restore();
  }, []);

  const drawOverlayBoxes = useCallback((detections: any[]) => {
    if (!drawOverlay) return;

    const video = videoRef.current;
    const overlay = overlayCanvasRef.current;
    if (!video || !overlay) return;

    const w = video.videoWidth;
    const h = video.videoHeight;
    if (!w || !h) return;

    if (overlay.width !== w || overlay.height !== h) {
      overlay.width = w;
      overlay.height = h;
    }
    const ctx = overlay.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, overlay.width, overlay.height);

    const resized = faceapi.resizeResults(detections, { width: overlay.width, height: overlay.height });
    const draw = (faceapi as any).draw;

    if (draw?.drawDetections) {
      draw.drawDetections(overlay, resized);
    } else {
      resized.forEach((d: any) => {
        const { x, y, width, height } = d.detection.box;
        ctx.strokeStyle = 'rgba(0,255,0,0.9)';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
      });
    }

    if (drawLandmarks && draw?.drawFaceLandmarks) {
      draw.drawFaceLandmarks(overlay, resized);
    }
  }, [drawOverlay, drawLandmarks]);

  const detectOnce = useCallback(async (): Promise<DetectionResult> => {
    const video = videoRef.current;
    if (!video || !isModelsLoaded || video.videoWidth === 0 || video.videoHeight === 0) {
      return { faceCount: 0, violationType: null, distance: undefined };
    }

    const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.4 });
    const results = await faceapi
      .detectAllFaces(video, options)
      .withFaceLandmarks()
      .withFaceDescriptors();

    drawOverlayBoxes(results);

    const faceCount = results.length;

    if (faceCount > 1) {
      setLastDistance(undefined);
      return { faceCount, violationType: 'multiple_faces', distance: undefined };
    }

    if (faceCount === 0) {
      setLastDistance(undefined);
      return { faceCount: 0, violationType: 'no_face', distance: undefined };
    }

    const ref = referenceFaceRef.current;
    if (ref && results[0]?.descriptor) {
      const dist = faceapi.euclideanDistance(ref, results[0].descriptor);
      setLastDistance(dist);
      if (dist > threshold) {
        return { faceCount: 1, violationType: 'face_mismatch', distance: dist };
      }
      return { faceCount: 1, violationType: null, distance: dist };
    }

    setLastDistance(undefined);
    return { faceCount: 1, violationType: null, distance: undefined };
  }, [isModelsLoaded, threshold, drawOverlayBoxes]);

  const captureScreenshot = useCallback((): string => {
    const canvas = canvasRef.current;
    if (!canvas) return '';
    drawFrameToCanvas();
    return canvas.toDataURL('image/jpeg', 0.8);
  }, [drawFrameToCanvas]);

  const captureReferenceFace = useCallback(async (): Promise<boolean> => {
    const video = videoRef.current;
    if (!video || !isModelsLoaded) {
      console.log('Video or models not ready for reference capture');
      return false;
    }

    const ready = await waitForVideoReady();
    if (!ready) {
      console.log('Video still not ready for reference capture', {
        readyState: video.readyState,
        vw: video.videoWidth,
        vh: video.videoHeight,
        hasStream: !!streamRef.current
      });
      return false;
    }

    const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.4 });
    const detection = await faceapi
      .detectSingleFace(video, options)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (detection?.descriptor) {
      setReferenceFace(detection.descriptor);
      referenceFaceRef.current = detection.descriptor;
      console.log('Reference face captured');
      return true;
    } else {
      console.log('No single face for reference');
      return false;
    }
  }, [isModelsLoaded, waitForVideoReady]);

  const startMonitoring = useCallback(() => {
    if (!isModelsLoaded || !referenceFaceRef.current) return;
    setIsMonitoring(true);
  }, [isModelsLoaded]);

  const startCamera = useCallback(async () => {
    try {
      setCameraError(false);

      if (!isModelsLoaded) {
        await loadModels();
      }

      if (!streamRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
          audio: false,
        });
        streamRef.current = stream;
      }

      if (videoRef.current) {
        // اطمینان از ویژگی‌ها
        (videoRef.current as any).playsInline = true;
        videoRef.current.muted = true;

        videoRef.current.srcObject = streamRef.current;
        try {
          await videoRef.current.play();
        } catch (e) {
          console.warn('video.play() blocked:', e);
        }
        await waitForVideoReady();
      }
      setIsInitialized(true);

      const detectIntervalMs = 1000 / detectFps;
      let lastRun = performance.now();

      const loop = async () => {
        rafIdRef.current = requestAnimationFrame(loop);

        const now = performance.now();
        if (now - lastRun < detectIntervalMs || detectionInProgressRef.current) return;
        detectionInProgressRef.current = true;
        const t0 = performance.now();

        try {
          drawFrameToCanvas();

          const result = await detectOnce();
          setCurrentFaceCount(result.faceCount);

          if (isMonitoringRef.current) {
            const hasViolation = result.violationType !== null;
            setIsViolating(hasViolation);
            if (hasViolation) {
              const screenshot = captureScreenshot();
              const violation: Violation = {
                timestamp: new Date(),
                faceCount: result.faceCount,
                screenshot,
                type: result.violationType!, // اینجا null نیست
                ...(result.distance !== undefined ? { distance: result.distance } : {}),
              };
              setViolations(prev => [...prev, violation]);
            }
          } else {
            setIsViolating(false);
          }
        } catch (e) {
          console.error('Detection loop error:', e);
        } finally {
          const t1 = performance.now();
          setFps(Math.round(1000 / Math.max(t1 - t0, 1)));
          detectionInProgressRef.current = false;
          lastRun = now;
        }
      };

      if (!rafIdRef.current) {
        rafIdRef.current = requestAnimationFrame(loop);
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraError(true);
      setIsInitialized(false);
      throw err;
    }
  }, [detectOnce, captureScreenshot, drawFrameToCanvas, loadModels, isModelsLoaded, detectFps, waitForVideoReady]);

  const stopCamera = useCallback(() => {
    setIsInitialized(false);
    setCurrentFaceCount(0);
    setIsViolating(false);

    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      (videoRef.current as any).srcObject = null;
    }

    const overlay = overlayCanvasRef.current;
    if (overlay) {
      const ctx = overlay.getContext('2d');
      ctx?.clearRect(0, 0, overlay.width, overlay.height);
    }
  }, []);

  useEffect(() => {
    loadModels();
  }, [loadModels]);

  useEffect(() => {
    if (enabled) {
      startCamera().catch(() => {});
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [enabled, startCamera, stopCamera]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    videoRef,
    canvasRef,
    overlayCanvasRef,
    isInitialized,
    currentFaceCount,
    isViolating,
    violations,
    referenceFace,
    isModelsLoaded,
    isMonitoring,
    cameraError,
    lastDistance,
    fps,
    startCamera,
    stopCamera,
    captureReferenceFace,
    startMonitoring,
  };
};