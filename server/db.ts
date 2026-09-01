import initSqlJs, { Database } from 'sql.js';
import fs from 'fs';
import path from 'path';
import { INITIAL_QUESTIONS } from '../src/data/questionsBank.js';
import { SUBJECT_TOPICS, INITIAL_LESSONS } from '../src/data/topicsAndLessons.js';
import { INITIAL_EXAMS } from '../src/data/mockExams.js';
import { User, SubjectTopic, TheoryLesson, Question, Exam, ExamResult, BookmarkNote } from '../src/types.js';

const DB_FILE_PATH = path.join(process.cwd(), 'sqlite_data', 'tin_hoc.sqlite');

let dbInstance: Database | null = null;

// Helper to ensure data directory exists
function ensureDirectoryExistence(filePath: string) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

// Persist the in-memory SQLite database to disk file
export function saveDatabase(): void {
  if (!dbInstance) return;
  try {
    ensureDirectoryExistence(DB_FILE_PATH);
    const data = dbInstance.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_FILE_PATH, buffer);
  } catch (err) {
    console.error('Error saving SQLite database to disk:', err);
  }
}

export async function getDatabase(): Promise<Database> {
  if (dbInstance) return dbInstance;

  const SQL = await initSqlJs();
  ensureDirectoryExistence(DB_FILE_PATH);

  if (fs.existsSync(DB_FILE_PATH)) {
    try {
      const fileBuffer = fs.readFileSync(DB_FILE_PATH);
      dbInstance = new SQL.Database(fileBuffer);
      console.log('Loaded existing SQLite database from:', DB_FILE_PATH);
    } catch (err) {
      console.error('Error loading SQLite file, creating fresh database:', err);
      dbInstance = new SQL.Database();
    }
  } else {
    console.log('Creating new SQLite database at:', DB_FILE_PATH);
    dbInstance = new SQL.Database();
  }

  // Initialize schema & seed
  initSchema(dbInstance);
  seedInitialData(dbInstance);
  saveDatabase();

  return dbInstance;
}

function initSchema(db: Database) {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      full_name TEXT NOT NULL,
      birth_date TEXT,
      email TEXT,
      phone TEXT,
      gender TEXT,
      province TEXT,
      password TEXT,
      role TEXT NOT NULL,
      target_score REAL,
      track TEXT,
      avatar_url TEXT,
      created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS topics (
      id TEXT PRIMARY KEY,
      code TEXT NOT NULL,
      title TEXT NOT NULL,
      short_title TEXT NOT NULL,
      description TEXT,
      track TEXT,
      icon_name TEXT,
      color TEXT,
      bg_light TEXT,
      border_color TEXT,
      lessons_count INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS lessons (
      id TEXT PRIMARY KEY,
      topic_id TEXT NOT NULL,
      title TEXT NOT NULL,
      sort_order INTEGER DEFAULT 1,
      summary TEXT,
      content_markdown TEXT,
      key_takeaways TEXT,
      code_snippets TEXT,
      exam_tips TEXT,
      author TEXT,
      updated_at TEXT,
      FOREIGN KEY (topic_id) REFERENCES topics(id)
    );

    CREATE TABLE IF NOT EXISTS questions (
      id TEXT PRIMARY KEY,
      topic_id TEXT NOT NULL,
      lesson_id TEXT,
      lesson_title TEXT,
      type TEXT NOT NULL,
      content TEXT NOT NULL,
      code_snippet TEXT,
      options TEXT,
      correct_answer TEXT,
      sub_questions TEXT,
      explanation TEXT,
      cognitive_level TEXT,
      track TEXT,
      source TEXT,
      author TEXT,
      created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS exams (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      duration_minutes INTEGER DEFAULT 50,
      year INTEGER DEFAULT 2025,
      target_track TEXT DEFAULT 'ALL',
      total_points REAL DEFAULT 10.0,
      part1_count INTEGER DEFAULT 24,
      part2_count INTEGER DEFAULT 4,
      question_ids TEXT,
      created_by TEXT,
      created_at TEXT,
      tags TEXT,
      is_official INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS exam_results (
      id TEXT PRIMARY KEY,
      exam_id TEXT NOT NULL,
      exam_title TEXT NOT NULL,
      user_id TEXT NOT NULL,
      user_full_name TEXT NOT NULL,
      started_at TEXT,
      completed_at TEXT,
      time_spent_seconds INTEGER,
      score REAL,
      part1_score REAL,
      part2_score REAL,
      total_correct_questions INTEGER,
      total_questions INTEGER,
      answers_json TEXT,
      topic_performance_json TEXT,
      strong_topics_json TEXT,
      weak_topics_json TEXT,
      ai_diagnostic_json TEXT
    );

    CREATE TABLE IF NOT EXISTS bookmarks (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      question_id TEXT NOT NULL,
      note TEXT,
      mastery_status TEXT DEFAULT 'need_review',
      created_at TEXT,
      updated_at TEXT
    );
  `);
}

function seedInitialData(db: Database) {
  // 1. Seed Users if empty
  const userCheck = db.exec("SELECT COUNT(*) as count FROM users");
  const userCount = userCheck[0]?.values[0]?.[0] as number;
  if (userCount === 0) {
    console.log('Seeding default users to SQLite...');
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

    for (const u of defaultUsers) {
      db.run(
        `INSERT INTO users (id, username, full_name, birth_date, email, phone, gender, province, password, role, target_score, track, avatar_url, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [u.id, u.username, u.full_name, u.birth_date, u.email, u.phone, u.gender, u.province, u.password, u.role, u.target_score, u.track, u.avatar_url, u.created_at]
      );
    }
  }

  // 2. Seed Topics if empty
  const topicCheck = db.exec("SELECT COUNT(*) as count FROM topics");
  const topicCount = topicCheck[0]?.values[0]?.[0] as number;
  if (topicCount === 0) {
    console.log('Seeding topics to SQLite...');
    for (const t of SUBJECT_TOPICS) {
      db.run(
        `INSERT INTO topics (id, code, title, short_title, description, track, icon_name, color, bg_light, border_color, lessons_count)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [t.id, t.code, t.title, t.shortTitle, t.description, t.track, t.iconName, t.color, t.bgLight, t.borderColor, t.lessonsCount]
      );
    }
  }

  // 3. Seed Lessons if empty
  const lessonCheck = db.exec("SELECT COUNT(*) as count FROM lessons");
  const lessonCount = lessonCheck[0]?.values[0]?.[0] as number;
  if (lessonCount === 0) {
    console.log('Seeding lessons to SQLite...');
    for (const l of INITIAL_LESSONS) {
      db.run(
        `INSERT INTO lessons (id, topic_id, title, sort_order, summary, content_markdown, key_takeaways, code_snippets, exam_tips, author, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          l.id,
          l.topicId,
          l.title,
          l.order,
          l.summary,
          l.contentMarkdown,
          JSON.stringify(l.keyTakeaways || []),
          JSON.stringify(l.codeSnippets || []),
          JSON.stringify(l.examTips || []),
          l.author,
          l.updatedAt
        ]
      );
    }
  }

  // 4. Seed Questions if empty
  const questionCheck = db.exec("SELECT COUNT(*) as count FROM questions");
  const questionCount = questionCheck[0]?.values[0]?.[0] as number;
  if (questionCount === 0) {
    console.log('Seeding questions bank to SQLite...');
    for (const q of INITIAL_QUESTIONS) {
      db.run(
        `INSERT INTO questions (id, topic_id, lesson_id, lesson_title, type, content, code_snippet, options, correct_answer, sub_questions, explanation, cognitive_level, track, source, author, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          q.id,
          q.topicId,
          q.lessonId || null,
          q.lessonTitle || null,
          q.type,
          q.content,
          q.codeSnippet ? JSON.stringify(q.codeSnippet) : null,
          q.options ? JSON.stringify(q.options) : null,
          q.correctAnswer || null,
          q.subQuestions ? JSON.stringify(q.subQuestions) : null,
          q.explanation,
          q.cognitiveLevel,
          q.track,
          q.source || null,
          q.author || 'Tổ Khảo Thí',
          new Date().toISOString().split('T')[0]
        ]
      );
    }
  }

  // 5. Seed Exams if empty
  const examCheck = db.exec("SELECT COUNT(*) as count FROM exams");
  const examCount = examCheck[0]?.values[0]?.[0] as number;
  if (examCount === 0) {
    console.log('Seeding exams to SQLite...');
    for (const e of INITIAL_EXAMS) {
      const qIds = e.questions.map(q => q.id);
      db.run(
        `INSERT INTO exams (id, title, description, duration_minutes, year, target_track, total_points, part1_count, part2_count, question_ids, created_by, created_at, tags, is_official)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          e.id,
          e.title,
          e.description,
          e.durationMinutes,
          e.year,
          e.targetTrack,
          e.totalPoints,
          e.part1Count,
          e.part2Count,
          JSON.stringify(qIds),
          e.createdBy,
          e.createdAt,
          JSON.stringify(e.tags || []),
          e.isOfficial ? 1 : 0
        ]
      );
    }
  }
}

// ==================== REPOSITORY / QUERY FUNCTIONS ====================

// Helper to convert query result to objects array
function rowsFromQuery(result: { columns: string[]; values: any[][] }[]): any[] {
  if (!result || result.length === 0) return [];
  const columns = result[0].columns;
  return result[0].values.map(row => {
    const obj: any = {};
    columns.forEach((col, idx) => {
      obj[col] = row[idx];
    });
    return obj;
  });
}

// 1. Status & Stats
export async function getDbStats() {
  const db = await getDatabase();
  const counts = {
    users: (db.exec("SELECT COUNT(*) FROM users")[0]?.values[0]?.[0] as number) || 0,
    topics: (db.exec("SELECT COUNT(*) FROM topics")[0]?.values[0]?.[0] as number) || 0,
    lessons: (db.exec("SELECT COUNT(*) FROM lessons")[0]?.values[0]?.[0] as number) || 0,
    questions: (db.exec("SELECT COUNT(*) FROM questions")[0]?.values[0]?.[0] as number) || 0,
    exams: (db.exec("SELECT COUNT(*) FROM exams")[0]?.values[0]?.[0] as number) || 0,
    examResults: (db.exec("SELECT COUNT(*) FROM exam_results")[0]?.values[0]?.[0] as number) || 0,
    bookmarks: (db.exec("SELECT COUNT(*) FROM bookmarks")[0]?.values[0]?.[0] as number) || 0,
    filePath: DB_FILE_PATH,
    fileSizeBytes: fs.existsSync(DB_FILE_PATH) ? fs.statSync(DB_FILE_PATH).size : 0
  };
  return counts;
}

// 2. Users
export async function getAllUsers(): Promise<User[]> {
  const db = await getDatabase();
  const res = db.exec("SELECT * FROM users ORDER BY created_at DESC");
  const rows = rowsFromQuery(res);
  return rows.map(r => ({
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

export async function getUserById(id: string): Promise<User | null> {
  const db = await getDatabase();
  const stmt = db.prepare("SELECT * FROM users WHERE id = :id");
  stmt.bind({ ':id': id });
  let user: User | null = null;
  if (stmt.step()) {
    const r = stmt.getAsObject() as any;
    user = {
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
    };
  }
  stmt.free();
  return user;
}

export async function getUserByUsername(username: string): Promise<User | null> {
  const db = await getDatabase();
  const stmt = db.prepare("SELECT * FROM users WHERE LOWER(username) = LOWER(:u)");
  stmt.bind({ ':u': username.trim() });
  let user: User | null = null;
  if (stmt.step()) {
    const r = stmt.getAsObject() as any;
    user = {
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
    };
  }
  stmt.free();
  return user;
}

export async function createUser(user: User): Promise<User> {
  const db = await getDatabase();
  db.run(
    `INSERT INTO users (id, username, full_name, birth_date, email, phone, gender, province, password, role, target_score, track, avatar_url, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      user.id,
      user.username,
      user.fullName,
      user.birthDate || '',
      user.email || '',
      user.phone || '',
      user.gender || 'Nam',
      user.province || 'Hà Nội',
      user.password || '123',
      user.role || 'student',
      user.targetScore || null,
      user.track || 'BOTH',
      user.avatarUrl || '',
      user.createdAt || new Date().toISOString().split('T')[0]
    ]
  );
  saveDatabase();
  return user;
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User | null> {
  const db = await getDatabase();
  const current = await getUserById(id);
  if (!current) return null;

  const merged = { ...current, ...updates };
  db.run(
    `UPDATE users SET
      full_name = ?, birth_date = ?, email = ?, phone = ?, gender = ?, province = ?,
      password = ?, role = ?, target_score = ?, track = ?, avatar_url = ?
     WHERE id = ?`,
    [
      merged.fullName,
      merged.birthDate || '',
      merged.email || '',
      merged.phone || '',
      merged.gender || 'Nam',
      merged.province || '',
      merged.password || '123',
      merged.role,
      merged.targetScore || null,
      merged.track || 'BOTH',
      merged.avatarUrl || '',
      id
    ]
  );
  saveDatabase();
  return merged;
}

// 3. Topics & Lessons
export async function getAllTopics(): Promise<SubjectTopic[]> {
  const db = await getDatabase();
  const res = db.exec("SELECT * FROM topics ORDER BY code ASC");
  const rows = rowsFromQuery(res);
  return rows.map(r => ({
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

export async function getAllLessons(): Promise<TheoryLesson[]> {
  const db = await getDatabase();
  const res = db.exec("SELECT * FROM lessons ORDER BY topic_id ASC, sort_order ASC");
  const rows = rowsFromQuery(res);
  return rows.map(r => ({
    id: r.id,
    topicId: r.topic_id,
    title: r.title,
    order: r.sort_order,
    summary: r.summary,
    contentMarkdown: r.content_markdown,
    keyTakeaways: r.key_takeaways ? JSON.parse(r.key_takeaways) : [],
    codeSnippets: r.code_snippets ? JSON.parse(r.code_snippets) : [],
    examTips: r.exam_tips ? JSON.parse(r.exam_tips) : [],
    author: r.author,
    updatedAt: r.updated_at
  }));
}

export async function createLesson(lesson: TheoryLesson): Promise<TheoryLesson> {
  const db = await getDatabase();
  db.run(
    `INSERT INTO lessons (id, topic_id, title, sort_order, summary, content_markdown, key_takeaways, code_snippets, exam_tips, author, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      lesson.id,
      lesson.topicId,
      lesson.title,
      lesson.order || 1,
      lesson.summary || '',
      lesson.contentMarkdown || '',
      JSON.stringify(lesson.keyTakeaways || []),
      JSON.stringify(lesson.codeSnippets || []),
      JSON.stringify(lesson.examTips || []),
      lesson.author || 'Giáo viên',
      lesson.updatedAt || new Date().toISOString().split('T')[0]
    ]
  );
  // Update topic count
  db.run("UPDATE topics SET lessons_count = (SELECT COUNT(*) FROM lessons WHERE topic_id = ?) WHERE id = ?", [lesson.topicId, lesson.topicId]);
  saveDatabase();
  return lesson;
}

export async function updateLesson(id: string, updates: Partial<TheoryLesson>): Promise<TheoryLesson | null> {
  const db = await getDatabase();
  const res = db.exec(`SELECT * FROM lessons WHERE id = '${id}'`);
  const rows = rowsFromQuery(res);
  if (rows.length === 0) return null;
  const current = rows[0];

  const merged: TheoryLesson = {
    id,
    topicId: updates.topicId !== undefined ? updates.topicId : current.topic_id,
    title: updates.title !== undefined ? updates.title : current.title,
    order: updates.order !== undefined ? updates.order : current.sort_order,
    summary: updates.summary !== undefined ? updates.summary : current.summary,
    contentMarkdown: updates.contentMarkdown !== undefined ? updates.contentMarkdown : current.content_markdown,
    keyTakeaways: updates.keyTakeaways !== undefined ? updates.keyTakeaways : (current.key_takeaways ? JSON.parse(current.key_takeaways) : []),
    codeSnippets: updates.codeSnippets !== undefined ? updates.codeSnippets : (current.code_snippets ? JSON.parse(current.code_snippets) : []),
    examTips: updates.examTips !== undefined ? updates.examTips : (current.exam_tips ? JSON.parse(current.exam_tips) : []),
    author: updates.author !== undefined ? updates.author : current.author,
    updatedAt: new Date().toISOString().split('T')[0]
  };

  db.run(
    `UPDATE lessons SET
      topic_id = ?, title = ?, sort_order = ?, summary = ?, content_markdown = ?,
      key_takeaways = ?, code_snippets = ?, exam_tips = ?, author = ?, updated_at = ?
     WHERE id = ?`,
    [
      merged.topicId,
      merged.title,
      merged.order,
      merged.summary,
      merged.contentMarkdown,
      JSON.stringify(merged.keyTakeaways),
      JSON.stringify(merged.codeSnippets),
      JSON.stringify(merged.examTips),
      merged.author,
      merged.updatedAt,
      id
    ]
  );
  saveDatabase();
  return merged;
}

export async function deleteLesson(id: string): Promise<boolean> {
  const db = await getDatabase();
  const res = db.exec(`SELECT topic_id FROM lessons WHERE id = '${id}'`);
  const rows = rowsFromQuery(res);
  const topicId = rows[0]?.topic_id;

  db.run(`DELETE FROM lessons WHERE id = ?`, [id]);
  if (topicId) {
    db.run("UPDATE topics SET lessons_count = (SELECT COUNT(*) FROM lessons WHERE topic_id = ?) WHERE id = ?", [topicId, topicId]);
  }
  saveDatabase();
  return true;
}

// 4. Questions
export async function getAllQuestions(): Promise<Question[]> {
  const db = await getDatabase();
  const res = db.exec("SELECT * FROM questions ORDER BY rowid ASC");
  const rows = rowsFromQuery(res);
  return rows.map(r => ({
    id: r.id,
    topicId: r.topic_id,
    lessonId: r.lesson_id || '',
    lessonTitle: r.lesson_title || '',
    type: r.type,
    content: r.content,
    codeSnippet: r.code_snippet ? JSON.parse(r.code_snippet) : undefined,
    options: r.options ? JSON.parse(r.options) : undefined,
    correctAnswer: r.correct_answer || undefined,
    subQuestions: r.sub_questions ? JSON.parse(r.sub_questions) : undefined,
    explanation: r.explanation,
    cognitiveLevel: r.cognitive_level,
    track: r.track,
    source: r.source || undefined,
    author: r.author || undefined
  }));
}

export async function createQuestion(q: Question): Promise<Question> {
  const db = await getDatabase();
  db.run(
    `INSERT INTO questions (id, topic_id, lesson_id, lesson_title, type, content, code_snippet, options, correct_answer, sub_questions, explanation, cognitive_level, track, source, author, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      q.id,
      q.topicId,
      q.lessonId || null,
      q.lessonTitle || null,
      q.type,
      q.content,
      q.codeSnippet ? JSON.stringify(q.codeSnippet) : null,
      q.options ? JSON.stringify(q.options) : null,
      q.correctAnswer || null,
      q.subQuestions ? JSON.stringify(q.subQuestions) : null,
      q.explanation,
      q.cognitiveLevel,
      q.track,
      q.source || null,
      q.author || 'Giáo viên',
      new Date().toISOString().split('T')[0]
    ]
  );
  saveDatabase();
  return q;
}

export async function updateQuestion(id: string, updates: Partial<Question>): Promise<Question | null> {
  const db = await getDatabase();
  const res = db.exec(`SELECT * FROM questions WHERE id = '${id}'`);
  const rows = rowsFromQuery(res);
  if (rows.length === 0) return null;
  const current = rows[0];

  const merged: Question = {
    id,
    topicId: updates.topicId !== undefined ? updates.topicId : current.topic_id,
    lessonId: updates.lessonId !== undefined ? updates.lessonId : (current.lesson_id || ''),
    lessonTitle: updates.lessonTitle !== undefined ? updates.lessonTitle : (current.lesson_title || ''),
    type: updates.type !== undefined ? updates.type : current.type,
    content: updates.content !== undefined ? updates.content : current.content,
    codeSnippet: updates.codeSnippet !== undefined ? updates.codeSnippet : (current.code_snippet ? JSON.parse(current.code_snippet) : undefined),
    options: updates.options !== undefined ? updates.options : (current.options ? JSON.parse(current.options) : undefined),
    correctAnswer: updates.correctAnswer !== undefined ? updates.correctAnswer : current.correct_answer,
    subQuestions: updates.subQuestions !== undefined ? updates.subQuestions : (current.sub_questions ? JSON.parse(current.sub_questions) : undefined),
    explanation: updates.explanation !== undefined ? updates.explanation : current.explanation,
    cognitiveLevel: updates.cognitiveLevel !== undefined ? updates.cognitiveLevel : current.cognitive_level,
    track: updates.track !== undefined ? updates.track : current.track,
    source: updates.source !== undefined ? updates.source : current.source,
    author: updates.author !== undefined ? updates.author : current.author
  };

  db.run(
    `UPDATE questions SET
      topic_id = ?, lesson_id = ?, lesson_title = ?, type = ?, content = ?,
      code_snippet = ?, options = ?, correct_answer = ?, sub_questions = ?,
      explanation = ?, cognitive_level = ?, track = ?, source = ?, author = ?
     WHERE id = ?`,
    [
      merged.topicId,
      merged.lessonId || null,
      merged.lessonTitle || null,
      merged.type,
      merged.content,
      merged.codeSnippet ? JSON.stringify(merged.codeSnippet) : null,
      merged.options ? JSON.stringify(merged.options) : null,
      merged.correctAnswer || null,
      merged.subQuestions ? JSON.stringify(merged.subQuestions) : null,
      merged.explanation,
      merged.cognitiveLevel,
      merged.track,
      merged.source || null,
      merged.author || null,
      id
    ]
  );
  saveDatabase();
  return merged;
}

export async function deleteQuestion(id: string): Promise<boolean> {
  const db = await getDatabase();
  db.run(`DELETE FROM questions WHERE id = ?`, [id]);
  db.run(`DELETE FROM bookmarks WHERE question_id = ?`, [id]);
  saveDatabase();
  return true;
}

// 5. Exams
export async function getAllExams(): Promise<Exam[]> {
  const db = await getDatabase();
  const allQuestions = await getAllQuestions();
  const questionsMap = new Map(allQuestions.map(q => [q.id, q]));

  const res = db.exec("SELECT * FROM exams ORDER BY created_at DESC");
  const rows = rowsFromQuery(res);

  return rows.map(r => {
    const qIds: string[] = r.question_ids ? JSON.parse(r.question_ids) : [];
    // Resolve questions array from IDs
    const questions: Question[] = qIds
      .map(id => questionsMap.get(id))
      .filter((q): q is Question => q !== undefined);

    // Fallback: If no explicit IDs mapped, provide matching default questions
    const finalQuestions = questions.length > 0 ? questions : allQuestions.slice(0, 28);

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
      tags: r.tags ? JSON.parse(r.tags) : [],
      isOfficial: Boolean(r.is_official)
    };
  });
}

export async function createExam(exam: Exam): Promise<Exam> {
  const db = await getDatabase();
  const qIds = exam.questions.map(q => q.id);

  db.run(
    `INSERT INTO exams (id, title, description, duration_minutes, year, target_track, total_points, part1_count, part2_count, question_ids, created_by, created_at, tags, is_official)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      exam.id,
      exam.title,
      exam.description,
      exam.durationMinutes,
      exam.year,
      exam.targetTrack,
      exam.totalPoints,
      exam.part1Count,
      exam.part2Count,
      JSON.stringify(qIds),
      exam.createdBy,
      exam.createdAt,
      JSON.stringify(exam.tags || []),
      exam.isOfficial ? 1 : 0
    ]
  );
  saveDatabase();
  return exam;
}

export async function deleteExam(id: string): Promise<boolean> {
  const db = await getDatabase();
  db.run(`DELETE FROM exams WHERE id = ?`, [id]);
  saveDatabase();
  return true;
}

// 6. Exam Results
export async function getAllExamResults(userId?: string): Promise<ExamResult[]> {
  const db = await getDatabase();
  const sql = userId
    ? `SELECT * FROM exam_results WHERE user_id = '${userId}' ORDER BY completed_at DESC`
    : "SELECT * FROM exam_results ORDER BY completed_at DESC";

  const res = db.exec(sql);
  const rows = rowsFromQuery(res);

  return rows.map(r => ({
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
    answers: r.answers_json ? JSON.parse(r.answers_json) : {},
    topicPerformance: r.topic_performance_json ? JSON.parse(r.topic_performance_json) : [],
    strongTopics: r.strong_topics_json ? JSON.parse(r.strong_topics_json) : [],
    weakTopics: r.weak_topics_json ? JSON.parse(r.weak_topics_json) : [],
    aiDiagnostic: r.ai_diagnostic_json ? JSON.parse(r.ai_diagnostic_json) : undefined
  }));
}

export async function createExamResult(result: ExamResult): Promise<ExamResult> {
  const db = await getDatabase();
  db.run(
    `INSERT INTO exam_results (
      id, exam_id, exam_title, user_id, user_full_name, started_at, completed_at,
      time_spent_seconds, score, part1_score, part2_score, total_correct_questions,
      total_questions, answers_json, topic_performance_json, strong_topics_json,
      weak_topics_json, ai_diagnostic_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      result.id,
      result.examId,
      result.examTitle,
      result.userId,
      result.userFullName,
      result.startedAt,
      result.completedAt,
      result.timeSpentSeconds,
      result.score,
      result.part1Score,
      result.part2Score,
      result.totalCorrectQuestions,
      result.totalQuestions,
      JSON.stringify(result.answers || {}),
      JSON.stringify(result.topicPerformance || []),
      JSON.stringify(result.strongTopics || []),
      JSON.stringify(result.weakTopics || []),
      result.aiDiagnostic ? JSON.stringify(result.aiDiagnostic) : null
    ]
  );
  saveDatabase();
  return result;
}

// 7. Bookmarks
export async function getBookmarks(userId?: string): Promise<BookmarkNote[]> {
  const db = await getDatabase();
  const allQuestions = await getAllQuestions();
  const qMap = new Map(allQuestions.map(q => [q.id, q]));

  const sql = userId
    ? `SELECT * FROM bookmarks WHERE user_id = '${userId}' ORDER BY updated_at DESC`
    : "SELECT * FROM bookmarks ORDER BY updated_at DESC";

  const res = db.exec(sql);
  const rows = rowsFromQuery(res);

  return rows
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

export async function toggleBookmark(userId: string, questionId: string, note: string = '', masteryStatus: string = 'need_review'): Promise<{ active: boolean; bookmark?: BookmarkNote }> {
  const db = await getDatabase();
  const existingRes = db.exec(`SELECT id FROM bookmarks WHERE user_id = '${userId}' AND question_id = '${questionId}'`);
  const rows = rowsFromQuery(existingRes);

  if (rows.length > 0) {
    db.run(`DELETE FROM bookmarks WHERE user_id = ? AND question_id = ?`, [userId, questionId]);
    saveDatabase();
    return { active: false };
  } else {
    const id = `bm_${Date.now()}`;
    const today = new Date().toISOString().split('T')[0];
    db.run(
      `INSERT INTO bookmarks (id, user_id, question_id, note, mastery_status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, userId, questionId, note, masteryStatus, today, today]
    );
    saveDatabase();

    const allQ = await getAllQuestions();
    const q = allQ.find(x => x.id === questionId);
    if (!q) return { active: true };

    const bm: BookmarkNote = {
      id,
      userId,
      questionId,
      question: q,
      note,
      masteryStatus: masteryStatus as any,
      createdAt: today,
      updatedAt: today
    };
    return { active: true, bookmark: bm };
  }
}

export async function updateBookmark(userId: string, questionId: string, note: string, masteryStatus: string): Promise<boolean> {
  const db = await getDatabase();
  const today = new Date().toISOString().split('T')[0];
  db.run(
    `UPDATE bookmarks SET note = ?, mastery_status = ?, updated_at = ? WHERE user_id = ? AND question_id = ?`,
    [note, masteryStatus, today, userId, questionId]
  );
  saveDatabase();
  return true;
}

export async function removeBookmark(userId: string, questionId: string): Promise<boolean> {
  const db = await getDatabase();
  db.run(`DELETE FROM bookmarks WHERE user_id = ? AND question_id = ?`, [userId, questionId]);
  saveDatabase();
  return true;
}

// 8. Database Reset (Utility)
export async function resetDatabaseToDefaults() {
  const db = await getDatabase();
  db.run(`
    DROP TABLE IF EXISTS bookmarks;
    DROP TABLE IF EXISTS exam_results;
    DROP TABLE IF EXISTS exams;
    DROP TABLE IF EXISTS questions;
    DROP TABLE IF EXISTS lessons;
    DROP TABLE IF EXISTS topics;
    DROP TABLE IF EXISTS users;
  `);
  initSchema(db);
  seedInitialData(db);
  saveDatabase();
  return getDbStats();
}
