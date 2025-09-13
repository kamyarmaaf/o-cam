import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ExamProctoring from '../../components/ExamProctoring';
import { violationService } from '../../services/violationService';
import { 
  Clock, 
  Maximize, 
  Minimize, 
  Send, 
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Flag,
  Eye,
  EyeOff,
  FileText,
  Monitor,
  Camera
} from 'lucide-react';

interface Question {
  id: number;
  type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';
  question: string;
  options?: string[];
  correctAnswer: number | string;
  points: number;
  timeEstimate: number;
}

interface ExamData {
  id: number;
  title: string;
  description: string;
  duration: number; // in minutes
  questions: Question[];
  startTime: Date;
  endTime: Date;
  allowReview: boolean;
  randomizeQuestions: boolean;
}

const ExamEnvironment: React.FC = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: any }>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [examStarted, setExamStarted] = useState(false);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [examMode, setExamMode] = useState<'default' | 'paper'>('default'); // حالت آزمون
  const [proctoringEnabled, setProctoringEnabled] = useState(false);
  const [violationCount, setViolationCount] = useState(0);
  const [isEjected, setIsEjected] = useState(false);
  const examContainerRef = useRef<HTMLDivElement>(null);

  // Mock exam data - در پروژه واقعی از API دریافت می‌شود
  const examData: ExamData = {
    id: parseInt(examId || '1'),
    title: 'آزمون ریاضی عمومی',
    description: 'آزمون میان‌ترم درس ریاضی عمومی شامل فصل‌های ۱ تا ۳',
    duration: 45, // 45 minutes
    startTime: new Date(),
    endTime: new Date(Date.now() + 45 * 60 * 1000),
    allowReview: true,
    randomizeQuestions: false,
    questions: [
      {
        id: 1,
        type: 'multiple_choice',
        question: 'حاصل مشتق تابع f(x) = x³ + 2x² - 5x + 1 چیست؟',
        options: ['3x² + 4x - 5', '3x² + 2x - 5', 'x² + 4x - 5', '3x² + 4x - 1'],
        correctAnswer: 0,
        points: 2,
        timeEstimate: 3
      },
      {
        id: 2,
        type: 'true_false',
        question: 'انتگرال تابع f(x) = 2x برابر با x² + C است.',
        correctAnswer: 0, // 0 = true, 1 = false
        points: 1,
        timeEstimate: 2
      },
      {
        id: 3,
        type: 'multiple_choice',
        question: 'کدام یک از موارد زیر تعریف صحیح حد است؟',
        options: [
          'مقداری که تابع در نقطه‌ای دارد',
          'مقداری که تابع به آن نزدیک می‌شود',
          'مقدار ماکزیمم تابع',
          'مقدار مینیمم تابع'
        ],
        correctAnswer: 1,
        points: 2,
        timeEstimate: 3
      },
      {
        id: 4,
        type: 'short_answer',
        question: 'مشتق تابع sin(x) چیست؟',
        correctAnswer: 'cos(x)',
        points: 1,
        timeEstimate: 2
      },
      {
        id: 5,
        type: 'essay',
        question: 'قضیه مقدار میانی را بیان کرده و کاربرد آن را توضیح دهید.',
        correctAnswer: 'اگر f تابعی پیوسته در بازه [a,b] باشد، آنگاه برای هر مقدار k بین f(a) و f(b)، حداقل یک نقطه c در بازه (a,b) وجود دارد که f(c) = k.',
        points: 5,
        timeEstimate: 8
      }
    ]
  };

  const currentQuestion = examData.questions[currentQuestionIndex];

  useEffect(() => {
    if (examStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [examStarted, timeLeft]);

  useEffect(() => {
    // Prevent page refresh/close during exam
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (examStarted && !examSubmitted) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [examStarted, examSubmitted]);

  const startExam = () => {
    setExamStarted(true);
    setTimeLeft(examData.duration * 60); // Convert minutes to seconds
    // Don't auto-start proctoring - wait for user to click
  };

  const startProctoring = () => {
    setProctoringEnabled(true);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (examContainerRef.current?.requestFullscreen) {
        examContainerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleAnswerChange = (questionId: number, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const toggleFlag = (questionId: number) => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < examData.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    let totalScore = 0;
    let maxScore = 0;

    examData.questions.forEach(question => {
      maxScore += question.points;
      const userAnswer = answers[question.id];
      
      if (userAnswer !== undefined && userAnswer !== null && userAnswer !== '') {
        if (question.type === 'multiple_choice' || question.type === 'true_false') {
          if (userAnswer === question.correctAnswer) {
            totalScore += question.points;
          }
        } else if (question.type === 'short_answer') {
          // Simple string comparison - in real app, this would be more sophisticated
          if (userAnswer.toLowerCase().trim() === (question.correctAnswer as string).toLowerCase().trim()) {
            totalScore += question.points;
          }
        }
        // Essay questions would need manual grading
      }
    });

    return Math.round((totalScore / maxScore) * 100);
  };

  const handleSubmitExam = () => {
    setExamSubmitted(true);
    const finalScore = calculateScore();
    setScore(finalScore);
    setShowResults(true);
  };

  const handleExitExam = () => {
    if (examStarted && !examSubmitted) {
      setShowExitWarning(true);
    } else {
      navigate('/dashboard/exams');
    }
  };

  const confirmExit = () => {
    setExamSubmitted(true);
    navigate('/dashboard/exams');
  };

  // Handle violation detection
  const handleViolationDetected = (violationData: any) => {
    console.log('Violation detected:', violationData);
    
    // Record violation
    violationService.recordViolation({
      studentId: user?.id || '',
      studentName: user?.name || '',
      examId: examId || '',
      examTitle: examData.title,
      faceCount: violationData.faceCount,
      screenshot: violationData.screenshot,
      violationNumber: violationData.violationNumber
    });

    setViolationCount(violationData.violationNumber);
  };

  // Handle student ejection
  const handleEjectStudent = () => {
    setIsEjected(true);
    setExamSubmitted(true);
    
    // Record ejection
    violationService.ejectStudent({
      studentId: user?.id || '',
      studentName: user?.name || '',
      examId: examId || '',
      examTitle: examData.title,
      totalViolations: violationCount
    });

    // Redirect after showing ejection message
    setTimeout(() => {
      navigate('/dashboard/exams');
    }, 5000);
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-soft via-white to-soft flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="card text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-primary rounded-full flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            
            <h1 className="text-3xl font-bold text-text-heading mb-4">آزمون با موفقیت تکمیل شد!</h1>
            
            <div className="bg-soft/50 rounded-2xl p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-text-body/70">نمره شما</p>
                  <p className={`text-3xl font-bold ${score >= 60 ? 'text-green-600' : 'text-red-600'}`}>
                    {score}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-text-body/70">وضعیت</p>
                  <p className={`text-lg font-semibold ${score >= 60 ? 'text-green-600' : 'text-red-600'}`}>
                    {score >= 60 ? 'قبول' : 'مردود'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-text-body/70">تعداد سوالات</p>
                  <p className="text-lg font-semibold text-text-heading">
                    {Object.keys(answers).length} از {examData.questions.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text-heading">جزئیات پاسخ‌ها</h3>
              <div className="space-y-2">
                {examData.questions.map((question, index) => {
                  const userAnswer = answers[question.id];
                  const isCorrect = question.type === 'multiple_choice' || question.type === 'true_false' 
                    ? userAnswer === question.correctAnswer
                    : question.type === 'short_answer' 
                      ? userAnswer?.toLowerCase().trim() === (question.correctAnswer as string).toLowerCase().trim()
                      : null; // Essay questions need manual grading

                  return (
                    <div key={question.id} className="flex items-center justify-between p-3 bg-white rounded-xl">
                      <span className="text-sm">سوال {index + 1}</span>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        {userAnswer !== undefined && userAnswer !== null && userAnswer !== '' ? (
                          isCorrect !== null ? (
                            isCorrect ? (
                              <span className="text-green-600 text-sm">✓ صحیح</span>
                            ) : (
                              <span className="text-red-600 text-sm">✗ نادرست</span>
                            )
                          ) : (
                            <span className="text-blue-600 text-sm">نیاز به بررسی</span>
                          )
                        ) : (
                          <span className="text-gray-500 text-sm">بدون پاسخ</span>
                        )}
                        <span className="text-xs text-text-body/70">{question.points} نمره</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex space-x-4 space-x-reverse mt-8">
              <button 
                onClick={() => navigate('/dashboard/exams')}
                className="btn-primary flex-1"
              >
                بازگشت به آزمون‌ها
              </button>
              <button 
                onClick={() => navigate('/dashboard/scores')}
                className="btn-secondary flex-1"
              >
                مشاهده نمرات
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!examStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-soft via-white to-soft flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="card text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-primary rounded-full flex items-center justify-center">
              <Clock className="h-10 w-10 text-white" />
            </div>
            
            <h1 className="text-3xl font-bold text-text-heading mb-4">{examData.title}</h1>
            <p className="text-text-body mb-8">{examData.description}</p>
            
            <div className="bg-soft/50 rounded-2xl p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-text-body/70">مدت زمان</p>
                  <p className="text-xl font-bold text-primary">{examData.duration} دقیقه</p>
                </div>
                <div>
                  <p className="text-sm text-text-body/70">تعداد سوالات</p>
                  <p className="text-xl font-bold text-primary">{examData.questions.length}</p>
                </div>
                <div>
                  <p className="text-sm text-text-body/70">نمره کل</p>
                  <p className="text-xl font-bold text-primary">
                    {examData.questions.reduce((sum, q) => sum + q.points, 0)} نمره
                  </p>
                </div>
              </div>
            </div>

            {/* Proctoring Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-8">
              <div className="flex items-center space-x-2 space-x-reverse text-blue-800 mb-3">
                <Camera className="h-5 w-5" />
                <span className="font-medium">سیستم نظارت آزمون</span>
              </div>
              <ul className="text-sm text-blue-700 space-y-1 text-right">
                <li>• پس از شروع آزمون، سیستم نظارت را فعال کنید</li>
                <li>• دوربین شما تصاویر را به‌طور مداوم بررسی می‌کند</li>
                <li>• حضور بیش از ۱ چهره در تصویر تخلف محسوب می‌شود</li>
                <li>• پس از ۳ تخلف، از آزمون حذف خواهید شد</li>
                <li>• در صورت ورود شخص دیگری، او را از محیط دور کنید</li>
                <li>• کادر نظارت در بالای صفحه نمایش داده می‌شود</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-8">
              <div className="flex items-center space-x-2 space-x-reverse text-yellow-800">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-medium">نکات مهم:</span>
              </div>
              <ul className="text-sm text-yellow-700 mt-2 space-y-1 text-right">
                <li>• پس از شروع آزمون، امکان خروج بدون ثبت پاسخ وجود ندارد</li>
                <li>• تایمر از لحظه شروع آزمون فعال می‌شود</li>
                <li>• پاسخ‌های شما به‌صورت خودکار ذخیره می‌شوند</li>
                <li>• در صورت قطع اتصال، سریعاً مجدداً وارد شوید</li>
                <li>• در محیط آرام و تنها آزمون دهید</li>
                <li>• مستقیماً به دوربین نگاه کنید</li>
              </ul>
            </div>

            <div className="flex space-x-4 space-x-reverse">
              <button 
                onClick={() => navigate('/dashboard/exams')}
                className="btn-secondary flex-1"
              >
                انصراف
              </button>
              <button 
                onClick={startExam}
                className="btn-primary flex-1"
              >
                شروع آزمون
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={examContainerRef} className={`min-h-screen bg-gradient-to-br from-soft via-white to-soft ${isFullscreen ? 'p-0' : 'p-4'}`}>
      {/* Exam Proctoring Component */}
      {proctoringEnabled && (
        <ExamProctoring
          isExamActive={examStarted && !examSubmitted}
          studentId={user?.id || ''}
          examId={examId || ''}
          onViolationDetected={handleViolationDetected}
          onEjectStudent={handleEjectStudent}
        />
      )}

      {/* Header */}
      <div className="bg-white/90 backdrop-blur-lg shadow-soft border-b border-white/20 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 space-x-reverse">
              <h1 className="text-xl font-bold text-text-heading">{examData.title}</h1>
              {examMode === 'default' && (
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  سوال {currentQuestionIndex + 1} از {examData.questions.length}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-4 space-x-reverse">
              {/* Proctoring Control */}
              {!proctoringEnabled ? (
                <button
                  onClick={startProctoring}
                  className="flex items-center space-x-2 space-x-reverse bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-2xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  <Camera className="h-5 w-5" />
                  <span>شروع نظارت</span>
                </button>
              ) : (
                <div className="flex items-center space-x-2 space-x-reverse bg-green-100 text-green-800 px-4 py-2 rounded-2xl">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">نظارت فعال</span>
                </div>
              )}

              {/* Mode Toggle */}
              <div className="flex items-center space-x-2 space-x-reverse bg-soft/50 rounded-2xl p-1">
                <button
                  onClick={() => setExamMode('default')}
                  className={`flex items-center space-x-2 space-x-reverse px-3 py-2 rounded-xl transition-all duration-300 ${
                    examMode === 'default'
                      ? 'bg-white text-primary shadow-soft'
                      : 'text-text-body hover:text-primary'
                  }`}
                >
                  <Monitor className="h-4 w-4" />
                  <span className="text-sm font-medium">حالت دیفالت</span>
                </button>
                <button
                  onClick={() => setExamMode('paper')}
                  className={`flex items-center space-x-2 space-x-reverse px-3 py-2 rounded-xl transition-all duration-300 ${
                    examMode === 'paper'
                      ? 'bg-white text-primary shadow-soft'
                      : 'text-text-body hover:text-primary'
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  <span className="text-sm font-medium">حالت امتحان کتبی</span>
                </button>
              </div>

              <div className={`flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-2xl font-bold ${
                timeLeft < 300 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
              }`}>
                <Clock className="h-5 w-5" />
                <span>{formatTime(timeLeft)}</span>
              </div>
              
              <button
                onClick={toggleFullscreen}
                className="p-2 hover:bg-soft/50 rounded-xl transition-colors"
                title={isFullscreen ? 'خروج از تمام صفحه' : 'تمام صفحه'}
              >
                {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
              </button>
              
              <button
                onClick={handleExitExam}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
              >
                خروج از آزمون
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {examMode === 'default' ? (
          // Default Mode - Question by Question
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Question Navigation Sidebar */}
            <div className="lg:col-span-1">
              <div className="card sticky top-24">
                <h3 className="font-bold text-text-heading mb-4">نمای کلی سوالات</h3>
                <div className="grid grid-cols-5 lg:grid-cols-4 gap-2">
                  {examData.questions.map((question, index) => {
                    const isAnswered = answers[question.id] !== undefined && answers[question.id] !== null && answers[question.id] !== '';
                    const isFlagged = flaggedQuestions.has(question.id);
                    const isCurrent = index === currentQuestionIndex;
                    
                    return (
                      <button
                        key={question.id}
                        onClick={() => goToQuestion(index)}
                        className={`relative w-10 h-10 rounded-xl font-medium text-sm transition-all duration-300 ${
                          isCurrent 
                            ? 'bg-primary text-white shadow-card' 
                            : isAnswered 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {index + 1}
                        {isFlagged && (
                          <Flag className="absolute -top-1 -right-1 h-3 w-3 text-red-500 fill-current" />
                        )}
                      </button>
                    );
                  })}
                </div>
                
                <div className="mt-6 space-y-2 text-sm">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <div className="w-4 h-4 bg-green-100 rounded"></div>
                    <span>پاسخ داده شده</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <div className="w-4 h-4 bg-gray-100 rounded"></div>
                    <span>پاسخ داده نشده</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Flag className="h-4 w-4 text-red-500" />
                    <span>علامت‌گذاری شده</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-accent/20">
                  <div className="text-sm text-text-body/70 space-y-1">
                    <div>پاسخ داده شده: {Object.keys(answers).filter(id => answers[parseInt(id)] !== undefined && answers[parseInt(id)] !== null && answers[parseInt(id)] !== '').length}</div>
                    <div>باقی‌مانده: {examData.questions.length - Object.keys(answers).filter(id => answers[parseInt(id)] !== undefined && answers[parseInt(id)] !== null && answers[parseInt(id)] !== '').length}</div>
                    <div>علامت‌گذاری شده: {flaggedQuestions.size}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Question Area */}
            <div className="lg:col-span-3">
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <span className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                      {currentQuestionIndex + 1}
                    </span>
                    <div>
                      <span className="px-3 py-1 bg-soft rounded-full text-sm font-medium">
                        {currentQuestion.type === 'multiple_choice' ? 'چندگزینه‌ای' :
                         currentQuestion.type === 'true_false' ? 'درست/نادرست' :
                         currentQuestion.type === 'short_answer' ? 'پاسخ کوتاه' : 'تشریحی'}
                      </span>
                      <span className="mr-2 text-sm text-text-body/70">
                        {currentQuestion.points} نمره
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => toggleFlag(currentQuestion.id)}
                    className={`p-2 rounded-xl transition-colors ${
                      flaggedQuestions.has(currentQuestion.id)
                        ? 'bg-red-100 text-red-600'
                        : 'hover:bg-soft/50 text-text-body/60'
                    }`}
                    title="علامت‌گذاری سوال"
                  >
                    <Flag className="h-5 w-5" />
                  </button>
                </div>

                <div className="mb-8">
                  <h2 className="text-xl font-medium text-text-heading leading-relaxed mb-6">
                    {currentQuestion.question}
                  </h2>

                  {/* Multiple Choice */}
                  {currentQuestion.type === 'multiple_choice' && currentQuestion.options && (
                    <div className="space-y-3">
                      {currentQuestion.options.map((option, index) => (
                        <label
                          key={index}
                          className={`flex items-center space-x-3 space-x-reverse p-4 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                            answers[currentQuestion.id] === index
                              ? 'border-primary bg-primary/10'
                              : 'border-accent/30 hover:border-primary/50 hover:bg-soft/30'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${currentQuestion.id}`}
                            value={index}
                            checked={answers[currentQuestion.id] === index}
                            onChange={() => handleAnswerChange(currentQuestion.id, index)}
                            className="sr-only"
                          />
                          <div className={`w-5 h-5 border-2 rounded-full transition-all duration-300 flex items-center justify-center ${
                            answers[currentQuestion.id] === index
                              ? 'border-primary bg-primary'
                              : 'border-accent/50'
                          }`}>
                            {answers[currentQuestion.id] === index && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                          <span className="flex-1 text-text-heading">
                            <span className="font-medium ml-2">{String.fromCharCode(65 + index)}.</span>
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}

                  {/* True/False */}
                  {currentQuestion.type === 'true_false' && (
                    <div className="space-y-3">
                      {['درست', 'نادرست'].map((option, index) => (
                        <label
                          key={index}
                          className={`flex items-center space-x-3 space-x-reverse p-4 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                            answers[currentQuestion.id] === index
                              ? 'border-primary bg-primary/10'
                              : 'border-accent/30 hover:border-primary/50 hover:bg-soft/30'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${currentQuestion.id}`}
                            value={index}
                            checked={answers[currentQuestion.id] === index}
                            onChange={() => handleAnswerChange(currentQuestion.id, index)}
                            className="sr-only"
                          />
                          <div className={`w-5 h-5 border-2 rounded-full transition-all duration-300 flex items-center justify-center ${
                            answers[currentQuestion.id] === index
                              ? 'border-primary bg-primary'
                              : 'border-accent/50'
                          }`}>
                            {answers[currentQuestion.id] === index && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                          <span className="flex-1 text-text-heading font-medium">
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}

                  {/* Short Answer */}
                  {currentQuestion.type === 'short_answer' && (
                    <div>
                      <input
                        type="text"
                        value={answers[currentQuestion.id] || ''}
                        onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                        className="w-full px-4 py-3 border-2 border-accent/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                        placeholder="پاسخ خود را وارد کنید..."
                      />
                    </div>
                  )}

                  {/* Essay */}
                  {currentQuestion.type === 'essay' && (
                    <div>
                      <textarea
                        value={answers[currentQuestion.id] || ''}
                        onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                        rows={8}
                        className="w-full px-4 py-3 border-2 border-accent/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 resize-none"
                        placeholder="پاسخ تشریحی خود را اینجا بنویسید..."
                      />
                      <div className="mt-2 text-sm text-text-body/70">
                        تعداد کاراکتر: {(answers[currentQuestion.id] || '').length}
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-accent/20">
                  <button
                    onClick={previousQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="flex items-center space-x-2 space-x-reverse px-6 py-3 border border-accent/30 rounded-2xl hover:bg-soft/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowRight className="h-5 w-5" />
                    <span>سوال قبل</span>
                  </button>

                  <div className="flex space-x-3 space-x-reverse">
                    {currentQuestionIndex === examData.questions.length - 1 ? (
                      <button
                        onClick={handleSubmitExam}
                        className="btn-primary flex items-center space-x-2 space-x-reverse"
                      >
                        <Send className="h-5 w-5" />
                        <span>ارسال آزمون</span>
                      </button>
                    ) : (
                      <button
                        onClick={nextQuestion}
                        className="btn-primary flex items-center space-x-2 space-x-reverse"
                      >
                        <span>سوال بعد</span>
                        <ArrowLeft className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Paper Mode - All Questions in One Page
          <div className="max-w-4xl mx-auto">
            <div className="card">
              {/* Exam Header */}
              <div className="text-center mb-8 pb-6 border-b-2 border-accent/20">
                <h1 className="text-2xl font-bold text-text-heading mb-2">{examData.title}</h1>
                <p className="text-text-body mb-4">{examData.description}</p>
                <div className="flex justify-center space-x-8 space-x-reverse text-sm text-text-body/70">
                  <span>تعداد سوالات: {examData.questions.length}</span>
                  <span>مدت زمان: {examData.duration} دقیقه</span>
                  <span>نمره کل: {examData.questions.reduce((sum, q) => sum + q.points, 0)}</span>
                </div>
              </div>

              {/* All Questions */}
              <div className="space-y-8">
                {examData.questions.map((question, index) => (
                  <div key={question.id} className="border-b border-accent/10 pb-8 last:border-b-0">
                    <div className="flex items-start space-x-4 space-x-reverse mb-4">
                      <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 space-x-reverse mb-3">
                          <span className="px-3 py-1 bg-soft rounded-full text-sm font-medium">
                            {question.type === 'multiple_choice' ? 'چندگزینه‌ای' :
                             question.type === 'true_false' ? 'درست/نادرست' :
                             question.type === 'short_answer' ? 'پاسخ کوتاه' : 'تشریحی'}
                          </span>
                          <span className="text-sm text-text-body/70">
                            {question.points} نمره
                          </span>
                          <button
                            onClick={() => toggleFlag(question.id)}
                            className={`p-1 rounded-lg transition-colors ${
                              flaggedQuestions.has(question.id)
                                ? 'bg-red-100 text-red-600'
                                : 'hover:bg-soft/50 text-text-body/60'
                            }`}
                            title="علامت‌گذاری سوال"
                          >
                            <Flag className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <h3 className="text-lg font-medium text-text-heading leading-relaxed mb-4">
                          {question.question}
                        </h3>

                        {/* Multiple Choice */}
                        {question.type === 'multiple_choice' && question.options && (
                          <div className="space-y-2">
                            {question.options.map((option, optIndex) => (
                              <label
                                key={optIndex}
                                className={`flex items-center space-x-3 space-x-reverse p-3 border rounded-xl cursor-pointer transition-all duration-300 ${
                                  answers[question.id] === optIndex
                                    ? 'border-primary bg-primary/10'
                                    : 'border-accent/30 hover:border-primary/50 hover:bg-soft/30'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`question-${question.id}`}
                                  value={optIndex}
                                  checked={answers[question.id] === optIndex}
                                  onChange={() => handleAnswerChange(question.id, optIndex)}
                                  className="sr-only"
                                />
                                <div className={`w-4 h-4 border-2 rounded-full transition-all duration-300 flex items-center justify-center ${
                                  answers[question.id] === optIndex
                                    ? 'border-primary bg-primary'
                                    : 'border-accent/50'
                                }`}>
                                  {answers[question.id] === optIndex && (
                                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                  )}
                                </div>
                                <span className="flex-1 text-text-heading">
                                  <span className="font-medium ml-2">{String.fromCharCode(65 + optIndex)}.</span>
                                  {option}
                                </span>
                              </label>
                            ))}
                          </div>
                        )}

                        {/* True/False */}
                        {question.type === 'true_false' && (
                          <div className="space-y-2">
                            {['درست', 'نادرست'].map((option, optIndex) => (
                              <label
                                key={optIndex}
                                className={`flex items-center space-x-3 space-x-reverse p-3 border rounded-xl cursor-pointer transition-all duration-300 ${
                                  answers[question.id] === optIndex
                                    ? 'border-primary bg-primary/10'
                                    : 'border-accent/30 hover:border-primary/50 hover:bg-soft/30'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`question-${question.id}`}
                                  value={optIndex}
                                  checked={answers[question.id] === optIndex}
                                  onChange={() => handleAnswerChange(question.id, optIndex)}
                                  className="sr-only"
                                />
                                <div className={`w-4 h-4 border-2 rounded-full transition-all duration-300 flex items-center justify-center ${
                                  answers[question.id] === optIndex
                                    ? 'border-primary bg-primary'
                                    : 'border-accent/50'
                                }`}>
                                  {answers[question.id] === optIndex && (
                                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                  )}
                                </div>
                                <span className="flex-1 text-text-heading font-medium">
                                  {option}
                                </span>
                              </label>
                            ))}
                          </div>
                        )}

                        {/* Short Answer */}
                        {question.type === 'short_answer' && (
                          <div>
                            <input
                              type="text"
                              value={answers[question.id] || ''}
                              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                              className="w-full px-4 py-3 border-2 border-accent/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                              placeholder="پاسخ خود را وارد کنید..."
                            />
                          </div>
                        )}

                        {/* Essay */}
                        {question.type === 'essay' && (
                          <div>
                            <textarea
                              value={answers[question.id] || ''}
                              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                              rows={6}
                              className="w-full px-4 py-3 border-2 border-accent/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 resize-none"
                              placeholder="پاسخ تشریحی خود را اینجا بنویسید..."
                            />
                            <div className="mt-2 text-sm text-text-body/70">
                              تعداد کاراکتر: {(answers[question.id] || '').length}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <div className="mt-8 pt-6 border-t-2 border-accent/20 text-center">
                <button
                  onClick={handleSubmitExam}
                  className="btn-primary flex items-center space-x-2 space-x-reverse mx-auto"
                >
                  <Send className="h-5 w-5" />
                  <span>ارسال آزمون</span>
                </button>
              </div>

              {/* Progress Indicator */}
              <div className="fixed bottom-4 right-4 bg-white/90 backdrop-blur-lg rounded-2xl shadow-card px-4 py-2 border border-white/20">
                <div className="text-sm font-medium text-text-heading">
                  {Object.keys(answers).filter(id => answers[parseInt(id)] !== undefined && answers[parseInt(id)] !== null && answers[parseInt(id)] !== '').length} از {examData.questions.length} سوال پاسخ داده شده
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Exit Warning Modal */}
      {showExitWarning && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-hero max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center space-x-3 space-x-reverse mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-text-heading">خروج از آزمون</h3>
              </div>
              
              <p className="text-text-body mb-6">
                آیا مطمئن هستید که می‌خواهید از آزمون خارج شوید؟ پاسخ‌های شما ذخیره خواهد شد اما امکان بازگشت وجود ندارد.
              </p>
              
              <div className="flex space-x-3 space-x-reverse">
                <button
                  onClick={() => setShowExitWarning(false)}
                  className="btn-secondary flex-1"
                >
                  ادامه آزمون
                </button>
                <button
                  onClick={confirmExit}
                  className="bg-red-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-red-700 transition-colors flex-1"
                >
                  خروج
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamEnvironment;