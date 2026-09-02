import React, { useState } from 'react';
import { useExam } from '../context/ExamContext';
import { useTheory } from '../context/TheoryContext';
import { Question } from '../types';
import { 
  Clock, 
  Flag, 
  Bookmark, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Sparkles, 
  Code, 
  Send,
  HelpCircle,
  X
} from 'lucide-react';

interface ExamTakingViewProps {
  onOpenQuickTheory: (lessonId: string) => void;
}

export const ExamTakingView: React.FC<ExamTakingViewProps> = ({ onOpenQuickTheory }) => {
  const { 
    currentExam, 
    answers, 
    timeRemaining, 
    examMode, 
    activeQuestionIndex, 
    setActiveQuestionIndex,
    selectSingleChoiceAnswer, 
    selectTrueFalseAnswer, 
    toggleFlagQuestion, 
    submitExam, 
    resetExamState,
    toggleBookmark,
    isQuestionBookmarked,
    isSubmitting
  } = useExam();

  const { topics } = useTheory();

  const [showSubmitConfirm, setShowSubmitConfirm] = useState<boolean>(false);
  const [showNoteModal, setShowNoteModal] = useState<boolean>(false);
  const [noteText, setNoteText] = useState<string>('');

  if (!currentExam || currentExam.questions.length === 0) {
    return null;
  }

  const currentQ: Question = currentExam.questions[activeQuestionIndex];
  const currentAnswer = answers[currentQ.id];
  const isFlagged = !!currentAnswer?.isFlagged;
  const isBookmarked = isQuestionBookmarked(currentQ.id);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isLowTime = examMode === 'exam' && timeRemaining <= 5 * 60;

  // Calculate answered count
  let answeredCount = 0;
  currentExam.questions.forEach(q => {
    const a = answers[q.id];
    if (q.type === 'single_choice' && a?.singleChoiceSelected) {
      answeredCount++;
    } else if (q.type === 'true_false' && a?.trueFalseSelected) {
      const tf = a.trueFalseSelected;
      if (tf.a !== undefined && tf.b !== undefined && tf.c !== undefined && tf.d !== undefined) {
        answeredCount++;
      } else if (Object.keys(tf).length > 0) {
        answeredCount += 0.5; // Partially answered
      }
    }
  });

  const getQuestionStatus = (index: number) => {
    const q = currentExam.questions[index];
    const a = answers[q.id];
    const flagged = !!a?.isFlagged;

    let isAnswered = false;
    if (q.type === 'single_choice') {
      isAnswered = !!a?.singleChoiceSelected;
    } else if (q.type === 'true_false' && a?.trueFalseSelected) {
      const tf = a.trueFalseSelected;
      isAnswered = tf.a !== undefined && tf.b !== undefined && tf.c !== undefined && tf.d !== undefined;
    }

    return { isAnswered, flagged };
  };

  const handleSaveBookmarkWithNote = () => {
    toggleBookmark(currentQ, noteText, 'need_review');
    setShowNoteModal(false);
    setNoteText('');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      
      {/* Sticky Exam Top Bar */}
      <header className="sticky top-0 z-30 bg-slate-900 text-white shadow-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Exam Title & Exit */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (window.confirm('Bạn có chắc chắn muốn rời khỏi phòng thi? Bài làm chưa nộp sẽ không được lưu.')) {
                  resetExamState();
                }
              }}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 transition-colors text-xs flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Rời phòng thi</span>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs sm:text-sm text-white line-clamp-1 max-w-[280px] sm:max-w-md">
                  {currentExam.title}
                </span>
                <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                  examMode === 'exam' ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30' : 'bg-sky-500/20 text-sky-300 border border-sky-400/30'
                }`}>
                  {examMode === 'exam' ? 'Thi thử (50 phút)' : 'Ôn tập tự do'}
                </span>
              </div>
            </div>
          </div>

          {/* Timer & Submit CTA */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Timer Badge */}
            {examMode === 'exam' && (
              <div className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-mono text-sm font-bold border transition-colors ${
                isLowTime
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                  : 'bg-white/10 text-white border-white/15'
              }`}>
                <Clock className={`w-4 h-4 ${isLowTime ? 'text-rose-400' : 'text-sky-400'}`} />
                <span>{formatTime(timeRemaining)}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={() => setShowSubmitConfirm(true)}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Nộp bài thi</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left/Main Column: Question Body & Answers */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-7 relative">
            
            {/* Question Meta Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="px-3.5 py-1 bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-xs font-bold rounded-xl shadow-xs">
                  Câu {activeQuestionIndex + 1} / {currentExam.questions.length}
                </span>
                
                <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                  currentQ.type === 'single_choice' ? 'bg-sky-50 text-sky-700 border border-sky-200/80' : 'bg-purple-50 text-purple-700 border border-purple-200/80'
                }`}>
                  {currentQ.type === 'single_choice' ? 'Phần I: 4 lựa chọn (0,25đ)' : 'Phần II: Đúng / Sai 4 ý (1,0đ)'}
                </span>

                <span className="px-2.5 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-600 rounded-full">
                  Mức độ: {currentQ.cognitiveLevel}
                </span>
              </div>

              {/* Action Buttons: Theory Reference & Bookmark */}
              <div className="flex items-center gap-2">
                
                {/* 📖 Tham khảo lý thuyết button */}
                <button
                  onClick={() => onOpenQuickTheory(currentQ.lessonId)}
                  className="px-3.5 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200/80 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
                  title="Mở ngay bài học lý thuyết tham chiếu để tra cứu kiến thức"
                >
                  <BookOpen className="w-3.5 h-3.5 text-sky-600" />
                  <span>Tham khảo lý thuyết</span>
                </button>

                {/* ⭐ Lưu sổ tay câu hỏi khó */}
                <button
                  onClick={() => {
                    if (isBookmarked) {
                      toggleBookmark(currentQ);
                    } else {
                      setShowNoteModal(true);
                    }
                  }}
                  className={`p-2 rounded-xl border text-xs font-semibold transition-colors flex items-center gap-1 ${
                    isBookmarked
                      ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-amber-50 hover:text-amber-700'
                  }`}
                  title={isBookmarked ? 'Đã lưu vào sổ tay câu hỏi' : 'Lưu câu hỏi này để nghiên cứu sâu'}
                >
                  <Bookmark className="w-4 h-4 fill-current" />
                </button>

                {/* 🚩 Đặt cờ phân vân */}
                <button
                  onClick={() => toggleFlagQuestion(currentQ.id)}
                  className={`p-2 rounded-xl border text-xs font-semibold transition-colors ${
                    isFlagged
                      ? 'bg-amber-100 text-amber-800 border-amber-300 shadow-xs'
                      : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-slate-600'
                  }`}
                  title="Đánh dấu câu hỏi cần xem lại trước khi nộp"
                >
                  <Flag className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Question Content Statement */}
            <div className="text-sm sm:text-base font-medium text-slate-900 leading-relaxed whitespace-pre-line mb-4">
              {currentQ.content}
            </div>

            {/* Code Snippet (if provided) */}
            {currentQ.codeSnippet && (
              <div className="rounded-2xl border border-slate-200 overflow-hidden mb-5">
                <div className="bg-slate-800 px-3.5 py-1.5 text-slate-200 text-xs font-mono flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code className="w-3.5 h-3.5 text-sky-400" />
                    <span>Mã nguồn {currentQ.codeSnippet.language}</span>
                  </div>
                </div>
                <pre className="p-4 bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed">
                  <code>{currentQ.codeSnippet.code}</code>
                </pre>
              </div>
            )}

            {/* Answer Selector */}
            {currentQ.type === 'single_choice' && currentQ.options && (
              <div className="space-y-2.5 pt-2">
                {currentQ.options.map((optionText, idx) => {
                  const optionKey = ['A', 'B', 'C', 'D'][idx] as 'A' | 'B' | 'C' | 'D';
                  const isSelected = currentAnswer?.singleChoiceSelected === optionKey;
                  const isPracticeMode = examMode === 'practice';
                  const isCorrect = isPracticeMode && isSelected && optionKey === currentQ.correctAnswer;
                  const isWrong = isPracticeMode && isSelected && optionKey !== currentQ.correctAnswer;

                  return (
                    <div
                      key={optionKey}
                      onClick={() => selectSingleChoiceAnswer(currentQ.id, optionKey)}
                      className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                        isSelected
                          ? isCorrect
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-950 shadow-xs'
                            : isWrong
                            ? 'border-rose-500 bg-rose-50 text-rose-950 shadow-xs'
                            : 'border-indigo-500 bg-indigo-50/70 text-indigo-950 shadow-xs'
                          : 'border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-xl shrink-0 flex items-center justify-center font-bold text-xs transition-colors ${
                        isSelected
                          ? isCorrect
                            ? 'bg-emerald-600 text-white'
                            : isWrong
                            ? 'bg-rose-600 text-white'
                            : 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {optionKey}
                      </div>

                      <div className="text-xs sm:text-sm font-medium leading-relaxed pt-0.5">
                        {optionText}
                      </div>
                    </div>
                  );
                })}

                {/* Instant Explanation in Practice Mode */}
                {examMode === 'practice' && currentAnswer?.singleChoiceSelected && (
                  <div className="mt-4 p-4 rounded-2xl bg-sky-50/80 border border-sky-100 text-xs text-slate-800 space-y-1.5 animate-in fade-in duration-200">
                    <div className="font-bold flex items-center gap-1.5 text-sky-900">
                      <HelpCircle className="w-4 h-4 text-sky-600" />
                      <span>Đáp án chính xác: {currentQ.correctAnswer}</span>
                    </div>
                    <p className="leading-relaxed text-slate-700">{currentQ.explanation}</p>
                  </div>
                )}
              </div>
            )}

            {/* Part II: True / False Multi-Statement Form */}
            {currentQ.type === 'true_false' && currentQ.subQuestions && (
              <div className="space-y-3 pt-2">
                <p className="text-xs font-semibold text-slate-500">
                  Mỗi ý sau đây, hãy xác định là <strong>ĐÚNG</strong> hay <strong>SAI</strong>:
                </p>

                <div className="space-y-2.5">
                  {currentQ.subQuestions.map(sub => {
                    const chosenValue = currentAnswer?.trueFalseSelected?.[sub.label];

                    return (
                      <div
                        key={sub.id}
                        className="p-3.5 rounded-2xl border border-slate-200/90 bg-slate-50/60 hover:bg-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-start gap-2.5 flex-1">
                          <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                            {sub.label}
                          </span>
                          <span className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                            {sub.statement}
                          </span>
                        </div>

                        {/* True / False Toggle buttons */}
                        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => selectTrueFalseAnswer(currentQ.id, sub.label, true)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                              chosenValue === true
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>ĐÚNG</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => selectTrueFalseAnswer(currentQ.id, sub.label, false)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                              chosenValue === false
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-700'
                            }`}
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>SAI</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation in Practice Mode */}
                {examMode === 'practice' && currentAnswer?.trueFalseSelected && (
                  <div className="mt-4 p-4 rounded-2xl bg-purple-50/80 border border-purple-100 text-xs text-purple-950 space-y-1.5">
                    <div className="font-bold text-purple-900">Giải thích chi tiết:</div>
                    <p className="leading-relaxed text-slate-700">{currentQ.explanation}</p>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Nav Controls */}
            <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100">
              <button
                onClick={() => setActiveQuestionIndex(Math.max(0, activeQuestionIndex - 1))}
                disabled={activeQuestionIndex === 0}
                className="px-4 py-2.5 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-30 flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Câu trước</span>
              </button>

              <div className="text-xs text-slate-500">
                Đã trả lời: <span className="font-bold text-indigo-600">{Math.floor(answeredCount)}</span> / {currentExam.questions.length}
              </div>

              <button
                onClick={() => setActiveQuestionIndex(Math.min(currentExam.questions.length - 1, activeQuestionIndex + 1))}
                disabled={activeQuestionIndex === currentExam.questions.length - 1}
                className="px-4 py-2.5 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-30 flex items-center gap-1 shadow-xs"
              >
                <span>Câu tiếp</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Question Palette Matrix */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 sticky top-20">
            
            {/* Palette Header */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Bảng câu hỏi ({currentExam.questions.length})
              </h3>
              <span className="text-[11px] font-bold text-indigo-600">
                Tiến độ: {Math.round((answeredCount / currentExam.questions.length) * 100)}%
              </span>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-2 text-[10px] text-slate-500 mb-4">
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-md bg-emerald-500" />
                <span>Đã làm</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-md bg-amber-400" />
                <span>Phân vân</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-md bg-slate-200" />
                <span>Chưa làm</span>
              </div>
            </div>

            {/* Questions Numbers Grid */}
            <div className="grid grid-cols-6 gap-2 max-h-80 overflow-y-auto pr-1">
              {currentExam.questions.map((q, idx) => {
                const { isAnswered, flagged } = getQuestionStatus(idx);
                const isActive = activeQuestionIndex === idx;

                return (
                  <button
                    key={q.id}
                    onClick={() => setActiveQuestionIndex(idx)}
                    className={`h-9 rounded-xl font-bold text-xs transition-all relative flex items-center justify-center ${
                      isActive
                        ? 'ring-2 ring-indigo-600 ring-offset-2 scale-105 z-10'
                        : ''
                    } ${
                      flagged
                        ? 'bg-amber-400 text-amber-950 font-bold'
                        : isAnswered
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {idx + 1}
                    {flagged && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Direct Submit CTA */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <button
                onClick={() => setShowSubmitConfirm(true)}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Nộp bài và xem kết quả</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <Send className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-slate-900 text-center mb-1">
              Xác nhận nộp bài thi
            </h3>
            <p className="text-xs text-slate-500 text-center mb-4">
              Bạn có chắc chắn muốn kết thúc bài thi và nhận phân tích chẩn đoán năng lực?
            </p>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs space-y-2 mb-5">
              <div className="flex justify-between">
                <span className="text-slate-600">Tổng số câu hỏi:</span>
                <span className="font-bold text-slate-900">{currentExam.questions.length} câu</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Đã trả lời:</span>
                <span className="font-bold text-emerald-600">{Math.floor(answeredCount)} câu</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Chưa hoàn thành:</span>
                <span className="font-bold text-rose-600">
                  {currentExam.questions.length - Math.floor(answeredCount)} câu
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 py-2.5 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors"
              >
                Tiếp tục làm bài
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={async () => {
                  setShowSubmitConfirm(false);
                  await submitExam();
                }}
                className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Đang chấm điểm...' : 'Đồng ý nộp bài'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bookmark with Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                <Bookmark className="w-5 h-5 fill-amber-500" />
                <span>Lưu vào sổ tay nghiên cứu sâu</span>
              </div>
              <button onClick={() => setShowNoteModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-3">
              Ghi chú lại lý do cần nghiên cứu sâu hoặc điểm bạn còn phân vân trong câu này:
            </p>

            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Ví dụ: Cần xem lại cú pháp lệnh GROUP BY và HAVING trong SQL..."
              rows={3}
              className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-hidden mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNoteModal(false)}
                className="px-3.5 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveBookmarkWithNote}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Lưu câu hỏi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
