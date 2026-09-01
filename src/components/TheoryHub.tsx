import React, { useState } from 'react';
import { useTheory } from '../context/TheoryContext';
import { useExam } from '../context/ExamContext';
import { SubjectTopic, TheoryLesson, StudyTrack } from '../types';
import { 
  BookOpen, 
  Search, 
  Lightbulb, 
  AlertTriangle, 
  Code, 
  CheckCircle, 
  Layers, 
  PlayCircle, 
  Cpu, 
  Globe, 
  ShieldCheck, 
  Database, 
  Code2, 
  Briefcase,
  Sparkles,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';

interface TheoryHubProps {
  initialLessonId?: string | null;
  onStartLessonPractice?: (topicId: string) => void;
}

export const TheoryHub: React.FC<TheoryHubProps> = ({ initialLessonId, onStartLessonPractice }) => {
  const { topics, lessons, getLessonsByTopic, getLessonById } = useTheory();
  const { questionsBank, startExam } = useExam();

  const [selectedTopicId, setSelectedTopicId] = useState<string>('all');
  const [selectedTrack, setSelectedTrack] = useState<StudyTrack>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeLessonId, setActiveLessonId] = useState<string | null>(initialLessonId || lessons[0]?.id || null);

  const activeLesson = activeLessonId ? getLessonById(activeLessonId) : null;
  const activeTopic = activeLesson ? topics.find(t => t.id === activeLesson.topicId) : null;

  // Filter lessons
  const filteredLessons = lessons.filter(l => {
    const parentTopic = topics.find(t => t.id === l.topicId);
    const matchesTopic = selectedTopicId === 'all' || l.topicId === selectedTopicId;
    const matchesTrack = selectedTrack === 'ALL' || (parentTopic && (parentTopic.track === selectedTrack || parentTopic.track === 'CORE'));
    const matchesSearch = searchQuery.trim() === '' || 
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.contentMarkdown.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTopic && matchesTrack && matchesSearch;
  });

  const getTopicIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu': return <Cpu className="w-4 h-4" />;
      case 'Globe': return <Globe className="w-4 h-4" />;
      case 'ShieldCheck': return <ShieldCheck className="w-4 h-4" />;
      case 'Database': return <Database className="w-4 h-4" />;
      case 'Code2': return <Code2 className="w-4 h-4" />;
      case 'Briefcase': return <Briefcase className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const handleStartPracticeForLesson = (lesson: TheoryLesson) => {
    const matchedQuestions = questionsBank.filter(q => q.lessonId === lesson.id || q.topicId === lesson.topicId);
    if (matchedQuestions.length === 0) return;

    startExam({
      id: `practice_lesson_${lesson.id}`,
      title: `Luyện Tập Củng Cố: ${lesson.title}`,
      description: `Bộ câu hỏi trắc nghiệm rèn luyện trực tiếp kiến thức trọng tâm bài học ${lesson.title}.`,
      durationMinutes: Math.max(15, matchedQuestions.length * 2),
      year: 2025,
      targetTrack: 'ALL',
      totalPoints: 10.0,
      part1Count: matchedQuestions.filter(q => q.type === 'single_choice').length,
      part2Count: matchedQuestions.filter(q => q.type === 'true_false').length,
      questions: matchedQuestions,
      createdBy: 'Hệ thống Tự luyện',
      createdAt: new Date().toISOString().split('T')[0],
      tags: ['Tự luyện bài học', lesson.title],
      isOfficial: false
    }, 'practice');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-sm border border-indigo-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-white/10 text-indigo-200 border border-white/15 rounded-full">
                Thư viện số hóa
              </span>
              <span className="text-xs text-slate-300">Chuẩn chương trình GDPT 2018</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Hệ thống kiến thức trọng tâm Tin học 12
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Tra cứu nhanh lý thuyết, sơ đồ tư duy, cú pháp Python / SQL, mẹo tránh bẫy đề thi tốt nghiệp THPT theo từng chủ đề A, B, D, E, F, G.
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full md:w-80">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm bài học, SQL, Python..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-white/10 border border-white/15 text-white placeholder-slate-400 rounded-xl focus:outline-hidden focus:bg-white/15 focus:border-indigo-400"
              />
            </div>
          </div>
        </div>

        {/* Topics Filter Chips */}
        <div className="flex items-center gap-2 mt-5 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedTopicId('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
              selectedTopicId === 'all'
                ? 'bg-white text-indigo-950 font-bold shadow-sm'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Tất cả chủ đề ({lessons.length})
          </button>
          {topics.map(topic => (
            <button
              key={topic.id}
              onClick={() => setSelectedTopicId(topic.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 flex items-center gap-1.5 transition-all ${
                selectedTopicId === topic.id
                  ? 'bg-white text-indigo-950 font-bold shadow-sm'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {getTopicIcon(topic.iconName)}
              <span>{topic.shortTitle}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Sidebar list + Detail view */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Lesson Directory */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Danh sách bài học ({filteredLessons.length})
            </h2>
            <div className="flex gap-1 text-[11px]">
              <button
                onClick={() => setSelectedTrack('ALL')}
                className={`px-2 py-0.5 rounded-md ${selectedTrack === 'ALL' ? 'bg-slate-800 text-white font-bold' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setSelectedTrack('ICT')}
                className={`px-2 py-0.5 rounded-md ${selectedTrack === 'ICT' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                ICT
              </button>
              <button
                onClick={() => setSelectedTrack('CS')}
                className={`px-2 py-0.5 rounded-md ${selectedTrack === 'CS' ? 'bg-purple-600 text-white font-bold' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                CS
              </button>
            </div>
          </div>

          <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
            {filteredLessons.map(lesson => {
              const topic = topics.find(t => t.id === lesson.topicId);
              const isActive = activeLessonId === lesson.id;
              const lessonQCount = questionsBank.filter(q => q.lessonId === lesson.id).length;

              return (
                <div
                  key={lesson.id}
                  onClick={() => setActiveLessonId(lesson.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isActive
                      ? 'border-indigo-600 bg-indigo-50/70 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${topic?.bgLight || 'bg-slate-100'}`}>
                      {topic?.shortTitle}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {lessonQCount > 0 ? `${lessonQCount} câu trắc nghiệm` : 'Lý thuyết'}
                    </span>
                  </div>

                  <h3 className={`text-xs font-bold leading-snug ${isActive ? 'text-indigo-950' : 'text-slate-800'}`}>
                    {lesson.title}
                  </h3>

                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                    {lesson.summary}
                  </p>
                </div>
              );
            })}

            {filteredLessons.length === 0 && (
              <div className="p-8 text-center bg-white rounded-xl border border-dashed border-slate-300 text-slate-400 text-xs">
                Không tìm thấy bài học phù hợp với từ khóa.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Detailed Lesson Viewer */}
        <div className="lg:col-span-8">
          {activeLesson ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              
              {/* Lesson Top Bar */}
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${activeTopic?.bgLight || 'bg-blue-100 text-blue-800'}`}>
                      {activeTopic?.title}
                    </span>
                    <span className="text-xs text-slate-500">
                      Cập nhật: {activeLesson.updatedAt}
                    </span>
                  </div>

                  {/* Practice Button */}
                  <button
                    onClick={() => handleStartPracticeForLesson(activeLesson)}
                    className="px-3.5 py-1.5 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                  >
                    <PlayCircle className="w-4 h-4" />
                    <span>Luyện tập câu hỏi bài này</span>
                  </button>
                </div>

                <h1 className="text-xl font-bold text-slate-900 mt-2">
                  {activeLesson.title}
                </h1>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {activeLesson.summary}
                </p>
              </div>

              {/* Lesson Content Body */}
              <div className="p-6 space-y-6">
                
                {/* Key Takeaways */}
                <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs uppercase tracking-wider mb-2.5">
                    <Lightbulb className="w-4 h-4 text-indigo-700" />
                    <span>Trọng tâm kiến thức cần nắm chắc:</span>
                  </div>
                  <ul className="space-y-2">
                    {activeLesson.keyTakeaways.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-indigo-950 font-medium leading-relaxed">
                        <CheckCircle className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Exam Tips */}
                {activeLesson.examTips && activeLesson.examTips.length > 0 && (
                  <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider mb-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Mẹo làm bài và cảnh báo bẫy đề thi:</span>
                    </div>
                    <ul className="space-y-1.5">
                      {activeLesson.examTips.map((tip, idx) => (
                        <li key={idx} className="text-xs text-amber-900 flex items-start gap-2">
                          <span className="font-bold text-amber-600">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Code Snippets */}
                {activeLesson.codeSnippets && activeLesson.codeSnippets.map((snippet, idx) => (
                  <div key={idx} className="rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                    <div className="bg-slate-800 px-4 py-2.5 text-slate-200 text-xs font-mono font-semibold flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Code className="w-4 h-4 text-sky-400" />
                        <span>{snippet.title}</span>
                      </div>
                      <span className="text-[10px] uppercase px-2 py-0.5 bg-slate-700 text-slate-300 rounded-md">
                        {snippet.language}
                      </span>
                    </div>
                    <pre className="p-4 bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed">
                      <code>{snippet.code}</code>
                    </pre>
                  </div>
                ))}

                {/* Main Content Markdown */}
                <div className="prose prose-slate max-w-none text-xs text-slate-700 leading-relaxed space-y-3 pt-2">
                  <div className="whitespace-pre-line">
                    {activeLesson.contentMarkdown}
                  </div>
                </div>

                {/* Bottom Practice CTA */}
                <div className="p-5 bg-gradient-to-r from-indigo-50 to-slate-50 border border-indigo-100 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-indigo-950">Đã nắm vững lý thuyết?</h4>
                    <p className="text-[11px] text-slate-600">Kiểm tra ngay mức độ thông hiểu với các câu hỏi bám sát đề thi tốt nghiệp.</p>
                  </div>
                  <button
                    onClick={() => handleStartPracticeForLesson(activeLesson)}
                    className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs shrink-0"
                  >
                    Bắt đầu luyện tập
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm font-medium">Chọn một bài học từ danh sách bên trái để xem lý thuyết chi tiết.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
