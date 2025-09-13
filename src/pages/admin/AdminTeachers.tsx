import React, { useState } from 'react';
import { 
  GraduationCap, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  Users,
  Plus,
  MoreVertical,
  X,
  Save
} from 'lucide-react';

const AdminTeachers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const teachers = [
    {
      id: 1,
      name: 'دکتر احمد احمدی',
      email: 'ahmad.ahmadi@university.ac.ir',
      phone: '۰۹۱۲۳۴۵۶۷۸۹',
      department: 'دانشکده ریاضی',
      specialization: 'ریاضی کاربردی',
      joinDate: '۱۴۰۰/۰۳/۱۵',
      status: 'active',
      examsCreated: 28,
      studentsCount: 125,
      averageRating: 4.8,
      lastActivity: '۱۴۰۳/۰۹/۲۰'
    },
    {
      id: 2,
      name: 'دکتر فاطمه محمدی',
      email: 'fatemeh.mohammadi@university.ac.ir',
      phone: '۰۹۱۲۳۴۵۶۷۸۸',
      department: 'دانشکده فیزیک',
      specialization: 'فیزیک کوانتوم',
      joinDate: '۱۳۹۹/۰۹/۱۰',
      status: 'active',
      examsCreated: 35,
      studentsCount: 98,
      averageRating: 4.9,
      lastActivity: '۱۴۰۳/۰۹/۱۹'
    },
    {
      id: 3,
      name: 'دکتر علی رضایی',
      email: 'ali.rezaei@university.ac.ir',
      phone: '۰۹۱۲۳۴۵۶۷۸۷',
      department: 'دانشکده شیمی',
      specialization: 'شیمی آلی',
      joinDate: '۱۴۰۱/۰۷/۲۰',
      status: 'inactive',
      examsCreated: 12,
      studentsCount: 67,
      averageRating: 4.3,
      lastActivity: '۱۴۰۳/۰۸/۱۵'
    }
  ];

  const [newTeacher, setNewTeacher] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    specialization: '',
    password: ''
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'فعال';
      case 'inactive':
        return 'غیرفعال';
      case 'suspended':
        return 'تعلیق';
      default:
        return status;
    }
  };

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || teacher.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const handleViewTeacher = (teacher: any) => {
    setSelectedTeacher(teacher);
    setShowTeacherModal(true);
  };

  const handleAddTeacher = () => {
    console.log('Adding teacher:', newTeacher);
    setShowAddModal(false);
    setNewTeacher({
      name: '',
      email: '',
      phone: '',
      department: '',
      specialization: '',
      password: ''
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-heading mb-2">مدیریت مدرسان</h1>
          <p className="text-text-body">مدیریت اطلاعات و دسترسی‌های مدرسان</p>
        </div>
        
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center space-x-2 space-x-reverse mt-4 lg:mt-0"
        >
          <Plus className="h-5 w-5" />
          <span>افزودن مدرس جدید</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-body mb-1">کل مدرسان</p>
              <p className="text-2xl font-bold text-text-heading">{teachers.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-body mb-1">مدرسان فعال</p>
              <p className="text-2xl font-bold text-green-600">
                {teachers.filter(t => t.status === 'active').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-body mb-1">کل آزمون‌ها</p>
              <p className="text-2xl font-bold text-blue-600">
                {teachers.reduce((sum, t) => sum + t.examsCreated, 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-body mb-1">میانگین رضایت</p>
              <p className="text-2xl font-bold text-purple-600">
                {(teachers.reduce((sum, t) => sum + t.averageRating, 0) / teachers.length).toFixed(1)}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <span className="text-white text-lg">⭐</span>
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
                placeholder="جستجو بر اساس نام، ایمیل یا دانشکده..."
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
                <option value="inactive">غیرفعال</option>
                <option value="suspended">تعلیق</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Teachers Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-accent/20">
                <th className="text-right py-4 px-6 font-semibold text-text-heading">مدرس</th>
                <th className="text-right py-4 px-6 font-semibold text-text-heading">اطلاعات تماس</th>
                <th className="text-right py-4 px-6 font-semibold text-text-heading">دانشکده</th>
                <th className="text-right py-4 px-6 font-semibold text-text-heading">آمار</th>
                <th className="text-right py-4 px-6 font-semibold text-text-heading">وضعیت</th>
                <th className="text-center py-4 px-6 font-semibold text-text-heading">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.map((teacher) => (
                <tr key={teacher.id} className="border-b border-accent/10 hover:bg-soft/30 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                        <GraduationCap className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-text-heading">{teacher.name}</p>
                        <p className="text-sm text-text-body/70">{teacher.specialization}</p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 space-x-reverse text-sm text-text-body">
                        <Mail className="h-4 w-4" />
                        <span>{teacher.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse text-sm text-text-body">
                        <Phone className="h-4 w-4" />
                        <span>{teacher.phone}</span>
                      </div>
                    </div>
                  </td>
                  
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-text-heading">{teacher.department}</p>
                      <div className="flex items-center space-x-2 space-x-reverse text-sm text-text-body/70">
                        <Calendar className="h-4 w-4" />
                        <span>عضویت: {teacher.joinDate}</span>
                      </div>
                    </div>
                  </td>
                  
                  <td className="py-4 px-6">
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                        <span>{teacher.examsCreated} آزمون</span>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Users className="h-4 w-4 text-green-600" />
                        <span>{teacher.studentsCount} دانشجو</span>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <span className="text-yellow-500">⭐</span>
                        <span>{teacher.averageRating}</span>
                      </div>
                    </div>
                  </td>
                  
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(teacher.status)}`}>
                      {getStatusText(teacher.status)}
                    </span>
                  </td>
                  
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center space-x-2 space-x-reverse">
                      <button
                        onClick={() => handleViewTeacher(teacher)}
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

      {/* Teacher Detail Modal */}
      {showTeacherModal && selectedTeacher && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-hero max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-accent/20">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-text-heading">جزئیات مدرس</h2>
                <button
                  onClick={() => setShowTeacherModal(false)}
                  className="p-2 hover:bg-soft/50 rounded-xl transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Teacher Info */}
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text-heading">{selectedTeacher.name}</h3>
                  <p className="text-text-body">{selectedTeacher.specialization}</p>
                  <p className="text-text-body/70">{selectedTeacher.department}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-soft/30 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{selectedTeacher.examsCreated}</div>
                  <div className="text-sm text-text-body/70">آزمون ایجاد شده</div>
                </div>
                <div className="bg-soft/30 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{selectedTeacher.studentsCount}</div>
                  <div className="text-sm text-text-body/70">دانشجو</div>
                </div>
                <div className="bg-soft/30 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">{selectedTeacher.averageRating}</div>
                  <div className="text-sm text-text-body/70">امتیاز رضایت</div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-text-heading mb-3">اطلاعات تماس</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 space-x-reverse text-sm">
                      <Mail className="h-4 w-4 text-text-body/60" />
                      <span>{selectedTeacher.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse text-sm">
                      <Phone className="h-4 w-4 text-text-body/60" />
                      <span>{selectedTeacher.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse text-sm">
                      <Calendar className="h-4 w-4 text-text-body/60" />
                      <span>عضویت: {selectedTeacher.joinDate}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-text-heading mb-3">فعالیت اخیر</h4>
                  <div className="space-y-2 text-sm">
                    <p>آخرین ورود: {selectedTeacher.lastActivity}</p>
                    <p>وضعیت: <span className={getStatusText(selectedTeacher.status) === 'فعال' ? 'text-green-600' : 'text-red-600'}>{getStatusText(selectedTeacher.status)}</span></p>
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
                <button className="border border-red-300 text-red-600 px-6 py-3 rounded-2xl hover:bg-red-50 transition-colors">
                  تعلیق حساب
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Teacher Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-hero max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-accent/20">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-text-heading">افزودن مدرس جدید</h2>
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
                    value={newTeacher.name}
                    onChange={(e) => setNewTeacher(prev => ({ ...prev, name: e.target.value }))}
                    className="input-field"
                    placeholder="نام کامل مدرس"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-heading mb-2">
                    ایمیل
                  </label>
                  <input
                    type="email"
                    value={newTeacher.email}
                    onChange={(e) => setNewTeacher(prev => ({ ...prev, email: e.target.value }))}
                    className="input-field"
                    placeholder="ایمیل مدرس"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-heading mb-2">
                    شماره تماس
                  </label>
                  <input
                    type="text"
                    value={newTeacher.phone}
                    onChange={(e) => setNewTeacher(prev => ({ ...prev, phone: e.target.value }))}
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
                    value={newTeacher.department}
                    onChange={(e) => setNewTeacher(prev => ({ ...prev, department: e.target.value }))}
                    className="input-field"
                    placeholder="نام دانشکده"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-heading mb-2">
                    تخصص
                  </label>
                  <input
                    type="text"
                    value={newTeacher.specialization}
                    onChange={(e) => setNewTeacher(prev => ({ ...prev, specialization: e.target.value }))}
                    className="input-field"
                    placeholder="حوزه تخصصی"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-heading mb-2">
                    رمز عبور موقت
                  </label>
                  <input
                    type="password"
                    value={newTeacher.password}
                    onChange={(e) => setNewTeacher(prev => ({ ...prev, password: e.target.value }))}
                    className="input-field"
                    placeholder="رمز عبور اولیه"
                  />
                </div>
              </div>

              <div className="flex space-x-4 space-x-reverse pt-4 border-t border-accent/20">
                <button 
                  onClick={handleAddTeacher}
                  className="btn-primary flex-1 flex items-center justify-center space-x-2 space-x-reverse"
                >
                  <Save className="h-5 w-5" />
                  <span>ذخیره مدرس</span>
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

export default AdminTeachers;