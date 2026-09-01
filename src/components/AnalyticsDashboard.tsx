import React from 'react';
import { useExam } from '../context/ExamContext';
import { useTheory } from '../context/TheoryContext';
import { useAuth } from '../context/AuthContext';
import { 
  BarChart3, 
  TrendingUp, 
  Award, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Flame, 
  Sparkles, 
  BookOpen, 
  Calendar, 
  ChevronRight 
} from 'lucide-react';

interface AnalyticsDashboardProps {
  onOpenQuickTheory: (lessonId: string) => void;
  onGoToExams: () => void;
  onViewResult: (resultId: string) => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  onOpenQuickTheory,
  onGoToExams,
  onViewResult
}) => {
  const { currentUser } = useAuth();
  const { examResults, setCurrentResult } = useExam();
  const { topics, lessons } = useTheory();

  const userResults = examResults.filter(r => !currentUser || r.userId === currentUser.id);

  // Aggregate stats across all exams taken
  const totalExams = userResults.length;
  const avgScore = totalExams > 0
    ? (userResults.reduce((acc, r) => acc + r.score, 0) / totalExams).toFixed(2)
    : '0.00';
  const highestScore = totalExams > 0
    ? Math.max(...userResults.map(r => r.score)).toFixed(2)
    : '0.00';

  // Aggregate performance per topic
  const topicStats: Record<string, { totalItems: number; correctItems: number }> = {};
  userResults.forEach(res => {
    res.topicPerformance.forEach(perf => {
      if (!topicStats[perf.topicId]) {
        topicStats[perf.topicId] = { totalItems: 0, correctItems: 0 };
      }
      topicStats[perf.topicId].totalItems += perf.totalItems;
      topicStats[perf.topicId].correctItems += perf.correctItems;
    });
  });

  const topicSummary = topics.map(t => {
    const stat = topicStats[t.id] || { totalItems: 0, correctItems: 0 };
    const percentage = stat.totalItems > 0 ? Math.round((stat.correctItems / stat.totalItems) * 100) : 0;
    const isMastered = percentage >= 75;
    const isWeak = stat.totalItems > 0 && percentage < 55;

    return {
      ...t,
      totalAnswered: stat.totalItems,
      correctCount: stat.correctItems,
      percentage,
      isMastered,
      isWeak
    };
  });

  const strongTopics = topicSummary.filter(t => t.isMastered && t.totalAnswered > 0);
  const weakTopics = topicSummary.filter(t => t.isWeak && t.totalAnswered > 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-blue-900 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-bold text-teal-200 mb-2">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Hệ thống phân tích năng lực học tập</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Báo cáo tổng hợp và lộ trình ôn luyện
            </h1>
            <p className="text-xs sm:text-sm text-teal-100 mt-1 max-w-2xl">
              Hệ thống tự động phân tích dữ liệu các lần làm bài thi thử để chỉ ra chính xác các chuyên đề bạn đã nắm vững và các nội dung cần được củng cố.
            </p>
          </div>

          {/* Quick Target KPI */}
          {currentUser && currentUser.role === 'student' && (
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/20 text-center shrink-0 min-w-[180px]">
              <div className="text-xs text-teal-200">Mục tiêu điểm số THPT</div>
              <div className="text-3xl font-black text-amber-300 my-1 font-mono">
                {currentUser.targetScore || 9.0}
                <span className="text-xs font-normal text-white/70"> / 10.0</span>
              </div>
              <div className="text-[11px] text-white/80 font-semibold">
                Điểm TB hiện tại: <span className="text-emerald-300 font-bold">{avgScore}</span>
              </div>
            </div>
          )}
        </div>

        {/* Global Performance Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/15">
          <div className="bg-white/10 rounded-xl p-3">
            <div className="text-[11px] text-teal-200">Số đề thi đã làm</div>
            <div className="text-xl font-bold text-white">{totalExams} bài</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <div className="text-[11px] text-teal-200">Điểm trung bình</div>
            <div className="text-xl font-bold text-amber-300">{avgScore}</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <div className="text-[11px] text-teal-200">Điểm cao nhất</div>
            <div className="text-xl font-bold text-emerald-300">{highestScore}</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <div className="text-[11px] text-teal-200">Chuyên đề vững vàng</div>
            <div className="text-xl font-bold text-teal-200">{strongTopics.length} / {topics.length}</div>
          </div>
        </div>
      </div>

      {/* Strengths and Weaknesses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Strengths */}
        <div className="bg-white rounded-2xl border border-emerald-200 p-6 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-4">
            <Flame className="w-5 h-5 text-emerald-600" />
            <span>Nội dung kiến thức mạnh (Đã vững vàng)</span>
          </div>

          {strongTopics.length > 0 ? (
            <div className="space-y-3">
              {strongTopics.map(t => (
                <div key={t.id} className="p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-emerald-950">{t.title}</div>
                    <div className="text-[11px] text-emerald-700">Tỷ lệ chính xác: {t.percentage}% ({t.correctCount}/{t.totalAnswered} ý)</div>
                  </div>
                  <span className="px-2 py-1 text-[10px] font-bold bg-emerald-200 text-emerald-900 rounded-lg">
                    Thành thạo
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-slate-400 text-xs bg-slate-50 rounded-xl">
              Chưa có đủ dữ liệu. Hãy hoàn thành thêm các bài thi thử để hệ thống nhận diện điểm mạnh của bạn.
            </div>
          )}
        </div>

        {/* Weaknesses */}
        <div className="bg-white rounded-2xl border border-rose-200 p-6 shadow-xs">
          <div className="flex items-center gap-2 text-rose-800 font-bold text-sm mb-4">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <span>Nội dung cần được củng cố và ưu tiên ôn tập</span>
          </div>

          {weakTopics.length > 0 ? (
            <div className="space-y-3">
              {weakTopics.map(t => {
                const topicLessons = lessons.filter(l => l.topicId === t.id);
                const firstLesson = topicLessons[0];

                return (
                  <div key={t.id} className="p-3.5 bg-rose-50/70 border border-rose-100 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-rose-950">{t.title}</div>
                      <div className="text-[11px] text-rose-700">Tỷ lệ đúng: {t.percentage}% ({t.correctCount}/{t.totalAnswered} ý)</div>
                    </div>
                    {firstLesson && (
                      <button
                        onClick={() => onOpenQuickTheory(firstLesson.id)}
                        className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Ôn lý thuyết</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-6 text-center text-emerald-700 text-xs bg-emerald-50 rounded-xl font-medium flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Tuyệt vời! Hiện tại bạn không bị hổng kiến thức ở các chủ đề đã làm.</span>
            </div>
          )}
        </div>
      </div>

      {/* Curriculum Mastery Grid A-G */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          <span>Mức độ nắm vững toàn diện các phân môn (Chương trình Tin học 12)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topicSummary.map(topic => {
            const hasData = topic.totalAnswered > 0;

            return (
              <div
                key={topic.id}
                className={`p-4 rounded-xl border transition-all ${
                  topic.isMastered
                    ? 'border-emerald-200 bg-emerald-50/30'
                    : topic.isWeak
                    ? 'border-rose-200 bg-rose-50/30'
                    : 'border-slate-200 bg-slate-50/30'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${topic.bgLight}`}>
                    {topic.shortTitle}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-700">
                    {hasData ? `${topic.percentage}%` : 'Chưa thi'}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-800 line-clamp-1 mb-2">
                  {topic.title}
                </h4>

                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      topic.isMastered ? 'bg-emerald-500' : topic.isWeak ? 'bg-rose-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.max(hasData ? 5 : 0, topic.percentage)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>{hasData ? `${topic.correctCount}/${topic.totalAnswered} câu đúng` : '0 câu đã làm'}</span>
                  <span className="capitalize">{topic.track}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Historical Exam Results Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-600" />
          <span>Lịch sử các bài thi đã thực hiện ({userResults.length})</span>
        </h3>

        {userResults.length > 0 ? (
          <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
            {userResults.map(res => (
              <div
                key={res.id}
                onClick={() => {
                  setCurrentResult(res);
                  onViewResult(res.id);
                }}
                className="py-3.5 px-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer flex items-center justify-between gap-4"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 leading-snug">{res.examTitle}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {new Date(res.completedAt).toLocaleDateString('vi-VN')} lúc {new Date(res.completedAt).toLocaleTimeString('vi-VN')} • Thời gian làm: {Math.floor(res.timeSpentSeconds / 60)}p
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div className="text-sm font-black font-mono text-blue-700">{res.score.toFixed(2)}/10</div>
                    <div className="text-[10px] text-slate-400">Đúng {res.totalCorrectQuestions}/{res.totalQuestions} câu</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 rounded-xl text-slate-400 text-xs">
            Bạn chưa thực hiện bài thi thử nào. Hãy chọn một đề thi để bắt đầu luyện tập!
          </div>
        )}
      </div>
    </div>
  );
};
