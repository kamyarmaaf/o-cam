import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  Eye, 
  X, 
  Clock,
  User,
  Camera,
  Download,
  Shield,
  CheckCircle
} from 'lucide-react';
import { violationService } from '../services/violationService';

interface AdminViolationNotificationsProps {
  className?: string;
}

const AdminViolationNotifications: React.FC<AdminViolationNotificationsProps> = ({ className = '' }) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Load notifications from localStorage and service
  useEffect(() => {
    const loadNotifications = () => {
      const storedNotifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
      const serviceNotifications = violationService.getAdminNotifications();
      
      // Combine and deduplicate notifications
      const allNotifications = [...storedNotifications, ...serviceNotifications];
      const uniqueNotifications = allNotifications.filter((notification, index, self) => 
        index === self.findIndex(n => n.id === notification.id)
      );

      setNotifications(uniqueNotifications);
      setUnreadCount(uniqueNotifications.filter(n => !n.isRead).length);
    };

    loadNotifications();

    // Poll for new notifications every 5 seconds
    const interval = setInterval(loadNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ejection':
        return <Shield className="h-5 w-5 text-red-600" />;
      case 'violation':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const handleNotificationClick = (notification: any) => {
    setSelectedNotification(notification);
    setShowDetailModal(true);
    
    // Mark as read
    if (!notification.isRead) {
      violationService.markNotificationAsRead(notification.id);
      notification.isRead = true;
      setUnreadCount(prev => prev - 1);
      
      // Update localStorage
      const updatedNotifications = notifications.map(n => 
        n.id === notification.id ? { ...n, isRead: true } : n
      );
      localStorage.setItem('adminNotifications', JSON.stringify(updatedNotifications));
    }
  };

  const formatTime = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleString('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <div className={`relative ${className}`}>
        {/* Notification Bell */}
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-3 bg-white/90 backdrop-blur-lg rounded-2xl shadow-soft border border-white/20 hover:shadow-card transition-all duration-300"
        >
          <Bell className="h-6 w-6 text-text-heading" />
          {unreadCount > 0 && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">{unreadCount}</span>
            </div>
          )}
        </button>

        {/* Notifications Dropdown */}
        {showNotifications && (
          <div className="absolute top-full left-0 mt-2 w-96 bg-white rounded-3xl shadow-hero border border-white/20 z-50 max-h-96 overflow-hidden">
            <div className="p-4 border-b border-accent/20">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-text-heading">اعلان‌های سیستم</h3>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-1 hover:bg-soft/50 rounded-lg transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center">
                  <Bell className="h-12 w-12 text-text-body/30 mx-auto mb-3" />
                  <p className="text-text-body/70">اعلانی وجود ندارد</p>
                </div>
              ) : (
                <div className="space-y-1 p-2">
                  {notifications.slice(0, 10).map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-3 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-soft/50 ${
                        !notification.isRead ? 'bg-primary/5 border-r-4 border-primary' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3 space-x-reverse">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          notification.type === 'ejection' ? 'bg-red-100' : 'bg-yellow-100'
                        }`}>
                          {getTypeIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 space-x-reverse mb-1">
                            <p className="font-medium text-text-heading text-sm truncate">
                              {notification.studentName}
                            </p>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(notification.severity)}`}>
                              {notification.type === 'ejection' ? 'حذف شده' : 'تخلف'}
                            </span>
                          </div>
                          <p className="text-xs text-text-body/70 line-clamp-2">
                            {notification.details}
                          </p>
                          <div className="flex items-center space-x-1 space-x-reverse text-xs text-text-body/50 mt-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatTime(notification.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {notifications.length > 10 && (
              <div className="p-3 border-t border-accent/20 text-center">
                <button className="text-primary hover:text-secondary transition-colors text-sm font-medium">
                  مشاهده همه اعلان‌ها
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Notification Detail Modal */}
      {showDetailModal && selectedNotification && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-hero max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-accent/20">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-text-heading">جزئیات تخلف</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 hover:bg-soft/50 rounded-xl transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Student Info */}
              <div className="bg-soft/30 rounded-2xl p-4">
                <div className="flex items-center space-x-3 space-x-reverse mb-3">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-text-heading">{selectedNotification.studentName}</h3>
                    <p className="text-text-body/70">شناسه: {selectedNotification.studentId}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(selectedNotification.severity)}`}>
                    {selectedNotification.type === 'ejection' ? 'حذف شده' : 'تخلف'}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-text-body/70">آزمون:</span>
                    <p className="font-medium">{selectedNotification.examTitle}</p>
                  </div>
                  <div>
                    <span className="text-text-body/70">زمان تخلف:</span>
                    <p className="font-medium">{formatTime(selectedNotification.timestamp)}</p>
                  </div>
                </div>
              </div>

              {/* Violation Details */}
              <div>
                <h4 className="font-semibold text-text-heading mb-3">جزئیات تخلف</h4>
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                  <p className="text-red-800">{selectedNotification.details}</p>
                </div>
              </div>

              {/* Screenshot */}
              {selectedNotification.screenshot && (
                <div>
                  <h4 className="font-semibold text-text-heading mb-3">تصویر ضبط شده</h4>
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <img 
                      src={selectedNotification.screenshot} 
                      alt="تصویر تخلف"
                      className="w-full max-w-md mx-auto rounded-xl border border-gray-200"
                    />
                    <div className="flex items-center justify-center mt-3">
                      <button className="btn-secondary flex items-center space-x-2 space-x-reverse">
                        <Download className="h-4 w-4" />
                        <span>دانلود تصویر</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-4 space-x-reverse pt-4 border-t border-accent/20">
                <button className="btn-primary flex-1">
                  بررسی بیشتر
                </button>
                <button 
                  onClick={() => setShowDetailModal(false)}
                  className="btn-secondary flex-1"
                >
                  بستن
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminViolationNotifications;