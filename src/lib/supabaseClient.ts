import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { User, SubjectTopic, TheoryLesson, Question, Exam, ExamResult, BookmarkNote, MasteryStatus } from '../types';

const SUPABASE_URL = 
  (typeof import.meta !== 'undefined' && ((import.meta as any).env?.VITE_SUPABASE_URL || (import.meta as any).env?.SUPABASE_URL)) ||
  'https://wvfguvppomfmuhlteosl.supabase.co';

const SUPABASE_ANON_KEY = 
  (typeof import.meta !== 'undefined' && ((import.meta as any).env?.VITE_SUPABASE_ANON_KEY || (import.meta as any).env?.SUPABASE_ANON_KEY)) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2Zmd1dnBwb21mbXVobHRlb3NsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzMDE5OTgsImV4cCI6MjEwMzg3Nzk5OH0.WnhR04a1O378vuD23UNRDrFBrhlwR0h_999IZLWlCSY';

export let directSupabase: SupabaseClient | null = null;

try {
  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    directSupabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    });
  }
} catch (e) {
  console.warn('Failed to initialize client-side Supabase client:', e);
}

export const directSupabaseApi = {
  // Users
  async getUsers(): Promise<User[]> {
    if (!directSupabase) return [];
    try {
      const { data, error } = await directSupabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: true });
      if (error || !data) return [];
      return data.map((u: any) => ({
        id: u.id,
        username: u.username,
        fullName: u.full_name,
        birthDate: u.birth_date || '',
        email: u.email || '',
        phone: u.phone || '',
        gender: u.gender || 'Nam',
        province: u.province || 'Hà Nội',
        password: u.password || '123',
        role: u.role,
        targetScore: u.target_score ?? undefined,
        track: u.track || 'BOTH',
        avatarUrl: u.avatar_url || '',
        createdAt: u.created_at
      }));
    } catch {
      return [];
    }
  },

  async login(username: string, password?: string): Promise<{ success: boolean; user?: User; message?: string }> {
    if (!directSupabase) {
      return { success: false, message: 'Chưa cấu hình Supabase Client' };
    }
    try {
      const cleanUsername = username.trim();
      const { data, error } = await directSupabase
        .from('users')
        .select('*')
        .eq('username', cleanUsername)
        .maybeSingle();

      if (error) {
        return { success: false, message: 'Lỗi truy vấn Supabase: ' + error.message };
      }

      if (!data) {
        return { success: false, message: 'Tên đăng nhập không tồn tại trong hệ thống' };
      }

      if (password && data.password && data.password !== password) {
        return { success: false, message: 'Mật khẩu không chính xác' };
      }

      const user: User = {
        id: data.id,
        username: data.username,
        fullName: data.full_name,
        birthDate: data.birth_date || '',
        email: data.email || '',
        phone: data.phone || '',
        gender: data.gender || 'Nam',
        province: data.province || 'Hà Nội',
        password: data.password || '123',
        role: data.role,
        targetScore: data.target_score ?? undefined,
        track: data.track || 'BOTH',
        avatarUrl: data.avatar_url || '',
        createdAt: data.created_at
      };

      return { success: true, user };
    } catch (err: any) {
      return { success: false, message: err.message || 'Lỗi kết nối máy chủ Supabase' };
    }
  },

  async register(userData: Omit<User, 'id' | 'createdAt'>): Promise<{ success: boolean; user?: User; message?: string }> {
    if (!directSupabase) {
      return { success: false, message: 'Chưa cấu hình Supabase Client' };
    }
    try {
      const cleanUsername = userData.username.trim();
      const { data: existing } = await directSupabase
        .from('users')
        .select('id')
        .eq('username', cleanUsername)
        .maybeSingle();

      if (existing) {
        return { success: false, message: 'Tên đăng nhập này đã được sử dụng' };
      }

      const id = `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const createdAt = new Date().toISOString();

      const row = {
        id,
        username: cleanUsername,
        full_name: userData.fullName,
        birth_date: userData.birthDate || '',
        email: userData.email || '',
        phone: userData.phone || '',
        gender: userData.gender || 'Nam',
        province: userData.province || 'Hà Nội',
        password: userData.password || '123',
        role: userData.role || 'student',
        target_score: userData.targetScore ?? null,
        track: userData.track || 'BOTH',
        avatar_url: userData.avatarUrl || '',
        created_at: createdAt
      };

      const { error } = await directSupabase.from('users').insert([row]);
      if (error) {
        return { success: false, message: error.message };
      }

      const user: User = {
        id,
        username: cleanUsername,
        fullName: userData.fullName,
        birthDate: userData.birthDate || '',
        email: userData.email || '',
        phone: userData.phone || '',
        gender: userData.gender || 'Nam',
        province: userData.province || 'Hà Nội',
        password: userData.password || '123',
        role: userData.role || 'student',
        targetScore: userData.targetScore,
        track: userData.track || 'BOTH',
        avatarUrl: userData.avatarUrl || '',
        createdAt
      };

      return { success: true, user };
    } catch (err: any) {
      return { success: false, message: err.message || 'Lỗi đăng ký Supabase' };
    }
  },

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    if (!directSupabase) return null;
    try {
      const updateData: any = {};
      if (updates.fullName !== undefined) updateData.full_name = updates.fullName;
      if (updates.birthDate !== undefined) updateData.birth_date = updates.birthDate;
      if (updates.email !== undefined) updateData.email = updates.email;
      if (updates.phone !== undefined) updateData.phone = updates.phone;
      if (updates.gender !== undefined) updateData.gender = updates.gender;
      if (updates.province !== undefined) updateData.province = updates.province;
      if (updates.password !== undefined) updateData.password = updates.password;
      if (updates.role !== undefined) updateData.role = updates.role;
      if (updates.targetScore !== undefined) updateData.target_score = updates.targetScore;
      if (updates.track !== undefined) updateData.track = updates.track;
      if (updates.avatarUrl !== undefined) updateData.avatar_url = updates.avatarUrl;

      const { data, error } = await directSupabase
        .from('users')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error || !data) return null;
      return {
        id: data.id,
        username: data.username,
        fullName: data.full_name,
        birthDate: data.birth_date || '',
        email: data.email || '',
        phone: data.phone || '',
        gender: data.gender || 'Nam',
        province: data.province || 'Hà Nội',
        password: data.password || '123',
        role: data.role,
        targetScore: data.target_score ?? undefined,
        track: data.track || 'BOTH',
        avatarUrl: data.avatar_url || '',
        createdAt: data.created_at
      };
    } catch {
      return null;
    }
  },

  // Topics & Lessons
  async getTopics(): Promise<SubjectTopic[]> {
    if (!directSupabase) return [];
    try {
      const { data, error } = await directSupabase.from('topics').select('*').order('code', { ascending: true });
      if (error || !data) return [];
      return data.map((t: any) => ({
        id: t.id,
        code: t.code,
        title: t.title,
        shortTitle: t.short_title,
        description: t.description,
        track: t.track,
        iconName: t.icon_name,
        color: t.color,
        bgLight: t.bg_light,
        borderColor: t.border_color,
        lessonsCount: t.lessons_count
      }));
    } catch {
      return [];
    }
  },

  async getLessons(): Promise<TheoryLesson[]> {
    if (!directSupabase) return [];
    try {
      const { data, error } = await directSupabase.from('lessons').select('*').order('sort_order', { ascending: true });
      if (error || !data) return [];
      return data.map((l: any) => ({
        id: l.id,
        topicId: l.topic_id,
        title: l.title,
        order: l.sort_order,
        summary: l.summary,
        contentMarkdown: l.content_markdown,
        keyTakeaways: l.key_takeaways || [],
        codeSnippets: l.codeSnippets || l.code_snippets || [],
        examTips: l.exam_tips || [],
        author: l.author,
        updatedAt: l.updated_at
      }));
    } catch {
      return [];
    }
  },

  async createLesson(lesson: Omit<TheoryLesson, 'id' | 'updatedAt'>): Promise<TheoryLesson | null> {
    if (!directSupabase) return null;
    try {
      const id = `lesson_${Date.now()}`;
      const updatedAt = new Date().toISOString();
      const row = {
        id,
        topic_id: lesson.topicId,
        title: lesson.title,
        sort_order: lesson.order,
        summary: lesson.summary,
        content_markdown: lesson.contentMarkdown,
        key_takeaways: lesson.keyTakeaways || [],
        code_snippets: lesson.codeSnippets || [],
        exam_tips: lesson.examTips || [],
        author: lesson.author || 'Tổ Khảo Thí',
        updated_at: updatedAt
      };
      const { error } = await directSupabase.from('lessons').insert([row]);
      if (error) return null;
      return { ...lesson, id, updatedAt };
    } catch {
      return null;
    }
  },

  async updateLesson(id: string, updates: Partial<TheoryLesson>): Promise<TheoryLesson | null> {
    if (!directSupabase) return null;
    try {
      const updateData: any = { updated_at: new Date().toISOString() };
      if (updates.topicId !== undefined) updateData.topic_id = updates.topicId;
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.order !== undefined) updateData.sort_order = updates.order;
      if (updates.summary !== undefined) updateData.summary = updates.summary;
      if (updates.contentMarkdown !== undefined) updateData.content_markdown = updates.contentMarkdown;
      if (updates.keyTakeaways !== undefined) updateData.key_takeaways = updates.keyTakeaways;
      if (updates.codeSnippets !== undefined) updateData.code_snippets = updates.codeSnippets;
      if (updates.examTips !== undefined) updateData.exam_tips = updates.examTips;
      if (updates.author !== undefined) updateData.author = updates.author;

      const { data, error } = await directSupabase.from('lessons').update(updateData).eq('id', id).select().single();
      if (error || !data) return null;
      return {
        id: data.id,
        topicId: data.topic_id,
        title: data.title,
        order: data.sort_order,
        summary: data.summary,
        contentMarkdown: data.content_markdown,
        keyTakeaways: data.key_takeaways || [],
        codeSnippets: data.code_snippets || [],
        examTips: data.exam_tips || [],
        author: data.author,
        updatedAt: data.updated_at
      };
    } catch {
      return null;
    }
  },

  async deleteLesson(id: string): Promise<boolean> {
    if (!directSupabase) return false;
    try {
      const { error } = await directSupabase.from('lessons').delete().eq('id', id);
      return !error;
    } catch {
      return false;
    }
  },

  // Questions
  async getQuestions(): Promise<Question[]> {
    if (!directSupabase) return [];
    try {
      const { data, error } = await directSupabase.from('questions').select('*').order('id', { ascending: true });
      if (error || !data) return [];
      return data.map((q: any) => ({
        id: q.id,
        topicId: q.topic_id,
        lessonId: q.lesson_id,
        lessonTitle: q.lesson_title,
        type: q.type,
        content: q.content,
        codeSnippet: q.code_snippet,
        options: q.options,
        correctAnswer: q.correct_answer,
        subQuestions: q.sub_questions,
        explanation: q.explanation,
        cognitiveLevel: q.cognitive_level,
        track: q.track,
        source: q.source,
        author: q.author
      }));
    } catch {
      return [];
    }
  },

  async createQuestion(question: Omit<Question, 'id'>): Promise<Question | null> {
    if (!directSupabase) return null;
    try {
      const id = `q_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const row = {
        id,
        topic_id: question.topicId,
        lesson_id: question.lessonId || null,
        lesson_title: question.lessonTitle || null,
        type: question.type,
        content: question.content,
        code_snippet: question.codeSnippet || null,
        options: question.options || null,
        correct_answer: question.correctAnswer || null,
        sub_questions: question.subQuestions || null,
        explanation: question.explanation,
        cognitive_level: question.cognitiveLevel,
        track: question.track,
        source: question.source || 'Giáo viên biên soạn',
        author: question.author || 'Tổ Khảo Thí'
      };
      const { error } = await directSupabase.from('questions').insert([row]);
      if (error) return null;
      return { ...question, id };
    } catch {
      return null;
    }
  },

  async updateQuestion(id: string, updates: Partial<Question>): Promise<Question | null> {
    if (!directSupabase) return null;
    try {
      const updateData: any = {};
      if (updates.topicId !== undefined) updateData.topic_id = updates.topicId;
      if (updates.lessonId !== undefined) updateData.lesson_id = updates.lessonId;
      if (updates.lessonTitle !== undefined) updateData.lesson_title = updates.lessonTitle;
      if (updates.type !== undefined) updateData.type = updates.type;
      if (updates.content !== undefined) updateData.content = updates.content;
      if (updates.codeSnippet !== undefined) updateData.code_snippet = updates.codeSnippet;
      if (updates.options !== undefined) updateData.options = updates.options;
      if (updates.correctAnswer !== undefined) updateData.correct_answer = updates.correctAnswer;
      if (updates.subQuestions !== undefined) updateData.sub_questions = updates.subQuestions;
      if (updates.explanation !== undefined) updateData.explanation = updates.explanation;
      if (updates.cognitiveLevel !== undefined) updateData.cognitive_level = updates.cognitiveLevel;
      if (updates.track !== undefined) updateData.track = updates.track;
      if (updates.source !== undefined) updateData.source = updates.source;
      if (updates.author !== undefined) updateData.author = updates.author;

      const { data, error } = await directSupabase.from('questions').update(updateData).eq('id', id).select().single();
      if (error || !data) return null;
      return {
        id: data.id,
        topicId: data.topic_id,
        lessonId: data.lesson_id,
        lessonTitle: data.lesson_title,
        type: data.type,
        content: data.content,
        codeSnippet: data.code_snippet,
        options: data.options,
        correctAnswer: data.correct_answer,
        subQuestions: data.sub_questions,
        explanation: data.explanation,
        cognitiveLevel: data.cognitive_level,
        track: data.track,
        source: data.source,
        author: data.author
      };
    } catch {
      return null;
    }
  },

  async deleteQuestion(id: string): Promise<boolean> {
    if (!directSupabase) return false;
    try {
      const { error } = await directSupabase.from('questions').delete().eq('id', id);
      return !error;
    } catch {
      return false;
    }
  },

  // Exams
  async getExams(): Promise<Exam[]> {
    if (!directSupabase) return [];
    try {
      const [examsRes, questionsRes] = await Promise.all([
        directSupabase.from('exams').select('*').order('created_at', { ascending: false }),
        directSupabase.from('questions').select('*')
      ]);

      if (examsRes.error || !examsRes.data) return [];
      const allQuestions: Question[] = (questionsRes.data || []).map((q: any) => ({
        id: q.id,
        topicId: q.topic_id,
        lessonId: q.lesson_id,
        lessonTitle: q.lesson_title,
        type: q.type,
        content: q.content,
        codeSnippet: q.code_snippet,
        options: q.options,
        correctAnswer: q.correct_answer,
        subQuestions: q.sub_questions,
        explanation: q.explanation,
        cognitiveLevel: q.cognitive_level,
        track: q.track,
        source: q.source,
        author: q.author
      }));

      const questionsMap = new Map(allQuestions.map(q => [q.id, q]));

      return examsRes.data.map((e: any) => {
        const qIds: string[] = Array.isArray(e.question_ids) ? e.question_ids : [];
        const examQuestions = qIds.map(id => questionsMap.get(id)).filter((q): q is Question => Boolean(q));
        return {
          id: e.id,
          title: e.title,
          description: e.description,
          durationMinutes: e.duration_minutes,
          year: e.year,
          targetTrack: e.target_track,
          totalPoints: e.total_points,
          part1Count: e.part1_count,
          part2Count: e.part2_count,
          questions: examQuestions,
          createdBy: e.created_by,
          createdAt: e.created_at,
          tags: e.tags || [],
          isOfficial: e.is_official
        };
      });
    } catch {
      return [];
    }
  },

  async createExam(examData: Omit<Exam, 'id' | 'createdAt'>): Promise<Exam | null> {
    if (!directSupabase) return null;
    try {
      const id = `exam_${Date.now()}`;
      const createdAt = new Date().toISOString();
      const row = {
        id,
        title: examData.title,
        description: examData.description,
        duration_minutes: examData.durationMinutes,
        year: examData.year,
        target_track: examData.targetTrack,
        total_points: examData.totalPoints,
        part1_count: examData.part1Count,
        part2_count: examData.part2Count,
        question_ids: examData.questions.map(q => q.id),
        created_by: examData.createdBy || 'Giáo viên Tin học',
        created_at: createdAt,
        tags: examData.tags || [],
        is_official: examData.isOfficial ?? false
      };
      const { error } = await directSupabase.from('exams').insert([row]);
      if (error) return null;
      return { ...examData, id, createdAt };
    } catch {
      return null;
    }
  },

  async deleteExam(id: string): Promise<boolean> {
    if (!directSupabase) return false;
    try {
      const { error } = await directSupabase.from('exams').delete().eq('id', id);
      return !error;
    } catch {
      return false;
    }
  },

  // Exam Results
  async getExamResults(userId?: string): Promise<ExamResult[]> {
    if (!directSupabase) return [];
    try {
      let query = directSupabase.from('exam_results').select('*').order('started_at', { ascending: false });
      if (userId) {
        query = query.eq('user_id', userId);
      }
      const { data, error } = await query;
      if (error || !data) return [];
      return data.map((r: any) => ({
        id: r.id,
        examId: r.exam_id,
        examTitle: r.exam_title,
        userId: r.user_id,
        userFullName: r.user_full_name,
        startedAt: r.started_at,
        completedAt: r.completed_at,
        timeSpentSeconds: r.time_spent_seconds,
        score: r.score,
        part1Score: r.part1_score,
        part2Score: r.part2_score,
        totalCorrectQuestions: r.total_correct_questions,
        totalQuestions: r.total_questions,
        answers: r.answers_json || {},
        topicPerformance: r.topic_performance_json || [],
        strongTopics: r.strong_topics_json || [],
        weakTopics: r.weak_topics_json || [],
        aiDiagnostic: r.ai_diagnostic_json || undefined
      }));
    } catch {
      return [];
    }
  },

  async saveExamResult(result: ExamResult): Promise<ExamResult | null> {
    if (!directSupabase) return null;
    try {
      const row = {
        id: result.id,
        exam_id: result.examId,
        exam_title: result.examTitle,
        user_id: result.userId,
        user_full_name: result.userFullName,
        started_at: result.startedAt,
        completed_at: result.completedAt || new Date().toISOString(),
        time_spent_seconds: result.timeSpentSeconds,
        score: result.score,
        part1_score: result.part1Score,
        part2_score: result.part2Score,
        total_correct_questions: result.totalCorrectQuestions,
        total_questions: result.totalQuestions,
        answers_json: result.answers || {},
        topic_performance_json: result.topicPerformance || [],
        strong_topics_json: result.strongTopics || [],
        weak_topics_json: result.weakTopics || [],
        ai_diagnostic_json: result.aiDiagnostic || null
      };
      const { error } = await directSupabase.from('exam_results').upsert([row], { onConflict: 'id' });
      if (error) return null;
      return result;
    } catch {
      return null;
    }
  },

  // Bookmarks
  async getBookmarks(userId?: string): Promise<BookmarkNote[]> {
    if (!directSupabase) return [];
    try {
      const [bmRes, qRes] = await Promise.all([
        (userId ? directSupabase.from('bookmarks').select('*').eq('user_id', userId) : directSupabase.from('bookmarks').select('*')).order('created_at', { ascending: false }),
        directSupabase.from('questions').select('*')
      ]);

      if (bmRes.error || !bmRes.data) return [];
      const questions: Question[] = (qRes.data || []).map((q: any) => ({
        id: q.id,
        topicId: q.topic_id,
        lessonId: q.lesson_id,
        lessonTitle: q.lesson_title,
        type: q.type,
        content: q.content,
        codeSnippet: q.code_snippet,
        options: q.options,
        correctAnswer: q.correct_answer,
        subQuestions: q.sub_questions,
        explanation: q.explanation,
        cognitiveLevel: q.cognitive_level,
        track: q.track,
        source: q.source,
        author: q.author
      }));

      const qMap = new Map(questions.map(q => [q.id, q]));

      const results: BookmarkNote[] = [];
      for (const b of bmRes.data) {
        const question = qMap.get(b.question_id);
        if (question) {
          results.push({
            id: b.id,
            userId: b.user_id,
            questionId: b.question_id,
            question,
            note: b.note || '',
            masteryStatus: b.mastery_status || 'need_review',
            createdAt: b.created_at,
            updatedAt: b.updated_at
          });
        }
      }
      return results;
    } catch {
      return [];
    }
  },

  async toggleBookmark(userId: string, questionId: string, note: string = '', masteryStatus: MasteryStatus = 'need_review'): Promise<{ active: boolean; bookmark?: BookmarkNote }> {
    if (!directSupabase) return { active: false };
    try {
      const { data: existing } = await directSupabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', userId)
        .eq('question_id', questionId)
        .maybeSingle();

      if (existing) {
        await directSupabase.from('bookmarks').delete().eq('id', existing.id);
        return { active: false };
      }

      const { data: qData } = await directSupabase.from('questions').select('*').eq('id', questionId).maybeSingle();

      const id = `bm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const now = new Date().toISOString();
      const row = {
        id,
        user_id: userId,
        question_id: questionId,
        note,
        mastery_status: masteryStatus,
        created_at: now,
        updated_at: now
      };
      const { error } = await directSupabase.from('bookmarks').insert([row]);
      if (error) return { active: false };

      const question: Question = qData ? {
        id: qData.id,
        topicId: qData.topic_id,
        lessonId: qData.lesson_id || '',
        lessonTitle: qData.lesson_title,
        type: qData.type,
        content: qData.content,
        codeSnippet: qData.code_snippet,
        options: qData.options,
        correctAnswer: qData.correct_answer,
        subQuestions: qData.sub_questions,
        explanation: qData.explanation,
        cognitiveLevel: qData.cognitive_level,
        track: qData.track,
        source: qData.source,
        author: qData.author
      } : {
        id: questionId,
        topicId: 'TOPIC_F',
        lessonId: '',
        type: 'single_choice',
        content: 'Câu hỏi đã lưu',
        explanation: '',
        cognitiveLevel: 'TH',
        track: 'ALL'
      };

      return {
        active: true,
        bookmark: {
          id,
          userId,
          questionId,
          question,
          note,
          masteryStatus,
          createdAt: now,
          updatedAt: now
        }
      };
    } catch {
      return { active: false };
    }
  },

  async updateBookmark(userId: string, questionId: string, note: string, masteryStatus: MasteryStatus): Promise<boolean> {
    if (!directSupabase) return false;
    try {
      const { error } = await directSupabase
        .from('bookmarks')
        .update({
          note,
          mastery_status: masteryStatus,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('question_id', questionId);
      return !error;
    } catch {
      return false;
    }
  },

  async removeBookmark(userId: string, questionId: string): Promise<boolean> {
    if (!directSupabase) return false;
    try {
      const { error } = await directSupabase
        .from('bookmarks')
        .delete()
        .eq('user_id', userId)
        .eq('question_id', questionId);
      return !error;
    } catch {
      return false;
    }
  }
};
