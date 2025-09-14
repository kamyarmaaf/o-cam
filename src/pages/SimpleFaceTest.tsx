import React, { useState, useRef, useEffect } from 'react';
import * as faceapi from 'face-api.js';

const SimpleFaceTest: React.FC = () => {
  const [status, setStatus] = useState({
    modelsLoaded: false,
    cameraActive: false,
    videoReady: false,
    detecting: false
  });
  
  const [detectionResults, setDetectionResults] = useState({
    faceCount: 0,
    lastError: '',
    lastSuccess: '',
    videoInfo: {
      width: 0,
      height: 0,
      readyState: 0,
      paused: false,
      ended: false
    }
  });

  const [logs, setLogs] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const addLog = (message: string) => {
    console.log(`[SimpleTest] ${message}`);
    setLogs(prev => [...prev.slice(-19), `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const updateVideoInfo = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      setDetectionResults(prev => ({
        ...prev,
        videoInfo: {
          width: video.videoWidth,
          height: video.videoHeight,
          readyState: video.readyState,
          paused: video.paused,
          ended: video.ended
        }
      }));
    }
  };

  // Load models
  const loadModels = async () => {
    try {
      addLog('شروع بارگذاری مدل‌ها...');
      
      // Try local first
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
          faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        ]);
        addLog('✅ مدل‌ها از مسیر محلی بارگذاری شدند');
      } catch (localError) {
        addLog('❌ خطا در بارگذاری محلی: ' + localError);
        addLog('در حال تلاش برای CDN...');
        
        // Fallback to CDN
        const base = 'https://justadudewhohacks.github.io/face-api.js/models';
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(base),
          faceapi.nets.faceLandmark68Net.loadFromUri(base),
          faceapi.nets.faceRecognitionNet.loadFromUri(base),
        ]);
        addLog('✅ مدل‌ها از CDN بارگذاری شدند');
      }
      
      setStatus(prev => ({ ...prev, modelsLoaded: true }));
      setDetectionResults(prev => ({ ...prev, lastSuccess: 'مدل‌ها با موفقیت بارگذاری شدند' }));
    } catch (error) {
      addLog('❌ خطا در بارگذاری مدل‌ها: ' + error);
      setDetectionResults(prev => ({ ...prev, lastError: 'خطا در بارگذاری مدل‌ها: ' + error }));
    }
  };

  // Start camera
  const startCamera = async () => {
    try {
      addLog('در حال شروع دوربین...');
      
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
        videoRef.current.muted = true;
        videoRef.current.playsInline = true;
        
        videoRef.current.onloadedmetadata = async () => {
          addLog('✅ متادیتای ویدیو بارگذاری شد');
          updateVideoInfo();
          
          try {
            await videoRef.current?.play();
            addLog('✅ ویدیو شروع به پخش کرد');
            
            // Wait a bit more for video to be truly ready
            setTimeout(() => {
              updateVideoInfo();
              if (videoRef.current && 
                  videoRef.current.videoWidth > 0 && 
                  videoRef.current.videoHeight > 0 &&
                  !videoRef.current.paused) {
                setStatus(prev => ({ ...prev, cameraActive: true, videoReady: true }));
                addLog('✅ ویدیو کاملاً آماده است');
              } else {
                addLog('⚠️ ویدیو هنوز کاملاً آماده نیست');
              }
            }, 1000);
          } catch (playError) {
            addLog('❌ خطا در پخش ویدیو: ' + playError);
          }
        };
      }
    } catch (error) {
      addLog('❌ خطا در دسترسی به دوربین: ' + error);
      setDetectionResults(prev => ({ ...prev, lastError: 'خطا در دسترسی به دوربین: ' + error }));
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setStatus(prev => ({ ...prev, cameraActive: false, videoReady: false }));
    addLog('دوربین متوقف شد');
  };

  // Detect faces - simple version
  const detectFaces = async () => {
    if (!videoRef.current || !status.modelsLoaded) {
      addLog('❌ ویدیو یا مدل‌ها آماده نیستند');
      setDetectionResults(prev => ({ 
        ...prev, 
        lastError: 'ویدیو یا مدل‌ها آماده نیستند' 
      }));
      return;
    }

    updateVideoInfo();
    
    const video = videoRef.current;
    
    // Detailed readiness check
    if (video.readyState < 2) {
      addLog('❌ ویدیو آماده نیست (readyState: ' + video.readyState + ')');
      setDetectionResults(prev => ({ 
        ...prev, 
        lastError: 'ویدیو آماده نیست (readyState: ' + video.readyState + ')' 
      }));
      return;
    }
    
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      addLog('❌ ابعاد ویدیو صفر است');
      setDetectionResults(prev => ({ 
        ...prev, 
        lastError: 'ابعاد ویدیو صفر است' 
      }));
      return;
    }

    if (video.paused || video.ended) {
      addLog('❌ ویدیو در حال پخش نیست');
      setDetectionResults(prev => ({ 
        ...prev, 
        lastError: 'ویدیو در حال پخش نیست' 
      }));
      return;
    }

    try {
      setStatus(prev => ({ ...prev, detecting: true }));
      addLog('در حال تشخیص چهره...');
      
      // Small delay to ensure video frame is ready
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const options = new faceapi.TinyFaceDetectorOptions({ 
        inputSize: 320, 
        scoreThreshold: 0.3 
      });
      
      const results = await faceapi
        .detectAllFaces(video, options)
        .withFaceLandmarks()
        .withFaceDescriptors();

      const faceCount = results.length;
      addLog(`✅ ${faceCount} چهره شناسایی شد`);
      
      setDetectionResults(prev => ({
        ...prev,
        faceCount,
        lastSuccess: `${faceCount} چهره شناسایی شد`,
        lastError: ''
      }));
      
    } catch (error) {
      addLog('❌ خطا در تشخیص چهره: ' + error);
      setDetectionResults(prev => ({ 
        ...prev, 
        lastError: 'خطا در تشخیص چهره: ' + error 
      }));
    } finally {
      setStatus(prev => ({ ...prev, detecting: false }));
    }
  };

  // Auto-detect every 2 seconds when camera is active
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (status.cameraActive && status.videoReady && status.modelsLoaded) {
      interval = setInterval(() => {
        if (!status.detecting) {
          detectFaces();
        }
      }, 2000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status.cameraActive, status.videoReady, status.modelsLoaded, status.detecting]);

  // Initial load
  useEffect(() => {
    loadModels();
    
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">تست ساده تشخیص چهره</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Video and Controls */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4">دوربین و کنترل‌ها</h2>
            
            {/* Status Indicators */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className={`p-3 rounded text-center text-sm ${
                status.modelsLoaded ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                مدل‌ها: {status.modelsLoaded ? '✅ آماده' : '❌ بارگذاری نشده'}
              </div>
              <div className={`p-3 rounded text-center text-sm ${
                status.cameraActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                دوربین: {status.cameraActive ? '✅ فعال' : '❌ غیرفعال'}
              </div>
              <div className={`p-3 rounded text-center text-sm ${
                status.videoReady ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                ویدیو: {status.videoReady ? '✅ آماده' : '⏳ در حال آماده‌سازی'}
              </div>
              <div className={`p-3 rounded text-center text-sm ${
                status.detecting ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
              }`}>
                تشخیص: {status.detecting ? '🔄 در حال انجام' : '⏸️ متوقف'}
              </div>
            </div>

            {/* Video */}
            <div className="mb-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-48 bg-black rounded-lg object-cover"
                style={{ transform: 'scaleX(-1)' }}
              />
            </div>

            {/* Video Info */}
            <div className="bg-gray-50 p-3 rounded-lg mb-4 text-sm">
              <h3 className="font-semibold mb-2">اطلاعات ویدیو:</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>عرض: {detectionResults.videoInfo.width}</div>
                <div>ارتفاع: {detectionResults.videoInfo.height}</div>
                <div>ReadyState: {detectionResults.videoInfo.readyState}</div>
                <div>Paused: {detectionResults.videoInfo.paused ? 'Yes' : 'No'}</div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={startCamera}
                disabled={status.cameraActive || !status.modelsLoaded}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 text-sm"
              >
                شروع دوربین
              </button>
              <button
                onClick={stopCamera}
                disabled={!status.cameraActive}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400 text-sm"
              >
                توقف دوربین
              </button>
              <button
                onClick={detectFaces}
                disabled={!status.cameraActive || !status.videoReady || !status.modelsLoaded || status.detecting}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 text-sm"
              >
                تشخیص چهره
              </button>
              <button
                onClick={() => setLogs([])}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
              >
                پاک لاگ‌ها
              </button>
            </div>

            {/* Results */}
            <div className="mt-4 space-y-2">
              <div className="bg-blue-50 p-3 rounded-lg">
                <span className="text-sm font-medium">تعداد چهره‌ها: </span>
                <span className="text-lg font-bold">{detectionResults.faceCount}</span>
              </div>
              
              {detectionResults.lastSuccess && (
                <div className="bg-green-50 p-3 rounded-lg">
                  <span className="text-sm text-green-800">{detectionResults.lastSuccess}</span>
                </div>
              )}
              
              {detectionResults.lastError && (
                <div className="bg-red-50 p-3 rounded-lg">
                  <span className="text-sm text-red-800">{detectionResults.lastError}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Logs */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4">لاگ‌ها</h2>
            
            <div className="bg-black text-green-400 p-4 rounded-lg h-96 overflow-y-auto font-mono text-xs">
              {logs.length === 0 ? (
                <div className="text-gray-500">در انتظار فعالیت...</div>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="mb-1">
                    {log}
                  </div>
                ))
              )}
            </div>
            
            <div className="mt-4 text-sm text-gray-600">
              <p className="font-semibold mb-2">راهنمای استفاده:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>منتظر بمانید تا مدل‌ها بارگذاری شوند</li>
                <li>روی "شروع دوربین" کلیک کنید</li>
                <li>منتظر بمانید تا ویدیو آماده شود</li>
                <li>تشخیص به طور خودکار هر 2 ثانیه انجام می‌شود</li>
                <li>یا به صورت دستی روی "تشخیص چهره" کلیک کنید</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleFaceTest;