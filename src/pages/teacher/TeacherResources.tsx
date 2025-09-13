import React, { useState } from 'react';
import { 
  FolderOpen, 
  Upload, 
  FileText, 
  Image, 
  Video,
  Link,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Calendar,
  Users,
  Share2,
  X
} from 'lucide-react';

const TeacherResources: React.FC = () => {
  const [activeTab, setActiveTab] = useState('files');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const resources = [
    {
      id: 1,
      name: 'جزوه ریاضی عمومی - فصل 1',
      type: 'pdf',
      size: '2.5 MB',
      category: 'جزوات',
      uploadDate: '۱۴۰۳/۰۹/۱۵',
      downloads: 45,
      isPublic: true,
      description: 'جزوه کامل فصل اول ریاضی عمومی شامل مثال‌ها و تمرین‌ها'
    },
    {
      id: 2,
      name: 'ویدیو آموزشی - مشتق',
      type: 'video',
      size: '125 MB',
      category: 'ویدیوها',
      uploadDate: '۱۴۰۳/۰۹/۱۰',
      downloads: 32,
      isPublic: true,
      description: 'ویدیو آموزشی کامل در مورد مفهوم مشتق و کاربردهای آن'
    },
    {
      id: 3,
      name: 'تصاویر نمودارهای ریاضی',
      type: 'image',
      size: '5.8 MB',
      category: 'تصاویر',
      uploadDate: '۱۴۰۳/۰۹/۰۸',
      downloads: 28,
      isPublic: false,
      description: 'مجموعه تصاویر نمودارهای مختلف ریاضی برای استفاده در کلاس'
    },
    {
      id: 4,
      name: 'لینک به کتاب آنلاین',
      type: 'link',
      size: '-',
      category: 'لینک‌ها',
      uploadDate: '۱۴۰۳/۰۹/۰۵',
      downloads: 67,
      isPublic: true,
      description: 'لینک به کتاب آنلاین ریاضی عمومی با دسترسی رایگان'
    }
  ];

  const categories = [
    { value: 'all', label: 'همه فایل‌ها', count: resources.length },
    { value: 'جزوات', label: 'جزوات', count: resources.filter(r => r.category === 'جزوات').length },
    { value: 'ویدیوها', label: 'ویدیوها', count: resources.filter(r => r.category === 'ویدیوها').length },
    { value: 'تصاویر', label: 'تصاویر', count: resources.filter(r => r.category === 'تصاویر').length },
    { value: 'لینک‌ها', label: 'لینک‌ها', count: resources.filter(r => r.category === 'لینک‌ها').length }
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-8 w-8 text-red-600" />;
      case 'video':
        return <Video className="h-8 w-8 text-purple-600" />;
      case 'image':
        return <Image className="h-8 w-8 text-green-600" />;
      case 'link':
        return <Link className="h-8 w-8 text-blue-600" />;
      default:
        return <FileText className="h-8 w-8 text-gray-600" />;
    }
  };

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case 'pdf':
        return 'bg-red-100 text-red-800';
      case 'video':
        return 'bg-purple-100 text-purple-800';
      case 'image':
        return 'bg-green-100 text-green-800';
      case 'link':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    console.log('Dropped files:', files);
    // Handle file upload logic here
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-heading mb-2">منابع آموزشی</h1>
          <p className="text-text-body">مدیریت فایل‌ها و منابع آموزشی کلاس‌های شما</p>
        </div>
        
        <button 
          onClick={() => setShowUploadModal(true)}
          className="btn-primary flex items-center space-x-2 space-x-reverse mt-4 lg:mt-0"
        >
          <Plus className="h-5 w-5" />
          <span>افزودن منبع جدید</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-body mb-1">کل فایل‌ها</p>
              <p className="text-2xl font-bold text-primary">{resources.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center">
              <FolderOpen className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-body mb-1">فایل‌های عمومی</p>
              <p className="text-2xl font-bold text-green-600">
                {resources.filter(r => r.isPublic).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
              <Share2 className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-body mb-1">کل دانلودها</p>
              <p className="text-2xl font-bold text-blue-600">
                {resources.reduce((sum, r) => sum + r.downloads, 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <Download className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-body mb-1">حجم کل</p>
              <p className="text-2xl font-bold text-purple-600">133.3 MB</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Upload className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Categories and Search */}
      <div className="card">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-body/40 h-5 w-5" />
              <input
                type="text"
                placeholder="جستجو در منابع..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pr-10"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2 space-x-reverse">
            <Filter className="h-5 w-5 text-text-body/40" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label} ({category.count})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <div key={resource.id} className="card hover:shadow-hero transition-all duration-300 group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="w-12 h-12 bg-soft/50 rounded-2xl flex items-center justify-center">
                  {getFileIcon(resource.type)}
                </div>
                <div>
                  <h3 className="font-semibold text-text-heading group-hover:text-primary transition-colors line-clamp-1">
                    {resource.name}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getFileTypeColor(resource.type)}`}>
                    {resource.type.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-1 space-x-reverse opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition-colors">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <p className="text-text-body text-sm mb-4 line-clamp-2">
              {resource.description}
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-text-body/70">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Calendar className="h-4 w-4" />
                  <span>{resource.uploadDate}</span>
                </div>
                <span>{resource.size}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2 space-x-reverse text-text-body/70">
                  <Download className="h-4 w-4" />
                  <span>{resource.downloads} دانلود</span>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  {resource.isPublic ? (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      عمومی
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                      خصوصی
                    </span>
                  )}
                </div>
              </div>

              <button className="w-full btn-primary">
                <Download className="h-4 w-4 ml-2" />
                دانلود
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-hero max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-accent/20">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-text-heading">افزودن منبع جدید</h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 hover:bg-soft/50 rounded-xl transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Upload Area */}
              <div 
                className={`border-2 border-dashed rounded-3xl p-8 text-center transition-colors ${
                  dragOver 
                    ? 'border-primary bg-primary/10' 
                    : 'border-accent/30 hover:border-primary/50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  multiple
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.mp4,.avi"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Upload className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-lg font-medium text-text-heading mb-2">
                    فایل‌ها را اینجا بکشید یا کلیک کنید
                  </p>
                  <p className="text-text-body text-sm">
                    فرمت‌های پشتیبانی شده: PDF, Word, تصاویر, ویدیو
                  </p>
                </label>
              </div>

              {/* Resource Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-heading mb-2">
                    نام منبع
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="نام منبع را وارد کنید"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-heading mb-2">
                    دسته‌بندی
                  </label>
                  <select className="input-field">
                    <option value="">انتخاب دسته‌بندی</option>
                    <option value="جزوات">جزوات</option>
                    <option value="ویدیوها">ویدیوها</option>
                    <option value="تصاویر">تصاویر</option>
                    <option value="لینک‌ها">لینک‌ها</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-heading mb-2">
                  توضیحات
                </label>
                <textarea
                  rows={4}
                  className="input-field resize-none"
                  placeholder="توضیحات منبع را وارد کنید"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-heading mb-2">
                    کلاس‌های مجاز
                  </label>
                  <select className="input-field">
                    <option value="all">همه کلاس‌ها</option>
                    <option value="class-a">کلاس A</option>
                    <option value="class-b">کلاس B</option>
                    <option value="class-c">کلاس C</option>
                  </select>
                </div>

                <div className="flex items-center space-x-3 space-x-reverse pt-6">
                  <input
                    type="checkbox"
                    id="isPublic"
                    className="rounded border-accent/30 text-primary focus:ring-primary"
                  />
                  <label htmlFor="isPublic" className="text-text-body">
                    قابل دسترسی برای دانشجویان
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 space-x-reverse pt-4 border-t border-accent/20">
                <button className="btn-primary flex-1 flex items-center justify-center space-x-2 space-x-reverse">
                  <Upload className="h-5 w-5" />
                  <span>بارگذاری منبع</span>
                </button>
                <button 
                  onClick={() => setShowUploadModal(false)}
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

export default TeacherResources;