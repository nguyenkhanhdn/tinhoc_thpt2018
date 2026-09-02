import React, { useState } from 'react';
import { useTheory } from '../context/TheoryContext';
import { useExam } from '../context/ExamContext';
import { useAuth } from '../context/AuthContext';
import { 
  TheoryLesson, 
  Question, 
  QuestionType, 
  CognitiveLevel, 
  StudyTrack 
} from '../types';
import { 
  BookOpen, 
  PlusCircle, 
  Sparkles, 
  FileText, 
  Edit3, 
  Trash2, 
  Save, 
  CheckCircle, 
  Code, 
  HelpCircle, 
  Database, 
  Layers,
  Wand2,
  AlertCircle
} from 'lucide-react';

export const TeacherStudio: React.FC = () => {
  const { currentUser } = useAuth();
  const { topics, lessons, addLesson, updateLesson, deleteLesson } = useTheory();
  const { questionsBank, addQuestionToBank, deleteQuestionFromBank, createExam, exams } = useExam();

  const [activeTab, setActiveTab] = useState<'lessons' | 'questions' | 'ai_assistant' | 'exams'>('lessons');

  // --- Lesson Form State ---
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonTopicId, setLessonTopicId] = useState(topics[0]?.id || 'topic_e');
  const [lessonOrder, setLessonOrder] = useState(1);
  const [lessonSummary, setLessonSummary] = useState('');
  const [lessonTakeaways, setLessonTakeaways] = useState<string>('');
  const [lessonTips, setLessonTips] = useState<string>('');
  const [lessonContent, setLessonContent] = useState('');
  const [lessonSavedNotice, setLessonSavedNotice] = useState(false);

  // --- Question Form State ---
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [qType, setQType] = useState<QuestionType>('single_choice');
  const [qTopicId, setQTopicId] = useState(topics[0]?.id || 'topic_e');
  const [qLessonId, setQLessonId] = useState(lessons[0]?.id || '');
  const [qLevel, setQLevel] = useState<CognitiveLevel>('Thông hiểu');
  const [qTrack, setQTrack] = useState<StudyTrack>('ALL');
  const [qContent, setQContent] = useState('');
  const [qCode, setQCode] = useState('');
  const [qCodeLang, setQCodeLang] = useState('python');
  // Single choice options
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctOption, setCorrectOption] = useState<'A' | 'B' | 'C' | 'D'>('A');
  // True / False statements
  const [tfStatementA, setTfStatementA] = useState('');
  const [tfValA, setTfValA] = useState(true);
  const [tfStatementB, setTfStatementB] = useState('');
  const [tfValB, setTfValB] = useState(false);
  const [tfStatementC, setTfStatementC] = useState('');
  const [tfValC, setTfValC] = useState(true);
  const [tfStatementD, setTfStatementD] = useState('');
  const [tfValD, setTfValD] = useState(false);
  const [qExplanation, setQExplanation] = useState('');
  const [qSavedNotice, setQSavedNotice] = useState(false);

  // --- AI Generator State ---
  const [aiTopic, setAiTopic] = useState('Cơ sở dữ liệu quan hệ và SQL');
  const [aiDifficulty, setAiDifficulty] = useState<'Nhận biết' | 'Thông hiểu' | 'Vận dụng' | 'Vận dụng cao'>('Vận dụng');
  const [aiType, setAiType] = useState<'single_choice' | 'true_false'>('single_choice');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [generatedQ, setGeneratedQ] = useState<any | null>(null);

  // Handlers for Lesson
  const handleStartNewLesson = () => {
    setEditingLessonId(null);
    setLessonTitle('');
    setLessonTopicId(topics[0]?.id || 'topic_e');
    setLessonOrder(lessons.length + 1);
    setLessonSummary('');
    setLessonTakeaways('');
    setLessonTips('');
    setLessonContent('');
  };

  const handleEditLesson = (lesson: TheoryLesson) => {
    setEditingLessonId(lesson.id);
    setLessonTitle(lesson.title);
    setLessonTopicId(lesson.topicId);
    setLessonOrder(lesson.order);
    setLessonSummary(lesson.summary);
    setLessonTakeaways(lesson.keyTakeaways.join('\n'));
    setLessonTips((lesson.examTips || []).join('\n'));
    setLessonContent(lesson.contentMarkdown);
  };

  const handleSaveLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonTitle.trim() || !lessonContent.trim()) return;

    const takeaways = lessonTakeaways.split('\n').map(s => s.trim()).filter(Boolean);
    const tips = lessonTips.split('\n').map(s => s.trim()).filter(Boolean);

    if (editingLessonId) {
      updateLesson(editingLessonId, {
        title: lessonTitle,
        topicId: lessonTopicId,
        order: lessonOrder,
        summary: lessonSummary,
        keyTakeaways: takeaways,
        examTips: tips,
        contentMarkdown: lessonContent
      });
    } else {
      addLesson({
        topicId: lessonTopicId,
        title: lessonTitle,
        order: lessonOrder,
        summary: lessonSummary,
        contentMarkdown: lessonContent,
        keyTakeaways: takeaways,
        examTips: tips,
        author: currentUser?.fullName || 'Giáo Viên Tin Học'
      });
    }

    setLessonSavedNotice(true);
    setTimeout(() => setLessonSavedNotice(false), 2000);
    handleStartNewLesson();
  };

  // Handlers for Questions
  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qContent.trim() || !qExplanation.trim()) return;

    const questionData: Omit<Question, 'id'> = {
      type: qType,
      topicId: qTopicId,
      lessonId: qLessonId || lessons[0]?.id || '',
      cognitiveLevel: qLevel,
      track: qTrack,
      content: qContent,
      explanation: qExplanation,
      author: currentUser?.fullName || 'Giáo viên',
      codeSnippet: qCode.trim() ? { language: qCodeLang, code: qCode.trim() } : undefined,
      options: qType === 'single_choice' ? [optA, optB, optC, optD] : undefined,
      correctAnswer: qType === 'single_choice' ? correctOption : undefined,
      subQuestions: qType === 'true_false' ? [
        { id: 'sub_a', label: 'a', statement: tfStatementA, isCorrect: tfValA },
        { id: 'sub_b', label: 'b', statement: tfStatementB, isCorrect: tfValB },
        { id: 'sub_c', label: 'c', statement: tfStatementC, isCorrect: tfValC },
        { id: 'sub_d', label: 'd', statement: tfStatementD, isCorrect: tfValD }
      ] : undefined
    };

    addQuestionToBank(questionData);
    setQSavedNotice(true);
    setTimeout(() => setQSavedNotice(false), 2000);

    // Reset
    setQContent('');
    setQCode('');
    setOptA('');
    setOptB('');
    setOptC('');
    setOptD('');
    setTfStatementA('');
    setTfStatementB('');
    setTfStatementC('');
    setTfStatementD('');
    setQExplanation('');
  };

  // Generate question with AI
  const handleGenerateQuestionWithAI = async () => {
    setIsGeneratingAI(true);
    setGeneratedQ(null);

    try {
      const res = await fetch('/api/ai/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiTopic,
          difficulty: aiDifficulty,
          type: aiType,
          lessonContext: lessons.find(l => l.topicId === qTopicId)?.summary
        })
      });

      if (res.ok) {
        const json = await res.json();
        setGeneratedQ(json.question);
      }
    } catch (err) {
      console.error('AI generation error:', err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleApplyAIQuestionToForm = () => {
    if (!generatedQ) return;
    setQType(generatedQ.type || 'single_choice');
    setQContent(generatedQ.content || '');
    setQLevel(generatedQ.cognitiveLevel || 'Vận dụng');
    setQExplanation(generatedQ.explanation || '');

    if (generatedQ.codeSnippet) {
      setQCode(generatedQ.codeSnippet.code || '');
      setQCodeLang(generatedQ.codeSnippet.language || 'python');
    }

    if (generatedQ.type === 'single_choice' && generatedQ.options) {
      setOptA(generatedQ.options[0] || '');
      setOptB(generatedQ.options[1] || '');
      setOptC(generatedQ.options[2] || '');
      setOptD(generatedQ.options[3] || '');
      setCorrectOption(generatedQ.correctAnswer || 'A');
    } else if (generatedQ.type === 'true_false' && generatedQ.subQuestions) {
      setTfStatementA(generatedQ.subQuestions[0]?.statement || '');
      setTfValA(generatedQ.subQuestions[0]?.isCorrect ?? true);
      setTfStatementB(generatedQ.subQuestions[1]?.statement || '');
      setTfValB(generatedQ.subQuestions[1]?.isCorrect ?? false);
      setTfStatementC(generatedQ.subQuestions[2]?.statement || '');
      setTfValC(generatedQ.subQuestions[2]?.isCorrect ?? true);
      setTfStatementD(generatedQ.subQuestions[3]?.statement || '');
      setTfValD(generatedQ.subQuestions[3]?.isCorrect ?? false);
    }

    setActiveTab('questions');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header Studio Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-white/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 border border-white/30 text-white backdrop-blur-md rounded-full text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Không gian biên soạn của giáo viên</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Biên soạn bài học & ngân hàng câu hỏi
          </h1>
          <p className="text-xs sm:text-sm text-purple-100 mt-1 max-w-2xl leading-relaxed">
            Hệ thống cho phép thầy/cô soạn thảo nội dung lý thuyết chuẩn kiến thức, xây dựng câu hỏi trắc nghiệm Phần I & Phần II, liên kết bài học tham chiếu và sử dụng Trợ lý AI tạo đề.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-2">
          <span className="px-3.5 py-1.5 bg-white/15 backdrop-blur-md rounded-2xl text-xs font-semibold text-white border border-white/20">
            {lessons.length} bài học lý thuyết
          </span>
          <span className="px-3.5 py-1.5 bg-white/15 backdrop-blur-md rounded-2xl text-xs font-semibold text-white border border-white/20">
            {questionsBank.length} câu hỏi trong ngân hàng
          </span>
        </div>
      </div>

      {/* Studio Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('lessons')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'lessons'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Biên soạn bài học lý thuyết</span>
        </button>

        <button
          onClick={() => setActiveTab('questions')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'questions'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>Biên soạn ngân hàng câu hỏi</span>
        </button>

        <button
          onClick={() => setActiveTab('ai_assistant')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'ai_assistant'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs'
              : 'bg-white text-purple-700 border border-purple-200 hover:bg-purple-50'
          }`}
        >
          <Wand2 className="w-4 h-4 text-amber-500" />
          <span>Trợ lý AI tạo câu hỏi tự động</span>
        </button>
      </div>

      {/* TAB 1: LESSON EDITOR */}
      {activeTab === 'lessons' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Lessons list */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Danh sách bài học ({lessons.length})
              </h3>
              <button
                onClick={handleStartNewLesson}
                className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1 shadow-2xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Thêm bài học mới</span>
              </button>
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {lessons.map(l => (
                <div
                  key={l.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    editingLessonId === l.id ? 'border-purple-600 bg-purple-50/70' : 'border-slate-200/90 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex-1">
                    <div className="text-[10px] font-bold text-purple-700">
                      {topics.find(t => t.id === l.topicId)?.shortTitle}
                    </div>
                    <div className="text-xs font-bold text-slate-900 leading-snug">{l.title}</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{l.summary}</div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleEditLesson(l)}
                      className="p-1.5 text-slate-500 hover:text-purple-600 hover:bg-purple-100 rounded-xl"
                      title="Sửa bài"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Xóa bài học: ${l.title}?`)) {
                          deleteLesson(l.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl"
                      title="Xóa bài"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-purple-600" />
              <span>{editingLessonId ? 'Chỉnh sửa bài học lý thuyết' : 'Soạn thảo bài học mới'}</span>
            </h3>

            {lessonSavedNotice && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-2xl flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Đã lưu bài học vào kho kiến thức thành công!</span>
              </div>
            )}

            <form onSubmit={handleSaveLesson} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Chủ đề kiến thức</label>
                  <select
                    value={lessonTopicId}
                    onChange={(e) => setLessonTopicId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white outline-hidden"
                  >
                    {topics.map(t => (
                      <option key={t.id} value={t.id}>{t.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Thứ tự hiển thị bài</label>
                  <input
                    type="number"
                    value={lessonOrder}
                    onChange={(e) => setLessonOrder(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Tên bài học</label>
                <input
                  type="text"
                  required
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  placeholder="Ví dụ: Bài 8: Khóa chính, khóa ngoại và các loại liên kết bảng"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Tóm tắt ngắn gọn</label>
                <input
                  type="text"
                  value={lessonSummary}
                  onChange={(e) => setLessonSummary(e.target.value)}
                  placeholder="Tóm tắt nội dung chính trong 1-2 câu..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Trọng tâm kiến thức cốt lõi (Mỗi ý 1 dòng):
                </label>
                <textarea
                  value={lessonTakeaways}
                  onChange={(e) => setLessonTakeaways(e.target.value)}
                  rows={3}
                  placeholder="Khóa chính (Primary Key) xác định duy nhất mỗi bản ghi&#10;Khóa ngoại (Foreign Key) tạo liên kết quan hệ giữa 2 bảng..."
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Mẹo làm bài & bẫy đề thi cần tránh (Mỗi ý 1 dòng):
                </label>
                <textarea
                  value={lessonTips}
                  onChange={(e) => setLessonTips(e.target.value)}
                  rows={2}
                  placeholder="Chú ý mệnh đề WHERE lọc từng hàng trước khi GROUP BY, HAVING lọc sau khi gom nhóm..."
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Nội dung bài học chi tiết (Markdown)</label>
                <textarea
                  required
                  value={lessonContent}
                  onChange={(e) => setLessonContent(e.target.value)}
                  rows={8}
                  placeholder="Soạn thảo nội dung lý thuyết chi tiết tại đây..."
                  className="w-full p-3 text-xs border border-slate-200 rounded-xl outline-hidden font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleStartNewLesson}
                  className="px-4 py-2 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50"
                >
                  Làm mới
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Lưu bài học</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: QUESTION BANK COMPILER */}
      {activeTab === 'questions' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Question List */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Ngân hàng câu hỏi hiện có ({questionsBank.length})
            </h3>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {questionsBank.map((q, idx) => (
                <div key={q.id} className="p-3.5 bg-white rounded-2xl border border-slate-200/90 hover:bg-slate-50 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-purple-700">
                      Câu {idx + 1} ({q.type === 'single_choice' ? '4 lựa chọn' : 'Đúng/Sai'})
                    </span>
                    <button
                      onClick={() => deleteQuestionFromBank(q.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-xs text-slate-800 line-clamp-2">{q.content}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Question Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-purple-600" />
              <span>Biên soạn câu hỏi trắc nghiệm mới</span>
            </h3>

            {qSavedNotice && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-2xl flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Đã thêm câu hỏi vào ngân hàng đề thi thành công!</span>
              </div>
            )}

            <form onSubmit={handleSaveQuestion} className="space-y-4">
              
              {/* Type, Topic, Lesson, Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Định dạng câu hỏi</label>
                  <select
                    value={qType}
                    onChange={(e) => setQType(e.target.value as QuestionType)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white outline-hidden"
                  >
                    <option value="single_choice">Phần I: 4 Lựa chọn (A, B, C, D)</option>
                    <option value="true_false">Phần II: Đúng / Sai 4 ý (a, b, c, d)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Mức độ nhận thức</label>
                  <select
                    value={qLevel}
                    onChange={(e) => setQLevel(e.target.value as CognitiveLevel)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white outline-hidden"
                  >
                    <option value="Nhận biết">Nhận biết</option>
                    <option value="Thông hiểu">Thông hiểu</option>
                    <option value="Vận dụng">Vận dụng</option>
                    <option value="Vận dụng cao">Vận dụng cao</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Chủ đề kiến thức</label>
                  <select
                    value={qTopicId}
                    onChange={(e) => setQTopicId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white outline-hidden"
                  >
                    {topics.map(t => (
                      <option key={t.id} value={t.id}>{t.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Bài học tham chiếu (Lý thuyết)</label>
                  <select
                    value={qLessonId}
                    onChange={(e) => setQLessonId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white outline-hidden"
                  >
                    {lessons.map(l => (
                      <option key={l.id} value={l.id}>{l.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Nội dung câu hỏi / Tình huống</label>
                <textarea
                  required
                  value={qContent}
                  onChange={(e) => setQContent(e.target.value)}
                  rows={3}
                  placeholder="Nhập nội dung đề bài..."
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl outline-hidden"
                />
              </div>

              {/* Optional Code snippet */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Mã nguồn minh họa (Tùy chọn Python/SQL)</label>
                <textarea
                  value={qCode}
                  onChange={(e) => setQCode(e.target.value)}
                  rows={3}
                  placeholder="SELECT * FROM HocSinh WHERE DiemTin >= 8.0..."
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl outline-hidden font-mono"
                />
              </div>

              {/* Single choice options */}
              {qType === 'single_choice' && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="block text-xs font-bold text-slate-700">4 phương án trả lời:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs">A:</span>
                      <input
                        type="text"
                        required
                        value={optA}
                        onChange={(e) => setOptA(e.target.value)}
                        placeholder="Phương án A"
                        className="w-full p-2 text-xs border border-slate-200 rounded-xl outline-hidden"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs">B:</span>
                      <input
                        type="text"
                        required
                        value={optB}
                        onChange={(e) => setOptB(e.target.value)}
                        placeholder="Phương án B"
                        className="w-full p-2 text-xs border border-slate-200 rounded-xl outline-hidden"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs">C:</span>
                      <input
                        type="text"
                        required
                        value={optC}
                        onChange={(e) => setOptC(e.target.value)}
                        placeholder="Phương án C"
                        className="w-full p-2 text-xs border border-slate-200 rounded-xl outline-hidden"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs">D:</span>
                      <input
                        type="text"
                        required
                        value={optD}
                        onChange={(e) => setOptD(e.target.value)}
                        placeholder="Phương án D"
                        className="w-full p-2 text-xs border border-slate-200 rounded-xl outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Đáp án đúng chính xác:</label>
                    <div className="flex gap-4">
                      {(['A', 'B', 'C', 'D'] as const).map(opt => (
                        <label key={opt} className="flex items-center gap-1.5 text-xs cursor-pointer">
                          <input
                            type="radio"
                            name="correctOpt"
                            checked={correctOption === opt}
                            onChange={() => setCorrectOption(opt)}
                            className="accent-purple-600"
                          />
                          <span className="font-bold">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* True/False Sub statements */}
              {qType === 'true_false' && (
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <label className="block text-xs font-bold text-slate-700">4 ý mệnh đề (a, b, c, d):</label>
                  
                  {[
                    { label: 'a', text: tfStatementA, setText: setTfStatementA, val: tfValA, setVal: setTfValA },
                    { label: 'b', text: tfStatementB, setText: setTfStatementB, val: tfValB, setVal: setTfValB },
                    { label: 'c', text: tfStatementC, setText: setTfStatementC, val: tfValC, setVal: setTfValC },
                    { label: 'd', text: tfStatementD, setText: setTfStatementD, val: tfValD, setVal: setTfValD }
                  ].map(item => (
                    <div key={item.label} className="p-2.5 bg-slate-50 rounded-2xl flex items-center gap-2">
                      <span className="font-bold text-xs text-purple-700">{item.label})</span>
                      <input
                        type="text"
                        required
                        value={item.text}
                        onChange={(e) => item.setText(e.target.value)}
                        placeholder={`Mệnh đề ý ${item.label}...`}
                        className="w-full p-1.5 text-xs border border-slate-200 rounded-xl outline-hidden bg-white"
                      />
                      <select
                        value={item.val ? 'true' : 'false'}
                        onChange={(e) => item.setVal(e.target.value === 'true')}
                        className="text-xs p-1.5 border border-slate-200 rounded-xl bg-white font-bold"
                      >
                        <option value="true">ĐÚNG</option>
                        <option value="false">SAI</option>
                      </select>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Hướng dẫn giải & lời giải thích chi tiết</label>
                <textarea
                  required
                  value={qExplanation}
                  onChange={(e) => setQExplanation(e.target.value)}
                  rows={3}
                  placeholder="Giải thích vì sao đáp án đúng và phân tích các phương án sai..."
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl outline-hidden"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Thêm vào ngân hàng câu hỏi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: GEMINI AI ASSISTANT FOR TEACHERS */}
      {activeTab === 'ai_assistant' && (
        <div className="bg-white rounded-3xl border border-purple-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-2 text-purple-950 font-bold text-base">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>Trợ lý Gemini AI: Tự động sinh câu hỏi chuẩn đề thi tốt nghiệp THPT</span>
          </div>

          <p className="text-xs text-slate-600 max-w-3xl">
            Tận dụng mô hình ngôn ngữ lớn để sinh ra các câu hỏi trắc nghiệm chuẩn cấu trúc Bộ GD&ĐT bám sát nội dung chương trình GDPT 2018, có sẵn đáp án và lời giải sư phạm chi tiết.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-purple-50/60 rounded-2xl border border-purple-100">
            <div>
              <label className="block text-xs font-bold text-purple-950 mb-1">Chủ đề mong muốn</label>
              <input
                type="text"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                placeholder="Ví dụ: Mạng máy tính và giao thức IP, hoặc SQL JOIN..."
                className="w-full p-2 text-xs border border-purple-200 rounded-xl bg-white outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-purple-950 mb-1">Mức độ nhận thức</label>
              <select
                value={aiDifficulty}
                onChange={(e) => setAiDifficulty(e.target.value as any)}
                className="w-full p-2 text-xs border border-purple-200 rounded-xl bg-white outline-hidden"
              >
                <option value="Nhận biết">Nhận biết (NB)</option>
                <option value="Thông hiểu">Thông hiểu (TH)</option>
                <option value="Vận dụng">Vận dụng (VD)</option>
                <option value="Vận dụng cao">Vận dụng cao (VDC)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-purple-950 mb-1">Định dạng câu hỏi</label>
              <select
                value={aiType}
                onChange={(e) => setAiType(e.target.value as any)}
                className="w-full p-2 text-xs border border-purple-200 rounded-xl bg-white outline-hidden"
              >
                <option value="single_choice">Phần I: 4 Lựa chọn A-B-C-D</option>
                <option value="true_false">Phần II: Đúng / Sai 4 ý a-b-c-d</option>
              </select>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleGenerateQuestionWithAI}
              disabled={isGeneratingAI}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Wand2 className="w-4 h-4 text-amber-300" />
              <span>{isGeneratingAI ? 'AI đang tư duy và biên soạn câu hỏi...' : 'Tạo câu hỏi bằng AI'}</span>
            </button>
          </div>

          {/* Generated Result Preview */}
          {generatedQ && (
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 bg-purple-100 text-purple-800 font-bold text-xs rounded-full">
                  Kết quả sinh tự động ({generatedQ.cognitiveLevel})
                </span>
                <button
                  onClick={handleApplyAIQuestionToForm}
                  className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Áp dụng vào trình biên soạn & thêm vào ngân hàng</span>
                </button>
              </div>

              <div className="text-sm font-semibold text-slate-900 whitespace-pre-line">
                {generatedQ.content}
              </div>

              {generatedQ.codeSnippet && (
                <pre className="p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl overflow-x-auto">
                  <code>{generatedQ.codeSnippet.code}</code>
                </pre>
              )}

              {generatedQ.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {generatedQ.options.map((opt: string, idx: number) => {
                    const key = ['A', 'B', 'C', 'D'][idx];
                    const isKey = key === generatedQ.correctAnswer;
                    return (
                      <div key={key} className={`p-2.5 rounded-xl border ${isKey ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-900' : 'bg-white border-slate-200'}`}>
                        {key}. {opt} {isKey && '✓ (Đáp án đúng)'}
                      </div>
                    );
                  })}
                </div>
              )}

              {generatedQ.subQuestions && (
                <div className="space-y-2 text-xs">
                  {generatedQ.subQuestions.map((sub: any) => (
                    <div key={sub.label} className="p-2 bg-white rounded-xl border border-slate-200 flex justify-between">
                      <span><strong>{sub.label})</strong> {sub.statement}</span>
                      <strong className={sub.isCorrect ? 'text-emerald-700' : 'text-rose-700'}>
                        {sub.isCorrect ? '[ĐÚNG]' : '[SAI]'}
                      </strong>
                    </div>
                  ))}
                </div>
              )}

              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-950">
                <span className="font-bold text-indigo-900">Giải thích: </span>
                <span>{generatedQ.explanation}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
