-- =========================================================================
-- HỆ THỐNG CƠ SỞ DỮ LIỆU LUYỆN THI TỐT NGHIỆP THPT QUỐC GIA - MÔN TIN HỌC
-- Schema PostgreSQL trên Supabase Cloud
-- =========================================================================

-- 1. BẢNG NGƯỜI DÙNG (USERS)
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  birth_date TEXT,
  email TEXT,
  phone TEXT,
  gender TEXT DEFAULT 'Nam',
  province TEXT DEFAULT 'Hà Nội',
  password TEXT DEFAULT '123',
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
  target_score REAL,
  track TEXT DEFAULT 'BOTH' CHECK (track IN ('ICT', 'CS', 'BOTH')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- 2. BẢNG CHỦ ĐỀ CHƯƠNG TRÌNH GDPT 2018 (TOPICS)
CREATE TABLE IF NOT EXISTS public.topics (
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

-- 3. BẢNG BÀI HỌC LÝ THUYẾT & TỔNG HỢP KIẾN THỨC (LESSONS)
CREATE TABLE IF NOT EXISTS public.lessons (
  id TEXT PRIMARY KEY,
  topic_id TEXT NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  sort_order INTEGER DEFAULT 1,
  summary TEXT,
  content_markdown TEXT,
  key_takeaways JSONB DEFAULT '[]'::jsonb,
  code_snippets JSONB DEFAULT '[]'::jsonb,
  exam_tips JSONB DEFAULT '[]'::jsonb,
  author TEXT DEFAULT 'Tổ Khảo Thí Tin Học',
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- 4. BẢNG NGÂN HÀNG CÂU HỎI KHẢO THÍ (QUESTIONS)
CREATE TABLE IF NOT EXISTS public.questions (
  id TEXT PRIMARY KEY,
  topic_id TEXT NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
  lesson_id TEXT,
  lesson_title TEXT,
  type TEXT NOT NULL CHECK (type IN ('single_choice', 'true_false')),
  content TEXT NOT NULL,
  code_snippet TEXT,
  options JSONB,
  correct_answer TEXT,
  sub_questions JSONB,
  explanation TEXT NOT NULL,
  cognitive_level TEXT NOT NULL CHECK (cognitive_level IN ('NB', 'TH', 'VD', 'VDC')),
  track TEXT NOT NULL DEFAULT 'BOTH' CHECK (track IN ('ICT', 'CS', 'BOTH')),
  source TEXT,
  author TEXT DEFAULT 'Tổ Khảo Thí Tin Học',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- 5. BẢNG ĐỀ THI THỬ CHUẨN CẤU TRÚC BỘ GD&ĐT (EXAMS)
CREATE TABLE IF NOT EXISTS public.exams (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER DEFAULT 50,
  year INTEGER DEFAULT 2025,
  target_track TEXT DEFAULT 'BOTH',
  total_points REAL DEFAULT 10.0,
  part1_count INTEGER DEFAULT 24,
  part2_count INTEGER DEFAULT 4,
  question_ids JSONB DEFAULT '[]'::jsonb,
  created_by TEXT DEFAULT 'Tổ Khảo Thí Tin Học',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
  tags JSONB DEFAULT '[]'::jsonb,
  is_official BOOLEAN DEFAULT TRUE
);

-- 6. BẢNG KẾT QUẢ & LỊCH SỬ THI (EXAM RESULTS)
CREATE TABLE IF NOT EXISTS public.exam_results (
  id TEXT PRIMARY KEY,
  exam_id TEXT NOT NULL,
  exam_title TEXT NOT NULL,
  user_id TEXT NOT NULL,
  user_full_name TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
  time_spent_seconds INTEGER DEFAULT 0,
  score REAL DEFAULT 0.0,
  part1_score REAL DEFAULT 0.0,
  part2_score REAL DEFAULT 0.0,
  total_correct_questions INTEGER DEFAULT 0,
  total_questions INTEGER DEFAULT 28,
  answers_json JSONB DEFAULT '{}'::jsonb,
  topic_performance_json JSONB DEFAULT '[]'::jsonb,
  strong_topics_json JSONB DEFAULT '[]'::jsonb,
  weak_topics_json JSONB DEFAULT '[]'::jsonb,
  ai_diagnostic_json JSONB
);

-- 7. BẢNG SỔ TAY CÂU HỎI KHÓ / GHI CHÚ ÔN TẬP (BOOKMARKS)
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  question_id TEXT NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  note TEXT DEFAULT '',
  mastery_status TEXT DEFAULT 'need_review' CHECK (mastery_status IN ('need_review', 'mastered')),
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id, question_id)
);

-- CHỈ MỤC TỐI ƯU HIỆU SUẤT TRUY VẤN
CREATE INDEX IF NOT EXISTS idx_questions_topic ON public.questions(topic_id);
CREATE INDEX IF NOT EXISTS idx_lessons_topic ON public.lessons(topic_id);
CREATE INDEX IF NOT EXISTS idx_exam_results_user ON public.exam_results(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON public.bookmarks(user_id);
