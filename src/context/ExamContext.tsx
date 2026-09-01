import React, { createContext, useContext, useState, useEffect } from 'react';
import { Exam, Question, UserAnswer, ExamResult, BookmarkNote, TopicPerformance, MasteryStatus } from '../types';
import { INITIAL_EXAMS } from '../data/mockExams';
import { INITIAL_QUESTIONS } from '../data/questionsBank';
import { SUBJECT_TOPICS } from '../data/topicsAndLessons';
import { useAuth } from './AuthContext';

interface ExamContextType {
  exams: Exam[];
  questionsBank: Question[];
  currentExam: Exam | null;
  currentResult: ExamResult | null;
  examResults: ExamResult[];
  answers: Record<string, UserAnswer>;
  timeRemaining: number;
  isExamRunning: boolean;
  examMode: 'exam' | 'practice';
  activeQuestionIndex: number;
  bookmarks: BookmarkNote[];
  isSubmitting: boolean;

  // Actions
  startExam: (exam: Exam, mode?: 'exam' | 'practice') => void;
  startBookmarkPractice: () => void;
  selectSingleChoiceAnswer: (questionId: string, option: 'A' | 'B' | 'C' | 'D') => void;
  selectTrueFalseAnswer: (questionId: string, subKey: 'a' | 'b' | 'c' | 'd', value: boolean) => void;
  toggleFlagQuestion: (questionId: string) => void;
  setActiveQuestionIndex: (index: number) => void;
  submitExam: () => Promise<ExamResult | null>;
  resetExamState: () => void;
  setCurrentResult: (result: ExamResult | null) => void;

  // Bookmarks
  toggleBookmark: (question: Question, note?: string, masteryStatus?: MasteryStatus) => void;
  updateBookmark: (questionId: string, note: string, masteryStatus: MasteryStatus) => void;
  removeBookmark: (questionId: string) => void;
  isQuestionBookmarked: (questionId: string) => boolean;
  getBookmarkByQuestionId: (questionId: string) => BookmarkNote | undefined;

  // Teacher / Authoring
  addQuestionToBank: (question: Omit<Question, 'id'>) => Question;
  updateQuestionInBank: (id: string, question: Partial<Question>) => void;
  deleteQuestionFromBank: (id: string) => void;
  createExam: (examData: Omit<Exam, 'id' | 'createdAt'>) => Exam;
  deleteExam: (examId: string) => void;
}

const ExamContext = createContext<ExamContextType | undefined>(undefined);

export const ExamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();

  const [exams, setExams] = useState<Exam[]>(() => {
    try {
      const saved = localStorage.getItem('tin_hoc_exams');
      return saved ? JSON.parse(saved) : INITIAL_EXAMS;
    } catch {
      return INITIAL_EXAMS;
    }
  });

  const [questionsBank, setQuestionsBank] = useState<Question[]>(() => {
    try {
      const saved = localStorage.getItem('tin_hoc_questions');
      return saved ? JSON.parse(saved) : INITIAL_QUESTIONS;
    } catch {
      return INITIAL_QUESTIONS;
    }
  });

  const [examResults, setExamResults] = useState<ExamResult[]>(() => {
    try {
      const saved = localStorage.getItem('tin_hoc_results');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [bookmarks, setBookmarks] = useState<BookmarkNote[]>(() => {
    try {
      const saved = localStorage.getItem('tin_hoc_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentExam, setCurrentExam] = useState<Exam | null>(null);
  const [currentResult, setCurrentResult] = useState<ExamResult | null>(null);
  const [answers, setAnswers] = useState<Record<string, UserAnswer>>({});
  const [timeRemaining, setTimeRemaining] = useState<number>(50 * 60);
  const [isExamRunning, setIsExamRunning] = useState<boolean>(false);
  const [examMode, setExamMode] = useState<'exam' | 'practice'>('exam');
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('tin_hoc_exams', JSON.stringify(exams));
  }, [exams]);

  useEffect(() => {
    localStorage.setItem('tin_hoc_questions', JSON.stringify(questionsBank));
  }, [questionsBank]);

  useEffect(() => {
    localStorage.setItem('tin_hoc_results', JSON.stringify(examResults));
  }, [examResults]);

  useEffect(() => {
    localStorage.setItem('tin_hoc_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isExamRunning && examMode === 'exam' && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(interval!);
            submitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isExamRunning, examMode, timeRemaining]);

  const startExam = (exam: Exam, mode: 'exam' | 'practice' = 'exam') => {
    setCurrentExam(exam);
    setExamMode(mode);
    setAnswers({});
    setTimeRemaining(exam.durationMinutes * 60);
    setIsExamRunning(true);
    setActiveQuestionIndex(0);
    setCurrentResult(null);
  };

  const startBookmarkPractice = () => {
    const userBookmarks = bookmarks.filter(b => !currentUser || b.userId === currentUser.id);
    if (userBookmarks.length === 0) return;

    const customExam: Exam = {
      id: `practice_bookmark_${Date.now()}`,
      title: 'Luyện Tập Chuyên Sâu: Các Câu Hỏi Trong Sổ Tay Cần Nghiên Cứu',
      description: 'Bài ôn tập tùy biến tổng hợp tất cả các câu hỏi bạn đã lưu lại để nghiền ngẫm và củng cố kiến thức.',
      durationMinutes: Math.max(15, userBookmarks.length * 2),
      year: 2025,
      targetTrack: 'ALL',
      totalPoints: 10.0,
      part1Count: userBookmarks.filter(b => b.question.type === 'single_choice').length,
      part2Count: userBookmarks.filter(b => b.question.type === 'true_false').length,
      questions: userBookmarks.map(b => b.question),
      createdBy: currentUser?.fullName || 'Học sinh',
      createdAt: new Date().toISOString().split('T')[0],
      tags: ['Sổ tay cá nhân', 'Ôn tập câu khó'],
      isOfficial: false
    };

    startExam(customExam, 'practice');
  };

  const selectSingleChoiceAnswer = (questionId: string, option: 'A' | 'B' | 'C' | 'D') => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        questionId,
        singleChoiceSelected: option
      }
    }));
  };

  const selectTrueFalseAnswer = (questionId: string, subKey: 'a' | 'b' | 'c' | 'd', value: boolean) => {
    setAnswers(prev => {
      const currentTF = prev[questionId]?.trueFalseSelected || {};
      return {
        ...prev,
        [questionId]: {
          ...prev[questionId],
          questionId,
          trueFalseSelected: {
            ...currentTF,
            [subKey]: value
          }
        }
      };
    });
  };

  const toggleFlagQuestion = (questionId: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        questionId,
        isFlagged: !prev[questionId]?.isFlagged
      }
    }));
  };

  const calculateScores = (exam: Exam, currentAnswers: Record<string, UserAnswer>) => {
    const singleChoiceQuestions = exam.questions.filter(q => q.type === 'single_choice');
    const trueFalseQuestions = exam.questions.filter(q => q.type === 'true_false');

    let part1Score = 0;
    let part1CorrectCount = 0;
    const part1PerQuestion = singleChoiceQuestions.length > 0 ? 6.0 / singleChoiceQuestions.length : 0.25;

    singleChoiceQuestions.forEach(q => {
      const userAnswer = currentAnswers[q.id]?.singleChoiceSelected;
      if (userAnswer && userAnswer === q.correctAnswer) {
        part1Score += part1PerQuestion;
        part1CorrectCount += 1;
      }
    });

    let part2Score = 0;
    let part2CorrectCount = 0;

    trueFalseQuestions.forEach(q => {
      const userTF = currentAnswers[q.id]?.trueFalseSelected || {};
      let subCorrectCount = 0;

      if (q.subQuestions) {
        q.subQuestions.forEach(sub => {
          if (userTF[sub.label] !== undefined && userTF[sub.label] === sub.isCorrect) {
            subCorrectCount += 1;
          }
        });
      }

      // Bộ GD&ĐT standard True/False scoring table
      if (subCorrectCount === 1) part2Score += 0.10;
      else if (subCorrectCount === 2) part2Score += 0.25;
      else if (subCorrectCount === 3) part2Score += 0.50;
      else if (subCorrectCount === 4) {
        part2Score += 1.00;
        part2CorrectCount += 1;
      }
    });

    // Cap total score at 10.0
    const rawScore = Math.min(10.0, Math.round((part1Score + part2Score) * 100) / 100);

    // Topic Performance Breakdown
    const topicStats: Record<string, { totalItems: number; correctItems: number }> = {};

    exam.questions.forEach(q => {
      if (!topicStats[q.topicId]) {
        topicStats[q.topicId] = { totalItems: 0, correctItems: 0 };
      }

      if (q.type === 'single_choice') {
        topicStats[q.topicId].totalItems += 1;
        if (currentAnswers[q.id]?.singleChoiceSelected === q.correctAnswer) {
          topicStats[q.topicId].correctItems += 1;
        }
      } else if (q.type === 'true_false' && q.subQuestions) {
        const userTF = currentAnswers[q.id]?.trueFalseSelected || {};
        q.subQuestions.forEach(sub => {
          topicStats[q.topicId].totalItems += 1;
          if (userTF[sub.label] !== undefined && userTF[sub.label] === sub.isCorrect) {
            topicStats[q.topicId].correctItems += 1;
          }
        });
      }
    });

    const topicPerformance: TopicPerformance[] = SUBJECT_TOPICS.map(topic => {
      const stat = topicStats[topic.id] || { totalItems: 0, correctItems: 0 };
      const percentage = stat.totalItems > 0 ? Math.round((stat.correctItems / stat.totalItems) * 100) : 100;
      let status: 'strong' | 'average' | 'weak' = 'average';
      if (percentage >= 75) status = 'strong';
      else if (percentage < 55) status = 'weak';

      return {
        topicId: topic.id,
        topicCode: topic.code,
        topicTitle: topic.shortTitle,
        totalItems: stat.totalItems,
        correctItems: stat.correctItems,
        percentage,
        status
      };
    }).filter(t => t.totalItems > 0);

    const strongTopics = topicPerformance.filter(t => t.status === 'strong').map(t => `${t.topicCode}: ${t.topicTitle}`);
    const weakTopics = topicPerformance.filter(t => t.status === 'weak').map(t => `${t.topicCode}: ${t.topicTitle}`);

    return {
      score: rawScore,
      part1Score: Math.round(part1Score * 100) / 100,
      part2Score: Math.round(part2Score * 100) / 100,
      totalCorrectQuestions: part1CorrectCount + part2CorrectCount,
      totalQuestions: exam.questions.length,
      topicPerformance,
      strongTopics,
      weakTopics
    };
  };

  const submitExam = async (): Promise<ExamResult | null> => {
    if (!currentExam) return null;
    setIsSubmitting(true);
    setIsExamRunning(false);

    const totalSeconds = currentExam.durationMinutes * 60;
    const timeSpentSeconds = Math.max(1, totalSeconds - timeRemaining);

    const calculated = calculateScores(currentExam, answers);

    const resultId = `res_${Date.now()}`;
    let aiDiagnosticData = undefined;

    // Fetch AI pedagogical diagnostics
    try {
      const response = await fetch('/api/ai/diagnose-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score: calculated.score,
          totalQuestions: calculated.totalQuestions,
          breakdownByTopic: calculated.topicPerformance,
          strongTopics: calculated.strongTopics,
          weakTopics: calculated.weakTopics
        })
      });
      if (response.ok) {
        const json = await response.json();
        if (json.analysis) {
          aiDiagnosticData = json.analysis;
        }
      }
    } catch {
      // Fallback pedagogical feedback
      aiDiagnosticData = {
        summary: `Học sinh đạt ${calculated.score.toFixed(2)}/10.0 điểm. ${calculated.strongTopics.length > 0 ? `Nắm chắc các nội dung: ${calculated.strongTopics.join(', ')}.` : ''} ${calculated.weakTopics.length > 0 ? `Cần đặc biệt tập trung bồi dưỡng: ${calculated.weakTopics.join(', ')}.` : ''}`,
        strengths: calculated.strongTopics.length > 0 ? calculated.strongTopics.map(t => `Vững kiến thức chuyên đề ${t}`) : ['Có ý thức hoàn thành bài thi nghiêm túc'],
        weaknesses: calculated.weakTopics.length > 0 ? calculated.weakTopics.map(t => `Còn nhầm lẫn trong chuyên đề ${t}`) : ['Cần chú ý bẫy cú pháp câu trắc nghiệm Đúng/Sai'],
        actionPlan: [
          'Bấm xem lại "Tham khảo lý thuyết" các bài học có câu sai.',
          'Lưu các câu làm sai vào Sổ tay để ôn luyện định kỳ.',
          'Luyện thêm các đề kiểm tra theo chuyên đề tương ứng.'
        ]
      };
    }

    const newResult: ExamResult = {
      id: resultId,
      examId: currentExam.id,
      examTitle: currentExam.title,
      userId: currentUser?.id || 'guest',
      userFullName: currentUser?.fullName || 'Học sinh',
      startedAt: new Date(Date.now() - timeSpentSeconds * 1000).toISOString(),
      completedAt: new Date().toISOString(),
      timeSpentSeconds,
      score: calculated.score,
      part1Score: calculated.part1Score,
      part2Score: calculated.part2Score,
      totalCorrectQuestions: calculated.totalCorrectQuestions,
      totalQuestions: calculated.totalQuestions,
      answers,
      topicPerformance: calculated.topicPerformance,
      strongTopics: calculated.strongTopics,
      weakTopics: calculated.weakTopics,
      aiDiagnostic: aiDiagnosticData
    };

    setExamResults(prev => [newResult, ...prev]);
    setCurrentResult(newResult);
    setIsSubmitting(false);

    return newResult;
  };

  const resetExamState = () => {
    setCurrentExam(null);
    setCurrentResult(null);
    setAnswers({});
    setIsExamRunning(false);
    setActiveQuestionIndex(0);
  };

  // Bookmarks management
  const toggleBookmark = (question: Question, note: string = '', masteryStatus: MasteryStatus = 'need_review') => {
    const userId = currentUser?.id || 'user_student_1';
    setBookmarks(prev => {
      const exists = prev.find(b => b.questionId === question.id && b.userId === userId);
      if (exists) {
        return prev.filter(b => !(b.questionId === question.id && b.userId === userId));
      } else {
        const newBookmark: BookmarkNote = {
          id: `bm_${Date.now()}`,
          userId,
          questionId: question.id,
          question,
          note,
          masteryStatus,
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0]
        };
        return [newBookmark, ...prev];
      }
    });
  };

  const updateBookmark = (questionId: string, note: string, masteryStatus: MasteryStatus) => {
    const userId = currentUser?.id || 'user_student_1';
    setBookmarks(prev => prev.map(b => {
      if (b.questionId === questionId && b.userId === userId) {
        return {
          ...b,
          note,
          masteryStatus,
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }
      return b;
    }));
  };

  const removeBookmark = (questionId: string) => {
    const userId = currentUser?.id || 'user_student_1';
    setBookmarks(prev => prev.filter(b => !(b.questionId === questionId && b.userId === userId)));
  };

  const isQuestionBookmarked = (questionId: string) => {
    const userId = currentUser?.id || 'user_student_1';
    return bookmarks.some(b => b.questionId === questionId && b.userId === userId);
  };

  const getBookmarkByQuestionId = (questionId: string) => {
    const userId = currentUser?.id || 'user_student_1';
    return bookmarks.find(b => b.questionId === questionId && b.userId === userId);
  };

  // Teacher Question authoring
  const addQuestionToBank = (questionData: Omit<Question, 'id'>): Question => {
    const newQ: Question = {
      ...questionData,
      id: `q_${Date.now()}`
    };
    setQuestionsBank(prev => [newQ, ...prev]);
    return newQ;
  };

  const updateQuestionInBank = (id: string, questionData: Partial<Question>) => {
    setQuestionsBank(prev => prev.map(q => q.id === id ? { ...q, ...questionData } : q));
  };

  const deleteQuestionFromBank = (id: string) => {
    setQuestionsBank(prev => prev.filter(q => q.id !== id));
  };

  const createExam = (examData: Omit<Exam, 'id' | 'createdAt'>): Exam => {
    const newExam: Exam = {
      ...examData,
      id: `exam_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setExams(prev => [newExam, ...prev]);
    return newExam;
  };

  const deleteExam = (examId: string) => {
    setExams(prev => prev.filter(e => e.id !== examId));
  };

  return (
    <ExamContext.Provider value={{
      exams,
      questionsBank,
      currentExam,
      currentResult,
      examResults,
      answers,
      timeRemaining,
      isExamRunning,
      examMode,
      activeQuestionIndex,
      bookmarks,
      isSubmitting,
      startExam,
      startBookmarkPractice,
      selectSingleChoiceAnswer,
      selectTrueFalseAnswer,
      toggleFlagQuestion,
      setActiveQuestionIndex,
      submitExam,
      resetExamState,
      setCurrentResult,
      toggleBookmark,
      updateBookmark,
      removeBookmark,
      isQuestionBookmarked,
      getBookmarkByQuestionId,
      addQuestionToBank,
      updateQuestionInBank,
      deleteQuestionFromBank,
      createExam,
      deleteExam
    }}>
      {children}
    </ExamContext.Provider>
  );
};

export const useExam = () => {
  const context = useContext(ExamContext);
  if (!context) throw new Error('useExam must be used within an ExamProvider');
  return context;
};
