import React, { useState } from 'react';
import { useExam } from '../context/ExamContext';
import { useTheory } from '../context/TheoryContext';
import { useAuth } from '../context/AuthContext';
import { MasteryStatus } from '../types';
import { 
  Bookmark, 
  BookOpen, 
  Play, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  AlertCircle, 
  Code, 
  Filter, 
  Lightbulb,
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface QuestionNotebookViewProps {
  onOpenQuickTheory: (lessonId: string) => void;
}

export const QuestionNotebookView: React.FC<QuestionNotebookViewProps> = ({ onOpenQuickTheory }) => {
  const { currentUser } = useAuth();
  const { bookmarks, removeBookmark, updateBookmark, startBookmarkPractice } = useExam();
  const { topics, getLessonById } = useTheory();

  const [filterTopic, setFilterTopic] = useState<string>('all');
  const [filterMastery, setFilterMastery] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedNote, setEditedNote] = useState<string>('');
  const [editedMastery, setEditedMastery] = useState<MasteryStatus>('need_review');

  const userBookmarks = bookmarks.filter(b => !currentUser || b.userId === currentUser.id);

  const filteredBookmarks = userBookmarks.filter(b => {
    const matchesTopic = filterTopic === 'all' || b.question.topicId === filterTopic;
    const matchesMastery = filterMastery === 'all' || b.masteryStatus === filterMastery;
    return matchesTopic && matchesMastery;
  });

  const handleStartEdit = (b: any) => {
    setEditingId(b.questionId);
    setEditedNote(b.note || '');
    setEditedMastery(b.masteryStatus || 'need_review');
  };

  const handleSaveEdit = (questionId: string) => {
    updateBookmark(questionId, editedNote, editedMastery);
    setEditingId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-white/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 border border-white/30 backdrop-blur-md rounded-full text-xs font-bold text-white mb-2">
            <Bookmark className="w-3.5 h-3.5 fill-current" />
            <span>Sổ tay câu hỏi cần nghiên cứu sâu</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Kho câu hỏi khó & cần nghiền ngẫm
          </h1>
          <p className="text-xs sm:text-sm text-amber-50 mt-1 max-w-2xl leading-relaxed">
            Nơi lưu trữ các câu hỏi bạn cần xem lại, kèm ghi chú riêng biệt và liên kết thẳng đến bài học lý thuyết tương ứng.
          </p>
        </div>

        {/* Practice CTA */}
        {userBookmarks.length > 0 && (
          <button
            onClick={startBookmarkPractice}
            className="relative z-10 px-5 py-3 bg-white hover:bg-amber-50 text-amber-900 font-extrabold text-xs sm:text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 shrink-0 group"
          >
            <Play className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
            <span>Luyện tập {userBookmarks.length} câu trong sổ tay</span>
          </button>
        )}
      </div>

      {/* Filter and Stats Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        
        {/* Topic & Mastery Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Lọc:</span>
          </div>

          <select
            value={filterTopic}
            onChange={(e) => setFilterTopic(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-200 rounded-xl outline-hidden bg-white"
          >
            <option value="all">Tất cả chủ đề</option>
            {topics.map(t => (
              <option key={t.id} value={t.id}>{t.shortTitle}</option>
            ))}
          </select>

          <select
            value={filterMastery}
            onChange={(e) => setFilterMastery(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-200 rounded-xl outline-hidden bg-white"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="need_review">Cần nghiên cứu gấp</option>
            <option value="in_progress">Đang củng cố</option>
            <option value="mastered">Đã thành thạo</option>
          </select>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Tổng cộng: <strong className="text-amber-700 font-bold">{filteredBookmarks.length}</strong> câu hỏi đã lưu
        </div>
      </div>

      {/* Bookmarks Grid / List */}
      <div className="space-y-4">
        {filteredBookmarks.map(b => {
          const q = b.question;
          const topic = topics.find(t => t.id === q.topicId);
          const lesson = getLessonById(q.lessonId);
          const isEditing = editingId === b.questionId;

          return (
            <div
              key={b.id}
              className="bg-white rounded-3xl border border-slate-200/90 hover:border-amber-300 transition-all p-5 sm:p-6 shadow-xs space-y-4"
            >
              {/* Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${topic?.bgLight || 'bg-slate-100'}`}>
                    {topic?.shortTitle}
                  </span>
                  <span className="text-xs font-semibold text-slate-600">
                    {q.type === 'single_choice' ? 'Phần I (4 lựa chọn)' : 'Phần II (Đúng/Sai)'}
                  </span>
                  
                  {/* Mastery Badge */}
                  <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                    b.masteryStatus === 'mastered'
                      ? 'bg-emerald-100 text-emerald-800'
                      : b.masteryStatus === 'in_progress'
                      ? 'bg-sky-100 text-sky-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {b.masteryStatus === 'mastered' ? 'Đã thành thạo' : b.masteryStatus === 'in_progress' ? 'Đang củng cố' : 'Cần nghiên cứu gấp'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* 📖 Tham khảo lý thuyết button */}
                  <button
                    onClick={() => onOpenQuickTheory(q.lessonId)}
                    className="px-3.5 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200/80 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-sky-600" />
                    <span>Tham khảo lý thuyết</span>
                  </button>

                  <button
                    onClick={() => handleStartEdit(b)}
                    className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-colors"
                    title="Chỉnh sửa ghi chú"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => removeBookmark(q.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Xóa khỏi sổ tay"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Question Statement */}
              <div className="text-sm font-medium text-slate-900 leading-relaxed whitespace-pre-line">
                {q.content}
              </div>

              {/* Code snippet if any */}
              {q.codeSnippet && (
                <div className="rounded-2xl border border-slate-200 overflow-hidden">
                  <div className="bg-slate-800 px-3.5 py-1 text-slate-200 text-xs font-mono">
                    Mã nguồn {q.codeSnippet.language}
                  </div>
                  <pre className="p-3.5 bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto">
                    <code>{q.codeSnippet.code}</code>
                  </pre>
                </div>
              )}

              {/* Personal Notes Section */}
              {isEditing ? (
                <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-amber-900">Ghi chú cá nhân cần nhớ:</label>
                    <select
                      value={editedMastery}
                      onChange={(e) => setEditedMastery(e.target.value as MasteryStatus)}
                      className="text-xs border border-amber-300 rounded-xl p-1 bg-white"
                    >
                      <option value="need_review">Cần nghiên cứu gấp</option>
                      <option value="in_progress">Đang củng cố</option>
                      <option value="mastered">Đã thành thạo</option>
                    </select>
                  </div>
                  <textarea
                    value={editedNote}
                    onChange={(e) => setEditedNote(e.target.value)}
                    rows={2}
                    className="w-full p-2.5 text-xs bg-white border border-amber-300 rounded-xl outline-hidden"
                    placeholder="Nhập lưu ý hoặc mẹo giải bài này..."
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1 text-xs text-slate-600 hover:bg-amber-100 rounded-lg"
                    >
                      Hủy
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveEdit(q.id)}
                      className="px-3.5 py-1 text-xs font-bold bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                    >
                      Lưu ghi chú
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-3.5 flex items-start gap-2.5">
                  <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-950 flex-1">
                    <span className="font-bold text-amber-900">Ghi chú của bạn: </span>
                    <span>{b.note || 'Chưa có ghi chú riêng. Bấm vào biểu tượng bút để thêm lưu ý.'}</span>
                  </div>
                </div>
              )}

              {/* Explanation & Reference Lesson */}
              <div className="p-3.5 bg-slate-50 border border-slate-200/70 rounded-2xl text-xs space-y-1">
                <div className="font-bold text-slate-800 flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
                  <span>Đáp án & giải thích chi tiết:</span>
                </div>
                <p className="text-slate-600">{q.explanation}</p>
                {lesson && (
                  <div className="text-[11px] text-sky-700 font-medium pt-1">
                    📖 Bài học tham chiếu: {lesson.title}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filteredBookmarks.length === 0 && (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center text-slate-400 space-y-3">
            <Bookmark className="w-12 h-12 mx-auto opacity-40 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-700">Sổ tay hiện đang trống</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Khi làm bài thi thử hoặc xem lại kết quả, bấm nút <strong>⭐ Lưu câu hỏi</strong> ở bất kỳ câu nào bạn thấy hay, khó hoặc cần hiểu sâu để ôn tập lại tại đây.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
