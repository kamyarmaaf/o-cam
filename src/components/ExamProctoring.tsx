// components/ExamProctoring.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useFaceDetection } from '../hooks/useFaceDetection';
import { 
  Camera, 
  CameraOff, 
  AlertTriangle, 
  Shield, 
  Eye,
  Users,
  Clock,
  X,
  Minimize,
  Maximize,
  CheckCircle
} from 'lucide-react';

interface ExamProctoringProps {
  isExamActive: boolean;
  studentId: string;
  examId: string;
  onViolationDetected: (violationData: any) => void;
  onEjectStudent: () => void;
}

const ExamProctoring: React.FC<ExamProctoringProps> = ({
  isExamActive,
  studentId,
  examId,
  onViolationDetected,
  onEjectStudent
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
    isModelsLoaded,
    startCamera,
    stopCamera,
    captureReferenceFace,
    startMonitoring
  } = useFaceDetection(false, { drawOverlay: true, detectFps: 10, threshold: 0.6 });

  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [violationCount, setViolationCount] = useState(0);
  const [showViolationWarning, setShowViolationWarning] = useState(false);
  const [isEjected, setIsEjected] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showCameraBox, setShowCameraBox] = useState(false);
  const [needsReferenceFace, setNeedsReferenceFace] = useState(true);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureError, setCaptureError] = useState('');

  useEffect(() => {
    if (!isExamActive) return;
    // اجازه دوربین با کلیک درخواست میشه
  }, [isExamActive]);

  useEffect(() => {
    if (violations.length > 0) {
      const latest = violations[violations.length - 1];
      setViolationCount(violations.length);
      onViolationDetected({
        studentId,
        examId,
        timestamp: latest.timestamp,
        faceCount: latest.faceCount,
        screenshot: latest.screenshot,
        violationNumber: violations.length,
        violationType: latest.type
      });

      if (violations.length === 3) {
        setIsEjected(true);
        setTimeout(() => onEjectStudent(), 2000);
      } else {
        setShowViolationWarning(true);
        setTimeout(() => setShowViolationWarning(false), 4000);
      }
    }
  }, [violations, studentId, examId, onViolationDetected, onEjectStudent]);

  const requestCameraAccess = async () => {
    try {
      await startCamera();
      setCameraPermission('granted');
      setShowCameraBox(true);
    } catch {
      setCameraPermission('denied');
    }
  };

  const handleCaptureReferenceFace = async () => {
    setIsCapturing(true);
    setCaptureError('');
    const ok = await captureReferenceFace();
    if (ok) {
      setNeedsReferenceFace(false);
      startMonitoring();
    } else {
      setCaptureError('چهره شناسایی نشد. نور و فاصله را بررسی کنید و مستقیم به دوربین نگاه کنید.');
    }
    setIsCapturing(false);
  };

  if (!isExamActive) return null;

  if (isEjected) {
    return (
      <div className="fixed inset-0 bg-red-600 z-50 flex items-center justify-center text-white">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">حذف از آزمون به دلیل تخلفات</h2>
          <p>اطلاعات شما جهت بررسی ثبت شد.</p>
        </div>
      </div>
    );
  }

  if (cameraPermission === 'denied') {
    return (
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-hero max-w-md w-full p-6 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CameraOff className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold mb-4">دسترسی به دوربین لازم است</h2>
          <button onClick={requestCameraAccess} className="btn-primary w-full">
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  if ((cameraPermission === 'prompt' && !isInitialized) || !isModelsLoaded) {
    return (
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-hero max-w-md w-full p-6 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold mb-4">راه‌اندازی سیستم نظارت</h2>
          <div className="space-y-2 text-sm text-text-body mb-4">
            <div className="flex items-center justify-center space-x-2 space-x-reverse">
              <Shield className="h-4 w-4 text-green-600" />
              <span>پردازش محلی تصاویر</span>
            </div>
            <div className="flex items-center justify-center space-x-2 space-x-reverse">
              <Eye className="h-4 w-4 text-blue-600" />
              <span>تشخیص خودکار چهره‌ها</span>
            </div>
          </div>
          <button onClick={requestCameraAccess} disabled={!isModelsLoaded} className="btn-primary w-full">
            {!isModelsLoaded ? 'بارگذاری مدل‌ها...' : 'فعال‌سازی دوربین'}
          </button>
        </div>
      </div>
    );
  }

  // ثبت چهره مرجع
  if (needsReferenceFace && isInitialized && isModelsLoaded) {
    return (
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-hero max-w-md w-full p-6 text-center">
          <h2 className="text-xl font-bold mb-4">ثبت چهره مرجع</h2>
          <div className="relative w-56 h-40 mx-auto mb-4 bg-gray-100 rounded-2xl overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ transform: 'scaleX(-1)' }}
            />
            <canvas
              ref={overlayCanvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ transform: 'scaleX(-1)' }}
            />
            <div className={`absolute inset-0 border-2 rounded-2xl pointer-events-none ${
              currentFaceCount === 1 ? 'border-green-500' : currentFaceCount > 1 ? 'border-red-500' : 'border-yellow-500'
            }`} />
          </div>

          {captureError && <p className="text-sm text-red-600 mb-2">{captureError}</p>}

          <div className="flex gap-2">
            <button onClick={handleCaptureReferenceFace} disabled={isCapturing} className="btn-primary flex-1">
              {isCapturing ? 'در حال ثبت...' : 'ثبت چهره'}
            </button>
            <button onClick={() => { setNeedsReferenceFace(false); startMonitoring(); }} className="btn-secondary">
              رد (تست)
            </button>
          </div>

          {/* پردازش */}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>
    );
  }

  return (
    <>
      {showCameraBox && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
          <div className={`bg-white/95 backdrop-blur-lg rounded-3xl shadow-hero border border-white/30 transition-all duration-300 ${
            isMinimized ? 'w-80 h-16' : 'w-96 h-72'
          }`}>
            <div className="flex items-center justify-between p-4 border-b border-accent/20">
              <div className="flex items-center space-x-2 space-x-reverse">
                <div className={`w-3 h-3 rounded-full ${isViolating ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                <span className="text-sm font-medium">نظارت فعال | چهره‌ها: {currentFaceCount}</span>
              </div>
              <button onClick={() => setIsMinimized(!isMinimized)} className="p-1 hover:bg-soft/50 rounded-lg">
                {isMinimized ? <Maximize className="h-4 w-4" /> : <Minimize className="h-4 w-4" />}
              </button>
            </div>

            {!isMinimized && (
              <div className="p-4">
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-48 bg-black rounded-2xl border-2 border-accent/20 object-cover"
                    style={{ transform: 'scaleX(-1)' }}
                  />
                  <canvas
                    ref={overlayCanvasRef}
                    className="absolute inset-0 w-full h-48 pointer-events-none"
                    style={{ transform: 'scaleX(-1)' }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {!showCameraBox && (
        <div className="fixed bottom-4 left-4">
          <button onClick={() => setShowCameraBox(true)} className="btn-primary">نمایش باکس نظارت</button>
        </div>
      )}

      {/* مخفی: پردازش/اسکرین‌شات */}
      <canvas ref={canvasRef} className="hidden" />

      {/* هشدار تخلف */}
      {showViolationWarning && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="bg-red-600 text-white rounded-3xl shadow-hero p-6 max-w-md">
            <div className="flex items-center space-x-3 space-x-reverse mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold">هشدار تخلف!</h3>
                <p className="text-sm opacity-90">لطفاً تنها باشید و به دوربین نگاه کنید.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* دکمه شروع/توقف */}
      <div className="fixed bottom-4 right-4 flex gap-2 z-50">
        <button onClick={requestCameraAccess} className="btn-primary">شروع دوربین</button>
        <button onClick={stopCamera} className="btn-secondary">توقف</button>
      </div>
    </>
  );
};

export default ExamProctoring;