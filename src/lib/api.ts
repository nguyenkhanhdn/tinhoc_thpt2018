import { User, SubjectTopic, TheoryLesson, Question, Exam, ExamResult, BookmarkNote, MasteryStatus } from '../types';

export interface DbStats {
  users: number;
  topics: number;
  lessons: number;
  questions: number;
  exams: number;
  examResults: number;
  bookmarks: number;
  filePath: string;
  fileSizeBytes: number;
}

export const dbApi = {
  // DB Stats & Management
  async getStats(): Promise<DbStats | null> {
    try {
      const res = await fetch('/api/db/stats');
      if (!res.ok) return null;
      const data = await res.json();
      return data.stats;
    } catch {
      return null;
    }
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
      if (!res.ok) throw new Error('Failed to fetch users');
      const json = await res.json();
      return json.data || [];
    } catch (err) {
      console.warn('SQLite fetch users fallback:', err);
      return [];
    }
  },

  async login(username: string, password?: string): Promise<{ success: boolean; user?: User; message?: string }> {
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const json = await res.json();
      if (res.ok && json.success) {
        return { success: true, user: json.data };
      }
      return { success: false, message: json.message || 'Đăng nhập thất bại' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Lỗi kết nối cơ sở dữ liệu SQLite' };
    }
  },

  async register(userData: Omit<User, 'id' | 'createdAt'>): Promise<{ success: boolean; user?: User; message?: string }> {
    try {
      const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const json = await res.json();
      if (res.ok && json.success) {
        return { success: true, user: json.data };
      }
      return { success: false, message: json.message || 'Đăng ký thất bại' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Lỗi kết nối cơ sở dữ liệu SQLite' };
    }
  },

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const json = await res.json();
      return json.success ? json.data : null;
    } catch {
      return null;
    }
  },

  // Topics & Lessons
  async getTopics(): Promise<SubjectTopic[]> {
    try {
      const res = await fetch('/api/topics');
      if (!res.ok) throw new Error('Failed to fetch topics');
      const json = await res.json();
      return json.data || [];
    } catch (err) {
      console.warn('SQLite fetch topics fallback:', err);
      return [];
    }
  },

  async getLessons(): Promise<TheoryLesson[]> {
    try {
      const res = await fetch('/api/lessons');
      if (!res.ok) throw new Error('Failed to fetch lessons');
      const json = await res.json();
      return json.data || [];
    } catch (err) {
      console.warn('SQLite fetch lessons fallback:', err);
      return [];
    }
  },

  async createLesson(lesson: Omit<TheoryLesson, 'id' | 'updatedAt'>): Promise<TheoryLesson | null> {
    try {
      const res = await fetch('/api/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lesson)
      });
      const json = await res.json();
      return json.success ? json.data : null;
    } catch {
      return null;
    }
  },

  async updateLesson(id: string, updates: Partial<TheoryLesson>): Promise<TheoryLesson | null> {
    try {
      const res = await fetch(`/api/lessons/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const json = await res.json();
      return json.success ? json.data : null;
    } catch {
      return null;
    }
  },

  async deleteLesson(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/lessons/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch {
      return false;
    }
  },

  // Questions Bank
  async getQuestions(): Promise<Question[]> {
    try {
      const res = await fetch('/api/questions');
      if (!res.ok) throw new Error('Failed to fetch questions');
      const json = await res.json();
      return json.data || [];
    } catch (err) {
      console.warn('SQLite fetch questions fallback:', err);
      return [];
    }
  },

  async createQuestion(question: Omit<Question, 'id'>): Promise<Question | null> {
    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(question)
      });
      const json = await res.json();
      return json.success ? json.data : null;
    } catch {
      return null;
    }
  },

  async updateQuestion(id: string, updates: Partial<Question>): Promise<Question | null> {
    try {
      const res = await fetch(`/api/questions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const json = await res.json();
      return json.success ? json.data : null;
    } catch {
      return null;
    }
  },

  async deleteQuestion(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/questions/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch {
      return false;
    }
  },

  // Exams
  async getExams(): Promise<Exam[]> {
    try {
      const res = await fetch('/api/exams');
      if (!res.ok) throw new Error('Failed to fetch exams');
      const json = await res.json();
      return json.data || [];
    } catch (err) {
      console.warn('SQLite fetch exams fallback:', err);
      return [];
    }
  },

  async createExam(examData: Omit<Exam, 'id' | 'createdAt'>): Promise<Exam | null> {
    try {
      const res = await fetch('/api/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(examData)
      });
      const json = await res.json();
      return json.success ? json.data : null;
    } catch {
      return null;
    }
  },

  async deleteExam(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/exams/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch {
      return false;
    }
  },

  // Exam Results
  async getExamResults(userId?: string): Promise<ExamResult[]> {
    try {
      const url = userId ? `/api/exam-results?userId=${encodeURIComponent(userId)}` : '/api/exam-results';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch exam results');
      const json = await res.json();
      return json.data || [];
    } catch (err) {
      console.warn('SQLite fetch results fallback:', err);
      return [];
    }
  },

  async saveExamResult(result: ExamResult): Promise<ExamResult | null> {
    try {
      const res = await fetch('/api/exam-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result)
      });
      const json = await res.json();
      return json.success ? json.data : null;
    } catch {
      return null;
    }
  },

  // Bookmarks
  async getBookmarks(userId?: string): Promise<BookmarkNote[]> {
    try {
      const url = userId ? `/api/bookmarks?userId=${encodeURIComponent(userId)}` : '/api/bookmarks';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch bookmarks');
      const json = await res.json();
      return json.data || [];
    } catch (err) {
      console.warn('SQLite fetch bookmarks fallback:', err);
      return [];
    }
  },

  async toggleBookmark(userId: string, questionId: string, note: string = '', masteryStatus: MasteryStatus = 'need_review'): Promise<{ active: boolean; bookmark?: BookmarkNote }> {
    try {
      const res = await fetch('/api/bookmarks/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, questionId, note, masteryStatus })
      });
      const json = await res.json();
      return { active: json.active, bookmark: json.bookmark };
    } catch {
      return { active: false };
    }
  },

  async updateBookmark(userId: string, questionId: string, note: string, masteryStatus: MasteryStatus): Promise<boolean> {
    try {
      const res = await fetch('/api/bookmarks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, questionId, note, masteryStatus })
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async removeBookmark(userId: string, questionId: string): Promise<boolean> {
    try {
      const res = await fetch('/api/bookmarks', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, questionId })
      });
      return res.ok;
    } catch {
      return false;
    }
  }
};
