import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2,
  Plus,
  Copy,
  Star,
  Clock,
  BarChart3,
  X,
  Save
} from 'lucide-react';
import { sampleQuestions, subjects } from '../../data/sampleQuestions';

const AdminQuestions: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newQuestion, setNewQuestion] = useState({
    type: 'multiple_choice',
    subject: '',
    topic: '',
    difficulty: 'متوسط',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    points: 1,
    explanation: ''
  });

  const questionTypes = [
    { value: 'multiple_choice', label: 'چندگزینه‌ای', icon: '📝' },
    { value: 'true_false', label: 'درست/نادرست', icon: '✅' },
    { value: 'short_answer', label: 'پاسخ کوتاه', icon: '📄' },
    { value: 'essay', label: 'تشریحی', icon: '📋' }
  ];

  const difficulties = ['آسان', 'متوسط', 'سخت'];

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case 'multiple_choice':
        return '📝';
      case 'true_false':
        return '✅';
      case 'short_answer':
        return '📄';
      case 'essay':
        return '📋';
      default:
        return '❓';
    }
  };

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'multiple_choice':
        return 'چندگزینه‌ای';
      case 'true_false':
        return 'درست/نادرست';
      case 'short_answer':
        return 'پاسخ کوتاه';
      case 'essay':
        return 'تشریحی';
      default:
        return type;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'آسان':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'متوسط':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'سخت':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredQuestions = sampleQuestions.filter(question => {
    const matchesSearch = question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = selectedSubject === 'all' || question.subject === selectedSubject;
    const matchesDifficulty = selectedDifficulty === 'all' || question.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesSubject && matchesDifficulty;
  });

  const handleViewQuestion = (question: any) => {
    setSelectedQuestion(question);
    setShowQuestionModal(true);
  };

  const handleAddQuestion = () => {
    console.log('Adding question:', newQuestion);
    setShowAddModal(false);
    setNewQuestion({
      type: 'multiple_choice',
      subject: '',
      topic: '',
      difficulty: 'متوسط',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      points: 1,
      explanation: ''
    });
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...newQuestion.options];
    newOptions[index] = value;
    setNewQuestion(prev => ({ ...prev, options: newOptions }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-heading mb-2">مدیریت سوالات</h1>
          <p className="text-text-body">مدیریت بانک سوالات سیستم آزمون‌گیری</p>
        </div>
        
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center space-x-2 space-x-reverse mt-4 lg:mt-0"
        >
          <Plus className="h-5 w-5" />
          <span>افزودن سوال جدید</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-body mb-1">کل سوالات</p>
              <p className="text-2xl font-bold text-text-heading">{sampleQuestions.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-body mb-1">موضوعات</p>
              <p className="text-2xl font-bold text-green-600">{subjects.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-body mb-1">سوالات آسان</p>
              <p className="text-2xl font-bold text-blue-600">
                {sampleQuestions.filter(q => q.difficulty === 'آسان').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <span className="text-white text-lg">😊</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-body mb-1">سوالات سخت</p>
              <p className="text-2xl font-bold text-red-600">
                {sampleQuestions.filter(q => q.difficulty === 'سخت').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center">
              <span className="text-white text-lg">🔥</span>
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
              placeholder="جستجو در سوالات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pr-10"
            />
          </div>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="input-field"
          >
            <option value="all">همه موضوعات</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="input-field"
          >
            <option value="all">همه سطوح</option>
            {difficulties.map((difficulty) => (
              <option key={difficulty} value={difficulty}>{difficulty}</option>
            ))}
          </select>

          <div className="text-sm text-text-body/70 flex items-center">
            {filteredQuestions.length} سوال یافت شد
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((question) => (
          <div key={question.id} className="card hover:shadow-hero transition-all duration-300">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 space-x-reverse mb-3">
                  <span className="text-2xl">{getQuestionTypeIcon(question.type)}</span>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="px-3 py-1 bg-soft rounded-full text-sm font-medium">
                      {getQuestionTypeLabel(question.type)}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(question.difficulty)}`}>
                      {question.difficulty}
                    </span>
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                      {question.subject}
                    </span>
                    <span className="text-sm text-text-body/70">{question.topic}</span>
                  </div>
                </div>

                <h3 className="font-medium text-text-heading mb-3 text-lg">
                  {question.question}
                </h3>

                {question.type === 'multiple_choice' && question.options && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                    {question.options.map((option, index) => (
                      <div 
                        key={index} 
                        className={`p-2 rounded-lg text-sm ${
                          index === question.correctAnswer 
                            ? 'bg-green-50 text-green-800 border border-green-200' 
                            : 'bg-gray-50 text-text-body'
                        }`}
                      >
                        {String.fromCharCode(65 + index)}. {option}
                        {index === question.correctAnswer && (
                          <span className="mr-2 text-green-600">✓</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center space-x-4 space-x-reverse text-sm text-text-body/70">
                  <div className="flex items-center space-x-1 space-x-reverse">
                    <Star className="h-4 w-4" />
                    <span>{question.points} نمره</span>
                  </div>
                  <div className="flex items-center space-x-1 space-x-reverse">
                    <Clock className="h-4 w-4" />
                    <span>{question.timeEstimate} دقیقه</span>
                  </div>
                </div>

                {question.explanation && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>توضیح:</strong> {question.explanation}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <button
                  onClick={() => handleViewQuestion(question)}
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
                  className="p-2 text-purple-600 hover:bg-purple-50 rounded-xl transition-colors"
                  title="کپی"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button
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

      {/* Add Question Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-hero max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-accent/20">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-text-heading">افزودن سوال جدید</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-soft/50 rounded-xl transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Question Type Selection */}
              <div>
                <label className="block text-sm font-medium text-text-heading mb-3">
                  نوع سوال
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {questionTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setNewQuestion(prev => ({ ...prev, type: type.value }))}
                      className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                        newQuestion.type === type.value
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

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-heading mb-2">
                    موضوع
                  </label>
                  <select
                    value={newQuestion.subject}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, subject: e.target.value }))}
                    className="input-field"
                  >
                    <option value="">انتخاب موضوع</option>
                    {subjects.map((subject) => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-heading mb-2">
                    مبحث
                  </label>
                  <input
                    type="text"
                    value={newQuestion.topic}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, topic: e.target.value }))}
                    className="input-field"
                    placeholder="مبحث سوال"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-heading mb-2">
                    سطح دشواری
                  </label>
                  <select
                    value={newQuestion.difficulty}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, difficulty: e.target.value }))}
                    className="input-field"
                  >
                    {difficulties.map((difficulty) => (
                      <option key={difficulty} value={difficulty}>{difficulty}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Question Text */}
              <div>
                <label className="block text-sm font-medium text-text-heading mb-2">
                  متن سوال *
                </label>
                <textarea
                  value={newQuestion.question}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, question: e.target.value }))}
                  rows={3}
                  className="input-field resize-none"
                  placeholder="متن سوال را وارد کنید"
                />
              </div>

              {/* Options for Multiple Choice */}
              {newQuestion.type === 'multiple_choice' && (
                <div>
                  <label className="block text-sm font-medium text-text-heading mb-3">
                    گزینه‌ها
                  </label>
                  <div className="space-y-3">
                    {newQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-3 space-x-reverse">
                        <input
                          type="radio"
                          name="correctAnswer"
                          checked={newQuestion.correctAnswer === index}
                          onChange={() => setNewQuestion(prev => ({ ...prev, correctAnswer: index }))}
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
              {newQuestion.type === 'true_false' && (
                <div>
                  <label className="block text-sm font-medium text-text-heading mb-3">
                    پاسخ صحیح
                  </label>
                  <div className="flex space-x-4 space-x-reverse">
                    <label className="flex items-center space-x-2 space-x-reverse">
                      <input
                        type="radio"
                        name="tfAnswer"
                        checked={newQuestion.correctAnswer === 0}
                        onChange={() => setNewQuestion(prev => ({ ...prev, correctAnswer: 0 }))}
                        className="text-primary focus:ring-primary"
                      />
                      <span>درست</span>
                    </label>
                    <label className="flex items-center space-x-2 space-x-reverse">
                      <input
                        type="radio"
                        name="tfAnswer"
                        checked={newQuestion.correctAnswer === 1}
                        onChange={() => setNewQuestion(prev => ({ ...prev, correctAnswer: 1 }))}
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
                    value={newQuestion.points}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, points: parseInt(e.target.value) || 1 }))}
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
                    value={newQuestion.explanation}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, explanation: e.target.value }))}
                    className="input-field"
                    placeholder="توضیح پاسخ صحیح"
                  />
                </div>
              </div>

              <div className="flex space-x-4 space-x-reverse pt-4 border-t border-accent/20">
                <button 
                  onClick={handleAddQuestion}
                  className="btn-primary flex-1 flex items-center justify-center space-x-2 space-x-reverse"
                >
                  <Save className="h-5 w-5" />
                  <span>ذخیره سوال</span>
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

export default AdminQuestions;