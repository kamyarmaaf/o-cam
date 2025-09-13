import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Mail, 
  Phone,
  Calendar,
  Award,
  TrendingUp,
  Download,
  UserPlus,
  MoreVertical,
  BookOpen,
  Clock,
  X
} from 'lucide-react';

const TeacherStudents: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [showStudentModal, setShowStudentModal] = useState(false);

  const students = [
    {
      id: 1,
      name: 'سینا داوودی',
      email: 'sina.davoodi@email.com',
      studentId: 'STU-2023-001',
      phone: '۰۹۱۲۳۴۵۶۷۸۹',
      department: 'مهندسی کامپیوتر',
      enrollDate: '۱۴۰۳/۰۷/۱۵',
      status: 'active',
      averageScore: 92,
      totalExams: 12,
      lastActivity: '۱۴۰۳/۰۹/۲۰',
      avatar: '👨‍🎓'
    },
    {
      id: 2,
      name: 'سارا احمدی',
      email: 'sara.ahmadi@email.com',
      studentId: 'STU-2023-002',
      phone: '۰۹۱۲۳۴۵۶۷۸۸',
      department: 'مهندسی کامپیوتر',
      enrollDate: '۱۴۰۳/۰۷/۱۸',
      status: 'active',
      averageScore: 88,
      totalExams: 10,
      lastActivity: '۱۴۰۳/۰۹/۱۹',
      avatar: '👩‍🎓'
    },
    {
      id: 3,
      name: 'علی رضایی',
      email: 'ali.rezaei@email.com',
      studentId: 'STU-2023-003',
      phone: '۰۹۱۲۳۴۵۶۷۸۷',
      department: 'مهندسی کامپیوتر',
      enrollDate: '۱۴۰۳/۰۷/۲۰',
      status: 'warning',
      averageScore: 65,
      totalExams: 8,
      lastActivity: '۱۴۰۳/۰۹/۱۵',
      avatar: '👨‍🎓'
    },
    {
      id: 4,
      name: 'فاطمه محمدی',
      email: 'fatemeh.mohammadi@email.com',
      studentId: 'STU-2023-004',
      phone: '۰۹۱۲۳۴۵۶۷۸۶',
      department: 'مهندسی کامپیوتر',
      enrollDate: '۱۴۰۳/۰۷/۲۲',
      status: 'inactive',
      averageScore: 45,
      totalExams: 5,
      lastActivity: '۱۴۰۳/۰۹/۰۵',
      avatar: '👩‍🎓'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'فعال';
      case 'warning':
        return 'نیاز به توجه';
      case 'inactive':
        return 'غیرفعال';
      default:
        return status;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || student.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const handleViewStudent = (student: any) => {
    setSelectedStudent(student);
    setShowStudentModal(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-heading mb-2">مدیریت دانشجویان</h1>
          <p className="text-text-body">مدیریت و نظارت بر دانشجویان کلاس‌های شما</p>
        </div>
        
        <div className="flex items-center space-x-4 space-x-reverse mt-4 lg:mt-0">
          <button className="btn-secondary flex items-center space-x-2 space-x-reverse">
            <Download className="h-5 w-5" />
            <span>دانلود لیست</span>
          </button>
          <button className="btn-primary flex items-center space-x-2 space-x-reverse">
            <UserPlus className="h-5 w-5" />
            <span>افزودن دانشجو</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-body mb-1">کل دانشجویان</p>
              <p className="text-2xl font-bold text-text-heading">{students.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-body mb-1">دانشجویان فعال</p>
              <p className="text-2xl font-bold text-green-600">
                {students.filter(s => s.status === 'active').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-body mb-1">میانگین کلاس</p>
              <p className="text-2xl font-bold text-blue-600">
                {Math.round(students.reduce((sum, s) => sum + s.averageScore, 0) / students.length)}%
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <Award className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-body mb-1">نیاز به توجه</p>
              <p className="text-2xl font-bold text-yellow-600">
                {students.filter(s => s.status === 'warning' || s.status === 'inactive').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-body/40 h-5 w-5" />
              <input
                type="text"
                placeholder="جستجو بر اساس نام، ایمیل یا شماره دانشجویی..."
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
                className="input-field"
              >
                <option value="all">همه وضعیت‌ها</option>
                <option value="active">فعال</option>
                <option value="warning">نیاز به توجه</option>
                <option value="inactive">غیرفعال</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-accent/20">
                <th className="text-right py-4 px-6 font-semibold text-text-heading">دانشجو</th>
                <th className="text-right py-4 px-6 font-semibold text-text-heading">اطلاعات تماس</th>
                <th className="text-right py-4 px-6 font-semibold text-text-heading">عملکرد</th>
                <th className="text-right py-4 px-6 font-semibold text-text-heading">وضعیت</th>
                <th className="text-right py-4 px-6 font-semibold text-text-heading">آخرین فعالیت</th>
                <th className="text-center py-4 px-6 font-semibold text-text-heading">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="border-b border-accent/10 hover:bg-soft/30 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className="text-2xl">{student.avatar}</div>
                      <div>
                        <p className="font-semibold text-text-heading">{student.name}</p>
                        <p className="text-sm text-text-body/70">{student.studentId}</p>
                        <p className="text-sm text-text-body/70">{student.department}</p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 space-x-reverse text-sm text-text-body">
                        <Mail className="h-4 w-4" />
                        <span>{student.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse text-sm text-text-body">
                        <Phone className="h-4 w-4" />
                        <span>{student.phone}</span>
                      </div>
                    </div>
                  </td>
                  
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <span className="text-sm text-text-body">میانگین:</span>
                        <span className={`font-bold ${getScoreColor(student.averageScore)}`}>
                          {student.averageScore}%
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse text-sm text-text-body">
                        <BookOpen className="h-4 w-4" />
                        <span>{student.totalExams} آزمون</span>
                      </div>
                    </div>
                  </td>
                  
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(student.status)}`}>
                      {getStatusText(student.status)}
                    </span>
                  </td>
                  
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2 space-x-reverse text-sm text-text-body">
                      <Calendar className="h-4 w-4" />
                      <span>{student.lastActivity}</span>
                    </div>
                  </td>
                  
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center space-x-2 space-x-reverse">
                      <button
                        onClick={() => handleViewStudent(student)}
                        className="p-2 text-primary hover:bg-primary/10 rounded-xl transition-colors"
                        title="مشاهده جزئیات"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                        title="ویرایش"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        className="p-2 text-text-body hover:bg-soft/50 rounded-xl transition-colors"
                        title="بیشتر"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Detail Modal */}
      {showStudentModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-hero max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-accent/20">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-text-heading">جزئیات دانشجو</h2>
                <button
                  onClick={() => setShowStudentModal(false)}
                  className="p-2 hover:bg-soft/50 rounded-xl transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Student Info */}
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="text-4xl">{selectedStudent.avatar}</div>
                <div>
                  <h3 className="text-xl font-bold text-text-heading">{selectedStudent.name}</h3>
                  <p className="text-text-body">{selectedStudent.studentId}</p>
                  <p className="text-text-body/70">{selectedStudent.department}</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-text-heading">اطلاعات تماس</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 space-x-reverse text-sm">
                      <Mail className="h-4 w-4 text-text-body/60" />
                      <span>{selectedStudent.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse text-sm">
                      <Phone className="h-4 w-4 text-text-body/60" />
                      <span>{selectedStudent.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse text-sm">
                      <Calendar className="h-4 w-4 text-text-body/60" />
                      <span>تاریخ ثبت نام: {selectedStudent.enrollDate}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-text-heading">عملکرد تحصیلی</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-text-body">میانگین نمرات:</span>
                      <span className={`font-bold ${getScoreColor(selectedStudent.averageScore)}`}>
                        {selectedStudent.averageScore}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-text-body">تعداد آزمون‌ها:</span>
                      <span className="font-medium">{selectedStudent.totalExams}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-text-body">آخرین فعالیت:</span>
                      <span className="font-medium">{selectedStudent.lastActivity}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 space-x-reverse pt-4 border-t border-accent/20">
                <button className="btn-primary flex-1">
                  ویرایش اطلاعات
                </button>
                <button className="btn-secondary flex-1">
                  ارسال پیام
                </button>
                <button className="border border-accent/30 text-text-body px-6 py-3 rounded-2xl hover:bg-soft/50 transition-colors">
                  مشاهده نمرات
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherStudents;