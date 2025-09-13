// components/ExamCamera.tsx
"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useFaceDetection } from '../hooks/useFaceDetection';
import { 
  Camera, 
  CameraOff, 
  AlertTriangle, 
  Eye,
  Users,
  Minimize,
  Maximize,
  CheckCircle,
  Settings,
} from 'lucide-react';

interface ExamCameraProps {
  onViolationDetected?: (violationData: any) => void;
  studentId?: string;
  examId?: string;
  className?: string;
}

const ExamCamera: React.FC<ExamCameraProps> = ({
  onViolationDetected,
  studentId = 'student-001',
  examId = 'exam-001',
  className = ''
}) => {
  const {
    videoRef,
    canvasRef,
    overlayCanvasRef,
    isInitialized,
    currentFaceCount,
    isViolating,
    violations,
    referenceFace,
    isMonitoring,
    cameraError,
    lastDistance,
    fps,
    startCamera,
    stopCamera,
    captureReferenceFace,
    startMonitoring,
  } = useFaceDetection(false, { drawOverlay: true, detectFps: 10, threshold: 0.6 }); // شروع با دکمه

  const [isMinimized, setIsMinimized] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [violationCount, setViolationCount] = useState(0);
  const [lastViolationTime, setLastViolationTime] = useState<Date | null>(null);

  // همگام‌سازی تعداد تخلفات و ارسال به والد
  useEffect(() => {
    if (violations.length === 0) return;
    const latest = violations[violations.length - 1];
    setViolationCount(violations.length);
    setLastViolationTime(latest.timestamp);

    if (onViolationDetected) {
      onViolationDetected({
        studentId,
        examId,
        timestamp: latest.timestamp,
        faceCount: latest.faceCount,
        screenshot: latest.screenshot,
        violationNumber: violations.length,
        type: latest.type,
        distance: latest.distance,
      });
    }
  }, [violations, onViolationDetected, studentId, examId]);

  const cameraStatus = useMemo<'loading' | 'active' | 'error'>(() => {
    if (cameraError) return 'error';
    return isInitialized ? 'active' : 'loading';
  }, [cameraError, isInitialized]);

  const getStatusColor = () => {
    if (cameraStatus === 'error') return 'border-red-500 bg-red-50';
    if (isViolating) return 'border-red-500 bg-red-50';
    if (currentFaceCount === 1) return 'border-green-500 bg-green-50';
    return 'border-yellow-500 bg-yellow-50';
  };

  const getStatusText = () => {
    if (cameraStatus === 'error') return 'خطا در دوربین';
    if (cameraStatus === 'loading') return 'در حال انتظار برای شروع دوربین...';
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
    if (cameraStatus === 'error') return <CameraOff className="h-5 w-5 text-red-600" />;
    if (isViolating) return <AlertTriangle className="h-5 w-5 text-red-600" />;
    if (currentFaceCount === 1) return <CheckCircle className="h-5 w-5 text-green-600" />;
    return <Eye className="h-5 w-5 text-yellow-600" />;
  };

  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 ${className}`}>
      <div className={`bg-white/95 backdrop-blur-lg rounded-3xl shadow-hero border-2 transition-all duration-300 ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-92'
      } ${getStatusColor()}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-accent/20">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isViolating ? 'bg-red-100' : currentFaceCount === 1 ? 'bg-green-100' : 'bg-yellow-100'
            }`}>
              {getStatusIcon()}
            </div>
            <div>
              <h3 className="font-bold text-text-heading text-sm">سیستم نظارت آزمون</h3>
              <p className={`text-xs ${
                isViolating ? 'text-red-600' : 
                currentFaceCount === 1 ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {getStatusText()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 space-x-reverse">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-1 hover:bg-soft/50 rounded-lg transition-colors"
              title="تنظیمات"
            >
              <Settings className="h-4 w-4 text-text-body/60" />
            </button>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:bg-soft/50 rounded-lg transition-colors"
              title={isMinimized ? 'بزرگ کردن' : 'کوچک کردن'}
            >
              {isMinimized ? <Maximize className="h-4 w-4" /> : <Minimize className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Video + Overlay */}
            <div className="p-4">
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-48 bg-black rounded-2xl border-2 border-accent/20 object-cover"
                  style={{ transform: 'scaleX(-1)' }} // Mirror effect
                />
                {/* Canvas نمایش باکس‌ها - روی ویدیو */}
                <canvas
                  ref={overlayCanvasRef}
                  className="absolute inset-0 w-full h-48 pointer-events-none"
                  style={{ transform: 'scaleX(-1)' }}
                />
                
                {/* Status Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {cameraStatus === 'loading' && (
                    <div className="bg-black/80 text-white px-4 py-2 rounded-2xl">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span className="text-sm font-medium">در حال بارگذاری...</span>
                      </div>
                    </div>
                  )}
                  {cameraStatus === 'active' && currentFaceCount === 0 && (
                    <div className="bg-red-500/90 text-white px-4 py-2 rounded-2xl animate-pulse">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Eye className="h-5 w-5" />
                        <span className="text-sm font-medium">چهره‌ای شناسایی نشد</span>
                      </div>
                    </div>
                  )}
                  {cameraStatus === 'active' && currentFaceCount === 1 && (
                    <div className="bg-green-500/90 text-white px-4 py-2 rounded-2xl">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <CheckCircle className="h-5 w-5" />
                        <span className="text-sm font-medium">وضعیت عادی</span>
                      </div>
                    </div>
                  )}
                  {cameraStatus === 'active' && currentFaceCount > 1 && (
                    <div className="bg-red-500/90 text-white px-4 py-2 rounded-2xl animate-pulse">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <AlertTriangle className="h-5 w-5" />
                        <span className="text-sm font-medium">تخلف: {currentFaceCount} چهره</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Face Count + Debug */}
                <div className="absolute bottom-2 left-2 right-2 bg-black/80 text-white text-xs rounded-xl px-3 py-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Users className="h-4 w-4" />
                      <span>چهره‌ها: {currentFaceCount}</span>
                    </div>
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <span>FPS: {fps ?? '-'}</span>
                      <span>dist: {lastDistance ? lastDistance.toFixed(3) : '-'}</span>
                    </div>
                  </div>
                </div>

                {/* Violation Counter */}
                {violationCount > 0 && (
                  <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-xl">
                    <div className="flex items-center space-x-1 space-x-reverse">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm font-bold">تخلفات: {violationCount}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Controls / Settings */}
            {showSettings && (
              <div className="px-4 pb-4">
                <div className="bg-soft/50 rounded-2xl p-3 space-y-3">
                  <h4 className="font-semibold text-text-heading text-sm">تنظیمات و وضعیت</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>دوربین: {cameraStatus === 'active' ? '✅' : cameraStatus === 'error' ? '❌' : '⏳'}</div>
                    <div>مرجع چهره: {referenceFace ? '✅' : '❌'}</div>
                    <div>مانیتورینگ: {isMonitoring ? '✅' : '❌'}</div>
                    <div>تخلفات: {violationCount}</div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={startCamera}
                      className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      شروع/تلاش مجدد دوربین
                    </button>
                    <button
                      onClick={stopCamera}
                      className="flex-1 bg-red-600 text-white py-2 px-3 rounded-xl hover:bg-red-700 transition-colors text-sm font-medium"
                    >
                      توقف دوربین
                    </button>
                    {!referenceFace && (
                      <button
                        onClick={async () => {
                          const ok = await captureReferenceFace();
                          if (ok) startMonitoring();
                        }}
                        className="flex-1 bg-green-600 text-white py-2 px-3 rounded-xl hover:bg-green-700 transition-colors text-sm font-medium"
                      >
                        ثبت چهره و شروع مانیتورینگ
                      </button>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => setShowSettings(false)}
                      className="px-3 py-2 border border-accent/30 text-text-body rounded-xl hover:bg-soft/50 transition-colors text-sm"
                    >
                      بستن
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Canvas پنهان برای پردازش/اسکرین‌شات */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default ExamCamera;