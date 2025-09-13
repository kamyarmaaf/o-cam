import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Users, 
  User,
  Search,
  Filter,
  Calendar,
  Clock,
  Bell,
  Plus,
  Eye,
  Trash2,
  Edit,
  X
} from 'lucide-react';

const TeacherMessages: React.FC = () => {
  const [activeTab, setActiveTab] = useState('inbox');
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const messages = [
    {
      id: 1,
      type: 'received',
      from: 'سینا داوودی',
      studentId: 'STU-2023-001',
      subject: 'سوال در مورد آزمون ریاضی',
      content: 'سلام استاد محترم، در مورد سوال شماره 15 آزمون ریاضی سوالی دارم. آیا امکان توضیح بیشتر وجود دارد؟',
      timestamp: '۱۴۰۳/۰۹/۲۰ - ۱۴:۳۰',
      isRead: false,
      priority: 'normal'
    },
    {
      id: 2,
      type: 'sent',
      to: 'همه دانشجویان کلاس A',
      subject: 'یادآوری آزمون فردا',
      content: 'دانشجویان عزیز، یادآوری می‌کنم که آزمون ریاضی عمومی فردا ساعت 10 صبح برگزار خواهد شد.',
      timestamp: '۱۴۰۳/۰۹/۱۹ - ۱۶:۰۰',
      isRead: true,
      priority: 'high',
      recipients: 45
    },
    {
      id: 3,
      type: 'received',
      from: 'سارا احمدی',
      studentId: 'STU-2023-002',
      subject: 'درخواست تمدید مهلت تکلیف',
      content: 'استاد محترم، به دلیل مشکلات فنی امکان ارسال تکلیف در موعد مقرر برایم فراهم نشد. آیا امکان تمدید مهلت وجود دارد؟',
      timestamp: '۱۴۰۳/۰۹/۱۸ - ۱۱:۱۵',
      isRead: true,
      priority: 'normal'
    }
  ];

  const notifications = [
    {
      id: 1,
      title: 'یادآوری آزمون ریاضی',
      content: 'آزمون ریاضی عمومی فردا ساعت 10:00 برگزار می‌شود',
      scheduledFor: '۱۴۰۳/۰۹/۲۱ - ۰۸:۰۰',
      status: 'scheduled',
      recipients: 'کلاس A (45 نفر)'
    },
    {
      id: 2,
      title: 'اعلام نمرات آزمون فیزیک',
      content: 'نمرات آزمون فیزیک کوانتوم اعلام شد',
      scheduledFor: '۱۴۰۳/۰۹/۲۰ - ۱۸:۰۰',
      status: 'sent',
      recipients: 'کلاس B (38 نفر)'
    }
  ];

  const [composeData, setComposeData] = useState({
    recipient: 'all',
    subject: '',
    content: '',
    priority: 'normal',
    scheduleType: 'now'
  });

  const handleSendMessage = () => {
    console.log('Sending message:', composeData);
    setShowComposeModal(false);
    setComposeData({
      recipient: 'all',
      subject: '',
      content: '',
      priority: 'normal',
      scheduleType: 'now'
    });
  };

  const filteredMessages = messages.filter(message => 
    message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (message.from && message.from.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (message.to && message.to.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-heading mb-2">پیام‌ها و اطلاع‌رسانی</h1>
          <p className="text-text-body">مدیریت ارتباط با دانشجویان و ارسال اطلاع‌رسانی‌ها</p>
        </div>
        
        <button 
          onClick={() => setShowComposeModal(true)}
          className="btn-primary flex items-center space-x-2 space-x-reverse mt-4 lg:mt-0"
        >
          <Plus className="h-5 w-5" />
          <span>پیام جدید</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-body mb-1">پیام‌های جدید</p>
              <p className="text-2xl font-bold text-primary">
                {messages.filter(m => m.type === 'received' && !m.isRead).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-body mb-1">پیام‌های ارسالی</p>
              <p className="text-2xl font-bold text-blue-600">
                {messages.filter(m => m.type === 'sent').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <Send className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-body mb-1">اطلاع‌رسانی‌های برنامه‌ریزی شده</p>
              <p className="text-2xl font-bold text-green-600">
                {notifications.filter(n => n.status === 'scheduled').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
              <Bell className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-body mb-1">کل گیرندگان</p>
              <p className="text-2xl font-bold text-purple-600">83</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="flex space-x-1 space-x-reverse mb-6 bg-soft/50 p-1 rounded-2xl">
          {[
            { id: 'inbox', label: 'صندوق ورودی', icon: MessageSquare },
            { id: 'sent', label: 'ارسال شده', icon: Send },
            { id: 'notifications', label: 'اطلاع‌رسانی‌ها', icon: Bell }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 space-x-reverse py-3 px-4 rounded-xl transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-white text-primary shadow-soft'
                  : 'text-text-body hover:text-primary'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-body/40 h-5 w-5" />
            <input
              type="text"
              placeholder="جستجو در پیام‌ها..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pr-10"
            />
          </div>
        </div>

        {/* Messages List */}
        {activeTab === 'inbox' && (
          <div className="space-y-4">
            {filteredMessages.filter(m => m.type === 'received').map((message) => (
              <div 
                key={message.id} 
                className={`border rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:shadow-soft ${
                  !message.isRead ? 'border-primary/30 bg-primary/5' : 'border-accent/20'
                }`}
                onClick={() => setSelectedMessage(message)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 space-x-reverse mb-2">
                      <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-text-heading">{message.from}</p>
                        <p className="text-sm text-text-body/70">{message.studentId}</p>
                      </div>
                      {!message.isRead && (
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                      )}
                    </div>
                    <h3 className="font-medium text-text-heading mb-2">{message.subject}</h3>
                    <p className="text-text-body text-sm line-clamp-2">{message.content}</p>
                  </div>
                  <div className="text-sm text-text-body/70">
                    {message.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sent Messages */}
        {activeTab === 'sent' && (
          <div className="space-y-4">
            {filteredMessages.filter(m => m.type === 'sent').map((message) => (
              <div 
                key={message.id} 
                className="border border-accent/20 rounded-2xl p-4 hover:shadow-soft transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 space-x-reverse mb-2">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-text-heading">{message.to}</p>
                        {message.recipients && (
                          <p className="text-sm text-text-body/70">{message.recipients} گیرنده</p>
                        )}
                      </div>
                      {message.priority === 'high' && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                          مهم
                        </span>
                      )}
                    </div>
                    <h3 className="font-medium text-text-heading mb-2">{message.subject}</h3>
                    <p className="text-text-body text-sm line-clamp-2">{message.content}</p>
                  </div>
                  <div className="text-sm text-text-body/70">
                    {message.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Notifications */}
        {activeTab === 'notifications' && (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className="border border-accent/20 rounded-2xl p-4 hover:shadow-soft transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 space-x-reverse mb-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        notification.status === 'scheduled' 
                          ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' 
                          : 'bg-gradient-to-r from-green-500 to-green-600'
                      }`}>
                        <Bell className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-text-heading">{notification.title}</p>
                        <p className="text-sm text-text-body/70">{notification.recipients}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        notification.status === 'scheduled'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {notification.status === 'scheduled' ? 'برنامه‌ریزی شده' : 'ارسال شده'}
                      </span>
                    </div>
                    <p className="text-text-body text-sm mb-2">{notification.content}</p>
                    <div className="flex items-center space-x-2 space-x-reverse text-sm text-text-body/70">
                      <Calendar className="h-4 w-4" />
                      <span>{notification.scheduledFor}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Compose Message Modal */}
      {showComposeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-hero max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-accent/20">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-text-heading">پیام جدید</h2>
                <button
                  onClick={() => setShowComposeModal(false)}
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
                    گیرنده
                  </label>
                  <select
                    value={composeData.recipient}
                    onChange={(e) => setComposeData(prev => ({ ...prev, recipient: e.target.value }))}
                    className="input-field"
                  >
                    <option value="all">همه دانشجویان</option>
                    <option value="class-a">کلاس A</option>
                    <option value="class-b">کلاس B</option>
                    <option value="individual">دانشجوی خاص</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-heading mb-2">
                    اولویت
                  </label>
                  <select
                    value={composeData.priority}
                    onChange={(e) => setComposeData(prev => ({ ...prev, priority: e.target.value }))}
                    className="input-field"
                  >
                    <option value="normal">عادی</option>
                    <option value="high">مهم</option>
                    <option value="urgent">فوری</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-heading mb-2">
                  موضوع
                </label>
                <input
                  type="text"
                  value={composeData.subject}
                  onChange={(e) => setComposeData(prev => ({ ...prev, subject: e.target.value }))}
                  className="input-field"
                  placeholder="موضوع پیام را وارد کنید"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-heading mb-2">
                  متن پیام
                </label>
                <textarea
                  value={composeData.content}
                  onChange={(e) => setComposeData(prev => ({ ...prev, content: e.target.value }))}
                  rows={6}
                  className="input-field resize-none"
                  placeholder="متن پیام خود را اینجا بنویسید..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-heading mb-2">
                  زمان ارسال
                </label>
                <div className="flex space-x-4 space-x-reverse">
                  <label className="flex items-center space-x-2 space-x-reverse">
                    <input
                      type="radio"
                      name="scheduleType"
                      value="now"
                      checked={composeData.scheduleType === 'now'}
                      onChange={(e) => setComposeData(prev => ({ ...prev, scheduleType: e.target.value }))}
                      className="text-primary focus:ring-primary"
                    />
                    <span>ارسال فوری</span>
                  </label>
                  <label className="flex items-center space-x-2 space-x-reverse">
                    <input
                      type="radio"
                      name="scheduleType"
                      value="scheduled"
                      checked={composeData.scheduleType === 'scheduled'}
                      onChange={(e) => setComposeData(prev => ({ ...prev, scheduleType: e.target.value }))}
                      className="text-primary focus:ring-primary"
                    />
                    <span>برنامه‌ریزی شده</span>
                  </label>
                </div>
              </div>

              {composeData.scheduleType === 'scheduled' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-heading mb-2">
                      تاریخ ارسال
                    </label>
                    <input
                      type="date"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-heading mb-2">
                      ساعت ارسال
                    </label>
                    <input
                      type="time"
                      className="input-field"
                    />
                  </div>
                </div>
              )}

              <div className="flex space-x-4 space-x-reverse pt-4 border-t border-accent/20">
                <button 
                  onClick={handleSendMessage}
                  className="btn-primary flex-1 flex items-center justify-center space-x-2 space-x-reverse"
                >
                  <Send className="h-5 w-5" />
                  <span>{composeData.scheduleType === 'now' ? 'ارسال' : 'برنامه‌ریزی'}</span>
                </button>
                <button 
                  onClick={() => setShowComposeModal(false)}
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

export default TeacherMessages;