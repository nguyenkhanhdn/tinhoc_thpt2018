import React, { useState } from 'react';
import { useExam } from '../context/ExamContext';
import { useTheory } from '../context/TheoryContext';
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
  Tag
} from 'lucide-react';

interface ExamListProps {
  onOpenQuickTheory: (lessonId: string) => void;
}

export const ExamList: React.FC<ExamListProps> = ({ onOpenQuickTheory }) => {
  const { exams, startExam, questionsBank } = useExam();
  const { topics } = useTheory();

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-sm relative overflow-hidden border border-indigo-800/40">
        {/* Subtle decorative background circles */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-indigo-200 mb-3 border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Kỳ Thi Tốt Nghiệp THPT Môn Tin Học</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Hệ Thống Đề Thi Thử & Luyện Tập Chuẩn Bộ GD&ĐT
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Đề thi cấu trúc chuẩn: <strong>24 câu trắc nghiệm nhiều phương án (Phần I)</strong> và <strong>4 câu trắc nghiệm Đúng/Sai đa ý a-b-c-d (Phần II)</strong>. Tích hợp liên kết tham chiếu lý thuyết trực tiếp và chẩn đoán năng lực điểm mạnh/điểm yếu sau khi nộp bài.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 border border-white/10">
              <div className="text-[11px] text-slate-300 font-medium">Thời gian làm bài</div>
              <div className="text-lg font-bold text-white">50 Phút</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 border border-white/10">
              <div className="text-[11px] text-slate-300 font-medium">Tổng thang điểm</div>
              <div className="text-lg font-bold text-amber-300">10.0 Điểm</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 border border-white/10">
              <div className="text-[11px] text-slate-300 font-medium">Cấu trúc đề</div>
              <div className="text-lg font-bold text-white">Phần I + II</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 border border-white/10">
              <div className="text-[11px] text-slate-300 font-medium">Ngân hàng câu hỏi</div>
              <div className="text-lg font-bold text-emerald-400">{questionsBank.length}+ Câu</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        
        {/* Track Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-xs font-bold text-slate-500 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-indigo-600" />
            Định hướng:
          </span>
          <button
            onClick={() => setSelectedTrack('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedTrack === 'ALL' ? 'bg-indigo-700 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tất Cả Phân Môn
          </button>
          <button
            onClick={() => setSelectedTrack('ICT')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedTrack === 'ICT' ? 'bg-indigo-700 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tin Học Ứng Dụng (ICT)
          </button>
          <button
            onClick={() => setSelectedTrack('CS')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedTrack === 'CS' ? 'bg-indigo-700 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Khoa Học Máy Tính (CS)
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
              selectedCategory === 'ALL' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            Tất cả đề
          </button>
          <button
            onClick={() => setSelectedCategory('OFFICIAL')}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
              selectedCategory === 'OFFICIAL' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            Đề Chuẩn Bộ GD&ĐT
          </button>
          <button
            onClick={() => setSelectedCategory('TOPIC')}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
              selectedCategory === 'TOPIC' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            Đề Chuyên Đề
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
              className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
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
                      <span className="px-2.5 py-0.5 text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full">
                        Đề Luyện Tập
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400">
                    Năm {exam.year}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-700 transition-colors leading-snug line-clamp-2">
                  {exam.title}
                </h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                  {exam.description}
                </p>

                {/* Exam Structure Specs */}
                <div className="grid grid-cols-3 gap-2 mt-4 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-center text-xs">
                  <div>
                    <div className="text-[10px] text-slate-400 font-medium">Thời gian</div>
                    <div className="font-bold text-slate-700 flex items-center justify-center gap-1">
                      <Clock className="w-3 h-3 text-indigo-600" />
                      {exam.durationMinutes}p
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-medium">Phần I (4 Lựa chọn)</div>
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
                    <span key={idx} className="text-[10px] font-medium px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Actions */}
              <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => startExam(exam, 'exam')}
                  className="flex-1 py-2 px-3 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Vào Thi Thử (50p)</span>
                </button>
                <button
                  onClick={() => startExam(exam, 'practice')}
                  title="Luyện tập tự do, xem đáp án & lý thuyết tức thì"
                  className="py-2 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1"
                >
                  <BookOpen className="w-3.5 h-3.5 text-indigo-700" />
                  <span>Ôn Tập</span>
                </button>
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
