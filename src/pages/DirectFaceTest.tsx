import React, { useState, useRef, useEffect } from 'react';

const DirectFaceTest: React.FC = () => {
  const [status, setStatus] = useState({
    cameraStarted: false,
    modelsLoaded: false,
    detecting: false
  });
  
  const [logs, setLogs] = useState<string[]>([]);
  const [faceCount, setFaceCount] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const addLog = (message: string) => {
    console.log(`[DirectTest] ${message}`);
    setLogs(prev => [...prev.slice(-14), `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  // Load face-api.js models
  const loadModels = async () => {
    try {
      addLog('Loading face-api.js models...');
      
      // Dynamically import face-api.js
      const faceapi = await import('face-api.js');
      
      // Try to load from CDN directly
      const modelUrl = 'https://justadudewhohacks.github.io/face-api.js/models';
      
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(modelUrl),
        faceapi.nets.faceLandmark68Net.loadFromUri(modelUrl),
        faceapi.nets.faceRecognitionNet.loadFromUri(modelUrl),
      ]);
      
      setStatus(prev => ({ ...prev, modelsLoaded: true }));
      addLog('✅ Models loaded successfully from CDN');
    } catch (error) {
      addLog('❌ Error loading models: ' + error);
    }
  };

  // Start camera with simple approach
  const startCamera = async () => {
    try {
      addLog('Starting camera...');
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        // Clear any existing stream
        if (videoRef.current.srcObject) {
          const oldStream = videoRef.current.srcObject as MediaStream;
          oldStream.getTracks().forEach(track => track.stop());
        }
        
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        videoRef.current.playsInline = true;
        videoRef.current.autoplay = true;
        
        // Force load
        videoRef.current.load();
        
        // Try to play with retries
        let attempts = 0;
        const maxAttempts = 10;
        
        const tryPlay = async (): Promise<boolean> => {
          try {
            attempts++;
            addLog(`Attempting to play video (try ${attempts})...`);
            await videoRef.current!.play();
            addLog('✅ Video playing successfully');
            return true;
          } catch (e) {
            addLog(`❌ Play attempt ${attempts} failed: ${e}`);
            
            if (attempts < maxAttempts) {
              await new Promise(resolve => setTimeout(resolve, 300));
              return tryPlay();
            }
            return false;
          }
        };
        
        const playSuccess = await tryPlay();
        
        if (playSuccess) {
          // Wait for video to be ready
          addLog('Waiting for video to be ready...');
          let readyAttempts = 0;
          const maxReadyAttempts = 30;
          
          const checkReady = () => {
            readyAttempts++;
            
            if (videoRef.current && 
                videoRef.current.readyState >= 2 && 
                videoRef.current.videoWidth > 0 && 
                videoRef.current.videoHeight > 0) {
              addLog(`✅ Video ready after ${readyAttempts} attempts`);
              addLog(`Video dimensions: ${videoRef.current.videoWidth}x${videoRef.current.videoHeight}`);
              setStatus(prev => ({ ...prev, cameraStarted: true }));
              return;
            }
            
            if (readyAttempts < maxReadyAttempts) {
              setTimeout(checkReady, 200);
            } else {
              addLog('❌ Video failed to become ready');
              addLog(`Final video state:`);
              addLog(`- readyState: ${videoRef.current?.readyState}`);
              addLog(`- videoWidth: ${videoRef.current?.videoWidth}`);
              addLog(`- videoHeight: ${videoRef.current?.videoHeight}`);
              addLog(`- paused: ${videoRef.current?.paused}`);
            }
          };
          
          checkReady();
        } else {
          addLog('❌ Failed to start video after all attempts');
        }
      }
    } catch (error) {
      addLog('❌ Error starting camera: ' + error);
    }
  };

  // Simple face detection
  const detectFaces = async () => {
    if (!videoRef.current || !status.modelsLoaded || !status.cameraStarted) {
      addLog('❌ Cannot detect - camera or models not ready');
      return;
    }

    try {
      setStatus(prev => ({ ...prev, detecting: true }));
      addLog('Starting face detection...');
      
      const faceapi = await import('face-api.js');
      
      const options = new faceapi.TinyFaceDetectorOptions({ 
        inputSize: 320, 
        scoreThreshold: 0.3 
      });
      
      const results = await faceapi
        .detectAllFaces(videoRef.current, options)
        .withFaceLandmarks()
        .withFaceDescriptors();

      const count = results.length;
      setFaceCount(count);
      addLog(`✅ Detection complete: ${count} face(s) found`);
      
    } catch (error) {
      addLog('❌ Error during detection: ' + error);
    } finally {
      setStatus(prev => ({ ...prev, detecting: false }));
    }
  };

  // Auto-detect every 3 seconds when ready
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (status.cameraStarted && status.modelsLoaded && !status.detecting) {
      interval = setInterval(() => {
        detectFaces();
      }, 3000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status.cameraStarted, status.modelsLoaded, status.detecting]);

  // Initialize
  useEffect(() => {
    loadModels();
    
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">Direct Face Detection Test</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Status */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className={`p-3 rounded text-center ${
              status.modelsLoaded ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              Models: {status.modelsLoaded ? '✅ Ready' : '❌ Loading'}
            </div>
            <div className={`p-3 rounded text-center ${
              status.cameraStarted ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              Camera: {status.cameraStarted ? '✅ Ready' : '❌ Not Ready'}
            </div>
            <div className={`p-3 rounded text-center ${
              status.detecting ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
            }`}>
              Detecting: {status.detecting ? '🔄 Active' : '⏸️ Idle'}
            </div>
          </div>

          {/* Video */}
          <div className="mb-6">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-64 bg-black rounded-lg object-cover"
              style={{ transform: 'scaleX(-1)' }}
            />
          </div>

          {/* Result */}
          <div className="mb-6 text-center">
            <div className="text-2xl font-bold mb-2">
              Faces Detected: <span className={faceCount > 0 ? 'text-green-600' : 'text-red-600'}>
                {faceCount}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={startCamera}
              disabled={status.cameraStarted || !status.modelsLoaded}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              Start Camera
            </button>
            <button
              onClick={detectFaces}
              disabled={!status.cameraStarted || !status.modelsLoaded || status.detecting}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
            >
              Detect Faces
            </button>
            <button
              onClick={() => setLogs([])}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Clear Logs
            </button>
          </div>

          {/* Logs */}
          <div>
            <h3 className="font-semibold mb-2">Logs:</h3>
            <div className="bg-black text-green-400 p-4 rounded-lg h-64 overflow-y-auto font-mono text-sm">
              {logs.length === 0 ? (
                <div className="text-gray-500">Waiting for activity...</div>
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
      </div>
    </div>
  );
};

export default DirectFaceTest;