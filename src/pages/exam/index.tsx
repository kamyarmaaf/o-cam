"use client";
import React from 'react';
import ExamCamera from '../../components/ExamCamera';

const ExamPage: React.FC = () => {
  const handleViolationDetected = (violationData: any) => {
    console.log('تخلف شناسایی شد:', violationData);
    // اینجا می‌توانید منطق مدیریت تخلفات را اضافه کنید
    // مثل ارسال به سرور، ذخیره در دیتابیس، و غیره
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft via-white to-soft p-4">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-heading mb-4">
            محیط آزمون با نظارت هوشمند
          </h1>
          <p className="text-text-body">
            سیستم تشخیص چهره فعال است و تمام فعالیت‌ها نظارت می‌شوند
          </p>
        </div>

        {/* نمایش کامپوننت دوربین */}
        <ExamCamera 
          onViolationDetected={handleViolationDetected}
          studentId="student-123"
          examId="exam-456"
        />

        {/* محتوای آزمون */}
        <div className="max-w-4xl mx-auto">
          <div className="card">
            <h2 className="text-2xl font-bold text-text-heading mb-6">آزمون نمونه</h2>
            
            <div className="space-y-6">
              <div className="border-b border-accent/20 pb-6">
                <h3 className="text-lg font-medium text-text-heading mb-4">
                  سوال ۱: کدام یک از موارد زیر تعریف صحیح الگوریتم است؟
                </h3>
                <div className="space-y-3">
                  {[
                    'مجموعه‌ای از دستورات برای حل مسئله',
                    'یک برنامه کامپیوتری',
                    'زبان برنامه‌نویسی',
                    'سیستم عامل'
                  ].map((option, index) => (
                    <label
                      key={index}
                      className="flex items-center space-x-3 space-x-reverse p-3 border border-accent/30 rounded-2xl cursor-pointer hover:border-primary/50 hover:bg-soft/30 transition-all duration-300"
                    >
                      <input
                        type="radio"
                        name="question1"
                        value={index}
                        className="text-primary focus:ring-primary"
                      />
                      <span className="flex-1 text-text-heading">
                        <span className="font-medium ml-2">{String.fromCharCode(65 + index)}.</span>
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-b border-accent/20 pb-6">
                <h3 className="text-lg font-medium text-text-heading mb-4">
                  سوال ۲: پیچیدگی زمانی الگوریتم مرتب‌سازی حبابی O(n²) است.
                </h3>
                <div className="space-y-3">
                  {['درست', 'نادرست'].map((option, index) => (
                    <label
                      key={index}
                      className="flex items-center space-x-3 space-x-reverse p-3 border border-accent/30 rounded-2xl cursor-pointer hover:border-primary/50 hover:bg-soft/30 transition-all duration-300"
                    >
                      <input
                        type="radio"
                        name="question2"
                        value={index}
                        className="text-primary focus:ring-primary"
                      />
                      <span className="flex-1 text-text-heading font-medium">
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="text-center pt-6">
                <button className="btn-primary">
                  ارسال آزمون
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamPage;