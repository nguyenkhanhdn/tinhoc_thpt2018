import React, { useState } from 'react';
import { useExam } from '../context/ExamContext';
import { useTheory } from '../context/TheoryContext';
import { useAuth } from '../context/AuthContext';
import { Exam, StudyTrack } from '../types';
import { 
  FileText, 
  Clock, 
  Award, 
  Sparkles, 
  Play, 
  HelpCircle, 
  CheckCircle2, 
  Flame, 
  GraduationCap, 
  BookOpen,
  Filter,
  BarChart,
  Tag,
  Lock,
  LogIn,
  AlertCircle
} from 'lucide-react';

interface ExamListProps {
  onOpenQuickTheory: (lessonId: string) => void;
  onOpenAuth?: (mode?: 'login' | 'register') => void;
}

export const ExamList: React.FC<ExamListProps> = ({ onOpenQuickTheory, onOpenAuth }) => {
  const { exams, startExam, questionsBank } = useExam();
  const { topics } = useTheory();
  const { isAuthenticated } = useAuth();

  const [selectedTrack, setSelectedTrack] = useState<StudyTrack>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'OFFICIAL' | 'TOPIC'>('ALL');

  const filteredExams = exams.filter(exam => {
    const matchesTrack = selectedTrack === 'ALL' || exam.targetTrack === selectedTrack || exam.targetTrack === 'ALL';
    const matchesCategory = 
      selectedCategory === 'ALL' ||
      (selectedCategory === 'OFFICIAL' && exam.isOfficial) ||
      (selectedCategory === 'TOPIC' && !exam.isOfficial);

    return matchesTrack && matchesCategory;
  });

  const handleStartExamAction = (exam: Exam, mode: 'exam' | 'practice') => {
    if (!isAuthenticated) {
      if (onOpenAuth) {
        onOpenAuth('login');
      }
      return;
    }
    startExam(exam, mode);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Unauthenticated Guest Warning Notice */}
      {!isAuthenticated && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-900 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-xl text-amber-700">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-900">
                Chế độ xem trước danh sách đề thi (Chưa đăng nhập)
              </div>
              <div className="text-[11px] text-amber-700 mt-0.5">
                Các tính năng bấm giờ thi, nộp bài, lưu điểm số và phân tích năng lực đang bị vô hiệu hóa.
              </div>
            </div>
          </div>

          <button
            onClick={() => onOpenAuth && onOpenAuth('login')}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-colors shadow-xs flex items-center gap-1.5 shrink-0"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Đăng nhập để kích hoạt</span>
          </button>
        </div>
      )}

      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-sky-500 via-indigo-600 to-blue-600 rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-md relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-white/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-60 h-60 bg-sky-300/20 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-white mb-3 border border-white/30 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Kỳ thi tốt nghiệp THPT môn Tin học</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            Hệ thống đề thi thử & luyện tập chuẩn Bộ GD&ĐT
          </h1>
          <p className="text-xs sm:text-sm text-blue-50 mt-2.5 leading-relaxed font-normal">
            Đề thi cấu trúc chuẩn: <strong>24 câu trắc nghiệm 4 lựa chọn (Phần I)</strong> và <strong>4 câu trắc nghiệm đúng/sai đa ý a-b-c-d (Phần II)</strong>. Tích hợp liên kết tham chiếu lý thuyết trực tiếp và chẩn đoán năng lực điểm mạnh/điểm yếu sau khi nộp bài.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3.5 border border-white/20">
              <div className="text-[11px] text-blue-100 font-medium">Thời gian làm bài</div>
              <div className="text-lg font-bold text-white">50 phút</div>
            </div>
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3.5 border border-white/20">
              <div className="text-[11px] text-blue-100 font-medium">Tổng thang điểm</div>
              <div className="text-lg font-bold text-amber-200">10,0 điểm</div>
            </div>
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3.5 border border-white/20">
              <div className="text-[11px] text-blue-100 font-medium">Cấu trúc đề</div>
              <div className="text-lg font-bold text-white">Phần I + II</div>
            </div>
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3.5 border border-white/20">
              <div className="text-[11px] text-blue-100 font-medium">Ngân hàng câu hỏi</div>
              <div className="text-lg font-bold text-emerald-200">{questionsBank.length}+ câu</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        
        {/* Track Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-slate-500 mr-2 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5 text-indigo-600" />
            Định hướng:
          </span>
          <button
            onClick={() => setSelectedTrack('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              selectedTrack === 'ALL' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            Tất cả phân môn
          </button>
          <button
            onClick={() => setSelectedTrack('ICT')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              selectedTrack === 'ICT' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            Tin học ứng dụng (ICT)
          </button>
          <button
            onClick={() => setSelectedTrack('CS')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              selectedTrack === 'CS' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            Khoa học máy tính (CS)
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 text-xs rounded-xl font-medium transition-colors ${
              selectedCategory === 'ALL' ? 'bg-slate-800 text-white font-semibold shadow-xs' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            Tất cả đề
          </button>
          <button
            onClick={() => setSelectedCategory('OFFICIAL')}
            className={`px-3 py-1.5 text-xs rounded-xl font-medium transition-colors ${
              selectedCategory === 'OFFICIAL' ? 'bg-slate-800 text-white font-semibold shadow-xs' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            Đề chuẩn Bộ GD&ĐT
          </button>
          <button
            onClick={() => setSelectedCategory('TOPIC')}
            className={`px-3 py-1.5 text-xs rounded-xl font-medium transition-colors ${
              selectedCategory === 'TOPIC' ? 'bg-slate-800 text-white font-semibold shadow-xs' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            Đề chuyên đề
          </button>
        </div>
      </div>

      {/* Exam Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExams.map(exam => {
          const part1Q = exam.questions.filter(q => q.type === 'single_choice').length;
          const part2Q = exam.questions.filter(q => q.type === 'true_false').length;

          return (
            <div
              key={exam.id}
              className="bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
            >
              {/* Card Header */}
              <div className="p-5">
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-1.5">
                    {exam.isOfficial ? (
                      <span className="px-2.5 py-0.5 text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 rounded-full flex items-center gap-1">
                        <Flame className="w-3 h-3 text-amber-500" />
                        Chuẩn Bộ GD&ĐT
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200 rounded-full">
                        Đề luyện tập
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400">
                    Năm {exam.year}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug line-clamp-2">
                  {exam.title}
                </h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                  {exam.description}
                </p>

                {/* Exam Structure Specs */}
                <div className="grid grid-cols-3 gap-2 mt-4 p-2.5 bg-slate-50/80 rounded-2xl border border-slate-100 text-center text-xs">
                  <div>
                    <div className="text-[10px] text-slate-400 font-medium">Thời gian</div>
                    <div className="font-bold text-slate-700 flex items-center justify-center gap-1">
                      <Clock className="w-3 h-3 text-sky-600" />
                      {exam.durationMinutes} phút
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-medium">Phần I (4 lựa chọn)</div>
                    <div className="font-bold text-slate-700">{part1Q} câu</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-medium">Phần II (Đúng/Sai)</div>
                    <div className="font-bold text-slate-700">{part2Q} câu</div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {exam.tags.map((tag, idx) => (
                    <span key={idx} className="text-[10px] font-medium px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-lg">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Actions */}
              <div className="p-4 bg-slate-50/60 border-t border-slate-100 flex items-center gap-2">
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => handleStartExamAction(exam, 'exam')}
                      className="flex-1 py-2.5 px-3 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Vào thi thử (50 phút)</span>
                    </button>
                    <button
                      onClick={() => handleStartExamAction(exam, 'practice')}
                      title="Luyện tập tự do, xem đáp án & lý thuyết tức thì"
                      className="py-2.5 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Ôn tập</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleStartExamAction(exam, 'exam')}
                    className="w-full py-2.5 px-3 bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 font-bold text-xs rounded-xl border border-dashed border-slate-300 hover:border-indigo-300 transition-all flex items-center justify-center gap-2"
                  >
                    <Lock className="w-3.5 h-3.5 text-amber-500" />
                    <span>Đăng nhập để vào làm bài thi</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredExams.length === 0 && (
        <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300 text-slate-400 text-sm my-6">
          Không tìm thấy đề thi phù hợp với bộ lọc hiện tại.
        </div>
      )}
    </div>
  );
};
