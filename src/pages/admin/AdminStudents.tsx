import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  Award,
  Plus,
  MoreVertical,
  X,
  Save,
  Download
} from 'lucide-react';

const AdminStudents: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const students = [
    {
      id: 1,
      name: 'سینا داوودی',
      email: 'sina.davoodi@student.ac.ir',
      phone: '۰۹۱۲۳۴۵۶۷۸۹',
      studentId: 'STU-2023-001',
      department: 'مهندسی کامپیوتر',
      year: 'سال سوم',
      enrollDate: '۱۴۰۱/۰۷/۱۵',
      status: 'active',
      averageScore: 92,
      totalExams: 15,
      lastActivity: '۱۴۰۳/۰۹/۲۰',
      gpa: 18.5
    },
    {
      id: 2,
      name: 'سارا احمدی',
      email: 'sara.ahmadi@student.ac.ir',
      phone: '۰۹۱۲۳۴۵۶۷۸۸',
      studentId: 'STU-2023-002',
      department: 'مهندسی کامپیوتر',
      year: 'سال دوم',
      enrollDate: '۱۴۰۲/۰۷/۱۸',
      status: 'active',
      averageScore: 88,
      totalExams: 12,
      lastActivity: '۱۴۰۳/۰۹/۱۹',
      gpa: 17.2
    },
    {
      id: 3,
      name: 'علی رضایی',
      email: 'ali.rezaei@student.ac.ir',
      phone: '۰۹۱۲۳۴۵۶۷۸۷',
      studentId: 'STU-2023-003',
      department: 'مهندسی برق',
      year: 'سال اول',
      enrollDate: '۱۴۰۳/۰۷/۲۰',
      status: 'warning',
      averageScore: 65,
      totalExams: 8,
      lastActivity: '۱۴۰۳/۰۹/۱۵',
      gpa: 14.8
    },
    {
      id: 4,
      name: 'فاطمه محمدی',
      email: 'fatemeh.mohammadi@student.ac.ir',
      phone: '۰۹۱۲۳۴۵۶۷۸۶',
      studentId: 'STU-2023-004',
      department: 'مهندسی شیمی',
      year: 'سال چهارم',
      enrollDate: '۱۴۰۰/۰۷/۲۲',
      status: 'inactive',
      averageScore: 45,
      totalExams: 5,
      lastActivity: '۱۴۰۳/۰۹/۰۵',
      gpa: 12.3
    }
  ];

  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    phone: '',
    studentId: '',
    department: '',
    year: '',
    password: ''
  });

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
                         student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || student.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const handleViewStudent = (student: any) => {
    setSelectedStudent(student);
    setShowStudentModal(true);
  };

  const handleAddStudent = () => {
    console.log('Adding student:', newStudent);
    setShowAddModal(false);
    setNewStudent({
      name: '',
      email: '',
      phone: '',
      studentId: '',
      department: '',
      year: '',
      password: ''
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-heading mb-2">مدیریت دانشجویان</h1>
          <p className="text-text-body">مدیریت اطلاعات و دسترسی‌های دانشجویان</p>
        </div>
        
        <div className="flex items-center space-x-4 space-x-reverse mt-4 lg:mt-0">
          <button className="btn-secondary flex items-center space-x-2 space-x-reverse">
            <Download className="h-5 w-5" />
            <span>دانلود لیست</span>
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center space-x-2 space-x-reverse"
          >
            <Plus className="h-5 w-5" />
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
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
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
              <Award className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-body mb-1">میانگین کل</p>
              <p className="text-2xl font-bold text-purple-600">
                {Math.round(students.reduce((sum, s) => sum + s.averageScore, 0) / students.length)}%
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-body mb-1">نیاز به توجه</p>
              <p className="text-2xl font-bold text-red-600">
                {students.filter(s => s.status === 'warning' || s.status === 'inactive').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center">
              <span className="text-white text-lg">⚠️</span>
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
                placeholder="جستجو بر اساس نام، ایمیل، شماره دانشجویی یا دانشکده..."
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
                <th className="text-right py-4 px-6 font-semibold text-text-heading">دانشکده</th>
                <th className="text-right py-4 px-6 font-semibold text-text-heading">عملکرد</th>
                <th className="text-right py-4 px-6 font-semibold text-text-heading">وضعیت</th>
                <th className="text-center py-4 px-6 font-semibold text-text-heading">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="border-b border-accent/10 hover:bg-soft/30 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-text-heading">{student.name}</p>
                        <p className="text-sm text-text-body/70">{student.studentId}</p>
                        <p className="text-sm text-text-body/70">{student.year}</p>
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
                    <div>
                      <p className="font-medium text-text-heading">{student.department}</p>
                      <div className="flex items-center space-x-2 space-x-reverse text-sm text-text-body/70">
                        <Calendar className="h-4 w-4" />
                        <span>ورودی: {student.enrollDate}</span>
                      </div>
                    </div>
                  </td>
                  
                  <td className="py-4 px-6">
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <span className="text-text-body/70">میانگین:</span>
                        <span className={`font-bold ${getScoreColor(student.averageScore)}`}>
                          {student.averageScore}%
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                        <span>{student.totalExams} آزمون</span>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Award className="h-4 w-4 text-purple-600" />
                        <span>معدل: {student.gpa}</span>
                      </div>
                    </div>
                  </td>
                  
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(student.status)}`}>
                      {getStatusText(student.status)}
                    </span>
                  </td>
                  
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center space-x-2 space-x-reverse">
                      <button
                        onClick={() => handleViewStudent(student)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                        title="مشاهده جزئیات"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition-colors"
                        title="ویرایش"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        title="حذف"
                      >
                        <Trash2 className="h-4 w-4" />
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
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text-heading">{selectedStudent.name}</h3>
                  <p className="text-text-body">{selectedStudent.studentId}</p>
                  <p className="text-text-body/70">{selectedStudent.department} - {selectedStudent.year}</p>
                </div>
              </div>

              {/* Academic Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-soft/30 rounded-2xl p-4 text-center">
                  <div className={`text-2xl font-bold ${getScoreColor(selectedStudent.averageScore)}`}>
                    {selectedStudent.averageScore}%
                  </div>
                  <div className="text-sm text-text-body/70">میانگین نمرات</div>
                </div>
                <div className="bg-soft/30 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{selectedStudent.totalExams}</div>
                  <div className="text-sm text-text-body/70">آزمون شرکت کرده</div>
                </div>
                <div className="bg-soft/30 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{selectedStudent.gpa}</div>
                  <div className="text-sm text-text-body/70">معدل کل</div>
                </div>
              </div>

              {/* Contact and Academic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-text-heading mb-3">اطلاعات تماس</h4>
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
                      <span>ثبت نام: {selectedStudent.enrollDate}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-text-heading mb-3">اطلاعات تحصیلی</h4>
                  <div className="space-y-2 text-sm">
                    <p>دانشکده: {selectedStudent.department}</p>
                    <p>سال تحصیلی: {selectedStudent.year}</p>
                    <p>آخرین فعالیت: {selectedStudent.lastActivity}</p>
                    <p>وضعیت: <span className={getStatusText(selectedStudent.status) === 'فعال' ? 'text-green-600' : getStatusText(selectedStudent.status) === 'نیاز به توجه' ? 'text-yellow-600' : 'text-red-600'}>{getStatusText(selectedStudent.status)}</span></p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 space-x-reverse pt-4 border-t border-accent/20">
                <button className="btn-primary flex-1">
                  ویرایش اطلاعات
                </button>
                <button className="btn-secondary flex-1">
                  مشاهده نمرات
                </button>
                <button className="border border-red-300 text-red-600 px-6 py-3 rounded-2xl hover:bg-red-50 transition-colors">
                  تعلیق حساب
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-hero max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-accent/20">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-text-heading">افزودن دانشجو جدید</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-soft/50 rounded-xl transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-heading mb-2">
                    نام و نام خانوادگی
                  </label>
                  <input
                    type="text"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, name: e.target.value }))}
                    className="input-field"
                    placeholder="نام کامل دانشجو"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-heading mb-2">
                    شماره دانشجویی
                  </label>
                  <input
                    type="text"
                    value={newStudent.studentId}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, studentId: e.target.value }))}
                    className="input-field"
                    placeholder="STU-2024-001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-heading mb-2">
                    ایمیل
                  </label>
                  <input
                    type="email"
                    value={newStudent.email}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, email: e.target.value }))}
                    className="input-field"
                    placeholder="ایمیل دانشجو"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-heading mb-2">
                    شماره تماس
                  </label>
                  <input
                    type="text"
                    value={newStudent.phone}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, phone: e.target.value }))}
                    className="input-field"
                    placeholder="شماره تماس"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-heading mb-2">
                    دانشکده
                  </label>
                  <input
                    type="text"
                    value={newStudent.department}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, department: e.target.value }))}
                    className="input-field"
                    placeholder="نام دانشکده"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-heading mb-2">
                    سال تحصیلی
                  </label>
                  <select
                    value={newStudent.year}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, year: e.target.value }))}
                    className="input-field"
                  >
                    <option value="">انتخاب سال</option>
                    <option value="سال اول">سال اول</option>
                    <option value="سال دوم">سال دوم</option>
                    <option value="سال سوم">سال سوم</option>
                    <option value="سال چهارم">سال چهارم</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-heading mb-2">
                    رمز عبور موقت
                  </label>
                  <input
                    type="password"
                    value={newStudent.password}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, password: e.target.value }))}
                    className="input-field"
                    placeholder="رمز عبور اولیه"
                  />
                </div>
              </div>

              <div className="flex space-x-4 space-x-reverse pt-4 border-t border-accent/20">
                <button 
                  onClick={handleAddStudent}
                  className="btn-primary flex-1 flex items-center justify-center space-x-2 space-x-reverse"
                >
                  <Save className="h-5 w-5" />
                  <span>ذخیره دانشجو</span>
                </button>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary flex-1"
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

export default AdminStudents;