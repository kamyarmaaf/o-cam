import React, { useState, useRef, useEffect } from 'react';
import { useFaceDetectionFixed } from '../hooks/useFaceDetectionFixed';
import { 
  Camera, 
  CameraOff, 
  AlertTriangle, 
  Eye,
  Users,
  CheckCircle,
  Settings,
} from 'lucide-react';

const FixedFaceTest: React.FC = () => {
  const {
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
  } = useFaceDetectionFixed(true, { drawOverlay: true, detectFps: 10, threshold: 0.6 });

  const [isMinimized, setIsMinimized] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [violationCount, setViolationCount] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  // Override console.log to capture logs
  useEffect(() => {
    const originalLog = console.log;
    console.log = (...args) => {
      const message = args.join(' ');
      if (message.includes('[FaceDetectionFixed]')) {
        setLogs(prev => [...prev.slice(-19), message.replace('[FaceDetectionFixed] ', '')]);
      }
      originalLog(...args);
    };

    return () => {
      console.log = originalLog;
    };
  }, []);

  // Update violation count
  useEffect(() => {
    setViolationCount(violations.length);
  }, [violations]);

  const getStatusColor = () => {
    if (cameraError) return 'border-red-500 bg-red-50';
    if (isViolating) return 'border-red-500 bg-red-50';
    if (currentFaceCount === 1) return 'border-green-500 bg-green-50';
    return 'border-yellow-500 bg-yellow-50';
  };

  const getStatusText = () => {
    if (cameraError) return 'خطا در دوربین';
    if (!isModelsLoaded) return 'در حال بارگذاری مدل‌ها...';
    if (!isInitialized) return 'در حال انتظار برای شروع دوربین...';
    if (currentFaceCount === 0) return 'چهره‌ای شناسایی نشد';
    if (currentFaceCount === 1) {
      if (referenceFace && isMonitoring) return 'وضعیت عادی (در حال مانیتورینگ)';
      if (referenceFace && !isMonitoring) return 'چهره ثبت شد (آماده مانیتورینگ)';
      return 'وضعیت عادی';
    }
    if (currentFaceCount > 1) return `تخلف: ${currentFaceCount} چهره`;
    return 'در حال بررسی...';
  };

  const getStatusIcon = () => {
    if (cameraError) return <CameraOff className="h-5 w-5 text-red-600" />;
    if (isViolating) return <AlertTriangle className="h-5 w-5 text-red-600" />;
    if (currentFaceCount === 1) return <CheckCircle className="h-5 w-5 text-green-600" />;
    return <Eye className="h-5 w-5 text-yellow-600" />;
  };

  const handleCaptureReference = async () => {
    const success = await captureReferenceFace();
    if (success) {
      // Start monitoring automatically after successful capture
      setTimeout(() => {
        startMonitoring();
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">تست تشخیص چهره (نسخه اصلاح شده)</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Status */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className={`p-3 rounded text-center text-sm ${
              isModelsLoaded ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              مدل‌ها: {isModelsLoaded ? '✅ آماده' : '❌ بارگذاری نشده'}
            </div>
            <div className={`p-3 rounded text-center text-sm ${
              isInitialized ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              دوربین: {isInitialized ? '✅ فعال' : '❌ غیرفعال'}
            </div>
            <div className={`p-3 rounded text-center text-sm ${
              referenceFace ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              چهره مرجع: {referenceFace ? '✅ ثبت شد' : '❌ ثبت نشده'}
            </div>
            <div className={`p-3 rounded text-center text-sm ${
              isMonitoring ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              مانیتورینگ: {isMonitoring ? '✅ فعال' : '❌ غیرفعال'}
            </div>
          </div>

          {/* Camera */}
          <div className="mb-6">
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
                ref={overlayCanvasRef}
                className="absolute inset-0 w-full h-64 pointer-events-none"
                style={{ transform: 'scaleX(-1)' }}
              />
              
              {/* Status overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {!isModelsLoaded && (
                  <div className="bg-black/80 text-white px-4 py-2 rounded-2xl">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span className="text-sm font-medium">در حال بارگذاری مدل‌ها...</span>
                    </div>
                  </div>
                )}
                {isModelsLoaded && !isInitialized && (
                  <div className="bg-yellow-500/90 text-white px-4 py-2 rounded-2xl">
                    <div className="flex items-center space-x-2">
                      <Eye className="h-5 w-5" />
                      <span className="text-sm font-medium">در حال شروع دوربین...</span>
                    </div>
                  </div>
                )}
                {isInitialized && currentFaceCount === 0 && (
                  <div className="bg-red-500/90 text-white px-4 py-2 rounded-2xl animate-pulse">
                    <div className="flex items-center space-x-2">
                      <Eye className="h-5 w-5" />
                      <span className="text-sm font-medium">چهره‌ای شناسایی نشد</span>
                    </div>
                  </div>
                )}
                {isInitialized && currentFaceCount === 1 && (
                  <div className="bg-green-500/90 text-white px-4 py-2 rounded-2xl">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5" />
                      <span className="text-sm font-medium">وضعیت عادی</span>
                    </div>
                  </div>
                )}
                {isInitialized && currentFaceCount > 1 && (
                  <div className="bg-red-500/90 text-white px-4 py-2 rounded-2xl animate-pulse">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5" />
                      <span className="text-sm font-medium">تخلف: {currentFaceCount} چهره</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Info overlay */}
              <div className="absolute bottom-2 left-2 right-2 bg-black/80 text-white text-xs rounded-xl px-3 py-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>چهره‌ها: {currentFaceCount}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span>FPS: {fps ?? '-'}</span>
                    <span>dist: {lastDistance ? lastDistance.toFixed(3) : '-'}</span>
                  </div>
                </div>
              </div>

              {/* Violation counter */}
              {violationCount > 0 && (
                <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-xl">
                  <div className="flex items-center space-x-1">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm font-bold">تخلفات: {violationCount}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Status text */}
          <div className={`mb-6 p-4 rounded-lg ${getStatusColor()}`}>
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isViolating ? 'bg-red-100' : currentFaceCount === 1 ? 'bg-green-100' : 'bg-yellow-100'
              }`}>
                {getStatusIcon()}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">وضعیت سیستم</h3>
                <p className={`text-sm ${
                  isViolating ? 'text-red-600' : 
                  currentFaceCount === 1 ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {getStatusText()}
                </p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={startCamera}
              disabled={isInitialized || !isModelsLoaded}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              شروع دوربین
            </button>
            <button
              onClick={stopCamera}
              disabled={!isInitialized}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
            >
              توقف دوربین
            </button>
            <button
              onClick={handleCaptureReference}
              disabled={!isInitialized || !isModelsLoaded || !!referenceFace}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
            >
              ثبت چهره مرجع
            </button>
            <button
              onClick={startMonitoring}
              disabled={!isInitialized || !isModelsLoaded || !referenceFace || isMonitoring}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-400"
            >
              شروع مانیتورینگ
            </button>
            <button
              onClick={() => setLogs([])}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              پاک لاگ‌ها
            </button>
          </div>

          {/* Logs */}
          <div>
            <h3 className="font-semibold mb-2">لاگ‌های سیستم:</h3>
            <div className="bg-black text-green-400 p-4 rounded-lg h-64 overflow-y-auto font-mono text-sm">
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
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">راهنمای استفاده:</h3>
          <ol className="text-blue-800 space-y-2">
            <li>1. روی "شروع دوربین" کلیک کنید و اجازه دسترسی به دوربین را بدهید</li>
            <li>2. منتظر بمانید تا مدل‌ها بارگذاری شوند و دوربین فعال شود</li>
            <li>3. مطمئن شوید چهره شما در دوربین قابل مشاهده است</li>
            <li>4. روی "ثبت چهره مرجع" کلیک کنید (سیستم به طور خودکار چند بار تلاش می‌کند)</li>
            <li>5. پس از ثبت موفق، مانیتورینگ به طور خودکار فعال می‌شود</li>
            <li>6. لاگ‌ها را برای مشاهده جزئیات و خطاها بررسی کنید</li>
          </ol>
          
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <h4 className="font-semibold text-yellow-800 mb-2">نکات مهم:</h4>
            <ul className="text-yellow-700 text-sm space-y-1">
              <li>• نور محیط را مناسب کنید</li>
              <li>• صورت خود را مستقیماً به دوربین نگه دارید</li>
              <li>• فاصله مناسب از دوربین (حدود 50-100 سانتی‌متر)</li>
              <li>• مطمئن شوید فقط یک نفر در تصویر باشد</li>
              <li>• اگر ثبت چهره مرجع failed شد، چند بار تلاش کنید</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FixedFaceTest;