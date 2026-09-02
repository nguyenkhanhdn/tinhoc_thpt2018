-- Supabase SQL Schema for Tin Học THPT 2025 Platform
-- Chạy đoạn mã này trong mục SQL Editor trên Dashboard Supabase của bạn

-- 1. Bảng Users
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
  role TEXT NOT NULL DEFAULT 'student',
  target_score NUMERIC,
  track TEXT DEFAULT 'BOTH',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Bảng Chuyên đề kiến thức (Topics)
CREATE TABLE IF NOT EXISTS topics (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  title TEXT NOT NULL,
  short_title TEXT NOT NULL,
  description TEXT,
  track TEXT DEFAULT 'BOTH',
  icon_name TEXT,
  color TEXT,
  bg_light TEXT,
  border_color TEXT,
  lessons_count INTEGER DEFAULT 0
);

-- 3. Bảng Bài học lý thuyết (Lessons)
CREATE TABLE IF NOT EXISTS lessons (
  id TEXT PRIMARY KEY,
  topic_id TEXT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  sort_order INTEGER DEFAULT 1,
  summary TEXT,
  content_markdown TEXT,
  key_takeaways JSONB DEFAULT '[]'::jsonb,
  code_snippets JSONB DEFAULT '[]'::jsonb,
  exam_tips JSONB DEFAULT '[]'::jsonb,
  author TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Bảng Ngân hàng câu hỏi (Questions)
CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  topic_id TEXT NOT NULL,
  lesson_id TEXT,
  lesson_title TEXT,
  type TEXT NOT NULL DEFAULT 'single_choice',
  content TEXT NOT NULL,
  code_snippet JSONB,
  options JSONB,
  correct_answer TEXT,
  sub_questions JSONB,
  explanation TEXT,
  cognitive_level TEXT DEFAULT 'TH',
  track TEXT DEFAULT 'BOTH',
  source TEXT,
  author TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Bảng Đề thi thử (Exams)
CREATE TABLE IF NOT EXISTS exams (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER DEFAULT 50,
  year INTEGER DEFAULT 2025,
  target_track TEXT DEFAULT 'ALL',
  total_points NUMERIC DEFAULT 10.0,
  part1_count INTEGER DEFAULT 24,
  part2_count INTEGER DEFAULT 4,
  question_ids JSONB DEFAULT '[]'::jsonb,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  tags JSONB DEFAULT '[]'::jsonb,
  is_official BOOLEAN DEFAULT false
);

-- 6. Bảng Kết quả thi (Exam Results)
CREATE TABLE IF NOT EXISTS exam_results (
  id TEXT PRIMARY KEY,
  exam_id TEXT NOT NULL,
  exam_title TEXT NOT NULL,
  user_id TEXT NOT NULL,
  user_full_name TEXT NOT NULL,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  time_spent_seconds INTEGER,
  score NUMERIC,
  part1_score NUMERIC,
  part2_score NUMERIC,
  total_correct_questions INTEGER,
  total_questions INTEGER,
  answers_json JSONB,
  topic_performance_json JSONB,
  strong_topics_json JSONB,
  weak_topics_json JSONB,
  ai_diagnostic_json JSONB
);

-- 7. Bảng Sổ tay câu hỏi khó & Bookmark (Bookmarks)
CREATE TABLE IF NOT EXISTS bookmarks (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  note TEXT,
  mastery_status TEXT DEFAULT 'need_review',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_question UNIQUE (user_id, question_id)
);

-- Tạo Index để tăng tốc độ truy vấn xếp hạng và kết quả
CREATE INDEX IF NOT EXISTS idx_exam_results_user ON exam_results(user_id);
CREATE INDEX IF NOT EXISTS idx_exam_results_score ON exam_results(total_correct_questions DESC, time_spent_seconds ASC);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_questions_topic ON questions(topic_id);
