import { WeeklyLeaderboardEntry, WeeklyBadge, LeaderboardPeriod, LeaderboardTrackFilter, User, ExamResult } from '../types';
import { SAMPLE_STUDENTS } from './mockStudentResults';

export const WEEKLY_BADGES: Record<string, WeeklyBadge> = {
  top_1: {
    id: 'badge_top_1',
    title: 'Quán Quân Tuần 👑',
    icon: '👑',
    description: 'Đứng đầu bảng xếp hạng tuần về số câu đúng và tốc độ.',
    bgGradient: 'from-amber-400 to-yellow-500',
    textColor: 'text-amber-950',
    borderColor: 'border-amber-400'
  },
  top_2: {
    id: 'badge_top_2',
    title: 'Á Quân 1 Tuần 🥈',
    icon: '🥈',
    description: 'Hạng 2 bảng xếp hạng tuần.',
    bgGradient: 'from-slate-200 to-slate-400',
    textColor: 'text-slate-900',
    borderColor: 'border-slate-300'
  },
  top_3: {
    id: 'badge_top_3',
    title: 'Á Quân 2 Tuần 🥉',
    icon: '🥉',
    description: 'Hạng 3 bảng xếp hạng tuần.',
    bgGradient: 'from-amber-600 to-orange-700',
    textColor: 'text-orange-50',
    borderColor: 'border-amber-600'
  },
  speed_demon: {
    id: 'badge_speed_demon',
    title: 'Thần Tốc ⚡',
    icon: '⚡',
    description: 'Hoàn thành đề thi trung bình dưới 25 phút.',
    bgGradient: 'from-sky-400 to-blue-600',
    textColor: 'text-white',
    borderColor: 'border-sky-300'
  },
  accuracy_king: {
    id: 'badge_accuracy_king',
    title: 'Độ Chính Xác 95%+ 🎯',
    icon: '🎯',
    description: 'Tỷ lệ trả lời chính xác trên 95% trong tuần.',
    bgGradient: 'from-emerald-400 to-teal-600',
    textColor: 'text-white',
    borderColor: 'border-emerald-300'
  },
  streak_fire: {
    id: 'badge_streak_fire',
    title: 'Chiến Thần Chăm Chỉ 🔥',
    icon: '🔥',
    description: 'Luyện đề liên tục trên 5 ngày trong tuần.',
    bgGradient: 'from-orange-500 to-rose-600',
    textColor: 'text-white',
    borderColor: 'border-orange-300'
  },
  sql_master: {
    id: 'badge_sql_master',
    title: 'Bậc Thầy SQL & CSDL 💾',
    icon: '💾',
    description: 'Đạt điểm tuyệt đối các câu hỏi Chủ đề E (CSDL & SQL).',
    bgGradient: 'from-indigo-500 to-purple-600',
    textColor: 'text-white',
    borderColor: 'border-indigo-300'
  },
  python_master: {
    id: 'badge_python_master',
    title: 'Cao Thủ Python 🐍',
    icon: '🐍',
    description: 'Đạt điểm tuyệt đối các câu hỏi Chủ đề F (Lập trình & Thuật toán).',
    bgGradient: 'from-teal-500 to-emerald-700',
    textColor: 'text-white',
    borderColor: 'border-teal-300'
  }
};

// Seeded Competitive Peer Students for rich, lively Weekly Leaderboard
export const SEED_LEADERBOARD_ENTRIES: WeeklyLeaderboardEntry[] = [
  {
    rank: 1,
    previousRank: 2,
    userId: 'user_student_1',
    username: 'minhquan12',
    fullName: 'Nguyễn Minh Quân',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    className: '12 Tin - THPT Chuyên Hà Nội - Amsterdam',
    province: 'Hà Nội',
    track: 'BOTH',
    totalCorrectQuestions: 146,
    totalQuestionsAnswered: 150,
    accuracyRate: 97.3,
    totalTimeSpentSeconds: 7850,
    averageTimePerExamSeconds: 1570, // ~26 mins per exam
    examsCompletedCount: 5,
    totalScoreSum: 47.75,
    averageScore: 9.55,
    streakDays: 7,
    xpPoints: 3450,
    weeklyBadges: [WEEKLY_BADGES.top_1, WEEKLY_BADGES.accuracy_king, WEEKLY_BADGES.streak_fire, WEEKLY_BADGES.python_master],
    lastActive: '10 phút trước'
  },
  {
    rank: 2,
    previousRank: 1,
    userId: 'user_student_2',
    username: 'anhtuyet12',
    fullName: 'Trần Thị Ánh Tuyết',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    className: '12 Tin - THPT Chuyên Lê Quý Đôn',
    province: 'Đà Nẵng',
    track: 'ICT',
    totalCorrectQuestions: 142,
    totalQuestionsAnswered: 148,
    accuracyRate: 95.9,
    totalTimeSpentSeconds: 7420,
    averageTimePerExamSeconds: 1484, // ~24.7 mins
    examsCompletedCount: 5,
    totalScoreSum: 46.50,
    averageScore: 9.30,
    streakDays: 6,
    xpPoints: 3200,
    weeklyBadges: [WEEKLY_BADGES.top_2, WEEKLY_BADGES.speed_demon, WEEKLY_BADGES.sql_master],
    lastActive: '25 phút trước'
  },
  {
    rank: 3,
    previousRank: 4,
    userId: 'user_student_6',
    username: 'phuongthao12',
    fullName: 'Đỗ Phương Thảo',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    className: '12 Toán 1 - THPT Chuyên Quốc Học',
    province: 'Thừa Thiên Huế',
    track: 'CS',
    totalCorrectQuestions: 138,
    totalQuestionsAnswered: 144,
    accuracyRate: 95.8,
    totalTimeSpentSeconds: 7600,
    averageTimePerExamSeconds: 1520,
    examsCompletedCount: 5,
    totalScoreSum: 45.25,
    averageScore: 9.05,
    streakDays: 5,
    xpPoints: 2980,
    weeklyBadges: [WEEKLY_BADGES.top_3, WEEKLY_BADGES.accuracy_king, WEEKLY_BADGES.streak_fire],
    lastActive: '1 giờ trước'
  },
  {
    rank: 4,
    previousRank: 3,
    userId: 'user_student_3',
    username: 'giabao12',
    fullName: 'Hoàng Gia Bảo',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    className: '12A1 - THPT Chuyên Lê Hồng Phong',
    province: 'TP. Hồ Chí Minh',
    track: 'CS',
    totalCorrectQuestions: 134,
    totalQuestionsAnswered: 142,
    accuracyRate: 94.4,
    totalTimeSpentSeconds: 6980,
    averageTimePerExamSeconds: 1396, // ~23.2 mins
    examsCompletedCount: 5,
    totalScoreSum: 44.0,
    averageScore: 8.80,
    streakDays: 4,
    xpPoints: 2750,
    weeklyBadges: [WEEKLY_BADGES.speed_demon, WEEKLY_BADGES.python_master],
    lastActive: '2 giờ trước'
  },
  {
    rank: 5,
    previousRank: 7,
    userId: 'user_student_7',
    username: 'hoangnam_pt',
    fullName: 'Lê Hoàng Nam',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    className: '12A1 - THPT Chuyên KHTN ĐHQG Hà Nội',
    province: 'Hà Nội',
    track: 'BOTH',
    totalCorrectQuestions: 131,
    totalQuestionsAnswered: 140,
    accuracyRate: 93.6,
    totalTimeSpentSeconds: 7100,
    averageTimePerExamSeconds: 1420,
    examsCompletedCount: 5,
    totalScoreSum: 43.5,
    averageScore: 8.70,
    streakDays: 6,
    xpPoints: 2600,
    weeklyBadges: [WEEKLY_BADGES.speed_demon, WEEKLY_BADGES.streak_fire],
    lastActive: '3 giờ trước'
  },
  {
    rank: 6,
    previousRank: 5,
    userId: 'user_student_4',
    username: 'thutrang12',
    fullName: 'Phạm Thu Trang',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    className: '12A2 - THPT Chuyên Trần Phú',
    province: 'Hải Phòng',
    track: 'ICT',
    totalCorrectQuestions: 125,
    totalQuestionsAnswered: 138,
    accuracyRate: 90.6,
    totalTimeSpentSeconds: 7300,
    averageTimePerExamSeconds: 1460,
    examsCompletedCount: 5,
    totalScoreSum: 41.75,
    averageScore: 8.35,
    streakDays: 4,
    xpPoints: 2420,
    weeklyBadges: [WEEKLY_BADGES.sql_master],
    lastActive: '5 giờ trước'
  },
  {
    rank: 7,
    previousRank: 6,
    userId: 'user_student_5',
    username: 'ducthang12',
    fullName: 'Vũ Đức Thắng',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    className: '12A2 - THPT Chuyên Lý Tự Trọng',
    province: 'Cần Thơ',
    track: 'BOTH',
    totalCorrectQuestions: 119,
    totalQuestionsAnswered: 135,
    accuracyRate: 88.1,
    totalTimeSpentSeconds: 7650,
    averageTimePerExamSeconds: 1530,
    examsCompletedCount: 5,
    totalScoreSum: 39.5,
    averageScore: 7.90,
    streakDays: 3,
    xpPoints: 2200,
    weeklyBadges: [],
    lastActive: 'Hôm qua'
  },
  {
    rank: 8,
    previousRank: 9,
    userId: 'user_student_8',
    username: 'baongoc_nd',
    fullName: 'Trịnh Bảo Ngọc',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    className: '12 Chuyên Tin - THPT Chuyên Lê Hồng Phong',
    province: 'Nam Định',
    track: 'CS',
    totalCorrectQuestions: 115,
    totalQuestionsAnswered: 126,
    accuracyRate: 91.3,
    totalTimeSpentSeconds: 6800,
    averageTimePerExamSeconds: 1700,
    examsCompletedCount: 4,
    totalScoreSum: 36.5,
    averageScore: 9.12,
    streakDays: 5,
    xpPoints: 2150,
    weeklyBadges: [WEEKLY_BADGES.python_master],
    lastActive: '1 ngày trước'
  },
  {
    rank: 9,
    previousRank: 8,
    userId: 'user_student_9',
    username: 'khanhduy_na',
    fullName: 'Ngô Khánh Duy',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    className: '12A1 - THPT Chuyên Phan Bội Châu',
    province: 'Nghệ An',
    track: 'BOTH',
    totalCorrectQuestions: 112,
    totalQuestionsAnswered: 128,
    accuracyRate: 87.5,
    totalTimeSpentSeconds: 7200,
    averageTimePerExamSeconds: 1800,
    examsCompletedCount: 4,
    totalScoreSum: 35.25,
    averageScore: 8.81,
    streakDays: 4,
    xpPoints: 2000,
    weeklyBadges: [],
    lastActive: '2 ngày trước'
  },
  {
    rank: 10,
    previousRank: 12,
    userId: 'user_student_10',
    username: 'thanhhang_bd',
    fullName: 'Võ Thanh Hằng',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    className: '12 Toán - THPT Chuyên Hùng Vương',
    province: 'Bình Dương',
    track: 'ICT',
    totalCorrectQuestions: 108,
    totalQuestionsAnswered: 124,
    accuracyRate: 87.1,
    totalTimeSpentSeconds: 6900,
    averageTimePerExamSeconds: 1725,
    examsCompletedCount: 4,
    totalScoreSum: 34.0,
    averageScore: 8.50,
    streakDays: 3,
    xpPoints: 1850,
    weeklyBadges: [WEEKLY_BADGES.sql_master],
    lastActive: '2 ngày trước'
  }
];

export const LAST_WEEK_LEADERBOARD_ENTRIES: WeeklyLeaderboardEntry[] = [
  {
    rank: 1,
    userId: 'user_student_2',
    username: 'anhtuyet12',
    fullName: 'Trần Thị Ánh Tuyết',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    className: '12 Tin - THPT Chuyên Lê Quý Đôn',
    province: 'Đà Nẵng',
    track: 'ICT',
    totalCorrectQuestions: 140,
    totalQuestionsAnswered: 144,
    accuracyRate: 97.2,
    totalTimeSpentSeconds: 7100,
    averageTimePerExamSeconds: 1420,
    examsCompletedCount: 5,
    totalScoreSum: 46.5,
    averageScore: 9.30,
    streakDays: 7,
    xpPoints: 3300,
    weeklyBadges: [WEEKLY_BADGES.top_1, WEEKLY_BADGES.accuracy_king, WEEKLY_BADGES.sql_master],
    lastActive: 'Tuần trước'
  },
  {
    rank: 2,
    userId: 'user_student_1',
    username: 'minhquan12',
    fullName: 'Nguyễn Minh Quân',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    className: '12 Tin - THPT Chuyên Hà Nội - Amsterdam',
    province: 'Hà Nội',
    track: 'BOTH',
    totalCorrectQuestions: 139,
    totalQuestionsAnswered: 146,
    accuracyRate: 95.2,
    totalTimeSpentSeconds: 7400,
    averageTimePerExamSeconds: 1480,
    examsCompletedCount: 5,
    totalScoreSum: 45.75,
    averageScore: 9.15,
    streakDays: 7,
    xpPoints: 3150,
    weeklyBadges: [WEEKLY_BADGES.top_2, WEEKLY_BADGES.streak_fire],
    lastActive: 'Tuần trước'
  },
  {
    rank: 3,
    userId: 'user_student_3',
    username: 'giabao12',
    fullName: 'Hoàng Gia Bảo',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    className: '12A1 - THPT Chuyên Lê Hồng Phong',
    province: 'TP. Hồ Chí Minh',
    track: 'CS',
    totalCorrectQuestions: 135,
    totalQuestionsAnswered: 144,
    accuracyRate: 93.7,
    totalTimeSpentSeconds: 6750,
    averageTimePerExamSeconds: 1350,
    examsCompletedCount: 5,
    totalScoreSum: 44.5,
    averageScore: 8.90,
    streakDays: 6,
    xpPoints: 2900,
    weeklyBadges: [WEEKLY_BADGES.top_3, WEEKLY_BADGES.speed_demon],
    lastActive: 'Tuần trước'
  }
];

/**
 * Computes live, aggregated weekly leaderboard by combining
 * current user's local and server exam results with peer seed data.
 */
export function buildWeeklyLeaderboard(
  results: ExamResult[],
  currentUser: User | null,
  period: LeaderboardPeriod,
  trackFilter: LeaderboardTrackFilter,
  searchQuery: string = ''
): WeeklyLeaderboardEntry[] {
  let baseEntries = period === 'last_week' 
    ? [...LAST_WEEK_LEADERBOARD_ENTRIES]
    : [...SEED_LEADERBOARD_ENTRIES];

  // If currentUser is logged in, compute real stats from `results`
  if (currentUser && currentUser.role === 'student') {
    const userResults = results.filter(r => r.userId === currentUser.id);

    if (userResults.length > 0) {
      const totalCorrect = userResults.reduce((acc, r) => acc + (r.totalCorrectQuestions || 0), 0);
      const totalQuestions = userResults.reduce((acc, r) => acc + (r.totalQuestions || 28), 0);
      const totalTime = userResults.reduce((acc, r) => acc + (r.timeSpentSeconds || 0), 0);
      const totalScore = userResults.reduce((acc, r) => acc + (r.score || 0), 0);
      const count = userResults.length;
      const avgTime = count > 0 ? Math.round(totalTime / count) : 0;
      const accuracy = totalQuestions > 0 ? Number(((totalCorrect / totalQuestions) * 100).toFixed(1)) : 0;
      const avgScore = count > 0 ? Number((totalScore / count).toFixed(2)) : 0;

      // Assign badges dynamically
      const earnedBadges: WeeklyBadge[] = [];
      if (accuracy >= 95) earnedBadges.push(WEEKLY_BADGES.accuracy_king);
      if (avgTime > 0 && avgTime <= 1500) earnedBadges.push(WEEKLY_BADGES.speed_demon);
      if (count >= 3) earnedBadges.push(WEEKLY_BADGES.streak_fire);

      const userEntryIndex = baseEntries.findIndex(e => e.userId === currentUser.id);
      const userEntry: WeeklyLeaderboardEntry = {
        rank: 0,
        userId: currentUser.id,
        username: currentUser.username,
        fullName: currentUser.fullName,
        avatarUrl: currentUser.avatarUrl,
        className: currentUser.className || '12A1 - Học sinh tự do',
        province: currentUser.province || 'Toàn quốc',
        track: currentUser.track || 'BOTH',
        totalCorrectQuestions: totalCorrect,
        totalQuestionsAnswered: totalQuestions,
        accuracyRate: accuracy,
        totalTimeSpentSeconds: totalTime,
        averageTimePerExamSeconds: avgTime,
        examsCompletedCount: count,
        totalScoreSum: totalScore,
        averageScore: avgScore,
        streakDays: Math.min(7, Math.max(1, count)),
        xpPoints: totalCorrect * 25 + count * 50,
        weeklyBadges: earnedBadges,
        lastActive: 'Vừa xong',
        isCurrentUser: true
      };

      if (userEntryIndex >= 0) {
        baseEntries[userEntryIndex] = {
          ...userEntry,
          previousRank: baseEntries[userEntryIndex].previousRank
        };
      } else {
        baseEntries.push(userEntry);
      }
    } else {
      // User has no exams yet, show them at bottom with 0 results if they exist in list or mark isCurrentUser
      const existing = baseEntries.find(e => e.userId === currentUser.id);
      if (existing) {
        existing.isCurrentUser = true;
      }
    }
  }

  // Filter by Track
  if (trackFilter !== 'ALL') {
    baseEntries = baseEntries.filter(e => e.track === trackFilter || e.track === 'BOTH');
  }

  // Filter by Search Query
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    baseEntries = baseEntries.filter(
      e => e.fullName.toLowerCase().includes(q) ||
           (e.className && e.className.toLowerCase().includes(q)) ||
           (e.province && e.province.toLowerCase().includes(q)) ||
           e.username.toLowerCase().includes(q)
    );
  }

  // Strict Motivating Sorting Rules:
  // 1. Primary: totalCorrectQuestions DESC (Số câu đúng nhiều nhất)
  // 2. Secondary: averageTimePerExamSeconds ASC (Thời gian hoàn thành ít nhất / Tốc độ nhanh nhất)
  // 3. Tertiary: accuracyRate DESC (Tỷ lệ chính xác)
  // 4. Quaternary: totalScoreSum DESC
  baseEntries.sort((a, b) => {
    if (b.totalCorrectQuestions !== a.totalCorrectQuestions) {
      return b.totalCorrectQuestions - a.totalCorrectQuestions;
    }
    if (a.averageTimePerExamSeconds !== b.averageTimePerExamSeconds && a.averageTimePerExamSeconds > 0 && b.averageTimePerExamSeconds > 0) {
      return a.averageTimePerExamSeconds - b.averageTimePerExamSeconds;
    }
    if (b.accuracyRate !== a.accuracyRate) {
      return b.accuracyRate - a.accuracyRate;
    }
    return b.totalScoreSum - a.totalScoreSum;
  });

  // Re-assign ranks 1, 2, 3... and Top badges
  return baseEntries.map((entry, idx) => {
    const rank = idx + 1;
    const badges = [...entry.weeklyBadges];

    // Remove old top badges then assign according to current rank
    const filteredBadges = badges.filter(b => !['badge_top_1', 'badge_top_2', 'badge_top_3'].includes(b.id));
    if (rank === 1) filteredBadges.unshift(WEEKLY_BADGES.top_1);
    else if (rank === 2) filteredBadges.unshift(WEEKLY_BADGES.top_2);
    else if (rank === 3) filteredBadges.unshift(WEEKLY_BADGES.top_3);

    return {
      ...entry,
      rank,
      weeklyBadges: filteredBadges
    };
  });
}
