import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Upload, 
  FileText, 
  Clock, 
  Settings,
  Save,
  Eye,
  Trash2,
  Copy,
  AlertCircle,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const TeacherExamEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [examData, setExamData] = useState({
    title: 'آزمون ریاضی عمومی',
    description: 'آزمون میان‌ترم درس ریاضی عمومی',
    subject: 'ریاضی',
    duration: 90,
    totalQuestions: 2,
    passingScore: 60,
    startDate: '2024-01-15',
    startTime: '10:00',
    endDate: '2024-01-15',
    endTime: '11:30',
    randomizeQuestions: true,
    showResults: true,
    allowReview: true,
    maxAttempts: 1
  });

  const [questions, setQuestions] = useState([
    {
      id: 1,
      type: 'multiple_choice',
      question: 'کدام یک از موارد زیر تعریف صحیح الگوریتم است؟',
      options: [
        'مجموعه‌ای از دستورات برای حل مسئله',
        'یک برنامه کامپیوتری',
        'زبان برنامه‌نویسی',
        'سیستم عامل'
      ],
      correctAnswer: 0,
      points: 2,
      explanation: 'الگوریتم مجموعه‌ای از دستورات منطقی برای حل یک مسئله است.'
    },
    {
      id: 2,
      type: 'true_false',
      question: 'پیچیدگی زمانی الگوریتم مرتب‌سازی حبابی O(n²) است.',
      options: ['درست', 'نادرست'],
      correctAnswer: 0,
      points: 1,
      explanation: 'بله، الگوریتم مرتب‌سازی حبابی دارای پیچیدگی زمانی O(n²) است.'
    }
  ]);

  const [currentQuestion, setCurrentQuestion] = useState({
    type: 'multiple_choice',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    points: 1,
    explanation: ''
  });

  const [activeTab, setActiveTab] = useState('basic');

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

    setQuestions(prev => [...prev, { ...currentQuestion, id: Date.now() }]);
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
    setQuestions(prev => prev.filter(q => q.id !== id));
    setExamData(prev => ({
      ...prev,
      totalQuestions: prev.totalQuestions - 1
    }));
  };

  const saveExam = () => {
    console.log('Saving exam:', { examData, questions });
    alert('آزمون با موفقیت به‌روزرسانی شد!');
    navigate('/dashboard/exams');
  };

  const previewExam = () => {
    console.log('Previewing exam:', { examData, questions });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center space-x-4 space-x-reverse">
          <button 
            onClick={() => navigate('/dashboard/exams')}
            className="p-2 hover:bg-soft/50 rounded-xl transition-colors"
          >
            <ArrowRight className="h-6 w-6 text-text-body" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-text-heading mb-2">ویرایش آزمون</h1>
            <p className="text-text-body">ویرایش و به‌روزرسانی آزمون موجود</p>
          </div>
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
            <span>ذخیره تغییرات</span>
          </button>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-text-heading">وضعیت آزمون</h3>
          <span className="text-sm text-text-body">
            {questions.length} سوال موجود
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-3 rounded-xl border-2 border-green-200 bg-green-50">
            <div className="flex items-center space-x-2 space-x-reverse">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">اطلاعات پایه</span>
            </div>
          </div>
          <div className="p-3 rounded-xl border-2 border-green-200 bg-green-50">
            <div className="flex items-center space-x-2 space-x-reverse">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">سوالات</span>
            </div>
          </div>
          <div className="p-3 rounded-xl border-2 border-green-200 bg-green-50">
            <div className="flex items-center space-x-2 space-x-reverse">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">زمان‌بندی</span>
            </div>
          </div>
          <div className="p-3 rounded-xl border-2 border-green-200 bg-green-50">
            <div className="flex items-center space-x-2 space-x-reverse">
              <CheckCircle className="h-5 w-5 text-green-600" />
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
            { id: 'questions', label: 'سوالات', icon: Plus },
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

        {/* Questions Tab */}
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

      {/* Questions List */}
      {questions.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-text-heading">
              سوالات موجود ({questions.length})
            </h3>
            <div className="text-sm text-text-body">
              مجموع امتیاز: {questions.reduce((sum, q) => sum + q.points, 0)} نمره
            </div>
          </div>

          <div className="space-y-4">
            {questions.map((question, index) => (
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
                    </div>
                    
                    <p className="text-text-heading font-medium mb-2">{question.question}</p>
                    
                    {question.type === 'multiple_choice' && (
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

export default TeacherExamEdit;