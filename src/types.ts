export type UserRole = 'student' | 'teacher';
export type Gender = 'Nam' | 'Nữ' | 'Khác';
export type CognitiveLevel = 'NB' | 'TH' | 'VD' | 'VDC'; // Nhận biết, Thông hiểu, Vận dụng, Vận dụng cao
export type QuestionType = 'single_choice' | 'true_false';
export type StudyTrack = 'CORE' | 'ICT' | 'CS' | 'ALL';
export type MasteryStatus = 'need_review' | 'in_progress' | 'mastered';

export interface User {
  id: string;
  username: string;
  fullName: string;
  birthDate: string;
  email: string;
  phone: string;
  gender: Gender;
  province: string;
  password?: string;
  role: UserRole;
  targetScore?: number;
  track?: 'ICT' | 'CS' | 'BOTH';
  createdAt: string;
  avatarUrl?: string;
  className?: string;
}

export interface SubjectTopic {
  id: string;
  code: 'A' | 'B' | 'D' | 'E' | 'F' | 'G';
  title: string;
  shortTitle: string;
  description: string;
  track: StudyTrack;
  iconName: string;
  color: string;
  bgLight: string;
  borderColor: string;
  lessonsCount: number;
}

export interface TheoryLesson {
  id: string;
  topicId: string;
  title: string;
  order: number;
  summary: string;
  contentMarkdown: string;
  keyTakeaways: string[];
  codeSnippets?: {
    language: string;
    title: string;
    code: string;
    note?: string;
  }[];
  examTips: string[];
  author: string;
  updatedAt: string;
}

export interface SubQuestion {
  id: string;
  label: 'a' | 'b' | 'c' | 'd';
  statement: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface Question {
  id: string;
  topicId: string;
  lessonId: string;
  lessonTitle?: string;
  type: QuestionType;
  content: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
  options?: string[]; // A, B, C, D for single_choice
  correctAnswer?: 'A' | 'B' | 'C' | 'D'; // For single_choice
  subQuestions?: SubQuestion[]; // For true_false (Part II)
  explanation: string;
  cognitiveLevel: CognitiveLevel;
  track: StudyTrack;
  source?: string;
  author?: string;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  year: number;
  targetTrack: StudyTrack;
  totalPoints: number;
  part1Count: number;
  part2Count: number;
  questions: Question[];
  createdBy: string;
  createdAt: string;
  tags: string[];
  isOfficial?: boolean;
}

export interface UserAnswer {
  questionId: string;
  singleChoiceSelected?: string; // 'A' | 'B' | 'C' | 'D'
  trueFalseSelected?: {
    a?: boolean;
    b?: boolean;
    c?: boolean;
    d?: boolean;
  };
  isFlagged?: boolean;
}

export interface TopicPerformance {
  topicId: string;
  topicCode: string;
  topicTitle: string;
  totalItems: number;
  correctItems: number;
  percentage: number;
  status: 'strong' | 'average' | 'weak';
}

export interface AIDiagnostic {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  actionPlan: string[];
}

export interface ExamResult {
  id: string;
  examId: string;
  examTitle: string;
  userId: string;
  userFullName: string;
  startedAt: string;
  completedAt: string;
  timeSpentSeconds: number;
  score: number; // 0 - 10.0 scale
  part1Score: number;
  part2Score: number;
  totalCorrectQuestions: number;
  totalQuestions: number;
  answers: Record<string, UserAnswer>;
  topicPerformance: TopicPerformance[];
  strongTopics: string[];
  weakTopics: string[];
  aiDiagnostic?: AIDiagnostic;
}

export interface BookmarkNote {
  id: string;
  userId: string;
  questionId: string;
  question: Question;
  note: string;
  masteryStatus: MasteryStatus;
  createdAt: string;
  updatedAt: string;
}

export type LeaderboardPeriod = 'this_week' | 'last_week' | 'all_time';
export type LeaderboardTrackFilter = 'ALL' | 'ICT' | 'CS';

export interface WeeklyBadge {
  id: string;
  title: string;
  icon: string;
  description: string;
  bgGradient: string;
  textColor: string;
  borderColor: string;
}

export interface WeeklyLeaderboardEntry {
  rank: number;
  previousRank?: number;
  userId: string;
  username: string;
  fullName: string;
  avatarUrl?: string;
  className?: string;
  province?: string;
  track?: 'ICT' | 'CS' | 'BOTH';
  
  // Weekly Performance Metrics
  totalCorrectQuestions: number;
  totalQuestionsAnswered: number;
  accuracyRate: number; // percentage, e.g. 96.5
  totalTimeSpentSeconds: number;
  averageTimePerExamSeconds: number;
  examsCompletedCount: number;
  totalScoreSum: number;
  averageScore: number;
  
  // Gamification & Streak
  streakDays: number;
  xpPoints: number;
  weeklyBadges: WeeklyBadge[];
  lastActive: string;
  isCurrentUser?: boolean;
}
