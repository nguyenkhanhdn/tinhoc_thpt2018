import React from 'react';
import { useTheory } from '../context/TheoryContext';
import { X, BookOpen, Lightbulb, AlertTriangle, Code, CheckCircle, ExternalLink, Bookmark } from 'lucide-react';

interface QuickTheoryModalProps {
  lessonId: string | null;
  onClose: () => void;
  onOpenFullTheory?: (lessonId: string) => void;
}

export const QuickTheoryModal: React.FC<QuickTheoryModalProps> = ({
  lessonId,
  onClose,
  onOpenFullTheory
}) => {
  const { getLessonById, topics } = useTheory();

  if (!lessonId) return null;

  const lesson = getLessonById(lessonId);
  if (!lesson) return null;

  const topic = topics.find(t => t.id === lesson.topicId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 via-blue-700 to-sky-700 p-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 text-[11px] font-bold bg-white/20 text-white rounded-md backdrop-blur-xs">
              {topic ? topic.shortTitle : 'Lý thuyết trọng tâm'}
            </span>
            <span className="text-blue-200 text-xs">Tham chiếu kiến thức môn học</span>
          </div>

          <h2 className="text-lg font-bold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-sky-200" />
            {lesson.title}
          </h2>
          <p className="text-xs text-blue-100 mt-1 line-clamp-2">
            {lesson.summary}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-800 text-sm">
          
          {/* Key Takeaways (Trọng tâm kiến thức) */}
          <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-4">
            <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs uppercase tracking-wider mb-2.5">
              <Lightbulb className="w-4 h-4 text-indigo-600" />
              <span>Điểm kiến thức cốt lõi cần nhớ:</span>
            </div>
            <ul className="space-y-2">
              {lesson.keyTakeaways.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-indigo-950">
                  <CheckCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Exam Tips (Mẹo tránh bẫy đề thi) */}
          {lesson.examTips && lesson.examTips.length > 0 && (
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Mẹo làm bài và cảnh báo bẫy đề thi:</span>
              </div>
              <ul className="space-y-1.5">
                {lesson.examTips.map((tip, idx) => (
                  <li key={idx} className="text-xs text-amber-900 flex items-start gap-2">
                    <span className="font-bold text-amber-600">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Code Snippets (if any) */}
          {lesson.codeSnippets && lesson.codeSnippets.map((snippet, idx) => (
            <div key={idx} className="rounded-xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-800 px-3.5 py-2 text-slate-200 text-xs font-mono font-semibold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code className="w-3.5 h-3.5 text-sky-400" />
                  <span>{snippet.title} ({snippet.language.toUpperCase()})</span>
                </div>
              </div>
              <pre className="p-4 bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed">
                <code>{snippet.code}</code>
              </pre>
            </div>
          ))}

          {/* Main Markdown Text */}
          <div className="prose prose-slate max-w-none text-xs leading-relaxed space-y-3 pt-2 border-t border-slate-100">
            <div className="whitespace-pre-line text-slate-700">
              {lesson.contentMarkdown}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            Biên soạn: <span className="font-semibold text-slate-700">{lesson.author}</span> • Cập nhật: {lesson.updatedAt}
          </div>
          <div className="flex items-center gap-2">
            {onOpenFullTheory && (
              <button
                onClick={() => {
                  onClose();
                  onOpenFullTheory(lesson.id);
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-50 border border-blue-200 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <span>Xem toàn bộ bài học</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-xl transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
