import React, { useState, useEffect } from 'react';
import { violationService } from '../../services/violationService';
import { 
  Camera, 
  AlertTriangle, 
  Shield, 
  Eye, 
  Download,
  Filter,
  Search,
  Calendar,
  User,
  Clock,
  X,
  CheckCircle
} from 'lucide-react';

const AdminViolations: React.FC = () => {
  const [violations, setViolations] = useState<any[]>([]);
  const [filteredViolations, setFilteredViolations] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [selectedViolation, setSelectedViolation] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    // Load violations from service and localStorage
    const loadViolations = () => {
      const storedNotifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
      const serviceNotifications = violationService.getAdminNotifications();
      
      const allViolations = [...storedNotifications, ...serviceNotifications];
      const uniqueViolations = allViolations.filter((violation, index, self) => 
        index === self.findIndex(v => v.id === violation.id)
      );

      setViolations(uniqueViolations);
      setFilteredViolations(uniqueViolations);
    };

    loadViolations();
    const interval = setInterval(loadViolations, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let filtered = violations.filter(violation => {
      const matchesSearch = violation.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           violation.examTitle.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filterType === 'all' || violation.type === filterType;
      const matchesSeverity = filterSeverity === 'all' || violation.severity === filterSeverity;
      
      return matchesSearch && matchesType && matchesSeverity;
    });

    setFilteredViolations(filtered);
  }, [violations, searchTerm, filterType, filterSeverity]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ejection':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'violation':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTime = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleString('fa-IR');
  };

  const handleViewDetails = (violation: any) => {
    setSelectedViolation(violation);
    setShowDetailModal(true);
    
    // Mark as read
    if (!violation.isRead) {
      violationService.markNotificationAsRead(violation.id);
      violation.isRead = true;
    }
  };

  const exportViolations = () => {
    const csvContent = [
      ['نام دانشجو', 'شناسه', 'آزمون', 'نوع تخلف', 'شدت', 'زمان', 'جزئیات'].join(','),
      ...filteredViolations.map(v => [
        v.studentName,
        v.studentId,
        v.examTitle,
        v.type === 'ejection' ? 'حذف' : 'تخلف',
        v.severity,
        formatTime(v.timestamp),
        v.details.replace(/,/g, ';')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `violations_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-heading mb-2">مدیریت تخلفات</h1>
          <p className="text-text-body">نظارت بر تخلفات آزمون‌ها و مدیریت موارد مشکوک</p>
        </div>
        
        <button 
          onClick={exportViolations}
          className="btn-primary flex items-center space-x-2 space-x-reverse mt-4 lg:mt-0"
        >
          <Download className="h-5 w-5" />
          <span>دانلود گزارش</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-body mb-1">کل تخلفات</p>
              <p className="text-2xl font-bold text-red-600">
                {violations.filter(v => v.type === 'violation').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-body mb-1">دانشجویان حذف شده</p>
              <p className="text-2xl font-bold text-red-600">
                {violations.filter(v => v.type === 'ejection').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-body mb-1">آزمون‌های نظارت شده</p>
              <p className="text-2xl font-bold text-blue-600">
                {new Set(violations.map(v => v.examId)).size}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <Camera className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-body mb-1">موارد بررسی نشده</p>
              <p className="text-2xl font-bold text-yellow-600">
                {violations.filter(v => !v.isRead).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center">
              <Eye className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-body/40 h-5 w-5" />
            <input
              type="text"
              placeholder="جستجو در تخلفات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pr-10"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="input-field"
          >
            <option value="all">همه انواع</option>
            <option value="violation">تخلفات</option>
            <option value="ejection">حذف شده‌ها</option>
          </select>

          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="input-field"
          >
            <option value="all">همه سطوح</option>
            <option value="critical">بحرانی</option>
            <option value="high">بالا</option>
            <option value="medium">متوسط</option>
            <option value="low">پایین</option>
          </select>

          <div className="text-sm text-text-body/70 flex items-center">
            {filteredViolations.length} مورد یافت شد
          </div>
        </div>
      </div>

      {/* Violations Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-accent/20">
                <th className="text-right py-4 px-6 font-semibold text-text-heading">دانشجو</th>
                <th className="text-right py-4 px-6 font-semibold text-text-heading">آزمون</th>
                <th className="text-right py-4 px-6 font-semibold text-text-heading">نوع تخلف</th>
                <th className="text-right py-4 px-6 font-semibold text-text-heading">شدت</th>
                <th className="text-right py-4 px-6 font-semibold text-text-heading">زمان</th>
                <th className="text-center py-4 px-6 font-semibold text-text-heading">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredViolations.map((violation) => (
                <tr key={violation.id} className={`border-b border-accent/10 hover:bg-soft/30 transition-colors ${!violation.isRead ? 'bg-primary/5' : ''}`}>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-text-heading">{violation.studentName}</p>
                        <p className="text-sm text-text-body/70">{violation.studentId}</p>
                      </div>
                      {!violation.isRead && (
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      )}
                    </div>
                  </td>
                  
                  <td className="py-4 px-6">
                    <p className="font-medium text-text-heading">{violation.examTitle}</p>
                    <p className="text-sm text-text-body/70">شناسه: {violation.examId}</p>
                  </td>
                  
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(violation.type)}`}>
                      {violation.type === 'ejection' ? 'حذف از آزمون' : 'تشخیص چند چهره'}
                    </span>
                  </td>
                  
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(violation.severity)}`}>
                      {violation.severity === 'critical' ? 'بحرانی' :
                       violation.severity === 'high' ? 'بالا' :
                       violation.severity === 'medium' ? 'متوسط' : 'پایین'}
                    </span>
                  </td>
                  
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2 space-x-reverse text-sm text-text-body">
                      <Clock className="h-4 w-4" />
                      <span>{formatTime(violation.timestamp)}</span>
                    </div>
                  </td>
                  
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center space-x-2 space-x-reverse">
                      <button
                        onClick={() => handleViewDetails(violation)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                        title="مشاهده جزئیات"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {violation.screenshot && (
                        <button
                          className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition-colors"
                          title="دانلود تصویر"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedViolation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-hero max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-accent/20">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-text-heading">جزئیات تخلف</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 hover:bg-soft/50 rounded-xl transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Violation Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-soft/30 rounded-2xl p-4">
                  <h3 className="font-semibold text-text-heading mb-3">اطلاعات دانشجو</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-body/70">نام:</span>
                      <span className="font-medium">{selectedViolation.studentName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-body/70">شناسه:</span>
                      <span className="font-medium">{selectedViolation.studentId}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-soft/30 rounded-2xl p-4">
                  <h3 className="font-semibold text-text-heading mb-3">اطلاعات آزمون</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-body/70">عنوان:</span>
                      <span className="font-medium">{selectedViolation.examTitle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-body/70">شناسه:</span>
                      <span className="font-medium">{selectedViolation.examId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-body/70">زمان:</span>
                      <span className="font-medium">{formatTime(selectedViolation.timestamp)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Violation Details */}
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                <h3 className="font-semibold text-red-800 mb-3 flex items-center space-x-2 space-x-reverse">
                  <AlertTriangle className="h-5 w-5" />
                  <span>جزئیات تخلف</span>
                </h3>
                <p className="text-red-700">{selectedViolation.details}</p>
              </div>

              {/* Screenshot */}
              {selectedViolation.screenshot && (
                <div>
                  <h3 className="font-semibold text-text-heading mb-3">تصویر ضبط شده</h3>
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <img 
                      src={selectedViolation.screenshot} 
                      alt="تصویر تخلف"
                      className="w-full max-w-lg mx-auto rounded-xl border border-gray-200"
                    />
                    <div className="flex items-center justify-center mt-4">
                      <button className="btn-secondary flex items-center space-x-2 space-x-reverse">
                        <Download className="h-4 w-4" />
                        <span>دانلود تصویر اصلی</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-4 space-x-reverse pt-4 border-t border-accent/20">
                <button className="btn-primary flex-1">
                  بررسی دقیق‌تر
                </button>
                <button className="btn-secondary flex-1">
                  ارسال هشدار
                </button>
                <button 
                  onClick={() => setShowDetailModal(false)}
                  className="border border-accent/30 text-text-body px-6 py-3 rounded-2xl hover:bg-soft/50 transition-colors"
                >
                  بستن
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredViolations.length === 0 && (
        <div className="text-center py-12">
          <Shield className="h-16 w-16 text-text-body/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-heading mb-2">
            تخلفی یافت نشد
          </h3>
          <p className="text-text-body">
            {violations.length === 0 
              ? 'هنوز تخلفی در سیستم ثبت نشده است'
              : 'با فیلترهای انتخابی تخلفی یافت نشد'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminViolations;