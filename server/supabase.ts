import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { User, SubjectTopic, TheoryLesson, Question, Exam, ExamResult, BookmarkNote } from '../src/types.js';
import { INITIAL_QUESTIONS } from '../src/data/questionsBank.js';
import { SUBJECT_TOPICS, INITIAL_LESSONS } from '../src/data/topicsAndLessons.js';
import { INITIAL_EXAMS } from '../src/data/mockExams.js';

let supabaseClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    return null;
  }

  if (!supabaseClient) {
    supabaseClient = createClient(url, key, {
      auth: { persistSession: false }
    });
  }

  return supabaseClient;
}

export function isSupabaseConfigured(): boolean {
  return !!(process.env.SUPABASE_URL && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY));
}

// ==================== SUPABASE QUERIES ====================

// 1. Database Stats
export async function getSupabaseStats() {
  const sb = getSupabase();
  if (!sb) return null;

  try {
    const [
      { count: usersCount },
      { count: topicsCount },
      { count: lessonsCount },
      { count: questionsCount },
      { count: examsCount },
      { count: resultsCount },
      { count: bookmarksCount }
    ] = await Promise.all([
      sb.from('users').select('*', { count: 'exact', head: true }),
      sb.from('topics').select('*', { count: 'exact', head: true }),
      sb.from('lessons').select('*', { count: 'exact', head: true }),
      sb.from('questions').select('*', { count: 'exact', head: true }),
      sb.from('exams').select('*', { count: 'exact', head: true }),
      sb.from('exam_results').select('*', { count: 'exact', head: true }),
      sb.from('bookmarks').select('*', { count: 'exact', head: true })
    ]);

    return {
      users: usersCount || 0,
      topics: topicsCount || 0,
      lessons: lessonsCount || 0,
      questions: questionsCount || 0,
      exams: examsCount || 0,
      examResults: resultsCount || 0,
      bookmarks: bookmarksCount || 0,
      provider: 'Supabase PostgreSQL Cloud'
    };
  } catch (err) {
    console.error('Supabase stats error:', err);
    return null;
  }
}

// 2. Seed default data into Supabase if empty
export async function seedSupabaseIfEmpty(): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;

  try {
    // Check topics count
    const { count: topicCount } = await sb.from('topics').select('*', { count: 'exact', head: true });
    if ((topicCount || 0) === 0) {
      console.log('Seeding topics to Supabase...');
      const topicRows = SUBJECT_TOPICS.map(t => ({
        id: t.id,
        code: t.code,
        title: t.title,
        short_title: t.shortTitle,
        description: t.description,
        track: t.track,
        icon_name: t.iconName,
        color: t.color,
        bg_light: t.bgLight,
        border_color: t.borderColor,
        lessons_count: t.lessonsCount
      }));
      await sb.from('topics').insert(topicRows);
    }

    // Check lessons count
    const { count: lessonCount } = await sb.from('lessons').select('*', { count: 'exact', head: true });
    if ((lessonCount || 0) === 0) {
      console.log('Seeding lessons to Supabase...');
      const lessonRows = INITIAL_LESSONS.map(l => ({
        id: l.id,
        topic_id: l.topicId,
        title: l.title,
        sort_order: l.order,
        summary: l.summary,
        content_markdown: l.contentMarkdown,
        key_takeaways: l.keyTakeaways || [],
        code_snippets: l.codeSnippets || [],
        exam_tips: l.examTips || [],
        author: l.author,
        updated_at: l.updatedAt || new Date().toISOString()
      }));
      await sb.from('lessons').insert(lessonRows);
    }

    // Check questions count
    const { count: questionCount } = await sb.from('questions').select('*', { count: 'exact', head: true });
    if ((questionCount || 0) === 0) {
      console.log('Seeding questions to Supabase...');
      const questionRows = INITIAL_QUESTIONS.map(q => ({
        id: q.id,
        topic_id: q.topicId,
        lesson_id: q.lessonId || null,
        lesson_title: q.lessonTitle || null,
        type: q.type,
        content: q.content,
        code_snippet: q.codeSnippet || null,
        options: q.options || null,
        correct_answer: q.correctAnswer || null,
        sub_questions: q.subQuestions || null,
        explanation: q.explanation,
        cognitive_level: q.cognitiveLevel,
        track: q.track,
        source: q.source || null,
        author: q.author || 'Tổ Khảo Thí Tin Học',
        created_at: new Date().toISOString()
      }));
      await sb.from('questions').insert(questionRows);
    }

    // Check exams count
    const { count: examCount } = await sb.from('exams').select('*', { count: 'exact', head: true });
    if ((examCount || 0) === 0) {
      console.log('Seeding exams to Supabase...');
      const examRows = INITIAL_EXAMS.map(e => ({
        id: e.id,
        title: e.title,
        description: e.description,
        duration_minutes: e.durationMinutes,
        year: e.year,
        target_track: e.targetTrack,
        total_points: e.totalPoints,
        part1_count: e.part1Count,
        part2_count: e.part2Count,
        question_ids: e.questions.map(q => q.id),
        created_by: e.createdBy,
        created_at: e.createdAt,
        tags: e.tags || [],
        is_official: e.isOfficial
      }));
      await sb.from('exams').insert(examRows);
    }

    // Check default users
    const { count: usersCount } = await sb.from('users').select('*', { count: 'exact', head: true });
    if ((usersCount || 0) === 0) {
      console.log('Seeding default users to Supabase...');
      const defaultUsers = [
        {
          id: 'user_student_1',
          username: 'hocsinh12',
          full_name: 'Nguyễn Minh Quân',
          birth_date: '2007-05-15',
          email: 'minhquan.tin12@gmail.com',
          phone: '0912345678',
          gender: 'Nam',
          province: 'Hà Nội',
          password: '123',
          role: 'student',
          target_score: 9.5,
          track: 'BOTH',
          avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          created_at: '2025-01-01'
        },
        {
          id: 'user_teacher_1',
          username: 'giaovien_tin',
          full_name: 'Thầy Lê Hoàng Long',
          birth_date: '1982-10-20',
          email: 'hoanglong.gv@thpt.edu.vn',
          phone: '0987654321',
          gender: 'Nam',
          province: 'Đà Nẵng',
          password: '123',
          role: 'teacher',
          target_score: null,
          track: 'BOTH',
          avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          created_at: '2024-09-01'
        }
      ];
      await sb.from('users').insert(defaultUsers);
    }

    return true;
  } catch (err) {
    console.error('Error seeding Supabase:', err);
    return false;
  }
}

// 3. Users Queries
export async function getSupabaseUsers(): Promise<User[]> {
  const sb = getSupabase();
  if (!sb) return [];

  const { data, error } = await sb.from('users').select('*').order('created_at', { ascending: false });
  if (error || !data) return [];

  return data.map(r => ({
    id: r.id,
    username: r.username,
    fullName: r.full_name,
    birthDate: r.birth_date,
    email: r.email,
    phone: r.phone,
    gender: r.gender,
    province: r.province,
    password: r.password,
    role: r.role,
    targetScore: r.target_score ? Number(r.target_score) : undefined,
    track: r.track,
    avatarUrl: r.avatar_url,
    createdAt: r.created_at
  }));
}

export async function getSupabaseUserByUsername(username: string): Promise<User | null> {
  const sb = getSupabase();
  if (!sb) return null;

  const { data, error } = await sb.from('users').select('*').ilike('username', username.trim()).single();
  if (error || !data) return null;

  return {
    id: data.id,
    username: data.username,
    fullName: data.full_name,
    birthDate: data.birth_date,
    email: data.email,
    phone: data.phone,
    gender: data.gender,
    province: data.province,
    password: data.password,
    role: data.role,
    targetScore: data.target_score ? Number(data.target_score) : undefined,
    track: data.track,
    avatarUrl: data.avatar_url,
    createdAt: data.created_at
  };
}

export async function createSupabaseUser(user: User): Promise<User | null> {
  const sb = getSupabase();
  if (!sb) return null;

  const row = {
    id: user.id,
    username: user.username,
    full_name: user.fullName,
    birth_date: user.birthDate || '',
    email: user.email || '',
    phone: user.phone || '',
    gender: user.gender || 'Nam',
    province: user.province || 'Hà Nội',
    password: user.password || '123',
    role: user.role || 'student',
    target_score: user.targetScore || null,
    track: user.track || 'BOTH',
    avatar_url: user.avatarUrl || '',
    created_at: user.createdAt || new Date().toISOString()
  };

  const { error } = await sb.from('users').insert(row);
  if (error) {
    console.error('Supabase create user error:', error);
    return null;
  }
  return user;
}

export async function updateSupabaseUser(id: string, updates: Partial<User>): Promise<User | null> {
  const sb = getSupabase();
  if (!sb) return null;

  const payload: any = {};
  if (updates.fullName !== undefined) payload.full_name = updates.fullName;
  if (updates.birthDate !== undefined) payload.birth_date = updates.birthDate;
  if (updates.email !== undefined) payload.email = updates.email;
  if (updates.phone !== undefined) payload.phone = updates.phone;
  if (updates.gender !== undefined) payload.gender = updates.gender;
  if (updates.province !== undefined) payload.province = updates.province;
  if (updates.password !== undefined) payload.password = updates.password;
  if (updates.role !== undefined) payload.role = updates.role;
  if (updates.targetScore !== undefined) payload.target_score = updates.targetScore;
  if (updates.track !== undefined) payload.track = updates.track;
  if (updates.avatarUrl !== undefined) payload.avatar_url = updates.avatarUrl;

  const { data, error } = await sb.from('users').update(payload).eq('id', id).select().single();
  if (error || !data) return null;

  return {
    id: data.id,
    username: data.username,
    fullName: data.full_name,
    birthDate: data.birth_date,
    email: data.email,
    phone: data.phone,
    gender: data.gender,
    province: data.province,
    password: data.password,
    role: data.role,
    targetScore: data.target_score ? Number(data.target_score) : undefined,
    track: data.track,
    avatarUrl: data.avatar_url,
    createdAt: data.created_at
  };
}

// 4. Topics & Lessons
export async function getSupabaseTopics(): Promise<SubjectTopic[]> {
  const sb = getSupabase();
  if (!sb) return [];

  const { data, error } = await sb.from('topics').select('*').order('code', { ascending: true });
  if (error || !data) return [];

  return data.map(r => ({
    id: r.id,
    code: r.code,
    title: r.title,
    shortTitle: r.short_title,
    description: r.description,
    track: r.track,
    iconName: r.icon_name,
    color: r.color,
    bgLight: r.bg_light,
    borderColor: r.border_color,
    lessonsCount: r.lessons_count
  }));
}

export async function getSupabaseLessons(): Promise<TheoryLesson[]> {
  const sb = getSupabase();
  if (!sb) return [];

  const { data, error } = await sb.from('lessons').select('*').order('sort_order', { ascending: true });
  if (error || !data) return [];

  return data.map(r => ({
    id: r.id,
    topicId: r.topic_id,
    title: r.title,
    order: r.sort_order,
    summary: r.summary,
    contentMarkdown: r.content_markdown,
    keyTakeaways: r.key_takeaways || [],
    codeSnippets: r.code_snippets || [],
    examTips: r.exam_tips || [],
    author: r.author,
    updatedAt: r.updated_at
  }));
}

export async function createSupabaseLesson(lesson: TheoryLesson): Promise<TheoryLesson | null> {
  const sb = getSupabase();
  if (!sb) return null;

  const row = {
    id: lesson.id,
    topic_id: lesson.topicId,
    title: lesson.title,
    sort_order: lesson.order || 1,
    summary: lesson.summary || '',
    content_markdown: lesson.contentMarkdown || '',
    key_takeaways: lesson.keyTakeaways || [],
    code_snippets: lesson.codeSnippets || [],
    exam_tips: lesson.examTips || [],
    author: lesson.author || 'Giáo viên',
    updated_at: lesson.updatedAt || new Date().toISOString()
  };

  const { error } = await sb.from('lessons').insert(row);
  if (error) return null;
  return lesson;
}

export async function updateSupabaseLesson(id: string, updates: Partial<TheoryLesson>): Promise<TheoryLesson | null> {
  const sb = getSupabase();
  if (!sb) return null;

  const payload: any = { updated_at: new Date().toISOString() };
  if (updates.topicId !== undefined) payload.topic_id = updates.topicId;
  if (updates.title !== undefined) payload.title = updates.title;
  if (updates.order !== undefined) payload.sort_order = updates.order;
  if (updates.summary !== undefined) payload.summary = updates.summary;
  if (updates.contentMarkdown !== undefined) payload.content_markdown = updates.contentMarkdown;
  if (updates.keyTakeaways !== undefined) payload.key_takeaways = updates.keyTakeaways;
  if (updates.codeSnippets !== undefined) payload.code_snippets = updates.codeSnippets;
  if (updates.examTips !== undefined) payload.exam_tips = updates.examTips;
  if (updates.author !== undefined) payload.author = updates.author;

  const { data, error } = await sb.from('lessons').update(payload).eq('id', id).select().single();
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
}

export async function deleteSupabaseLesson(id: string): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;

  const { error } = await sb.from('lessons').delete().eq('id', id);
  return !error;
}

// 5. Questions
export async function getSupabaseQuestions(): Promise<Question[]> {
  const sb = getSupabase();
  if (!sb) return [];

  const { data, error } = await sb.from('questions').select('*');
  if (error || !data) return [];

  return data.map(r => ({
    id: r.id,
    topicId: r.topic_id,
    lessonId: r.lesson_id || '',
    lessonTitle: r.lesson_title || '',
    type: r.type,
    content: r.content,
    codeSnippet: r.code_snippet || undefined,
    options: r.options || undefined,
    correctAnswer: r.correct_answer || undefined,
    subQuestions: r.sub_questions || undefined,
    explanation: r.explanation,
    cognitiveLevel: r.cognitive_level,
    track: r.track,
    source: r.source || undefined,
    author: r.author || undefined
  }));
}

export async function createSupabaseQuestion(q: Question): Promise<Question | null> {
  const sb = getSupabase();
  if (!sb) return null;

  const row = {
    id: q.id,
    topic_id: q.topicId,
    lesson_id: q.lessonId || null,
    lesson_title: q.lessonTitle || null,
    type: q.type,
    content: q.content,
    code_snippet: q.codeSnippet || null,
    options: q.options || null,
    correct_answer: q.correctAnswer || null,
    sub_questions: q.subQuestions || null,
    explanation: q.explanation,
    cognitive_level: q.cognitiveLevel,
    track: q.track,
    source: q.source || null,
    author: q.author || 'Giáo viên',
    created_at: new Date().toISOString()
  };

  const { error } = await sb.from('questions').insert(row);
  if (error) return null;
  return q;
}

export async function updateSupabaseQuestion(id: string, updates: Partial<Question>): Promise<Question | null> {
  const sb = getSupabase();
  if (!sb) return null;

  const payload: any = {};
  if (updates.topicId !== undefined) payload.topic_id = updates.topicId;
  if (updates.lessonId !== undefined) payload.lesson_id = updates.lessonId;
  if (updates.lessonTitle !== undefined) payload.lesson_title = updates.lessonTitle;
  if (updates.type !== undefined) payload.type = updates.type;
  if (updates.content !== undefined) payload.content = updates.content;
  if (updates.codeSnippet !== undefined) payload.code_snippet = updates.codeSnippet;
  if (updates.options !== undefined) payload.options = updates.options;
  if (updates.correctAnswer !== undefined) payload.correct_answer = updates.correctAnswer;
  if (updates.subQuestions !== undefined) payload.sub_questions = updates.subQuestions;
  if (updates.explanation !== undefined) payload.explanation = updates.explanation;
  if (updates.cognitiveLevel !== undefined) payload.cognitive_level = updates.cognitiveLevel;
  if (updates.track !== undefined) payload.track = updates.track;
  if (updates.source !== undefined) payload.source = updates.source;
  if (updates.author !== undefined) payload.author = updates.author;

  const { data, error } = await sb.from('questions').update(payload).eq('id', id).select().single();
  if (error || !data) return null;

  return {
    id: data.id,
    topicId: data.topic_id,
    lessonId: data.lesson_id || '',
    lessonTitle: data.lesson_title || '',
    type: data.type,
    content: data.content,
    codeSnippet: data.code_snippet || undefined,
    options: data.options || undefined,
    correctAnswer: data.correct_answer || undefined,
    subQuestions: data.sub_questions || undefined,
    explanation: data.explanation,
    cognitiveLevel: data.cognitive_level,
    track: data.track,
    source: data.source || undefined,
    author: data.author || undefined
  };
}

export async function deleteSupabaseQuestion(id: string): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;

  const { error } = await sb.from('questions').delete().eq('id', id);
  return !error;
}

// 6. Exams
export async function getSupabaseExams(): Promise<Exam[]> {
  const sb = getSupabase();
  if (!sb) return [];

  const [examsRes, questions] = await Promise.all([
    sb.from('exams').select('*').order('created_at', { ascending: false }),
    getSupabaseQuestions()
  ]);

  if (examsRes.error || !examsRes.data) return [];
  const qMap = new Map(questions.map(q => [q.id, q]));

  return examsRes.data.map(r => {
    const qIds: string[] = Array.isArray(r.question_ids) ? r.question_ids : [];
    const matched = qIds.map(id => qMap.get(id)).filter((q): q is Question => q !== undefined);
    const finalQuestions = matched.length > 0 ? matched : questions.slice(0, 28);

    return {
      id: r.id,
      title: r.title,
      description: r.description,
      durationMinutes: r.duration_minutes,
      year: r.year,
      targetTrack: r.target_track,
      totalPoints: r.total_points,
      part1Count: r.part1_count,
      part2Count: r.part2_count,
      questions: finalQuestions,
      createdBy: r.created_by,
      createdAt: r.created_at,
      tags: r.tags || [],
      isOfficial: Boolean(r.is_official)
    };
  });
}

export async function createSupabaseExam(exam: Exam): Promise<Exam | null> {
  const sb = getSupabase();
  if (!sb) return null;

  const row = {
    id: exam.id,
    title: exam.title,
    description: exam.description,
    duration_minutes: exam.durationMinutes,
    year: exam.year,
    target_track: exam.targetTrack,
    total_points: exam.totalPoints,
    part1_count: exam.part1Count,
    part2_count: exam.part2Count,
    question_ids: exam.questions.map(q => q.id),
    created_by: exam.createdBy,
    created_at: exam.createdAt,
    tags: exam.tags || [],
    is_official: exam.isOfficial
  };

  const { error } = await sb.from('exams').insert(row);
  if (error) return null;
  return exam;
}

export async function deleteSupabaseExam(id: string): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;

  const { error } = await sb.from('exams').delete().eq('id', id);
  return !error;
}

// 7. Exam Results
export async function getSupabaseExamResults(userId?: string): Promise<ExamResult[]> {
  const sb = getSupabase();
  if (!sb) return [];

  let query = sb.from('exam_results').select('*').order('completed_at', { ascending: false });
  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query;
  if (error || !data) return [];

  return data.map(r => ({
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
}

export async function createSupabaseExamResult(result: ExamResult): Promise<ExamResult | null> {
  const sb = getSupabase();
  if (!sb) return null;

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

  const { error } = await sb.from('exam_results').insert(row);
  if (error) {
    console.error('Error creating Supabase exam result:', error);
    return null;
  }
  return result;
}

// 8. Bookmarks
export async function getSupabaseBookmarks(userId?: string): Promise<BookmarkNote[]> {
  const sb = getSupabase();
  if (!sb) return [];

  let query = sb.from('bookmarks').select('*').order('updated_at', { ascending: false });
  if (userId) {
    query = query.eq('user_id', userId);
  }

  const [bmsRes, questions] = await Promise.all([
    query,
    getSupabaseQuestions()
  ]);

  if (bmsRes.error || !bmsRes.data) return [];
  const qMap = new Map(questions.map(q => [q.id, q]));

  return bmsRes.data
    .map(r => {
      const q = qMap.get(r.question_id);
      if (!q) return null;
      return {
        id: r.id,
        userId: r.user_id,
        questionId: r.question_id,
        question: q,
        note: r.note || '',
        masteryStatus: r.mastery_status || 'need_review',
        createdAt: r.created_at,
        updatedAt: r.updated_at
      } as BookmarkNote;
    })
    .filter((b): b is BookmarkNote => b !== null);
}

export async function toggleSupabaseBookmark(userId: string, questionId: string, note: string = '', masteryStatus: string = 'need_review'): Promise<{ active: boolean; bookmark?: BookmarkNote }> {
  const sb = getSupabase();
  if (!sb) return { active: false };

  const { data: existing } = await sb.from('bookmarks').select('id').eq('user_id', userId).eq('question_id', questionId).maybeSingle();

  if (existing) {
    await sb.from('bookmarks').delete().eq('id', existing.id);
    return { active: false };
  } else {
    const id = `bm_${Date.now()}`;
    const today = new Date().toISOString();
    await sb.from('bookmarks').insert({
      id,
      user_id: userId,
      question_id: questionId,
      note,
      mastery_status: masteryStatus,
      created_at: today,
      updated_at: today
    });

    const questions = await getSupabaseQuestions();
    const q = questions.find(x => x.id === questionId);
    if (!q) return { active: true };

    return {
      active: true,
      bookmark: {
        id,
        userId,
        questionId,
        question: q,
        note,
        masteryStatus: masteryStatus as any,
        createdAt: today,
        updatedAt: today
      }
    };
  }
}

export async function updateSupabaseBookmark(userId: string, questionId: string, note: string, masteryStatus: string): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;

  const { error } = await sb
    .from('bookmarks')
    .update({ note, mastery_status: masteryStatus, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('question_id', questionId);

  return !error;
}

export async function removeSupabaseBookmark(userId: string, questionId: string): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;

  const { error } = await sb.from('bookmarks').delete().eq('user_id', userId).eq('question_id', questionId);
  return !error;
}
