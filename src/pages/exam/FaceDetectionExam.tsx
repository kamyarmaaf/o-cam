import React, { useState, useRef, useEffect } from 'react';
import * as faceapi from 'face-api.js';

interface FaceDetectionExamProps {}

const FaceDetectionExam: React.FC<FaceDetectionExamProps> = () => {
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [isModelsLoaded, setIsModelsLoaded] = useState(false);
  const [referenceFace, setReferenceFace] = useState<Float32Array | null>(null);
  const [violationCount, setViolationCount] = useState(0);
  const [currentWarning, setCurrentWarning] = useState<string>('');
  const [isMonitoring, setIsMonitoring] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load face-api.js models
  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
          faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
          faceapi.nets.faceExpressionNet.loadFromUri('/models')
        ]);
        setIsModelsLoaded(true);
        console.log('Face-api.js models loaded successfully');
      } catch (error) {
        console.error('Error loading face-api.js models:', error);
        // Fallback: try loading from CDN
        try {
          await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models'),
            faceapi.nets.faceRecognitionNet.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models'),
            faceapi.nets.faceExpressionNet.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models')
          ]);
          setIsModelsLoaded(true);
          console.log('Face-api.js models loaded from CDN successfully');
        } catch (cdnError) {
          console.error('Error loading models from CDN:', cdnError);
        }
      }
    };

    loadModels();
  }, []);

  // Start webcam
  const startWebcam = async () => {
    try {
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
        
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play();
          }
        };
      }
    } catch (error) {
      console.error('Error accessing webcam:', error);
      alert('Unable to access webcam. Please check your camera permissions.');
    }
  };

  // Stop webcam
  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsWebcamActive(false);
    setIsMonitoring(false);
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
  };

  // Capture reference face
  const captureReferenceFace = async () => {
    if (!videoRef.current || !isModelsLoaded) return;

    try {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

      if (detections.length === 1) {
        setReferenceFace(detections[0].descriptor);
        console.log('Reference face captured successfully');
        setCurrentWarning('');
        return true;
      } else if (detections.length === 0) {
        setCurrentWarning('No face detected. Please ensure your face is visible in the camera.');
        return false;
      } else {
        setCurrentWarning('Multiple faces detected. Please ensure only you are in the frame.');
        return false;
      }
    } catch (error) {
      console.error('Error capturing reference face:', error);
      setCurrentWarning('Error capturing reference face. Please try again.');
      return false;
    }
  };

  // Start face monitoring
  const startMonitoring = async () => {
    if (!videoRef.current || !isModelsLoaded || !referenceFace) return;

    setIsMonitoring(true);
    
    const detectFaces = async () => {
      try {
        const detections = await faceapi
          .detectAllFaces(videoRef.current!, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptors();

        // Check for multiple faces
        if (detections.length > 1) {
          const violationMessage = 'Violation: Multiple faces detected';
          console.log(violationMessage);
          setCurrentWarning('⚠️ Multiple people detected in frame!');
          setViolationCount(prev => prev + 1);
          return;
        }

        // Check for no faces
        if (detections.length === 0) {
          setCurrentWarning('No face detected. Please position yourself in front of the camera.');
          return;
        }

        // Check face match
        if (detections.length === 1) {
          const distance = faceapi.euclideanDistance(referenceFace, detections[0].descriptor);
          const threshold = 0.6; // Adjust this value as needed
          
          if (distance > threshold) {
            const violationMessage = 'Violation: Face mismatch';
            console.log(violationMessage);
            setCurrentWarning('⚠️ Face mismatch detected!');
            setViolationCount(prev => prev + 1);
            return;
          }
        }

        // No violations detected
        setCurrentWarning('');
      } catch (error) {
        console.error('Error during face detection:', error);
      }
    };

    // Run detection every 2 seconds
    detectionIntervalRef.current = setInterval(detectFaces, 2000);
  };

  // Start exam
  const startExam = async () => {
    await startWebcam();
    setIsExamStarted(true);
  };

  // Begin monitoring after reference face is captured
  const beginMonitoring = async () => {
    const success = await captureReferenceFace();
    if (success) {
      await startMonitoring();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Online Exam with Face Detection</h1>
            <div className="flex items-center space-x-4">
              {isExamStarted && (
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${isWebcamActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-sm text-gray-600">
                    {isWebcamActive ? 'Camera Active' : 'Camera Inactive'}
                  </span>
                </div>
              )}
              {violationCount > 0 && (
                <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                  Violations: {violationCount}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isExamStarted ? (
          /* Pre-exam screen */
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start Your Exam?</h2>
              <p className="text-gray-600 mb-8">
                This exam uses advanced face detection technology to ensure academic integrity. 
                Your camera will monitor your exam session to detect any violations.
              </p>

              <div className="bg-blue-50 rounded-xl p-6 mb-8 text-left">
                <h3 className="font-semibold text-blue-900 mb-3">Exam Guidelines:</h3>
                <ul className="space-y-2 text-blue-800">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    Ensure you are alone in the room during the exam
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    Keep your face visible to the camera at all times
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    Do not allow others to enter the exam area
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    Violations will be logged and may result in exam termination
                  </li>
                </ul>
              </div>

              <button
                onClick={startExam}
                disabled={!isModelsLoaded}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-8 rounded-xl transition-colors duration-200"
              >
                {!isModelsLoaded ? 'Loading Face Detection Models...' : 'Start Exam'}
              </button>
            </div>
          </div>
        ) : (
          /* Exam interface */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main exam content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Sample Exam Questions</h2>
                
                {!referenceFace ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Setup Required</h3>
                    <p className="text-gray-600 mb-6">
                      Please position yourself in front of the camera and click the button below to capture your reference face.
                    </p>
                    <button
                      onClick={beginMonitoring}
                      disabled={!isWebcamActive}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
                    >
                      Begin Face Monitoring
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-green-800 font-medium">Face monitoring is active</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="border border-gray-200 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Question 1</h3>
                        <p className="text-gray-700 mb-4">
                          What is the capital of France?
                        </p>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input type="radio" name="q1" className="mr-3" />
                            <span>London</span>
                          </label>
                          <label className="flex items-center">
                            <input type="radio" name="q1" className="mr-3" />
                            <span>Paris</span>
                          </label>
                          <label className="flex items-center">
                            <input type="radio" name="q1" className="mr-3" />
                            <span>Berlin</span>
                          </label>
                          <label className="flex items-center">
                            <input type="radio" name="q1" className="mr-3" />
                            <span>Madrid</span>
                          </label>
                        </div>
                      </div>

                      <div className="border border-gray-200 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Question 2</h3>
                        <p className="text-gray-700 mb-4">
                          Which programming language is known for its use in web development?
                        </p>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input type="radio" name="q2" className="mr-3" />
                            <span>Python</span>
                          </label>
                          <label className="flex items-center">
                            <input type="radio" name="q2" className="mr-3" />
                            <span>JavaScript</span>
                          </label>
                          <label className="flex items-center">
                            <input type="radio" name="q2" className="mr-3" />
                            <span>C++</span>
                          </label>
                          <label className="flex items-center">
                            <input type="radio" name="q2" className="mr-3" />
                            <span>Java</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between pt-6">
                      <button className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-xl transition-colors duration-200">
                        Previous
                      </button>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl transition-colors duration-200">
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Webcam feed and controls */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Camera Feed</h3>
                
                {/* Webcam container */}
                <div className="relative mb-4">
                  <div className="relative w-full h-64 bg-gray-100 rounded-xl overflow-hidden shadow-lg">
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                      playsInline
                    />
                    <canvas
                      ref={canvasRef}
                      className="absolute inset-0 w-full h-full"
                      style={{ display: 'none' }}
                    />
                    
                    {/* Overlay when no webcam */}
                    {!isWebcamActive && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                        <div className="text-center">
                          <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          <p className="text-gray-500 text-sm">Camera not active</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Status indicators */}
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <div className={`w-3 h-3 rounded-full ${isWebcamActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <div className={`w-3 h-3 rounded-full ${isMonitoring ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
                  </div>
                </div>

                {/* Warning message */}
                {currentWarning && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 text-sm font-medium">{currentWarning}</p>
                  </div>
                )}

                {/* Controls */}
                <div className="space-y-3">
                  <button
                    onClick={isWebcamActive ? stopWebcam : startWebcam}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${
                      isWebcamActive 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {isWebcamActive ? 'Stop Camera' : 'Start Camera'}
                  </button>

                  {isWebcamActive && !referenceFace && (
                    <button
                      onClick={beginMonitoring}
                      className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200"
                    >
                      Begin Monitoring
                    </button>
                  )}

                  <button
                    onClick={() => {
                      stopWebcam();
                      setIsExamStarted(false);
                      setReferenceFace(null);
                      setViolationCount(0);
                      setCurrentWarning('');
                    }}
                    className="w-full py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors duration-200"
                  >
                    End Exam
                  </button>
                </div>

                {/* Violation counter */}
                {violationCount > 0 && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 text-sm">
                      <span className="font-semibold">Violations Detected:</span> {violationCount}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FaceDetectionExam;
