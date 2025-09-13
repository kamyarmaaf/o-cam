# Face Detection Exam System

This is a client-side only exam proctoring system that uses face-api.js for face detection and monitoring.

## Features

- **Webcam Integration**: Automatically activates webcam when exam starts
- **Reference Face Capture**: Captures student's face as reference for monitoring
- **Real-time Monitoring**: Continuously monitors for violations
- **Multiple Face Detection**: Detects when more than one person is in frame
- **Face Mismatch Detection**: Detects when current face doesn't match reference
- **Violation Logging**: Logs violations to browser console
- **Clean UI**: Modern, responsive interface with floating webcam frame

## How to Use

1. **Start the Application**:
   ```bash
   npm run dev
   ```

2. **Access the Face Detection Exam**:
   - Navigate to `/face-exam` in your browser
   - Or go to Dashboard → Exams → "Face Detection Demo Exam"

3. **Take the Exam**:
   - Click "Start Exam" to begin
   - Allow camera permissions when prompted
   - Click "Begin Face Monitoring" to capture your reference face
   - Answer the sample questions while being monitored

## Technical Details

### Dependencies
- `face-api.js`: For face detection and recognition
- `React`: Frontend framework
- `TypeScript`: Type safety

### Models Used
- `tiny_face_detector`: Lightweight face detection
- `face_landmark_68`: Face landmark detection
- `face_recognition`: Face recognition and comparison
- `face_expression`: Facial expression detection

### Browser Compatibility
- Chrome (recommended)
- Firefox
- Safari
- Edge

### Violation Detection
- **Multiple Faces**: Detects when more than 1 person is in frame
- **Face Mismatch**: Detects when current face doesn't match reference (threshold: 0.6)
- **No Face**: Detects when no face is visible

### Console Logging
Violations are logged to browser console with messages:
- `"Violation: Multiple faces detected"`
- `"Violation: Face mismatch"`

## File Structure

```
src/pages/exam/
├── FaceDetectionExam.tsx    # Main exam component
└── ExamEnvironment.tsx      # Original exam environment

public/models/               # Face-api.js model files
├── tiny_face_detector_model-weights_manifest.json
├── tiny_face_detector_model-shard1
├── face_landmark_68_model-weights_manifest.json
├── face_landmark_68_model-shard1
├── face_recognition_model-weights_manifest.json
├── face_recognition_model-shard1
└── face_recognition_model-shard2
```

## Customization

### Adjusting Detection Sensitivity
In `FaceDetectionExam.tsx`, modify the threshold value:
```typescript
const threshold = 0.6; // Lower = more sensitive, Higher = less sensitive
```

### Changing Detection Interval
Modify the detection frequency:
```typescript
detectionIntervalRef.current = setInterval(detectFaces, 2000); // 2 seconds
```

### Styling the Webcam Frame
The webcam frame is styled with:
- Fixed position (top-right corner)
- Rounded corners
- Shadow effects
- Responsive design

## Troubleshooting

### Models Not Loading
- Ensure all model files are in `public/models/`
- Check browser console for loading errors
- Models will fallback to CDN if local loading fails

### Camera Not Working
- Check browser permissions
- Ensure camera is not being used by another application
- Try refreshing the page

### Face Detection Issues
- Ensure good lighting
- Keep face centered in frame
- Avoid extreme angles or distances

## Security Notes

- This is a client-side only implementation
- No data is sent to external servers
- All processing happens in the browser
- For production use, consider server-side validation

## Future Enhancements

- Server-side violation logging
- Real-time notifications to proctors
- Advanced analytics and reporting
- Integration with existing exam systems
- Multi-camera support
- Audio monitoring
