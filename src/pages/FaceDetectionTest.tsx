import React, { useState, useRef, useEffect } from 'react';
import * as faceapi from 'face-api.js';

const FaceDetectionTest: React.FC = () => {
  const [isModelsLoaded, setIsModelsLoaded] = useState(false);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [detectionStatus, setDetectionStatus] = useState('در حال آماده‌سازی...');
  const [faceCount, setFaceCount] = useState(0);
  const [consoleLog, setConsoleLog] = useState<string[]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const addLog = (message: string) => {
    console.log(message);
    setConsoleLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  // Load face-api.js models
  useEffect(() => {
    const loadModels = async () => {
      try {
        addLog('شروع بارگذاری مدل‌های face-api.js...');
        
        // Try loading from local models first
        try {
          await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
            faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
          ]);
          addLog('✅ مدل‌ها با موفقیت از مسیر /models بارگذاری شدند');
        } catch (localError) {
          addLog('❌ خطا در بارگذاری مدل‌های محلی: ' + localError);
          addLog('در حال تلاش برای بارگذاری از CDN...');
          
          // Fallback to CDN
          await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models'),
            faceapi.nets.faceRecognitionNet.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models'),
          ]);
          addLog('✅ مدل‌ها با موفقیت از CDN بارگذاری شدند');
        }
        
        setIsModelsLoaded(true);
        setDetectionStatus('مدل‌ها آماده هستند');
      } catch (error) {
        addLog('❌ خطا در بارگذاری مدل‌ها: ' + error);
        setDetectionStatus('خطا در بارگذاری مدل‌ها');
      }
    };

    loadModels();
  }, []);

  // Start webcam
  const startWebcam = async () => {
    try {
      addLog('در حال شروع دوربین...');
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsWebcamActive(true);
        addLog('✅ دوربین با موفقیت فعال شد');
        
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play();
            addLog('✅ ویدیو در حال پخش است');
          }
        };
      }
    } catch (error) {
      addLog('❌ خطا در دسترسی به دوربین: ' + error);
      setDetectionStatus('خطا در دسترسی به دوربین');
    }
  };

  // Stop webcam
  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsWebcamActive(false);
    setFaceCount(0);
    addLog('دوربین متوقف شد');
  };

  // Detect faces
  const detectFaces = async () => {
    if (!videoRef.current || !isModelsLoaded) {
      addLog('❌ ویدیو یا مدل‌ها آماده نیستند');
      return;
    }

    try {
      addLog('در حال تشخیص چهره...');
      
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

      setFaceCount(detections.length);
      addLog(`✅ ${detections.length} چهره شناسایی شد`);

      // Draw detections on canvas
      if (canvasRef.current && videoRef.current) {
        const displaySize = { 
          width: videoRef.current.videoWidth, 
          height: videoRef.current.videoHeight 
        };
        
        canvasRef.current.width = displaySize.width;
        canvasRef.current.height = displaySize.height;
        
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
          faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
        }
      }

      if (detections.length > 0) {
        addLog(`اطلاعات چهره اول: اندازه دیسکریپتور = ${detections[0].descriptor.length}`);
      }
    } catch (error) {
      addLog('❌ خطا در تشخیص چهره: ' + error);
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">تست تشخیص چهره</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Video Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">دوربین و تشخیص چهره</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">وضعیت مدل‌ها:</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  isModelsLoaded ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {isModelsLoaded ? '✅ آماده' : '⏳ در حال بارگذاری'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">وضعیت دوربین:</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  isWebcamActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {isWebcamActive ? '✅ فعال' : '❌ غیرفعال'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">تعداد چهره‌ها:</span>
                <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                  {faceCount}
                </span>
              </div>
              
              <div className="text-sm text-gray-600">
                وضعیت تشخیص: {detectionStatus}
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-64 bg-black rounded-lg object-cover"
                  style={{ transform: 'scaleX(-1)' }}
                />
                <canvas
                  ref={canvasRef}
                  className="absolute top-0 left-0 w-full h-64 pointer-events-none"
                  style={{ transform: 'scaleX(-1)' }}
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={startWebcam}
                  disabled={!isModelsLoaded || isWebcamActive}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                >
                  شروع دوربین
                </button>
                <button
                  onClick={stopWebcam}
                  disabled={!isWebcamActive}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
                >
                  توقف دوربین
                </button>
                <button
                  onClick={detectFaces}
                  disabled={!isModelsLoaded || !isWebcamActive}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
                >
                  تشخیص چهره
                </button>
              </div>
            </div>
          </div>

          {/* Console Log Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">لاگ کنسول</h2>
            
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg h-96 overflow-y-auto font-mono text-sm">
              {consoleLog.length === 0 ? (
                <div className="text-gray-500">در انتظار فعالیت...</div>
              ) : (
                consoleLog.map((log, index) => (
                  <div key={index} className="mb-1">
                    {log}
                  </div>
                ))
              )}
            </div>
            
            <button
              onClick={() => setConsoleLog([])}
              className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              پاک کردن لاگ
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">راهنمای تست</h3>
          <ul className="text-blue-800 space-y-2">
            <li>• ابتدا روی "شروع دوربین" کلیک کنید و اجازه دسترسی به دوربین را بدهید</li>
            <li>• منتظر بمانید تا مدل‌های face-api.js بارگذاری شوند</li>
            <li>• مطمئن شوید که چهره شما در دوربین قابل مشاهده است</li>
            <li>• روی "تشخیص چهره" کلیک کنید تا عملکرد تشخیص تست شود</li>
            <li>• لاگ کنسول را برای مشاهده جزئیات و خطاها بررسی کنید</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FaceDetectionTest;