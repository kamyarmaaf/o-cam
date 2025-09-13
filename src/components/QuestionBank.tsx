import React, { useState } from 'react';
import { sampleQuestions, getQuestionsBySubject, getQuestionsByDifficulty, subjects, Question } from '../data/sampleQuestions';
import { 
  Search, 
  Filter, 
  BookOpen, 
  Clock, 
  Star,
  Plus,
  Eye,
  Edit,
  Copy,
  Trash2
} from 'lucide-react';

interface QuestionBankProps {
  onSelectQuestion?: (question: Question) => void;
  selectedQuestions?: Question[];
  mode?: 'select' | 'manage';
}

const QuestionBank: React.FC<QuestionBankProps> = ({ 
  onSelectQuestion, 
  selectedQuestions = [], 
  mode = 'manage' 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedTopic, setSelectedTopic] = useState('all');

  const filteredQuestions = sampleQuestions.filter(question => {
    const matchesSearch = question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.topic.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = selectedSubject === 'all' || question.subject === selectedSubject;
    const matchesDifficulty = selectedDifficulty === 'all' || question.difficulty === selectedDifficulty;
    const matchesTopic = selectedTopic === 'all' || question.topic === selectedTopic;
    
    return matchesSearch && matchesSubject && matchesDifficulty && matchesTopic;
  });

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

  const isQuestionSelected = (question: Question) => {
    return selectedQuestions.some(q => q.id === question.id);
  };

  const topics = [...new Set(
    sampleQuestions
      .filter(q => selectedSubject === 'all' || q.subject === selectedSubject)
      .map(q => q.topic)
  )];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-heading">بانک سوالات</h2>
          <p className="text-text-body">مجموعه کامل سوالات در دسترس</p>
        </div>
        {mode === 'manage' && (
          <button className="btn-primary flex items-center space-x-2 space-x-reverse">
            <Plus className="h-5 w-5" />
            <span>سوال جدید</span>
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-soft/30 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-primary">{sampleQuestions.length}</div>
          <div className="text-sm text-text-body/70">کل سوالات</div>
        </div>
        <div className="bg-soft/30 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{subjects.length}</div>
          <div className="text-sm text-text-body/70">موضوعات</div>
        </div>
        <div className="bg-soft/30 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {sampleQuestions.filter(q => q.difficulty === 'آسان').length}
          </div>
          <div className="text-sm text-text-body/70">سوالات آسان</div>
        </div>
        <div className="bg-soft/30 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-red-600">
            {sampleQuestions.filter(q => q.difficulty === 'سخت').length}
          </div>
          <div className="text-sm text-text-body/70">سوالات سخت</div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="input-field"
          >
            <option value="all">همه مباحث</option>
            {topics.map((topic) => (
              <option key={topic} value={topic}>{topic}</option>
            ))}
          </select>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="input-field"
          >
            <option value="all">همه سطوح</option>
            <option value="آسان">آسان</option>
            <option value="متوسط">متوسط</option>
            <option value="سخت">سخت</option>
          </select>

          <div className="text-sm text-text-body/70 flex items-center">
            {filteredQuestions.length} سوال یافت شد
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((question) => (
          <div 
            key={question.id} 
            className={`card hover:shadow-hero transition-all duration-300 ${
              isQuestionSelected(question) ? 'ring-2 ring-primary bg-primary/5' : ''
            }`}
          >
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

                {question.type === 'true_false' && (
                  <div className="flex space-x-4 space-x-reverse mb-3">
                    <div className={`p-2 rounded-lg text-sm ${
                      question.correctAnswer === 0 
                        ? 'bg-green-50 text-green-800 border border-green-200' 
                        : 'bg-gray-50 text-text-body'
                    }`}>
                      درست {question.correctAnswer === 0 && <span className="mr-2 text-green-600">✓</span>}
                    </div>
                    <div className={`p-2 rounded-lg text-sm ${
                      question.correctAnswer === 1 
                        ? 'bg-green-50 text-green-800 border border-green-200' 
                        : 'bg-gray-50 text-text-body'
                    }`}>
                      نادرست {question.correctAnswer === 1 && <span className="mr-2 text-green-600">✓</span>}
                    </div>
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
                {mode === 'select' && onSelectQuestion && (
                  <button
                    onClick={() => onSelectQuestion(question)}
                    className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                      isQuestionSelected(question)
                        ? 'bg-primary text-white'
                        : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
                    }`}
                  >
                    {isQuestionSelected(question) ? 'انتخاب شده' : 'انتخاب'}
                  </button>
                )}
                
                {mode === 'manage' && (
                  <>
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-purple-600 hover:bg-purple-50 rounded-xl transition-colors">
                      <Copy className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredQuestions.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-text-body/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-heading mb-2">
            سوالی یافت نشد
          </h3>
          <p className="text-text-body">
            فیلترهای خود را تغییر دهید یا سوال جدیدی اضافه کنید
          </p>
        </div>
      )}
    </div>
  );
};

export default QuestionBank;