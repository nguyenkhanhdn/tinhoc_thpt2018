import React, { useState } from 'react';
import { useExam } from '../context/ExamContext';
import { useTheory } from '../context/TheoryContext';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Lightbulb, 
  BookOpen, 
  Bookmark, 
  RotateCcw, 
  ArrowRight, 
  Code, 
  HelpCircle, 
  TrendingUp,
  Sparkles,
  Flame,
  BrainCircuit,
  X
} from 'lucide-react';

interface ExamResultViewProps {
  onOpenQuickTheory: (lessonId: string) => void;
  onGoToNotebook: () => void;
  onGoToExams: () => void;
}

export const ExamResultView: React.FC<ExamResultViewProps> = ({
  onOpenQuickTheory,
  onGoToNotebook,
  onGoToExams
}) => {
  const { currentResult, currentExam, startExam, toggleBookmark, isQuestionBookmarked } = useExam();
  const { topics, getLessonById } = useTheory();

  const [activeTab, setActiveTab] = useState<'review' | 'analysis'>('analysis');
  const [filterWrongOnly, setFilterWrongOnly] = useState<boolean>(false);
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string>('all');

  // Bookmark modal note
  const [bookmarkingQuestionId, setBookmarkingQuestionId] = useState<string | null>(null);
  const [bookmarkNote, setBookmarkNote] = useState<string>('');

  if (!currentResult || !currentExam) {
    return null;
  }

  const isExcellent = currentResult.score >= 8.0;
  const isGood = currentResult.score >= 6.5 && currentResult.score < 8.0;

  const minutesSpent = Math.floor(currentResult.timeSpentSeconds / 60);
  const secondsSpent = currentResult.timeSpentSeconds % 60;

  // Filter review questions
  const reviewQuestions = currentExam.questions.filter(q => {
    const a = currentResult.answers[q.id];
    let isCorrect = false;

    if (q.type === 'single_choice') {
      isCorrect = a?.singleChoiceSelected === q.correctAnswer;
    } else if (q.type === 'true_false' && q.subQuestions) {
      const userTF = a?.trueFalseSelected || {};
      isCorrect = q.subQuestions.every(sub => userTF[sub.label] === sub.isCorrect);
    }

    const matchesWrong = !filterWrongOnly || !isCorrect;
    const matchesTopic = selectedTopicFilter === 'all' || q.topicId === selectedTopicFilter;

    return matchesWrong && matchesTopic;
  });

  const handleSaveBookmarkWithNote = () => {
    if (!bookmarkingQuestionId) return;
    const question = currentExam.questions.find(q => q.id === bookmarkingQuestionId);
    if (question) {
      toggleBookmark(question, bookmarkNote, 'need_review');
    }
    setBookmarkingQuestionId(null);
    setBookmarkNote('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Banner: Score & Overview */}
      <div className={`rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden ${
        isExcellent
          ? 'bg-gradient-to-r from-emerald-800 via-teal-800 to-blue-900'
          : isGood
          ? 'bg-gradient-to-r from-blue-800 via-indigo-800 to-slate-900'
          : 'bg-gradient-to-r from-slate-900 via-indigo-900 to-amber-900'
      }`}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-bold text-white mb-3">
              <Award className="w-4 h-4 text-amber-300" />
              <span>BÁO CÁO KẾT QUẢ & CHẨN ĐOÁN NĂNG LỰC</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              {currentResult.examTitle}
            </h1>
            <p className="text-xs text-white/80 mt-1">
              Thí sinh: <span className="font-semibold text-white">{currentResult.userFullName}</span> • Hoàn thành: {new Date(currentResult.completedAt).toLocaleTimeString('vi-VN')} {new Date(currentResult.completedAt).toLocaleDateString('vi-VN')}
            </p>
          </div>

          {/* Main Score Capsule */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 text-center min-w-[200px] shrink-0">
            <div className="text-xs text-white/80 font-medium">TỔNG ĐIỂM ĐẠT ĐƯỢC</div>
            <div className="text-4xl sm:text-5xl font-black text-amber-300 my-1 font-mono tracking-tight">
              {currentResult.score.toFixed(2)}
              <span className="text-sm font-normal text-white/70"> / 10.0</span>
            </div>
            <div className="text-xs text-white/90 font-semibold">
              {isExcellent ? '🌟 Xuất sắc - Nắm rất vững kiến thức' : isGood ? '👍 Khá - Cần tối ưu thêm các câu khó' : '💪 Cần củng cố thêm các chủ đề yếu'}
            </div>
          </div>
        </div>

        {/* Detailed Metrics Sub-Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/15">
          <div className="bg-black/20 rounded-xl p-3">
            <div className="text-[11px] text-white/70">Điểm Phần I (Trắc nghiệm)</div>
            <div className="text-lg font-bold text-white">
              {currentResult.part1Score.toFixed(2)} / 6.00
            </div>
          </div>
          <div className="bg-black/20 rounded-xl p-3">
            <div className="text-[11px] text-white/70">Điểm Phần II (Đúng/Sai)</div>
            <div className="text-lg font-bold text-white">
              {currentResult.part2Score.toFixed(2)} / 4.00
            </div>
          </div>
          <div className="bg-black/20 rounded-xl p-3">
            <div className="text-[11px] text-white/70">Thời gian làm bài</div>
            <div className="text-lg font-bold text-white">
              {minutesSpent}p {secondsSpent}s
            </div>
          </div>
          <div className="bg-black/20 rounded-xl p-3">
            <div className="text-[11px] text-white/70">Số câu đúng tuyệt đối</div>
            <div className="text-lg font-bold text-emerald-300">
              {currentResult.totalCorrectQuestions} / {currentResult.totalQuestions}
            </div>
          </div>
        </div>
      </div>

      {/* Switcher: Diagnostics Analysis vs Detailed Review */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('analysis')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'analysis'
                ? 'bg-indigo-700 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <BrainCircuit className="w-4 h-4" />
            <span>Phân Tích Năng Lực & Chẩn Đoán Củng Cố</span>
          </button>
          
          <button
            onClick={() => setActiveTab('review')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'review'
                ? 'bg-indigo-700 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Xem Chi Tiết Từng Câu & Tham Chiếu Lý Thuyết</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => startExam(currentExam, 'practice')}
            className="px-3.5 py-1.5 bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Làm Lại Đề Này</span>
          </button>
          <button
            onClick={onGoToExams}
            className="px-3.5 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-xl hover:bg-slate-900 transition-colors"
          >
            Danh Sách Đề Thi
          </button>
        </div>
      </div>

      {/* VIEW 1: DIAGNOSTICS & STRENGTHS/WEAKNESSES */}
      {activeTab === 'analysis' && (
        <div className="space-y-6">
          
          {/* Key Strengths and Weaknesses Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Điểm Mạnh */}
            <div className="bg-white rounded-2xl border border-emerald-200 p-5 shadow-xs">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-3">
                <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                  <Flame className="w-4 h-4" />
                </div>
                <span>Nội Dung Kiến Thức Nắm Chắc (Điểm Mạnh)</span>
              </div>

              {currentResult.strongTopics.length > 0 ? (
                <div className="space-y-2">
                  {currentResult.strongTopics.map((topicStr, idx) => (
                    <div key={idx} className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-semibold text-emerald-950">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{topicStr}</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-200 text-emerald-800 rounded-md">
                        Đạt chuẩn
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-xl">
                  Chưa có chủ đề nào đạt tỷ lệ chính xác trên 75%. Hãy tiếp tục luyện tập đều các phân môn.
                </p>
              )}
            </div>

            {/* Điểm Yếu Cần Củng Cố */}
            <div className="bg-white rounded-2xl border border-rose-200 p-5 shadow-xs">
              <div className="flex items-center gap-2 text-rose-800 font-bold text-sm mb-3">
                <div className="p-1.5 rounded-lg bg-rose-100 text-rose-700">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <span>Nội Dung Cần Được Củng Cố & Tập Trung (Điểm Cần Khắc Phục)</span>
              </div>

              {currentResult.weakTopics.length > 0 ? (
                <div className="space-y-2">
                  {currentResult.weakTopics.map((topicStr, idx) => (
                    <div key={idx} className="p-3 bg-rose-50/70 border border-rose-100 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-semibold text-rose-950">
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>{topicStr}</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-200 text-rose-800 rounded-md">
                        Cần ôn lại
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Rất tốt! Bạn không bị hổng kiến thức ở bất kỳ chủ đề trọng tâm nào.</span>
                </div>
              )}
            </div>
          </div>

          {/* Detailed Topic-by-Topic Mastery Bar Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span>Phân Tích Chi Tiết Tỷ Lệ Làm Đúng Theo Từng Chủ Đề (A - G)</span>
            </h3>

            <div className="space-y-4">
              {currentResult.topicPerformance.map(perf => {
                const isStrong = perf.status === 'strong';
                const isWeak = perf.status === 'weak';

                return (
                  <div key={perf.topicId} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">
                          {perf.topicCode}: {perf.topicTitle}
                        </span>
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                          isStrong ? 'bg-emerald-100 text-emerald-800' : isWeak ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {isStrong ? 'Mạnh (Vững)' : isWeak ? 'Yếu (Cần ôn)' : 'Trung bình'}
                        </span>
                      </div>
                      <span className="font-mono font-bold text-slate-700">
                        {perf.correctItems}/{perf.totalItems} ý ({perf.percentage}%)
                      </span>
                    </div>

                    {/* Progress Track */}
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isStrong ? 'bg-emerald-500' : isWeak ? 'bg-rose-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${Math.max(5, perf.percentage)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Pedagogical Diagnosis & Recommendations */}
          {currentResult.aiDiagnostic && (
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <span>Lời Khuyên & Lộ Trình Củng Cố Của Trợ Lý Giáo Viên</span>
              </div>

              <p className="text-xs text-indigo-950 leading-relaxed font-medium">
                {currentResult.aiDiagnostic.summary}
              </p>

              {currentResult.aiDiagnostic.actionPlan && (
                <div className="pt-2">
                  <div className="text-xs font-bold text-indigo-900 mb-2">Kế hoạch hành động cụ thể:</div>
                  <ul className="space-y-2">
                    {currentResult.aiDiagnostic.actionPlan.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-indigo-950">
                        <span className="w-5 h-5 rounded-full bg-indigo-200 text-indigo-900 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: QUESTION-BY-QUESTION REVIEW & THEORY REFERENCE */}
      {activeTab === 'review' && (
        <div className="space-y-4">
          
          {/* Review Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterWrongOnly(false)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                  !filterWrongOnly ? 'bg-indigo-700 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Tất cả câu ({currentExam.questions.length})
              </button>
              <button
                onClick={() => setFilterWrongOnly(true)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                  filterWrongOnly ? 'bg-rose-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Chỉ câu làm sai ({currentExam.questions.length - currentResult.totalCorrectQuestions})
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Lọc theo chủ đề:</span>
              <select
                value={selectedTopicFilter}
                onChange={(e) => setSelectedTopicFilter(e.target.value)}
                className="px-3 py-1.5 text-xs border border-slate-300 rounded-xl outline-hidden bg-white"
              >
                <option value="all">Tất cả chủ đề</option>
                {topics.map(t => (
                  <option key={t.id} value={t.id}>{t.shortTitle}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Questions List */}
          <div className="space-y-4">
            {reviewQuestions.map((q, idx) => {
              const userAnswer = currentResult.answers[q.id];
              const isBookmarked = isQuestionBookmarked(q.id);
              const lesson = getLessonById(q.lessonId);

              // Evaluate question correctness
              let isFullyCorrect = false;
              if (q.type === 'single_choice') {
                isFullyCorrect = userAnswer?.singleChoiceSelected === q.correctAnswer;
              } else if (q.type === 'true_false' && q.subQuestions) {
                const userTF = userAnswer?.trueFalseSelected || {};
                isFullyCorrect = q.subQuestions.every(sub => userTF[sub.label] === sub.isCorrect);
              }

              return (
                <div
                  key={q.id}
                  className={`bg-white rounded-2xl border p-5 sm:p-6 shadow-xs transition-all ${
                    isFullyCorrect ? 'border-emerald-200' : 'border-rose-200'
                  }`}
                >
                  {/* Question Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-lg flex items-center gap-1 ${
                        isFullyCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                      }`}>
                        {isFullyCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        <span>Câu {currentExam.questions.findIndex(item => item.id === q.id) + 1}</span>
                      </span>

                      <span className="text-xs font-semibold text-slate-600">
                        {q.type === 'single_choice' ? 'Phần I: 4 Lựa chọn' : 'Phần II: Đúng/Sai 4 ý'}
                      </span>
                    </div>

                    {/* Action buttons: Direct Theory reference & Bookmark */}
                    <div className="flex items-center gap-2">
                      
                      {/* 📖 Tham khảo lý thuyết button */}
                      <button
                        onClick={() => onOpenQuickTheory(q.lessonId)}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
                        title="Mở bài học lý thuyết tương ứng với câu hỏi này"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Tham Khảo Lý Thuyết</span>
                      </button>

                      {/* ⭐ Lưu vào Sổ tay nghiên cứu sâu */}
                      <button
                        onClick={() => {
                          if (isBookmarked) {
                            toggleBookmark(q);
                          } else {
                            setBookmarkingQuestionId(q.id);
                          }
                        }}
                        className={`p-2 rounded-xl border text-xs font-semibold transition-colors flex items-center gap-1 ${
                          isBookmarked
                            ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-amber-50 hover:text-amber-700'
                        }`}
                        title={isBookmarked ? 'Đã lưu trong sổ tay' : 'Lưu lại câu hỏi để nghiên cứu sâu'}
                      >
                        <Bookmark className="w-4 h-4 fill-current" />
                      </button>
                    </div>
                  </div>

                  {/* Statement */}
                  <div className="text-sm font-medium text-slate-900 whitespace-pre-line mb-3">
                    {q.content}
                  </div>

                  {/* Code snippet if any */}
                  {q.codeSnippet && (
                    <div className="rounded-xl border border-slate-200 overflow-hidden mb-4">
                      <div className="bg-slate-800 px-3 py-1 text-slate-200 text-xs font-mono">
                        Mã nguồn {q.codeSnippet.language}
                      </div>
                      <pre className="p-3.5 bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto">
                        <code>{q.codeSnippet.code}</code>
                      </pre>
                    </div>
                  )}

                  {/* Single Choice Options Display */}
                  {q.type === 'single_choice' && q.options && (
                    <div className="space-y-2 mb-4">
                      {q.options.map((optText, optIdx) => {
                        const optKey = ['A', 'B', 'C', 'D'][optIdx] as 'A' | 'B' | 'C' | 'D';
                        const isCorrectKey = optKey === q.correctAnswer;
                        const isUserChoice = userAnswer?.singleChoiceSelected === optKey;

                        return (
                          <div
                            key={optKey}
                            className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                              isCorrectKey
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold'
                                : isUserChoice && !isCorrectKey
                                ? 'bg-rose-50 border-rose-300 text-rose-950'
                                : 'bg-slate-50/70 border-slate-200 text-slate-700'
                            }`}
                          >
                            <span className={`w-6 h-6 rounded-md font-bold text-xs flex items-center justify-center shrink-0 ${
                              isCorrectKey
                                ? 'bg-emerald-600 text-white'
                                : isUserChoice
                                ? 'bg-rose-600 text-white'
                                : 'bg-slate-200 text-slate-700'
                            }`}>
                              {optKey}
                            </span>
                            <span className="pt-0.5 flex-1">{optText}</span>
                            {isCorrectKey && (
                              <span className="text-[11px] font-bold text-emerald-700 shrink-0">
                                [Đáp án đúng]
                              </span>
                            )}
                            {isUserChoice && !isCorrectKey && (
                              <span className="text-[11px] font-bold text-rose-700 shrink-0">
                                [Bạn chọn]
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* True/False Statements Display */}
                  {q.type === 'true_false' && q.subQuestions && (
                    <div className="space-y-2 mb-4">
                      {q.subQuestions.map(sub => {
                        const userVal = userAnswer?.trueFalseSelected?.[sub.label];
                        const isSubCorrect = userVal === sub.isCorrect;

                        return (
                          <div
                            key={sub.id}
                            className={`p-3 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                              isSubCorrect ? 'bg-emerald-50/60 border-emerald-200' : 'bg-rose-50/60 border-rose-200'
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <span className="font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-md">
                                {sub.label}
                              </span>
                              <span className="text-slate-800">{sub.statement}</span>
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-center shrink-0 text-[11px]">
                              <span>Bạn chọn: <strong className={userVal === sub.isCorrect ? 'text-emerald-700' : 'text-rose-700'}>
                                {userVal === true ? 'ĐÚNG' : userVal === false ? 'SAI' : 'Chưa chọn'}
                              </strong></span>
                              <span>• Chuẩn: <strong className="text-blue-700">{sub.isCorrect ? 'ĐÚNG' : 'SAI'}</strong></span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Detailed Pedagogical Explanation & Lesson Pointer */}
                  <div className="p-4 bg-indigo-50/80 border border-indigo-100 rounded-xl text-xs text-indigo-950 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-indigo-900">
                      <HelpCircle className="w-4 h-4 text-indigo-600" />
                      <span>Hướng Dẫn Giải & Phân Tích:</span>
                    </div>
                    <p className="leading-relaxed text-slate-700">{q.explanation}</p>
                    
                    {lesson && (
                      <div className="pt-2 text-[11px] text-indigo-800 flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Bài học tham chiếu: <strong>{lesson.title}</strong></span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bookmark with Note Modal */}
      {bookmarkingQuestionId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
                <Bookmark className="w-5 h-5 fill-amber-500" />
                <span>Lưu Vào Sổ Tay Nghiên Cứu Sâu</span>
              </div>
              <button onClick={() => setBookmarkingQuestionId(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-3">
              Ghi chú lại lý do cần nghiên cứu sâu hoặc điểm bạn còn phân vân trong câu này:
            </p>

            <textarea
              value={bookmarkNote}
              onChange={(e) => setBookmarkNote(e.target.value)}
              placeholder="ví dụ: Cần xem lại cú pháp lệnh GROUP BY và HAVING trong SQL..."
              rows={3}
              className="w-full p-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-hidden mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setBookmarkingQuestionId(null)}
                className="px-3.5 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveBookmarkWithNote}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Lưu Câu Hỏi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
