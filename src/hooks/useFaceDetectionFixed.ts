// hooks/useFaceDetectionFixed.ts - Fixed version for reference face capture
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

export const useFaceDetectionFixed = (
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

  const addLog = (message: string) => {
    console.log(`[FaceDetectionFixed] ${message}`);
  };

  useEffect(() => {
    (async () => {
      try {
        addLog('شروع تنظیم TensorFlow.js backend...');
        await tf.setBackend('webgl');
        await tf.ready();
        addLog(`✅ TensorFlow.js backend تنظیم شد: ${tf.getBackend()}`);
      } catch (e) {
        addLog('❌ خطا در تنظیم WebGL backend، تلاش برای CPU backend...');
        try {
          await tf.setBackend('cpu');
          await tf.ready();
          addLog(`✅ TensorFlow.js CPU backend تنظیم شد: ${tf.getBackend()}`);
        } catch (cpuError) {
          addLog('❌ خطا در تنظیم CPU backend: ' + cpuError);
        }
      }
    })();
  }, []);

  const loadModels = useCallback(async () => {
    try {
      addLog('شروع بارگذاری مدل‌های face-api.js...');
      setIsModelsLoaded(false);
      
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
      ]);
      setIsModelsLoaded(true);
      addLog('✅ face-api models loaded from /models');
    } catch (err) {
      addLog('❌ Local model load failed: ' + err);
      addLog('Trying CDN fallback...');
      try {
        const base = 'https://justadudewhohacks.github.io/face-api.js/models';
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(base),
          faceapi.nets.faceLandmark68Net.loadFromUri(base),
          faceapi.nets.faceRecognitionNet.loadFromUri(base),
        ]);
        setIsModelsLoaded(true);
        addLog('✅ face-api models loaded from CDN');
      } catch (cdnErr) {
        addLog('❌ CDN model load failed: ' + cdnErr);
        setIsModelsLoaded(false);
      }
    }
  }, []);

  const waitForVideoReady = useCallback(async (timeoutMs = 10000): Promise<boolean> => {
    const video = videoRef.current;
    const stream = streamRef.current;
    if (!video || !stream) {
      addLog('❌ ویدیو یا استریم وجود ندارد');
      return false;
    }

    (video as any).playsInline = true;
    video.muted = true;

    const isReady = () => {
      const ready = video.readyState >= 2 && 
                   video.videoWidth > 0 && 
                   video.videoHeight > 0 &&
                   !video.paused &&
                   !video.ended;
      return ready;
    };

    addLog('در حال انتظار برای آماده شدن ویدیو...');

    try { 
      await video.play(); 
      addLog('✅ video.play() موفق بود');
    } catch (e) {
      addLog('⚠️ video.play() خطا داد: ' + e);
    }

    if (isReady()) {
      addLog('✅ ویدیو بلافاصله آماده بود');
      return true;
    }

    return await new Promise<boolean>((resolve) => {
      let settled = false;
      let attempts = 0;
      const maxAttempts = 50;

      const checkReady = () => {
        if (settled) return;
        attempts++;
        
        if (isReady()) {
          addLog(`✅ ویدیو بعد از ${attempts} تلاش آماده شد`);
          settled = true;
          resolve(true);
          return;
        }

        if (attempts >= maxAttempts) {
          addLog(`❌ ویدیو بعد از ${attempts} تلاش آماده نشد`);
          settled = true;
          resolve(false);
          return;
        }

        setTimeout(checkReady, 100);
      };

      setTimeout(checkReady, 100);
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
      addLog('❌ ویدیو یا مدل‌ها آماده نیستند');
      return { faceCount: 0, violationType: null, distance: undefined };
    }

    if (video.readyState < 2) {
      addLog('❌ ویدیو هنوز آماده نیست (readyState: ' + video.readyState + ')');
      return { faceCount: 0, violationType: null, distance: undefined };
    }
    
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      addLog('❌ ابعاد ویدیو صفر است');
      return { faceCount: 0, violationType: null, distance: undefined };
    }

    if (video.paused || video.ended) {
      addLog('❌ ویدیو در حال پخش نیست');
      return { faceCount: 0, violationType: null, distance: undefined };
    }

    try {
      addLog('در حال تشخیص چهره...');
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const options = new faceapi.TinyFaceDetectorOptions({ 
        inputSize: 320, 
        scoreThreshold: 0.3 
      });
      
      const results = await faceapi
        .detectAllFaces(video, options)
        .withFaceLandmarks()
        .withFaceDescriptors();

      drawOverlayBoxes(results);
      addLog(`✅ ${results.length} چهره شناسایی شد`);

      const faceCount = results.length;

      if (faceCount > 1) {
        setLastDistance(undefined);
        addLog(`🚨 تخلف: چند چهره (${faceCount})`);
        return { faceCount, violationType: 'multiple_faces', distance: undefined };
      }

      if (faceCount === 0) {
        setLastDistance(undefined);
        addLog('⚠️ هیچ چهره‌ای شناسایی نشد');
        return { faceCount: 0, violationType: 'no_face', distance: undefined };
      }

      const ref = referenceFaceRef.current;
      if (ref && results[0]?.descriptor) {
        const dist = faceapi.euclideanDistance(ref, results[0].descriptor);
        setLastDistance(dist);
        addLog(`فاصله چهره: ${dist.toFixed(3)}`);
        if (dist > threshold) {
          addLog(`🚨 تخلف: عدم تطابق چهره (فاصله: ${dist.toFixed(3)})`);
          return { faceCount: 1, violationType: 'face_mismatch', distance: dist };
        }
        addLog('✅ چهره تطابق دارد');
        return { faceCount: 1, violationType: null, distance: dist };
      }

      setLastDistance(undefined);
      addLog('✅ یک چهره شناسایی شد (بدون مرجع)');
      return { faceCount: 1, violationType: null, distance: undefined };
    } catch (error) {
      addLog('❌ خطا در تشخیص چهره: ' + error);
      return { faceCount: 0, violationType: null, distance: undefined };
    }
  }, [isModelsLoaded, threshold, drawOverlayBoxes]);

  const captureScreenshot = useCallback((): string => {
    const canvas = canvasRef.current;
    if (!canvas) return '';
    drawFrameToCanvas();
    return canvas.toDataURL('image/jpeg', 0.8);
  }, [drawFrameToCanvas]);

  // FIXED VERSION - Much more robust reference face capture
  const captureReferenceFace = useCallback(async (): Promise<boolean> => {
    const video = videoRef.current;
    if (!video || !isModelsLoaded) {
      addLog('❌ ویدیو یا مدل‌ها برای ثبت چهره مرجع آماده نیستند');
      return false;
    }

    addLog('در حال تلاش برای ثبت چهره مرجع...');

    if (video.readyState < 2 || video.videoWidth === 0 || video.videoHeight === 0) {
      addLog('❌ ویدیو برای ثبت چهره مرجع آماده نیست');
      addLog(`وضعیت: readyState=${video.readyState}, width=${video.videoWidth}, height=${video.videoHeight}`);
      
      addLog('در حال انتظار برای آماده شدن ویدیو...');
      const ready = await waitForVideoReady(5000);
      if (!ready) {
        addLog('❌ ویدیو پس از انتظار هم آماده نشد');
        return false;
      }
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      addLog('در حال تشخیص چهره برای ثبت مرجع...');
      
      // Try multiple approaches for better detection
      let detection = null;
      let allDetections = [];
      
      // Approach 1: Try with very low threshold
      try {
        const options1 = new faceapi.TinyFaceDetectorOptions({ 
          inputSize: 320, 
          scoreThreshold: 0.15 // Very low threshold
        });
        
        allDetections = await faceapi
          .detectAllFaces(video, options1)
          .withFaceLandmarks()
          .withFaceDescriptors();
        
        addLog(`تعداد چهره‌های شناسایی شده (آستانه بسیار پایین): ${allDetections.length}`);
        
        if (allDetections.length === 1) {
          detection = allDetections[0];
          addLog(`✅ یک چهره با امتیاز ${detection.detection.score.toFixed(3)} شناسایی شد`);
        } else if (allDetections.length > 1) {
          // If multiple faces, take the one with highest confidence
          detection = allDetections.reduce((prev, current) => 
            prev.detection.score > current.detection.score ? prev : current
          );
          addLog(`✅ بهترین چهره از بین ${allDetections.length} چهره انتخاب شد (امتیاز: ${detection.detection.score.toFixed(3)})`);
        }
      } catch (e1) {
        addLog('❌ خطا در تشخیص با آستانه پایین: ' + e1);
      }

      // Approach 2: If no detection, try with larger input size
      if (!detection) {
        try {
          addLog('در حال تلاش با سایز ورودی بزرگتر...');
          const options2 = new faceapi.TinyFaceDetectorOptions({ 
            inputSize: 416, 
            scoreThreshold: 0.2
          });
          
          allDetections = await faceapi
            .detectAllFaces(video, options2)
            .withFaceLandmarks()
            .withFaceDescriptors();
          
          addLog(`تعداد چهره‌های شناسایی شده (سایز بزرگتر): ${allDetections.length}`);
          
          if (allDetections.length > 0) {
            detection = allDetections[0];
            addLog(`✅ چهره با سایز بزرگتر شناسایی شد (امتیاز: ${detection.detection.score.toFixed(3)})`);
          }
        } catch (e2) {
          addLog('❌ خطا در تشخیص با سایز بزرگتر: ' + e2);
        }
      }

      // Approach 3: Last resort - try different settings
      if (!detection) {
        try {
          addLog('در حال تلاش با تنظیمات جایگزین...');
          const options3 = new faceapi.TinyFaceDetectorOptions({ 
            inputSize: 320, 
            scoreThreshold: 0.1 // Extremely low threshold
          });
          
          const basicDetections = await faceapi.detectAllFaces(video, options3);
          addLog(`تعداد چهره‌های پایه شناسایی شده: ${basicDetections.length}`);
          
          if (basicDetections.length > 0) {
            // Try to get full detection for the first face
            const optionsFull = new faceapi.TinyFaceDetectorOptions({ 
              inputSize: 320, 
              scoreThreshold: 0.1
            });
            
            const fullDetections = await faceapi
              .detectAllFaces(video, optionsFull)
              .withFaceLandmarks()
              .withFaceDescriptors();
            
            if (fullDetections.length > 0) {
              detection = fullDetections[0];
              addLog(`✅ چهره با روش جایگزین شناسایی شد (امتیاز: ${detection.detection.score.toFixed(3)})`);
            }
          }
        } catch (e3) {
          addLog('❌ خطا در تشخیص با روش جایگزین: ' + e3);
        }
      }

      if (detection?.descriptor) {
        setReferenceFace(detection.descriptor);
        referenceFaceRef.current = detection.descriptor;
        addLog('✅ چهره مرجع با موفقیت ثبت شد');
        addLog(`اندازه دیسکریپتور: ${detection.descriptor.length}`);
        addLog(`امتیاز تشخیص: ${detection.detection.score.toFixed(3)}`);
        return true;
      } else {
        addLog('❌ هیچ چهره‌ای برای ثبت مرجع شناسایی نشد');
        
        if (allDetections.length === 0) {
          addLog('هیچ چهره‌ای در تصویر پیدا نشد');
          addLog('راهنمایی:');
          addLog('- مطمئن شوید چهره شما در دوربین قابل مشاهده است');
          addLog('- نور محیط را مناسب کنید');
          addLog('- صورت خود را مستقیماً به دوربین نگه دارید');
          addLog('- فاصله خود را از دوربین تنظیم کنید (حدود 50-100 سانتی‌متر)');
        } else if (allDetections.length > 1) {
          addLog(`چندین چهره (${allDetections.length}) شناسایی شد`);
          addLog('لطفاً فقط یک نفر در تصویر باشد');
        }
        
        return false;
      }
    } catch (error) {
      addLog('❌ خطا در ثبت چهره مرجع: ' + error);
      return false;
    }
  }, [isModelsLoaded, waitForVideoReady]);

  const startMonitoring = useCallback(() => {
    if (!isModelsLoaded || !referenceFaceRef.current) return;
    setIsMonitoring(true);
  }, [isModelsLoaded]);

  const startCamera = useCallback(async () => {
    try {
      addLog('شروع راه‌اندازی دوربین...');
      setCameraError(false);

      if (!isModelsLoaded) {
        addLog('مدل‌ها بارگذاری نشده‌اند، در حال بارگذاری...');
        await loadModels();
      }

      if (!streamRef.current) {
        addLog('در حال درخواست دسترسی به دوربین...');
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            width: { ideal: 640 }, 
            height: { ideal: 480 }, 
            facingMode: 'user' 
          },
          audio: false,
        });
        streamRef.current = stream;
        addLog('✅ دسترسی به دوربین دریافت شد');
      }

      if (videoRef.current) {
        (videoRef.current as any).playsInline = true;
        videoRef.current.muted = true;
        videoRef.current.autoplay = true;

        if (videoRef.current.srcObject) {
          const oldStream = videoRef.current.srcObject as MediaStream;
          oldStream.getTracks().forEach(track => track.stop());
        }

        videoRef.current.srcObject = streamRef.current;
        addLog('در حال تنظیم ویدیو...');
        
        videoRef.current.load();
        
        let playAttempts = 0;
        const maxPlayAttempts = 5;
        
        const tryPlay = async (): Promise<boolean> => {
          try {
            addLog(`تلاش برای پخش ویدیو (تلاش ${playAttempts + 1})...`);
            await videoRef.current!.play();
            addLog('✅ ویدیو با موفقیت شروع به پخش کرد');
            return true;
          } catch (e) {
            playAttempts++;
            addLog(`❌ خطا در پخش ویدیو (تلاش ${playAttempts}): ${e}`);
            
            if (playAttempts < maxPlayAttempts) {
              addLog('در حال انتظار برای تلاش مجدد...');
              await new Promise(resolve => setTimeout(resolve, 500));
              return tryPlay();
            }
            return false;
          }
        };

        const playSuccess = await tryPlay();
        
        if (!playSuccess) {
          addLog('❌ تمام تلاش‌ها برای پخش ویدیو ناموفق بود');
          setCameraError(true);
          setIsInitialized(false);
          return;
        }
        
        addLog('در حال انتظار برای آماده شدن ویدیو...');
        const ready = await waitForVideoReady(15000);
        
        if (ready) {
          addLog('✅ ویدیو کاملاً آماده است');
        } else {
          addLog('❌ ویدیو پس از انتظار طولانی آماده نشد');
        }
      }
      
      setIsInitialized(true);
      addLog('✅ دوربین با موفقیت راه‌اندازی شد');

      const detectIntervalMs = 1000 / detectFps;
      let lastRun = performance.now();
      let consecutiveFailures = 0;
      const maxConsecutiveFailures = 10;

      const loop = async () => {
        rafIdRef.current = requestAnimationFrame(loop);

        const now = performance.now();
        if (now - lastRun < detectIntervalMs || detectionInProgressRef.current) return;
        detectionInProgressRef.current = true;
        const t0 = performance.now();

        try {
          drawFrameToCanvas();

          const result = await detectOnce();
          
          if (result.faceCount > 0 || result.violationType === 'no_face') {
            consecutiveFailures = 0;
          }
          
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
                type: result.violationType!,
                ...(result.distance !== undefined ? { distance: result.distance } : {}),
              };
              setViolations(prev => [...prev, violation]);
              addLog(`🚨 تخلف شناسایی شد: ${result.violationType}`);
            }
          } else {
            setIsViolating(false);
          }
        } catch (e) {
          consecutiveFailures++;
          addLog(`❌ خطا در حلقه تشخیص (تلاش ${consecutiveFailures}): ${e}`);
          
          if (consecutiveFailures >= maxConsecutiveFailures) {
            addLog('❌ تعداد خطاهای متوالی زیاد شد، در حال تلاش برای راه‌اندازی مجدد دوربین...');
            consecutiveFailures = 0;
            
            try {
              stopCamera();
              await new Promise(resolve => setTimeout(resolve, 1000));
              await startCamera();
            } catch (restartError) {
              addLog('❌ راه‌اندازی مجدد دوربین ناموفق بود: ' + restartError);
            }
          }
        } finally {
          const t1 = performance.now();
          setFps(Math.round(1000 / Math.max(t1 - t0, 1)));
          detectionInProgressRef.current = false;
          lastRun = now;
        }
      };

      if (!rafIdRef.current) {
        rafIdRef.current = requestAnimationFrame(loop);
        addLog('✅ حلقه تشخیص شروع شد');
      }
    } catch (err) {
      addLog('❌ خطا در راه‌اندازی دوربین: ' + err);
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