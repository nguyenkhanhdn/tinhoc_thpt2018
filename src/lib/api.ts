import { User, SubjectTopic, TheoryLesson, Question, Exam, ExamResult, BookmarkNote, MasteryStatus } from '../types';
import { directSupabaseApi, directSupabase } from './supabaseClient';

export interface DbStats {
  users: number;
  topics: number;
  lessons: number;
  questions: number;
  exams: number;
  examResults: number;
  bookmarks: number;
  filePath?: string;
  fileSizeBytes?: number;
}

// Helper: Safely parse JSON from fetch response, preventing HTML (404/500) JSON parsing errors on Vercel
async function safeFetchJson<T = any>(res: Response): Promise<{ ok: boolean; data?: T; error?: string }> {
  try {
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return { ok: false, error: `Máy chủ trả về định dạng không phải JSON (${res.status})` };
    }
    const json = await res.json();
    return { ok: res.ok, data: json };
  } catch (err: any) {
    return { ok: false, error: err.message || 'Lỗi phân giải phản hồi máy chủ' };
  }
}

export const dbApi = {
  // DB Stats & Management
  async getStats(): Promise<DbStats | null> {
    try {
      const res = await fetch('/api/db/stats');
      const parsed = await safeFetchJson(res);
      if (parsed.ok && parsed.data?.stats) {
        return parsed.data.stats;
      }
    } catch {
      // Fallback
    }

    // Direct Supabase stats fallback
    if (directSupabase) {
      try {
        const [
          { count: uCount },
          { count: tCount },
          { count: lCount },
          { count: qCount },
          { count: eCount },
          { count: erCount },
          { count: bCount }
        ] = await Promise.all([
          directSupabase.from('users').select('*', { count: 'exact', head: true }),
          directSupabase.from('topics').select('*', { count: 'exact', head: true }),
          directSupabase.from('lessons').select('*', { count: 'exact', head: true }),
          directSupabase.from('questions').select('*', { count: 'exact', head: true }),
          directSupabase.from('exams').select('*', { count: 'exact', head: true }),
          directSupabase.from('exam_results').select('*', { count: 'exact', head: true }),
          directSupabase.from('bookmarks').select('*', { count: 'exact', head: true })
        ]);
        return {
          users: uCount || 0,
          topics: tCount || 0,
          lessons: lCount || 0,
          questions: qCount || 0,
          exams: eCount || 0,
          examResults: erCount || 0,
          bookmarks: bCount || 0
        };
      } catch {
        return null;
      }
    }
    return null;
  },

  async resetDatabase(): Promise<boolean> {
    try {
      const res = await fetch('/api/db/reset', { method: 'POST' });
      return res.ok;
    } catch {
      return false;
    }
  },

  // Users
  async getUsers(): Promise<User[]> {
    try {
      const res = await fetch('/api/users');
      const parsed = await safeFetchJson(res);
      if (parsed.ok && Array.isArray(parsed.data?.data)) {
        return parsed.data.data;
      }
    } catch {
      // Ignore and fallback
    }
    return directSupabaseApi.getUsers();
  },

  async login(username: string, password?: string): Promise<{ success: boolean; user?: User; message?: string }> {
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const parsed = await safeFetchJson(res);
      if (parsed.ok && parsed.data?.success) {
        return { success: true, user: parsed.data.data };
      }
      if (parsed.data?.message) {
        return { success: false, message: parsed.data.message };
      }
    } catch {
      // Network or non-existent endpoint (e.g. Vercel static)
    }

    // Seamless direct Supabase client fallback (for Vercel & static deployments)
    return directSupabaseApi.login(username, password);
  },

  async register(userData: Omit<User, 'id' | 'createdAt'>): Promise<{ success: boolean; user?: User; message?: string }> {
    try {
      const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const parsed = await safeFetchJson(res);
      if (parsed.ok && parsed.data?.success) {
        return { success: true, user: parsed.data.data };
      }
      if (parsed.data?.message) {
        return { success: false, message: parsed.data.message };
      }
    } catch {
      // Network or serverless 404
    }

    // Direct Supabase fallback
    return directSupabaseApi.register(userData);
  },

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const parsed = await safeFetchJson(res);
      if (parsed.ok && parsed.data?.success) {
        return parsed.data.data;
      }
    } catch {
      // Fallback
    }
    return directSupabaseApi.updateUser(id, updates);
  },

  // Topics & Lessons
  async getTopics(): Promise<SubjectTopic[]> {
    try {
      const res = await fetch('/api/topics');
      const parsed = await safeFetchJson(res);
      if (parsed.ok && Array.isArray(parsed.data?.data)) {
        return parsed.data.data;
      }
    } catch {
      // Fallback
    }
    return directSupabaseApi.getTopics();
  },

  async getLessons(): Promise<TheoryLesson[]> {
    try {
      const res = await fetch('/api/lessons');
      const parsed = await safeFetchJson(res);
      if (parsed.ok && Array.isArray(parsed.data?.data)) {
        return parsed.data.data;
      }
    } catch {
      // Fallback
    }
    return directSupabaseApi.getLessons();
  },

  async createLesson(lesson: Omit<TheoryLesson, 'id' | 'updatedAt'>): Promise<TheoryLesson | null> {
    try {
      const res = await fetch('/api/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lesson)
      });
      const parsed = await safeFetchJson(res);
      if (parsed.ok && parsed.data?.success) {
        return parsed.data.data;
      }
    } catch {
      // Fallback
    }
    return directSupabaseApi.createLesson(lesson);
  },

  async updateLesson(id: string, updates: Partial<TheoryLesson>): Promise<TheoryLesson | null> {
    try {
      const res = await fetch(`/api/lessons/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const parsed = await safeFetchJson(res);
      if (parsed.ok && parsed.data?.success) {
        return parsed.data.data;
      }
    } catch {
      // Fallback
    }
    return directSupabaseApi.updateLesson(id, updates);
  },

  async deleteLesson(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/lessons/${id}`, { method: 'DELETE' });
      const parsed = await safeFetchJson(res);
      if (parsed.ok) return true;
    } catch {
      // Fallback
    }
    return directSupabaseApi.deleteLesson(id);
  },

  // Questions Bank
  async getQuestions(): Promise<Question[]> {
    try {
      const res = await fetch('/api/questions');
      const parsed = await safeFetchJson(res);
      if (parsed.ok && Array.isArray(parsed.data?.data)) {
        return parsed.data.data;
      }
    } catch {
      // Fallback
    }
    return directSupabaseApi.getQuestions();
  },

  async createQuestion(question: Omit<Question, 'id'>): Promise<Question | null> {
    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(question)
      });
      const parsed = await safeFetchJson(res);
      if (parsed.ok && parsed.data?.success) {
        return parsed.data.data;
      }
    } catch {
      // Fallback
    }
    return directSupabaseApi.createQuestion(question);
  },

  async updateQuestion(id: string, updates: Partial<Question>): Promise<Question | null> {
    try {
      const res = await fetch(`/api/questions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const parsed = await safeFetchJson(res);
      if (parsed.ok && parsed.data?.success) {
        return parsed.data.data;
      }
    } catch {
      // Fallback
    }
    return directSupabaseApi.updateQuestion(id, updates);
  },

  async deleteQuestion(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/questions/${id}`, { method: 'DELETE' });
      const parsed = await safeFetchJson(res);
      if (parsed.ok) return true;
    } catch {
      // Fallback
    }
    return directSupabaseApi.deleteQuestion(id);
  },

  // Exams
  async getExams(): Promise<Exam[]> {
    try {
      const res = await fetch('/api/exams');
      const parsed = await safeFetchJson(res);
      if (parsed.ok && Array.isArray(parsed.data?.data)) {
        return parsed.data.data;
      }
    } catch {
      // Fallback
    }
    return directSupabaseApi.getExams();
  },

  async createExam(examData: Omit<Exam, 'id' | 'createdAt'>): Promise<Exam | null> {
    try {
      const res = await fetch('/api/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(examData)
      });
      const parsed = await safeFetchJson(res);
      if (parsed.ok && parsed.data?.success) {
        return parsed.data.data;
      }
    } catch {
      // Fallback
    }
    return directSupabaseApi.createExam(examData);
  },

  async deleteExam(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/exams/${id}`, { method: 'DELETE' });
      const parsed = await safeFetchJson(res);
      if (parsed.ok) return true;
    } catch {
      // Fallback
    }
    return directSupabaseApi.deleteExam(id);
  },

  // Exam Results
  async getExamResults(userId?: string): Promise<ExamResult[]> {
    try {
      const url = userId ? `/api/exam-results?userId=${encodeURIComponent(userId)}` : '/api/exam-results';
      const res = await fetch(url);
      const parsed = await safeFetchJson(res);
      if (parsed.ok && Array.isArray(parsed.data?.data)) {
        return parsed.data.data;
      }
    } catch {
      // Fallback
    }
    return directSupabaseApi.getExamResults(userId);
  },

  async saveExamResult(result: ExamResult): Promise<ExamResult | null> {
    try {
      const res = await fetch('/api/exam-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result)
      });
      const parsed = await safeFetchJson(res);
      if (parsed.ok && parsed.data?.success) {
        return parsed.data.data;
      }
    } catch {
      // Fallback
    }
    return directSupabaseApi.saveExamResult(result);
  },

  // Bookmarks
  async getBookmarks(userId?: string): Promise<BookmarkNote[]> {
    try {
      const url = userId ? `/api/bookmarks?userId=${encodeURIComponent(userId)}` : '/api/bookmarks';
      const res = await fetch(url);
      const parsed = await safeFetchJson(res);
      if (parsed.ok && Array.isArray(parsed.data?.data)) {
        return parsed.data.data;
      }
    } catch {
      // Fallback
    }
    return directSupabaseApi.getBookmarks(userId);
  },

  async toggleBookmark(userId: string, questionId: string, note: string = '', masteryStatus: MasteryStatus = 'need_review'): Promise<{ active: boolean; bookmark?: BookmarkNote }> {
    try {
      const res = await fetch('/api/bookmarks/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, questionId, note, masteryStatus })
      });
      const parsed = await safeFetchJson(res);
      if (parsed.ok && parsed.data?.active !== undefined) {
        return { active: parsed.data.active, bookmark: parsed.data.bookmark };
      }
    } catch {
      // Fallback
    }
    return directSupabaseApi.toggleBookmark(userId, questionId, note, masteryStatus);
  },

  async updateBookmark(userId: string, questionId: string, note: string, masteryStatus: MasteryStatus): Promise<boolean> {
    try {
      const res = await fetch('/api/bookmarks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, questionId, note, masteryStatus })
      });
      const parsed = await safeFetchJson(res);
      if (parsed.ok) return true;
    } catch {
      // Fallback
    }
    return directSupabaseApi.updateBookmark(userId, questionId, note, masteryStatus);
  },

  async removeBookmark(userId: string, questionId: string): Promise<boolean> {
    try {
      const res = await fetch('/api/bookmarks', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, questionId })
      });
      const parsed = await safeFetchJson(res);
      if (parsed.ok) return true;
    } catch {
      // Fallback
    }
    return directSupabaseApi.removeBookmark(userId, questionId);
  }
};
