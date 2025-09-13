import React, { useState } from 'react';
import { 
  Plus, 
  Upload, 
  FileText, 
  Image, 
  Clock, 
  Users, 
  Settings,
  Save,
  Eye,
  Trash2,
  Copy,
  AlertCircle,
  CheckCircle,
  BookOpen
} from 'lucide-react';
import QuestionBank from '../../components/QuestionBank';
import { Question } from '../../data/sampleQuestions';

const TeacherExamCreate: React.FC = () => {
  const [examData, setExamData] = useState({
    title: '',
    description: '',
    subject: '',
    duration: 90,
    totalQuestions: 0,
    passingScore: 60,
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    randomizeQuestions: true,
    showResults: true,
    allowReview: true,
    maxAttempts: 1
  });

  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    type: 'multiple_choice',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    points: 1,
    explanation: ''
  });

  const [activeTab, setActiveTab] = useState('basic');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const questionTypes = [
    { value: 'multiple_choice', label: 'چندگزینه‌ای', icon: '📝' },
    { value: 'true_false', label: 'درست/نادرست', icon: '✅' },
    { value: 'short_answer', label: 'پاسخ کوتاه', icon: '📄' },
    { value: 'essay', label: 'تشریحی', icon: '📋' }
  ];

  const subjects = [
    'ریاضی',
    'فیزیک', 
    'شیمی',
    'زیست‌شناسی',
    'تاریخ',
    'جغرافیا',
    'ادبیات',
    'زبان انگلیسی'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setExamData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleQuestionChange = (field: string, value: any) => {
    setCurrentQuestion(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion(prev => ({
      ...prev,
      options: newOptions
    }));
  };

  const addQuestion = () => {
    if (!currentQuestion.question.trim()) {
      alert('لطفاً متن سوال را وارد کنید');
      return;
    }

    if (currentQuestion.type === 'multiple_choice' && currentQuestion.options.some(opt => !opt.trim())) {
      alert('لطفاً تمام گزینه‌ها را پر کنید');
      return;
    }

    const newQuestion: Question = {
      id: Date.now(),
      type: currentQuestion.type as any,
      subject: examData.subject || 'عمومی',
      topic: 'سایر',
      difficulty: 'متوسط',
      question: currentQuestion.question,
      options: currentQuestion.type === 'multiple_choice' ? currentQuestion.options : undefined,
      correctAnswer: currentQuestion.correctAnswer,
      points: currentQuestion.points,
      explanation: currentQuestion.explanation,
      timeEstimate: 2
    };

    setSelectedQuestions(prev => [...prev, newQuestion]);
    setCurrentQuestion({
      type: 'multiple_choice',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      points: 1,
      explanation: ''
    });
    
    setExamData(prev => ({
      ...prev,
      totalQuestions: prev.totalQuestions + 1
    }));
  };

  const removeQuestion = (id: number) => {
    setSelectedQuestions(prev => prev.filter(q => q.id !== id));
    setExamData(prev => ({
      ...prev,
      totalQuestions: prev.totalQuestions - 1
    }));
  };

  const handleSelectFromBank = (question: Question) => {
    if (!selectedQuestions.find(q => q.id === question.id)) {
      setSelectedQuestions(prev => [...prev, question]);
      setExamData(prev => ({
        ...prev,
        totalQuestions: prev.totalQuestions + 1
      }));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setIsProcessing(true);

    // Simulate file processing
    setTimeout(() => {
      // Mock extracted questions
      const extractedQuestions: Question[] = [
        {
          id: Date.now() + 1,
          type: 'multiple_choice',
          subject: examData.subject || 'عمومی',
          topic: 'استخراج شده از فایل',
          difficulty: 'متوسط',
          question: 'کدام یک از موارد زیر تعریف صحیح الگوریتم است؟',
          options: [
            'مجموعه‌ای از دستورات برای حل مسئله',
            'یک برنامه کامپیوتری',
            'زبان برنامه‌نویسی',
            'سیستم عامل'
          ],
          correctAnswer: 0,
          points: 2,
          explanation: 'الگوریتم مجموعه‌ای از دستورات منطقی برای حل یک مسئله است.',
          timeEstimate: 3
        },
        {
          id: Date.now() + 2,
          type: 'true_false',
          subject: examData.subject || 'عمومی',
          topic: 'استخراج شده از فایل',
          difficulty: 'آسان',
          question: 'پیچیدگی زمانی الگوریتم مرتب‌سازی حبابی O(n²) است.',
          correctAnswer: 0,
          points: 1,
          explanation: 'بله، الگوریتم مرتب‌سازی حبابی دارای پیچیدگی زمانی O(n²) است.',
          timeEstimate: 2
        }
      ];

      setSelectedQuestions(prev => [...prev, ...extractedQuestions]);
      setExamData(prev => ({
        ...prev,
        totalQuestions: prev.totalQuestions + extractedQuestions.length
      }));
      setIsProcessing(false);
    }, 3000);
  };

  const saveExam = () => {
    if (!examData.title.trim()) {
      alert('لطفاً عنوان آزمون را وارد کنید');
      return;
    }

    if (selectedQuestions.length === 0) {
      alert('لطفاً حداقل یک سوال اضافه کنید');
      return;
    }

    // Save exam logic here
    console.log('Saving exam:', { examData, questions: selectedQuestions });
    alert('آزمون با موفقیت ذخیره شد!');
  };

  const previewExam = () => {
    // Preview logic here
    console.log('Previewing exam:', { examData, questions: selectedQuestions });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-heading mb-2">ایجاد آزمون جدید</h1>
          <p className="text-text-body">آزمون جدید خود را طراحی و ایجاد کنید</p>
        </div>
        
        <div className="flex items-center space-x-4 space-x-reverse mt-4 lg:mt-0">
          <button 
            onClick={previewExam}
            className="btn-secondary flex items-center space-x-2 space-x-reverse"
          >
            <Eye className="h-5 w-5" />
            <span>پیش‌نمایش</span>
          </button>
          <button 
            onClick={saveExam}
            className="btn-primary flex items-center space-x-2 space-x-reverse"
          >
            <Save className="h-5 w-5" />
            <span>ذخیره آزمون</span>
          </button>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-text-heading">پیشرفت ایجاد آزمون</h3>
          <span className="text-sm text-text-body">
            {selectedQuestions.length} سوال اضافه شده
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className={`p-3 rounded-xl border-2 ${examData.title ? 'border-green-200 bg-green-50' : 'border-accent/30 bg-soft/30'}`}>
            <div className="flex items-center space-x-2 space-x-reverse">
              {examData.title ? <CheckCircle className="h-5 w-5 text-green-600" /> : <AlertCircle className="h-5 w-5 text-text-body/40" />}
              <span className="text-sm font-medium">اطلاعات پایه</span>
            </div>
          </div>
          <div className={`p-3 rounded-xl border-2 ${selectedQuestions.length > 0 ? 'border-green-200 bg-green-50' : 'border-accent/30 bg-soft/30'}`}>
            <div className="flex items-center space-x-2 space-x-reverse">
              {selectedQuestions.length > 0 ? <CheckCircle className="h-5 w-5 text-green-600" /> : <AlertCircle className="h-5 w-5 text-text-body/40" />}
              <span className="text-sm font-medium">سوالات</span>
            </div>
          </div>
          <div className={`p-3 rounded-xl border-2 ${examData.startDate ? 'border-green-200 bg-green-50' : 'border-accent/30 bg-soft/30'}`}>
            <div className="flex items-center space-x-2 space-x-reverse">
              {examData.startDate ? <CheckCircle className="h-5 w-5 text-green-600" /> : <AlertCircle className="h-5 w-5 text-text-body/40" />}
              <span className="text-sm font-medium">زمان‌بندی</span>
            </div>
          </div>
          <div className="p-3 rounded-xl border-2 border-accent/30 bg-soft/30">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Settings className="h-5 w-5 text-text-body/40" />
              <span className="text-sm font-medium">تنظیمات</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="flex space-x-1 space-x-reverse mb-6 bg-soft/50 p-1 rounded-2xl">
          {[
            { id: 'basic', label: 'اطلاعات پایه', icon: FileText },
            { id: 'questions', label: 'سوالات دستی', icon: Plus },
            { id: 'bank', label: 'بانک سوالات', icon: BookOpen },
            { id: 'upload', label: 'بارگذاری فایل', icon: Upload },
            { id: 'settings', label: 'تنظیمات', icon: Settings }
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

        {/* Basic Info Tab */}
        {activeTab === 'basic' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text-heading mb-2">
                  عنوان آزمون *
                </label>
                <input
                  type="text"
                  name="title"
                  value={examData.title}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="عنوان آزمون را وارد کنید"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-heading mb-2">
                  موضوع درس
                </label>
                <select
                  name="subject"
                  value={examData.subject}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="">انتخاب موضوع</option>
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-heading mb-2">
                توضیحات آزمون
              </label>
              <textarea
                name="description"
                value={examData.description}
                onChange={handleInputChange}
                rows={4}
                className="input-field resize-none"
                placeholder="توضیحات و راهنمای آزمون را وارد کنید"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-text-heading mb-2">
                  مدت زمان (دقیقه)
                </label>
                <input
                  type="number"
                  name="duration"
                  value={examData.duration}
                  onChange={handleInputChange}
                  className="input-field"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-heading mb-2">
                  نمره قبولی (%)
                </label>
                <input
                  type="number"
                  name="passingScore"
                  value={examData.passingScore}
                  onChange={handleInputChange}
                  className="input-field"
                  min="0"
                  max="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-heading mb-2">
                  حداکثر تلاش
                </label>
                <input
                  type="number"
                  name="maxAttempts"
                  value={examData.maxAttempts}
                  onChange={handleInputChange}
                  className="input-field"
                  min="1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text-heading mb-2">
                  تاریخ شروع
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={examData.startDate}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-heading mb-2">
                  ساعت شروع
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={examData.startTime}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
            </div>
          </div>
        )}

        {/* Manual Questions Tab */}
        {activeTab === 'questions' && (
          <div className="space-y-6">
            {/* Question Type Selection */}
            <div>
              <label className="block text-sm font-medium text-text-heading mb-3">
                نوع سوال
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {questionTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => handleQuestionChange('type', type.value)}
                    className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                      currentQuestion.type === type.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-accent/30 hover:border-primary/50'
                    }`}
                  >
                    <div className="text-2xl mb-2">{type.icon}</div>
                    <div className="text-sm font-medium">{type.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Question Input */}
            <div>
              <label className="block text-sm font-medium text-text-heading mb-2">
                متن سوال *
              </label>
              <textarea
                value={currentQuestion.question}
                onChange={(e) => handleQuestionChange('question', e.target.value)}
                rows={3}
                className="input-field resize-none"
                placeholder="متن سوال را وارد کنید"
              />
            </div>

            {/* Options for Multiple Choice */}
            {currentQuestion.type === 'multiple_choice' && (
              <div>
                <label className="block text-sm font-medium text-text-heading mb-3">
                  گزینه‌ها
                </label>
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-3 space-x-reverse">
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={currentQuestion.correctAnswer === index}
                        onChange={() => handleQuestionChange('correctAnswer', index)}
                        className="text-primary focus:ring-primary"
                      />
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        className="input-field flex-1"
                        placeholder={`گزینه ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* True/False Options */}
            {currentQuestion.type === 'true_false' && (
              <div>
                <label className="block text-sm font-medium text-text-heading mb-3">
                  پاسخ صحیح
                </label>
                <div className="flex space-x-4 space-x-reverse">
                  <label className="flex items-center space-x-2 space-x-reverse">
                    <input
                      type="radio"
                      name="tfAnswer"
                      checked={currentQuestion.correctAnswer === 0}
                      onChange={() => handleQuestionChange('correctAnswer', 0)}
                      className="text-primary focus:ring-primary"
                    />
                    <span>درست</span>
                  </label>
                  <label className="flex items-center space-x-2 space-x-reverse">
                    <input
                      type="radio"
                      name="tfAnswer"
                      checked={currentQuestion.correctAnswer === 1}
                      onChange={() => handleQuestionChange('correctAnswer', 1)}
                      className="text-primary focus:ring-primary"
                    />
                    <span>نادرست</span>
                  </label>
                </div>
              </div>
            )}

            {/* Points and Explanation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text-heading mb-2">
                  امتیاز سوال
                </label>
                <input
                  type="number"
                  value={currentQuestion.points}
                  onChange={(e) => handleQuestionChange('points', parseInt(e.target.value) || 1)}
                  className="input-field"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-heading mb-2">
                  توضیح پاسخ (اختیاری)
                </label>
                <input
                  type="text"
                  value={currentQuestion.explanation}
                  onChange={(e) => handleQuestionChange('explanation', e.target.value)}
                  className="input-field"
                  placeholder="توضیح پاسخ صحیح"
                />
              </div>
            </div>

            {/* Add Question Button */}
            <button
              onClick={addQuestion}
              className="btn-primary w-full flex items-center justify-center space-x-2 space-x-reverse"
            >
              <Plus className="h-5 w-5" />
              <span>افزودن سوال</span>
            </button>
          </div>
        )}

        {/* Question Bank Tab */}
        {activeTab === 'bank' && (
          <div>
            <QuestionBank 
              mode="select" 
              onSelectQuestion={handleSelectFromBank}
              selectedQuestions={selectedQuestions}
            />
          </div>
        )}

        {/* File Upload Tab */}
        {activeTab === 'upload' && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-text-heading mb-2">
                بارگذاری فایل سوالات
              </h3>
              <p className="text-text-body mb-6">
                فایل‌های PDF، Word یا تصاویر حاوی سوالات را بارگذاری کنید
              </p>
            </div>

            <div className="border-2 border-dashed border-accent/30 rounded-3xl p-8 text-center hover:border-primary/50 transition-colors">
              <input
                type="file"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-8 w-8 text-white" />
                </div>
                <p className="text-lg font-medium text-text-heading mb-2">
                  فایل را اینجا بکشید یا کلیک کنید
                </p>
                <p className="text-text-body text-sm">
                  فرمت‌های پشتیبانی شده: PDF, Word, JPG, PNG
                </p>
              </label>
            </div>

            {uploadedFile && (
              <div className="card bg-soft/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <FileText className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-medium text-text-heading">{uploadedFile.name}</p>
                      <p className="text-sm text-text-body">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  {isProcessing && (
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                      <span className="text-sm text-primary">در حال پردازش...</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {isProcessing && (
              <div className="card bg-blue-50 border-blue-200">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <div>
                    <p className="font-medium text-blue-800">در حال استخراج سوالات...</p>
                    <p className="text-sm text-blue-600">
                      سیستم در حال تشخیص و استخراج سوالات از فایل شما است
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text-heading">تنظیمات آزمون</h3>
                
                <label className="flex items-center space-x-3 space-x-reverse">
                  <input
                    type="checkbox"
                    checked={examData.randomizeQuestions}
                    onChange={(e) => setExamData(prev => ({ ...prev, randomizeQuestions: e.target.checked }))}
                    className="rounded border-accent/30 text-primary focus:ring-primary"
                  />
                  <span className="text-text-body">ترتیب تصادفی سوالات</span>
                </label>

                <label className="flex items-center space-x-3 space-x-reverse">
                  <input
                    type="checkbox"
                    checked={examData.showResults}
                    onChange={(e) => setExamData(prev => ({ ...prev, showResults: e.target.checked }))}
                    className="rounded border-accent/30 text-primary focus:ring-primary"
                  />
                  <span className="text-text-body">نمایش نتایج پس از اتمام</span>
                </label>

                <label className="flex items-center space-x-3 space-x-reverse">
                  <input
                    type="checkbox"
                    checked={examData.allowReview}
                    onChange={(e) => setExamData(prev => ({ ...prev, allowReview: e.target.checked }))}
                    className="rounded border-accent/30 text-primary focus:ring-primary"
                  />
                  <span className="text-text-body">امکان بازبینی پاسخ‌ها</span>
                </label>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text-heading">دسترسی</h3>
                
                <div>
                  <label className="block text-sm font-medium text-text-heading mb-2">
                    کلاس‌های مجاز
                  </label>
                  <select className="input-field">
                    <option>همه کلاس‌ها</option>
                    <option>کلاس A</option>
                    <option>کلاس B</option>
                    <option>کلاس C</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-heading mb-2">
                    رمز عبور آزمون (اختیاری)
                  </label>
                  <input
                    type="password"
                    className="input-field"
                    placeholder="رمز عبور برای ورود به آزمون"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Selected Questions List */}
      {selectedQuestions.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-text-heading">
              سوالات انتخاب شده ({selectedQuestions.length})
            </h3>
            <div className="text-sm text-text-body">
              مجموع امتیاز: {selectedQuestions.reduce((sum, q) => sum + q.points, 0)} نمره
            </div>
          </div>

          <div className="space-y-4">
            {selectedQuestions.map((question, index) => (
              <div key={question.id} className="border border-accent/20 rounded-2xl p-4 hover:shadow-soft transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 space-x-reverse mb-2">
                      <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <span className="px-3 py-1 bg-soft rounded-full text-sm font-medium">
                        {questionTypes.find(t => t.value === question.type)?.label}
                      </span>
                      <span className="text-sm text-text-body">
                        {question.points} نمره
                      </span>
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                        {question.subject}
                      </span>
                    </div>
                    
                    <p className="text-text-heading font-medium mb-2">{question.question}</p>
                    
                    {question.type === 'multiple_choice' && question.options && (
                      <div className="space-y-1">
                        {question.options.map((option: string, optIndex: number) => (
                          <div key={optIndex} className={`text-sm p-2 rounded-lg ${
                            optIndex === question.correctAnswer 
                              ? 'bg-green-50 text-green-800 border border-green-200' 
                              : 'text-text-body'
                          }`}>
                            {String.fromCharCode(65 + optIndex)}. {option}
                          </div>
                        ))}
                      </div>
                    )}

                    {question.explanation && (
                      <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>توضیح:</strong> {question.explanation}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 space-x-reverse">
                    <button
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                      title="کپی"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => removeQuestion(question.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherExamCreate;