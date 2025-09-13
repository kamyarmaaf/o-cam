import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  Users, 
  Play, 
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Star,
  Award,
  TrendingUp,
  Download
} from 'lucide-react';

const DashboardExams: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedExamResult, setSelectedExamResult] = useState<any>(null);

  const studentExams = [
    {
      id: 'face-detection',
      title: 'Face Detection Demo Exam',
      subject: 'Technology Demo',
      date: '۱۴۰۳/۰۹/۲۵',
      time: '۱۰:۰۰',
      duration: '۳۰ دقیقه',
      questions: 2,
      status: 'upcoming',
      teacher: 'System Demo',
      description: 'Demo exam with advanced face detection and monitoring technology',
      passingScore: 60,
      attempts: 0,
      maxAttempts: 1,
      isFaceDetection: true
    },
    {
      id: 1,
      title: 'آزمون ریاضی عمومی',
      subject: 'ریاضی',
      date: '۱۴۰۳/۰۹/۲۵',
      time: '۱۰:۰۰',
      duration: '۹۰ دقیقه',
      questions: 25,
      status: 'upcoming',
      teacher: 'دکتر احمدی',
      description: 'آزمون میان‌ترم شامل فصل‌های ۱ تا ۳',
      passingScore: 60,
      attempts: 1,
      maxAttempts: 1
    },
    {
      id: 2,
      title: 'آزمون فیزیک کوانتوم',
      subject: 'فیزیک',
      date: '۱۴۰۳/۰۹/۲۸',
      time: '۱۴:۰۰',
      duration: '۱۲۰ دقیقه',
      questions: 30,
      status: 'upcoming',
      teacher: 'دکتر محمدی',
      description: 'آزمون جامع فیزیک کوانتوم',
      passingScore: 70,
      attempts: 0,
      maxAttempts: 2
    },
    {
      id: 3,
      title: 'آزمون شیمی آلی',
      subject: 'شیمی',
      date: '۱۴۰۳/۰۹/۲۰',
      time: '۰۹:۰۰',
      duration: '۱۰۰ دقیقه',
      questions: 20,
      status: 'completed',
      teacher: 'دکتر رضایی',
      score: 85,
      rank: 5,
      totalParticipants: 42,
      correctAnswers: 17,
      description: 'آزمون شیمی آلی فصل ۱ و ۲',
      passingScore: 60,
      attempts: 1,
      maxAttempts: 1,
      timeSpent: '۸۵ دقیقه',
      submittedAt: '۱۴۰۳/۰۹/۲۰ - ۱۰:۲۵',
      detailedResults: [
        { questionNumber: 1, userAnswer: 0, correctAnswer: 0, isCorrect: true, points: 2 },
        { questionNumber: 2, userAnswer: 1, correctAnswer: 2, isCorrect: false, points: 0 },
        { questionNumber: 3, userAnswer: 2, correctAnswer: 2, isCorrect: true, points: 3 },
        // ... more questions
      ]
    },
    {
      id: 4,
      title: 'آزمون زیست‌شناسی سلولی',
      subject: 'زیست',
      date: '۱۴۰۳/۰۹/۱۵',
      time: '۱۱:۰۰',
      duration: '۸۰ دقیقه',
      questions: 18,
      status: 'completed',
      teacher: 'دکتر کریمی',
      score: 92,
      rank: 2,
      totalParticipants: 35,
      correctAnswers: 16,
      description: 'آزمون زیست‌شناسی سلولی و مولکولی',
      passingScore: 65,
      attempts: 1,
      maxAttempts: 1,
      timeSpent: '۷۲ دقیقه',
      submittedAt: '۱۴۰۳/۰۹/۱۵ - ۱۲:۱۲',
      detailedResults: [
        { questionNumber: 1, userAnswer: 0, correctAnswer: 0, isCorrect: true, points: 3 },
        { questionNumber: 2, userAnswer: 1, correctAnswer: 1, isCorrect: true, points: 2 },
        { questionNumber: 3, userAnswer: 0, correctAnswer: 1, isCorrect: false, points: 0 },
        // ... more questions
      ]
    }
  ];

  const teacherExams = [
    {
      id: 1,
      title: 'آزمون ریاضی عمومی',
      subject: 'ریاضی',
      date: '۱۴۰۳/۰۹/۲۵',
      time: '۱۰:۰۰',
      duration: '۹۰ دقیقه',
      questions: 25,
      status: 'active',
      participants: 45,
      completed: 12,
      averageScore: 78,
      description: 'آزمون میان‌ترم ریاضی عمومی'
    },
    {
      id: 2,
      title: 'آزمون جبر خطی',
      subject: 'ریاضی',
      date: '۱۴۰۳/۰۹/۳۰',
      time: '۱۱:۰۰',
      duration: '۱۲۰ دقیقه',
      questions: 30,
      status: 'draft',
      participants: 0,
      completed: 0,
      averageScore: 0,
      description: 'آزمون جبر خطی پیشرفته'
    },
    {
      id: 3,
      title: 'آزمون حسابان',
      subject: 'ریاضی',
      date: '۱۴۰۳/۰۹/۱۵',
      time: '۰۹:۰۰',
      duration: '۱۰۰ دقیقه',
      questions: 20,
      status: 'completed',
      participants: 38,
      completed: 38,
      averageScore: 82,
      description: 'آزمون نهایی حسابان'
    }
  ];

  const exams = user?.role === 'teacher' ? teacherExams : studentExams;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
      case 'active':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'آینده';
      case 'active':
        return 'فعال';
      case 'completed':
        return 'تکمیل شده';
      case 'draft':
        return 'پیش‌نویس';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Clock className="h-4 w-4" />;
      case 'active':
        return <Play className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'draft':
        return <Edit className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRankColor = (rank: number, total: number) => {
    const percentage = (rank / total) * 100;
    if (percentage <= 10) return 'text-green-600';
    if (percentage <= 25) return 'text-blue-600';
    if (percentage <= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleStartExam = (examId: number | string) => {
    if (examId === 'face-detection') {
      navigate('/face-exam');
    } else {
      navigate(`/exam/${examId}`);
    }
  };

  const handleViewResult = (exam: any) => {
    setSelectedExamResult(exam);
    setShowResultModal(true);
  };

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || exam.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-heading mb-2">
            {user?.role === 'teacher' ? 'مدیریت آزمون‌ها' : 'آزمون‌های فعال'}
          </h1>
          <p className="text-text-body">
            {user?.role === 'teacher' 
              ? 'آزمون‌های خود را ایجاد و مدیریت کنید'
              : 'آزمون‌های در دسترس و آینده'
            }
          </p>
        </div>
        
        {user?.role === 'teacher' && (
          <button 
            onClick={() => navigate('/dashboard/exam/create')}
            className="btn-primary flex items-center space-x-2 space-x-reverse mt-4 md:mt-0"
          >
            <Plus className="h-5 w-5" />
            <span>ایجاد آزمون جدید</span>
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {user?.role === 'student' ? (
          <>
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-body mb-1">آزمون‌های آینده</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {studentExams.filter(e => e.status === 'upcoming').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-body mb-1">تکمیل شده</p>
                  <p className="text-2xl font-bold text-green-600">
                    {studentExams.filter(e => e.status === 'completed').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-body mb-1">میانگین نمره</p>
                  <p className="text-2xl font-bold text-primary">
                    {Math.round(studentExams.filter(e => e.score).reduce((sum, e) => sum + (e.score || 0), 0) / studentExams.filter(e => e.score).length) || 0}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center">
                  <Star className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-body mb-1">بهترین نمره</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {Math.max(...studentExams.filter(e => e.score).map(e => e.score || 0)) || 0}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <Star className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-body mb-1">کل آزمون‌ها</p>
                  <p className="text-2xl font-bold text-primary">{teacherExams.length}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-body mb-1">آزمون‌های فعال</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {teacherExams.filter(e => e.status === 'active').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                  <Play className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-body mb-1">کل شرکت‌کنندگان</p>
                  <p className="text-2xl font-bold text-green-600">
                    {teacherExams.reduce((sum, e) => sum + e.participants, 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-body mb-1">میانگین کلاس</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {Math.round(teacherExams.filter(e => e.averageScore > 0).reduce((sum, e) => sum + e.averageScore, 0) / teacherExams.filter(e => e.averageScore > 0).length) || 0}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <Star className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-body/40 h-5 w-5" />
              <input
                type="text"
                placeholder="جستجو در آزمون‌ها..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pr-10"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Filter className="h-5 w-5 text-text-body/40" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-accent/30 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 bg-white/90"
              >
                <option value="all">همه وضعیت‌ها</option>
                <option value="upcoming">آینده</option>
                <option value="active">فعال</option>
                <option value="completed">تکمیل شده</option>
                {user?.role === 'teacher' && <option value="draft">پیش‌نویس</option>}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Exams Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredExams.map((exam) => (
          <div key={exam.id} className="card hover:shadow-hero transition-all duration-300 group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className={`w-12 h-12 ${exam.isFaceDetection ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gradient-primary'} rounded-2xl flex items-center justify-center`}>
                  {exam.isFaceDetection ? (
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  ) : (
                    <BookOpen className="h-6 w-6 text-white" />
                  )}
                </div>
                <div>
                  <div>
                    <h3 className="font-semibold text-text-heading group-hover:text-primary transition-colors">
                      {exam.title}
                    </h3>
                    <p className="text-sm text-text-body/70">{exam.subject}</p>
                    {exam.isFaceDetection && (
                      <span className="inline-block mt-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                        AI-Powered
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 space-x-reverse ${getStatusColor(exam.status)}`}>
                {getStatusIcon(exam.status)}
                <span>{getStatusText(exam.status)}</span>
              </div>
            </div>

            <p className="text-text-body text-sm mb-4 line-clamp-2">
              {exam.description}
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm text-text-body/70">
                <Calendar className="h-4 w-4 ml-2" />
                <span>{exam.date} - {exam.time}</span>
              </div>
              
              <div className="flex items-center text-sm text-text-body/70">
                <Clock className="h-4 w-4 ml-2" />
                <span>{exam.duration} - {exam.questions} سوال</span>
              </div>
              
              {user?.role === 'student' && 'teacher' in exam && (
                <div className="flex items-center text-sm text-text-body/70">
                  <Users className="h-4 w-4 ml-2" />
                  <span>{exam.teacher}</span>
                </div>
              )}
              
              {user?.role === 'teacher' && 'participants' in exam && (
                <div className="flex items-center text-sm text-text-body/70">
                  <Users className="h-4 w-4 ml-2" />
                  <span>{exam.completed}/{exam.participants} شرکت‌کننده</span>
                </div>
              )}
              
              {user?.role === 'student' && 'score' in exam && exam.score && (
                <div className="space-y-2">
                  <div className="flex items-center text-sm font-semibold">
                    <Star className="h-4 w-4 ml-2 text-yellow-500" />
                    <span className={getScoreColor(exam.score)}>نمره: {exam.score}%</span>
                  </div>
                  {exam.rank && exam.totalParticipants && (
                    <div className="flex items-center text-sm">
                      <Award className="h-4 w-4 ml-2 text-purple-500" />
                      <span className={getRankColor(exam.rank, exam.totalParticipants)}>
                        رتبه {exam.rank} از {exam.totalParticipants}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {user?.role === 'teacher' && 'averageScore' in exam && exam.averageScore > 0 && (
                <div className="flex items-center text-sm font-semibold text-primary">
                  <Star className="h-4 w-4 ml-2" />
                  <span>میانگین: {exam.averageScore}%</span>
                </div>
              )}
            </div>

            <div className="flex space-x-2 space-x-reverse">
              {user?.role === 'student' ? (
                <>
                  {exam.status === 'upcoming' && (
                    <button 
                      onClick={() => handleStartExam(exam.id)}
                      className="btn-primary flex-1 flex items-center justify-center space-x-2 space-x-reverse"
                    >
                      <Play className="h-4 w-4" />
                      <span>شرکت در آزمون</span>
                    </button>
                  )}
                  {exam.status === 'completed' && (
                    <div className="flex space-x-2 space-x-reverse w-full">
                      <button 
                        onClick={() => handleViewResult(exam)}
                        className="btn-primary flex-1 flex items-center justify-center space-x-2 space-x-reverse"
                      >
                        <Eye className="h-4 w-4" />
                        <span>مشاهده نتیجه</span>
                      </button>
                      <button className="border border-accent/30 text-text-body px-3 py-2 rounded-2xl hover:bg-soft/50 transition-colors flex items-center justify-center">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <button className="flex-1 border border-accent/30 text-text-body px-3 py-2 rounded-2xl font-medium hover:bg-soft/50 transition-colors flex items-center justify-center space-x-1 space-x-reverse">
                    <Eye className="h-4 w-4" />
                    <span>مشاهده</span>
                  </button>
                  <button 
                    onClick={() => navigate(`/dashboard/exam/edit/${exam.id}`)}
                    className="flex-1 border border-accent/30 text-text-body px-3 py-2 rounded-2xl font-medium hover:bg-soft/50 transition-colors flex items-center justify-center space-x-1 space-x-reverse"
                  >
                    <Edit className="h-4 w-4" />
                    <span>ویرایش</span>
                  </button>
                  <button className="border border-red-300 text-red-600 px-3 py-2 rounded-2xl font-medium hover:bg-red-50 transition-colors flex items-center justify-center">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredExams.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-text-body/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-heading mb-2">
            {user?.role === 'teacher' ? 'هنوز آزمونی ایجاد نکرده‌اید' : 'آزمونی در دسترس نیست'}
          </h3>
          <p className="text-text-body mb-6">
            {user?.role === 'teacher' 
              ? 'اولین آزمون خود را ایجاد کنید'
              : 'آزمون‌های جدید به زودی اضافه خواهند شد'
            }
          </p>
          {user?.role === 'teacher' && (
            <button 
              onClick={() => navigate('/dashboard/exam/create')}
              className="input-field"
            >
              ایجاد آزمون جدید
            </button>
          )}
        </div>
      )}

      {/* Result Modal */}
      {showResultModal && selectedExamResult && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-hero max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-accent/20">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-text-heading">نتیجه آزمون</h2>
                <button
                  onClick={() => setShowResultModal(false)}
                  className="p-2 hover:bg-soft/50 rounded-xl transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Exam Info */}
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-text-heading mb-2">{selectedExamResult.title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-text-body/70">تاریخ آزمون:</span>
                    <p className="font-medium">{selectedExamResult.date}</p>
                  </div>
                  <div>
                    <span className="text-text-body/70">مدرس:</span>
                    <p className="font-medium">{selectedExamResult.teacher}</p>
                  </div>
                  <div>
                    <span className="text-text-body/70">زمان ارسال:</span>
                    <p className="font-medium">{selectedExamResult.submittedAt}</p>
                  </div>
                </div>
              </div>

              {/* Score Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-2xl">
                  <div className="text-3xl font-bold text-green-600 mb-1">{selectedExamResult.score}%</div>
                  <div className="text-sm text-green-700">نمره کل</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-2xl">
                  <div className="text-3xl font-bold text-blue-600 mb-1">{selectedExamResult.rank}</div>
                  <div className="text-sm text-blue-700">رتبه شما</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-2xl">
                  <div className="text-3xl font-bold text-purple-600 mb-1">{selectedExamResult.correctAnswers}</div>
                  <div className="text-sm text-purple-700">پاسخ صحیح</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-2xl">
                  <div className="text-3xl font-bold text-yellow-600 mb-1">{selectedExamResult.timeSpent}</div>
                  <div className="text-sm text-yellow-700">زمان صرف شده</div>
                </div>
              </div>

              {/* Performance Analysis */}
              <div className="bg-soft/30 rounded-2xl p-6">
                <h4 className="font-semibold text-text-heading mb-4">تحلیل عملکرد</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>درصد پاسخ‌های صحیح:</span>
                    <span className="font-bold text-green-600">
                      {Math.round((selectedExamResult.correctAnswers / selectedExamResult.questions) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-green-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(selectedExamResult.correctAnswers / selectedExamResult.questions) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-text-body/70">
                    <span>نمره قبولی: {selectedExamResult.passingScore}%</span>
                    <span className={selectedExamResult.score >= selectedExamResult.passingScore ? 'text-green-600' : 'text-red-600'}>
                      {selectedExamResult.score >= selectedExamResult.passingScore ? '✅ قبول' : '❌ مردود'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Detailed Results */}
              {selectedExamResult.detailedResults && (
                <div>
                  <h4 className="font-semibold text-text-heading mb-4">جزئیات پاسخ‌ها</h4>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {selectedExamResult.detailedResults.map((result: any, index: number) => (
                      <div key={index} className={`p-3 rounded-xl border ${
                        result.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">سوال {result.questionNumber}</span>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <span className={`text-sm ${result.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                              {result.isCorrect ? '✓ صحیح' : '✗ نادرست'}
                            </span>
                            <span className="text-sm text-text-body/70">{result.points} نمره</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-4 space-x-reverse pt-4 border-t border-accent/20">
                <button className="btn-primary flex-1">
                  دانلود گزارش PDF
                </button>
                <button 
                  onClick={() => setShowResultModal(false)}
                  className="btn-secondary flex-1"
                >
                  بستن
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardExams;