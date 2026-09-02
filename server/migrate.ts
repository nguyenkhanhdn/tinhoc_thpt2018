import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { SAMPLE_STUDENTS, INITIAL_SAMPLE_EXAM_RESULTS } from '../src/data/mockStudentResults.js';
import { SUBJECT_TOPICS, INITIAL_LESSONS } from '../src/data/topicsAndLessons.js';
import { INITIAL_QUESTIONS } from '../src/data/questionsBank.js';
import { INITIAL_EXAMS } from '../src/data/mockExams.js';

dotenv.config();
if (!process.env.SUPABASE_URL) {
  dotenv.config({ path: path.join(process.cwd(), '.env.example') });
}

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY)!;

console.log('🚀 Starting full data migration to Supabase Cloud...');
console.log('📍 Supabase Target:', supabaseUrl);

const sb = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

async function migrateAll() {
  try {
    // 1. TOPICS
    console.log('\n📦 1. Migrating Topics (Chủ đề Tin học GDPT 2018)...');
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
    const { data: topicsData, error: topicsError } = await sb
      .from('topics')
      .upsert(topicRows, { onConflict: 'id' })
      .select();
    if (topicsError) {
      console.error('❌ Error migrating topics:', topicsError.message);
    } else {
      console.log(`✅ Successfully synced ${topicsData?.length || topicRows.length} topics.`);
    }

    // 2. LESSONS
    console.log('\n📚 2. Migrating Lessons (Bài học trọng tâm & sơ đồ tư duy)...');
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
      author: l.author || 'Tổ Khảo Thí Tin Học',
      updated_at: l.updatedAt || new Date().toISOString()
    }));
    const { data: lessonsData, error: lessonsError } = await sb
      .from('lessons')
      .upsert(lessonRows, { onConflict: 'id' })
      .select();
    if (lessonsError) {
      console.error('❌ Error migrating lessons:', lessonsError.message);
    } else {
      console.log(`✅ Successfully synced ${lessonsData?.length || lessonRows.length} lessons.`);
    }

    // 3. QUESTIONS
    console.log('\n❓ 3. Migrating Questions Bank (Ngân hàng câu hỏi trắc nghiệm & Đúng/Sai)...');
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
      source: q.source || 'Đề khảo thí GDPT 2018',
      author: q.author || 'Tổ Khảo Thí Tin Học'
    }));
    const { data: questionsData, error: questionsError } = await sb
      .from('questions')
      .upsert(questionRows, { onConflict: 'id' })
      .select();
    if (questionsError) {
      console.error('❌ Error migrating questions:', questionsError.message);
    } else {
      console.log(`✅ Successfully synced ${questionsData?.length || questionRows.length} questions.`);
    }

    // 4. EXAMS
    console.log('\n📝 4. Migrating Exams (Đề thi thử THPT Quốc gia)...');
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
    const { data: examsData, error: examsError } = await sb
      .from('exams')
      .upsert(examRows, { onConflict: 'id' })
      .select();
    if (examsError) {
      console.error('❌ Error migrating exams:', examsError.message);
    } else {
      console.log(`✅ Successfully synced ${examsData?.length || examRows.length} exams.`);
    }

    // 5. USERS
    console.log('\n👥 5. Migrating Users (Tài khoản giáo viên & học sinh)...');
    const defaultTeacher = {
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
    };

    const studentRows = SAMPLE_STUDENTS.map(s => ({
      id: s.id,
      username: s.username,
      full_name: s.fullName,
      birth_date: s.birthDate || '',
      email: s.email || '',
      phone: s.phone || '',
      gender: s.gender || 'Nam',
      province: s.province || 'Hà Nội',
      password: '123',
      role: s.role || 'student',
      target_score: s.targetScore || null,
      track: s.track || 'BOTH',
      avatar_url: s.avatarUrl || '',
      created_at: s.createdAt || new Date().toISOString()
    }));

    const allUserRows = [defaultTeacher, ...studentRows];
    const { data: usersData, error: usersError } = await sb
      .from('users')
      .upsert(allUserRows, { onConflict: 'id' })
      .select();
    if (usersError) {
      console.error('❌ Error migrating users:', usersError.message);
    } else {
      console.log(`✅ Successfully synced ${usersData?.length || allUserRows.length} users.`);
    }

    // 6. EXAM RESULTS (Lịch sử làm bài thi & Phân tích ma trận năng lực)
    console.log('\n📊 6. Migrating Exam Results (Lịch sử làm bài thi & Phân tích năng lực)...');
    const examResultRows = INITIAL_SAMPLE_EXAM_RESULTS.map(r => ({
      id: r.id,
      exam_id: r.examId,
      exam_title: r.examTitle,
      user_id: r.userId,
      user_full_name: r.userFullName,
      started_at: r.startedAt,
      completed_at: r.completedAt || new Date().toISOString(),
      time_spent_seconds: r.timeSpentSeconds,
      score: r.score,
      part1_score: r.part1Score,
      part2_score: r.part2Score,
      total_correct_questions: r.totalCorrectQuestions,
      total_questions: r.totalQuestions,
      answers_json: r.answers || {},
      topic_performance_json: r.topicPerformance || [],
      strong_topics_json: r.strongTopics || [],
      weak_topics_json: r.weakTopics || [],
      ai_diagnostic_json: r.aiDiagnostic || null
    }));

    const { data: resultsData, error: resultsError } = await sb
      .from('exam_results')
      .upsert(examResultRows, { onConflict: 'id' })
      .select();
    if (resultsError) {
      console.error('❌ Error migrating exam results:', resultsError.message);
    } else {
      console.log(`✅ Successfully synced ${resultsData?.length || examResultRows.length} exam results.`);
    }

    // 7. BOOKMARKS (Sổ tay câu hỏi khó)
    console.log('\n🔖 7. Migrating Initial Bookmarks (Sổ tay câu hỏi khó)...');
    const initialBookmarks = [
      {
        id: 'bm_seed_1',
        user_id: 'user_student_1',
        question_id: 'q11',
        note: 'Chú ý: Cú pháp khóa chính (PRIMARY KEY) trong câu lệnh CREATE TABLE SQL.',
        mastery_status: 'need_review',
        created_at: '2025-01-15T10:00:00.000Z',
        updated_at: '2025-01-15T10:00:00.000Z'
      },
      {
        id: 'bm_seed_2',
        user_id: 'user_student_1',
        question_id: 'q27',
        note: 'Bài toán lập lịch và giải thuật tìm kiếm chu trình đồ thị (Chủ đề F - Khoa học máy tính).',
        mastery_status: 'mastered',
        created_at: '2025-01-20T15:30:00.000Z',
        updated_at: '2025-01-20T15:30:00.000Z'
      }
    ];

    const { data: bookmarksData, error: bookmarksError } = await sb
      .from('bookmarks')
      .upsert(initialBookmarks, { onConflict: 'id' })
      .select();
    if (bookmarksError) {
      console.error('❌ Error migrating bookmarks:', bookmarksError.message);
    } else {
      console.log(`✅ Successfully synced ${bookmarksData?.length || initialBookmarks.length} bookmarks.`);
    }

    // FINAL SUMMARY
    console.log('\n🎉 ALL DATA HAS BEEN MIGRATED AND SYNCHRONIZED WITH SUPABASE!');
    const finalStats = await sb.rpc ? null : null;
    const [
      { count: uCount },
      { count: tCount },
      { count: lCount },
      { count: qCount },
      { count: eCount },
      { count: erCount },
      { count: bCount }
    ] = await Promise.all([
      sb.from('users').select('*', { count: 'exact', head: true }),
      sb.from('topics').select('*', { count: 'exact', head: true }),
      sb.from('lessons').select('*', { count: 'exact', head: true }),
      sb.from('questions').select('*', { count: 'exact', head: true }),
      sb.from('exams').select('*', { count: 'exact', head: true }),
      sb.from('exam_results').select('*', { count: 'exact', head: true }),
      sb.from('bookmarks').select('*', { count: 'exact', head: true })
    ]);

    console.log('📈 Current Supabase Database Status:');
    console.log(`  - 👥 Users: ${uCount}`);
    console.log(`  - 📦 Topics: ${tCount}`);
    console.log(`  - 📚 Lessons: ${lCount}`);
    console.log(`  - ❓ Questions: ${qCount}`);
    console.log(`  - 📝 Exams: ${eCount}`);
    console.log(`  - 📊 Exam Results: ${erCount}`);
    console.log(`  - 🔖 Bookmarks: ${bCount}`);

  } catch (err: any) {
    console.error('Migration failed:', err);
  }
}

migrateAll();
