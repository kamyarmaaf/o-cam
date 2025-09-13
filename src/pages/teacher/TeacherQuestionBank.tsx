import React from 'react';
import QuestionBank from '../../components/QuestionBank';

const TeacherQuestionBank: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-heading mb-2">بانک سوالات</h1>
        <p className="text-text-body">مدیریت و سازماندهی سوالات آزمون‌ها</p>
      </div>

      <QuestionBank mode="manage" />
    </div>
  );
};

export default TeacherQuestionBank;