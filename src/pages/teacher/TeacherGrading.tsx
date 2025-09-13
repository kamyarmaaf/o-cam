import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  MessageSquare,
  Star,
  Save,
  Send,
  X
} from 'lucide-react';

const TeacherGrading: React.FC = () => {
  const [selectedExam, setSelectedExam] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [showGradingModal, setShowGradingModal] = useState(false);

  const submissions = [
    {
      id: 1,
      studentName: 'سینا داوودی',
      studentId: 'STU-2023-001',
      examTitle: 'آزمون ریاضی عمومی',
      submittedAt: '۱۴۰۳/۰۹/۲۰ - ۱۰:۳۰',
      status: 'pending',
      autoScore: 85,
      manualScore: null,
      totalQuestions: 25,
      answeredQuestions: 25,
      timeSpent: '۸۵ دقیقه',
      hasEssayQuestions: true
    },
    {
      id: 2,
      studentName: 'سارا احمدی',
      studentId: 'STU-2023-002',
      examTitle: 'آزمون ریاضی عمومی',
      submittedAt: '۱۴۰۳/۰۹/۲۰ - ۱۰:۴۵',
      status: 'graded',
      autoScore: 92,
      manualScore: 90,
      totalQuestions: 25,
      answeredQuestions: 24,
      timeSpent: '۷۸ دقیقه',
      hasEssayQuestions: true
    },
    {
      id: 3,
      studentName: 'علی رضایی',
      studentId: 'STU-2023-003',
      examTitle: 'آزمون فیزیک کوانتوم',
      submittedAt: '۱۴۰۳/۰۹/۱۹ - ۱۴:۲۰',
      status: 'auto_graded',
      autoScore: 78,
      manualScore: null,
      totalQuestions: 30,
      answeredQuestions: 28,
      timeSpent: '۱۱۵ دقیقه',
      hasEssayQuestions: false
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'graded':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'auto_graded':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'در انتظار تصحیح';
      case 'graded':
        return 'تصحیح شده';
      case 'auto_graded':
        return 'تصحیح خودکار';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'graded':
        return <CheckCircle className="h-4 w-4" />;
      case 'auto_graded':
        return <FileText className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const handleGradeSubmission = (submission: any) => {
    setSelectedSubmission(submission);
    setShowGradingModal(true);
  };

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesExam = selectedExam === 'all' || submission.examTitle.includes(selectedExam);
    const matchesStatus = filterStatus === 'all' || submission.status === filterStatus;
    
    return matchesSearch && matchesExam && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-heading mb-2">تصحیح و نمره‌دهی</h1>
          <p className="text-text-body">تصحیح آزمون‌ها و ثبت نمرات دانشجویان</p>
        </div>
        
        <div className="flex items-center space-x-4 space-x-reverse mt-4 lg:mt-0">
          <button className="btn-secondary flex items-center space-x-2 space-x-reverse">
            <Download className="h-5 w-5" />
            <span>دانلود نمرات</span>
          </button>
          <button className="btn-primary flex items-center space-x-2 space-x-reverse">
            <Send className="h-5 w-5" />
            <span>انتشار نمرات</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-body mb-1">در انتظار تصحیح</p>
              <p className="text-2xl font-bold text-yellow-600">
                {submissions.filter(s => s.status === 'pending').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-body mb-1">تصحیح شده</p>
              <p className="text-2xl font-bold text-green-600">
                {submissions.filter(s => s.status === 'graded').length}
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
              <p className="text-sm text-text-body mb-1">تصحیح خودکار</p>
              <p className="text-2xl font-bold text-blue-600">
                {submissions.filter(s => s.status === 'auto_graded').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <FileText className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-body mb-1">میانگین نمرات</p>
              <p className="text-2xl font-bold text-primary">
                {Math.round(submissions.reduce((sum, s) => sum + (s.manualScore || s.autoScore), 0) / submissions.length)}%
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center">
              <Star className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-body/40 h-5 w-5" />
            <input
              type="text"
              placeholder="جستجو بر اساس نام یا شماره دانشجویی..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pr-10"
            />
          </div>
          
          <div className="flex items-center space-x-2 space-x-reverse">
            <Filter className="h-5 w-5 text-text-body/40" />
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="input-field"
            >
              <option value="all">همه آزمون‌ها</option>
              <option value="ریاضی">آزمون ریاضی عمومی</option>
              <option value="فیزیک">آزمون فیزیک کوانتوم</option>
              <option value="شیمی">آزمون شیمی آلی</option>
            </select>
          </div>

          <div className="flex items-center space-x-2 space-x-reverse">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field"
            >
              <option value="all">همه وضعیت‌ها</option>
              <option value="pending">در انتظار تصحیح</option>
              <option value="graded">تصحیح شده</option>
              <option value="auto_graded">تصحیح خودکار</option>
            </select>
          </div>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-accent/20">
                <th className="text-right py-4 px-6 font-semibold text-text-heading">دانشجو</th>
                <th className="text-right py-4 px-6 font-semibold text-text-heading">آزمون</th>
                <th className="text-right py-4 px-6 font-semibold text-text-heading">زمان ارسال</th>
                <th className="text-right py-4 px-6 font-semibold text-text-heading">نمره</th>
                <th className="text-right py-4 px-6 font-semibold text-text-heading">وضعیت</th>
                <th className="text-center py-4 px-6 font-semibold text-text-heading">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.map((submission) => (
                <tr key={submission.id} className="border-b border-accent/10 hover:bg-soft/30 transition-colors">
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-semibold text-text-heading">{submission.studentName}</p>
                      <p className="text-sm text-text-body/70">{submission.studentId}</p>
                    </div>
                  </td>
                  
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-text-heading">{submission.examTitle}</p>
                      <p className="text-sm text-text-body/70">
                        {submission.answeredQuestions}/{submission.totalQuestions} سوال
                      </p>
                    </div>
                  </td>
                  
                  <td className="py-4 px-6">
                    <div>
                      <p className="text-sm text-text-body">{submission.submittedAt}</p>
                      <p className="text-sm text-text-body/70">مدت: {submission.timeSpent}</p>
                    </div>
                  </td>
                  
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      {submission.manualScore !== null ? (
                        <div className="text-lg font-bold text-green-600">
                          {submission.manualScore}%
                        </div>
                      ) : (
                        <div className="text-lg font-bold text-blue-600">
                          {submission.autoScore}%
                        </div>
                      )}
                      {submission.hasEssayQuestions && submission.status === 'pending' && (
                        <p className="text-xs text-yellow-600">نیاز به تصحیح دستی</p>
                      )}
                    </div>
                  </td>
                  
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center space-x-2 space-x-reverse w-fit ${getStatusColor(submission.status)}`}>
                      {getStatusIcon(submission.status)}
                      <span>{getStatusText(submission.status)}</span>
                    </span>
                  </td>
                  
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center space-x-2 space-x-reverse">
                      <button
                        onClick={() => handleGradeSubmission(submission)}
                        className="p-2 text-primary hover:bg-primary/10 rounded-xl transition-colors"
                        title="تصحیح"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                        title="مشاهده جزئیات"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition-colors"
                        title="ارسال بازخورد"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grading Modal */}
      {showGradingModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-hero max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-accent/20">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-text-heading">
                  تصحیح آزمون - {selectedSubmission.studentName}
                </h2>
                <button
                  onClick={() => setShowGradingModal(false)}
                  className="p-2 hover:bg-soft/50 rounded-xl transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Student Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-soft/30 rounded-2xl p-4">
                <div>
                  <p className="text-sm text-text-body/70">دانشجو</p>
                  <p className="font-semibold">{selectedSubmission.studentName}</p>
                  <p className="text-sm text-text-body/70">{selectedSubmission.studentId}</p>
                </div>
                <div>
                  <p className="text-sm text-text-body/70">آزمون</p>
                  <p className="font-semibold">{selectedSubmission.examTitle}</p>
                  <p className="text-sm text-text-body/70">{selectedSubmission.submittedAt}</p>
                </div>
                <div>
                  <p className="text-sm text-text-body/70">نمره فعلی</p>
                  <p className="text-2xl font-bold text-primary">
                    {selectedSubmission.manualScore || selectedSubmission.autoScore}%
                  </p>
                </div>
              </div>

              {/* Questions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text-heading">سوالات و پاسخ‌ها</h3>
                
                {/* Sample Questions */}
                <div className="space-y-4">
                  <div className="border border-accent/20 rounded-2xl p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 space-x-reverse mb-2">
                          <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">چندگزینه‌ای</span>
                          <span className="text-sm text-text-body">2 نمره</span>
                        </div>
                        <p className="font-medium text-text-heading mb-3">
                          کدام یک از موارد زیر تعریف صحیح الگوریتم است؟
                        </p>
                        <div className="space-y-2">
                          <div className="p-2 bg-green-50 border border-green-200 rounded-lg">
                            <span className="font-medium">الف) مجموعه‌ای از دستورات برای حل مسئله</span>
                            <span className="text-green-600 mr-2">✓ پاسخ صحیح</span>
                          </div>
                          <div className="p-2 rounded-lg text-text-body/70">
                            ب) یک برنامه کامپیوتری
                          </div>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <p className="text-sm font-medium text-green-600">صحیح</p>
                        <p className="text-xs text-text-body/70">2/2 نمره</p>
                      </div>
                    </div>
                  </div>

                  <div className="border border-accent/20 rounded-2xl p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 space-x-reverse mb-2">
                          <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">تشریحی</span>
                          <span className="text-sm text-text-body">5 نمره</span>
                        </div>
                        <p className="font-medium text-text-heading mb-3">
                          الگوریتم مرتب‌سازی حبابی را توضیح دهید و پیچیدگی زمانی آن را محاسبه کنید.
                        </p>
                        <div className="bg-gray-50 p-4 rounded-lg mb-3">
                          <p className="text-sm text-text-body">
                            <strong>پاسخ دانشجو:</strong><br />
                            الگوریتم مرتب‌سازی حبابی یکی از ساده‌ترین الگوریتم‌های مرتب‌سازی است که با مقایسه عناصر مجاور کار می‌کند. در هر مرحله، بزرگترین عنصر به انتهای آرایه منتقل می‌شود. پیچیدگی زمانی این الگوریتم O(n²) است.
                          </p>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-text-heading">
                            نمره (از 5):
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="5"
                            defaultValue="4"
                            className="w-20 px-3 py-2 border border-accent/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div className="mt-3">
                          <label className="block text-sm font-medium text-text-heading mb-2">
                            بازخورد:
                          </label>
                          <textarea
                            rows={3}
                            className="w-full px-3 py-2 border border-accent/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                            placeholder="بازخورد و توضیحات برای دانشجو..."
                            defaultValue="پاسخ خوبی ارائه داده‌اید. توضیح الگوریتم صحیح است اما می‌توانستید مثال عملی نیز ارائه دهید."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Final Grade */}
              <div className="bg-primary/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-text-heading mb-4">نمره نهایی</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-heading mb-2">
                      نمره خودکار:
                    </label>
                    <div className="text-2xl font-bold text-blue-600">{selectedSubmission.autoScore}%</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-heading mb-2">
                      نمره دستی:
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      defaultValue={selectedSubmission.manualScore || selectedSubmission.autoScore}
                      className="w-full px-3 py-2 border border-accent/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-xl font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-heading mb-2">
                      نمره نهایی:
                    </label>
                    <div className="text-2xl font-bold text-green-600">88%</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 space-x-reverse pt-4 border-t border-accent/20">
                <button className="btn-primary flex-1 flex items-center justify-center space-x-2 space-x-reverse">
                  <Save className="h-5 w-5" />
                  <span>ذخیره نمره</span>
                </button>
                <button className="btn-secondary flex-1 flex items-center justify-center space-x-2 space-x-reverse">
                  <MessageSquare className="h-5 w-5" />
                  <span>ارسال بازخورد</span>
                </button>
                <button 
                  onClick={() => setShowGradingModal(false)}
                  className="border border-accent/30 text-text-body px-6 py-3 rounded-2xl hover:bg-soft/50 transition-colors"
                >
                  انصراف
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherGrading;