import React, { useState, useMemo } from 'react';
import { 
  Trophy, 
  Flame, 
  Clock, 
  Target, 
  Medal, 
  Search, 
  Filter, 
  ArrowUp, 
  ArrowDown, 
  Minus, 
  Sparkles, 
  CheckCircle2, 
  Award, 
  Zap, 
  TrendingUp, 
  ChevronRight, 
  Info, 
  X,
  BookOpen,
  Calendar,
  Share2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useExam } from '../context/ExamContext';
import { LeaderboardPeriod, LeaderboardTrackFilter, WeeklyLeaderboardEntry, WeeklyBadge } from '../types';
import { buildWeeklyLeaderboard, WEEKLY_BADGES } from '../data/mockLeaderboard';

interface LeaderboardViewProps {
  onGoToExams: () => void;
  onOpenQuickTheory?: (lessonId: string) => void;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ onGoToExams }) => {
  const { currentUser } = useAuth();
  const { examResults } = useExam();

  const [period, setPeriod] = useState<LeaderboardPeriod>('this_week');
  const [trackFilter, setTrackFilter] = useState<LeaderboardTrackFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<WeeklyLeaderboardEntry | null>(null);
  const [showRulesModal, setShowRulesModal] = useState<boolean>(false);

  // Compute live leaderboard based on filters & actual user test results
  const leaderboard = useMemo(() => {
    return buildWeeklyLeaderboard(examResults, currentUser, period, trackFilter, searchQuery);
  }, [examResults, currentUser, period, trackFilter, searchQuery]);

  // Current user's entry on this leaderboard
  const currentUserEntry = useMemo(() => {
    if (!currentUser) return null;
    return leaderboard.find(e => e.userId === currentUser.id) || null;
  }, [leaderboard, currentUser]);

  // Top 3 Podium
  const top1 = leaderboard[0] || null;
  const top2 = leaderboard[1] || null;
  const top3 = leaderboard[2] || null;

  // Format seconds to mm:ss or hh:mm:ss
  const formatTime = (seconds: number) => {
    if (!seconds || seconds <= 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins >= 60) {
      const hrs = Math.floor(mins / 60);
      const remMins = mins % 60;
      return `${hrs}h ${remMins}p`;
    }
    return `${mins}p ${secs.toString().padStart(2, '0')}s`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Hero Banner & Motivating Arena Title */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 overflow-hidden shadow-xl border border-indigo-800/40">
        
        {/* Background glow effects */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            
            {/* Live Arena Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold tracking-wide">
              <Trophy className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>ĐẤU TRƯỜNG BẢNG XẾP HẠNG TUẦN (WEEKLY ARENA)</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Bảng Vàng Thi Đua <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">Tin Học THPT 2025</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Vinh danh các thí sinh xuất sắc nhất dựa trên tiêu chí <strong className="text-amber-200 font-semibold">Tổng số câu trả lời đúng</strong> kết hợp <strong className="text-sky-200 font-semibold">Tốc độ hoàn thành bài thi</strong>. Luyện đề mỗi ngày để bứt phá thứ hạng!
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
              <button
                onClick={() => setShowRulesModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10 transition-all font-medium cursor-pointer"
              >
                <Info className="w-3.5 h-3.5 text-amber-300" />
                <span>Tiêu chí & Thể lệ tính điểm</span>
              </button>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/40 text-amber-300 border border-amber-500/20 font-mono font-bold">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Chốt tuần sau: 3 ngày 14 giờ</span>
              </div>
            </div>
          </div>

          {/* Quick Arena Key Metrics */}
          <div className="grid grid-cols-2 gap-3 shrink-0 sm:w-auto">
            <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10 text-center">
              <div className="text-[11px] text-slate-400 font-medium mb-1">Thí sinh tranh tài</div>
              <div className="text-xl sm:text-2xl font-black text-amber-300">1,420+</div>
              <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">▲ +12% tuần này</div>
            </div>

            <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10 text-center">
              <div className="text-[11px] text-slate-400 font-medium mb-1">Tổng câu đã giải</div>
              <div className="text-xl sm:text-2xl font-black text-sky-300">42.8K</div>
              <div className="text-[10px] text-sky-400 font-semibold mt-0.5">Độ chính xác 91.2%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Current User Standing Card (Personal Motivation Booster) */}
      {currentUser && (
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 rounded-2xl p-5 text-white shadow-md border border-indigo-700/60 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            
            {/* User Profile & Rank Status */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl overflow-hidden ring-3 ring-amber-400 bg-indigo-950 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {currentUser.avatarUrl ? (
                    <img src={currentUser.avatarUrl} alt={currentUser.fullName} className="w-full h-full object-cover" />
                  ) : (
                    currentUser.fullName.charAt(0)
                  )}
                </div>
                <div className="absolute -bottom-2 -right-1 px-2 py-0.5 bg-amber-400 text-amber-950 font-black text-[10px] rounded-full shadow-md">
                  {currentUserEntry ? `#${currentUserEntry.rank}` : 'Mới'}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-white">{currentUser.fullName}</h3>
                  <span className="px-2 py-0.5 rounded-md bg-white/10 text-indigo-200 text-[10px] font-semibold">
                    {currentUser.className || 'Học sinh THPT'}
                  </span>
                </div>
                
                <p className="text-xs text-indigo-200 mt-0.5">
                  {currentUserEntry ? (
                    <span>
                      Xếp hạng hiện tại: <strong className="text-amber-300 font-black">Top {currentUserEntry.rank}</strong> toàn hệ thống tuần này
                    </span>
                  ) : (
                    <span>Bạn chưa hoàn thành bài thi nào trong tuần này. Hãy thi thử để gia nhập bảng vàng!</span>
                  )}
                </p>
              </div>
            </div>

            {/* User Key Performance Metrics */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-6 bg-black/25 px-4 py-2.5 rounded-xl border border-white/10">
              <div className="text-center">
                <div className="text-[10px] uppercase font-bold text-slate-300">Số câu đúng</div>
                <div className="text-base sm:text-lg font-black text-emerald-300 font-mono">
                  {currentUserEntry ? `${currentUserEntry.totalCorrectQuestions} câu` : '0'}
                </div>
              </div>

              <div className="w-px h-8 bg-white/15 hidden sm:block" />

              <div className="text-center">
                <div className="text-[10px] uppercase font-bold text-slate-300">Tốc độ TB</div>
                <div className="text-base sm:text-lg font-black text-sky-300 font-mono">
                  {currentUserEntry && currentUserEntry.averageTimePerExamSeconds > 0
                    ? formatTime(currentUserEntry.averageTimePerExamSeconds)
                    : '--'}
                </div>
              </div>

              <div className="w-px h-8 bg-white/15 hidden sm:block" />

              <div className="text-center">
                <div className="text-[10px] uppercase font-bold text-slate-300">Độ chính xác</div>
                <div className="text-base sm:text-lg font-black text-amber-300 font-mono">
                  {currentUserEntry ? `${currentUserEntry.accuracyRate}%` : '0%'}
                </div>
              </div>

              <button
                onClick={onGoToExams}
                className="ml-auto px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-amber-950 font-black text-xs rounded-xl shadow-md transition-all transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 fill-amber-950" />
                <span>Luyện đề bứt phá hạng 🚀</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top 3 Podium (Bục Vinh Danh Vàng - Bạc - Đồng) */}
      {leaderboard.length >= 3 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CrownIcon className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-bold text-slate-900">Bục Vinh Danh Top 3 Tuần Này</h2>
            </div>
            <span className="text-xs text-slate-500 font-medium">Cập nhật theo thời gian thực</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 pt-6">
            
            {/* Rank 2 (Á Quân 1 - Silver) */}
            {top2 && (
              <div 
                onClick={() => setSelectedStudent(top2)}
                className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-sm hover:shadow-md transition-all relative flex flex-col items-center text-center cursor-pointer order-2 md:order-1 hover:-translate-y-1"
              >
                <div className="absolute -top-5 w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-400 text-slate-900 font-black text-base flex items-center justify-center shadow-md ring-4 ring-white">
                  🥈
                </div>

                <div className="mt-3 w-18 h-18 rounded-2xl overflow-hidden ring-4 ring-slate-300 shadow-md mb-3">
                  <img src={top2.avatarUrl} alt={top2.fullName} className="w-full h-full object-cover" />
                </div>

                <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{top2.fullName}</h3>
                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{top2.className}</p>
                <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md mt-1">
                  📍 {top2.province}
                </span>

                <div className="grid grid-cols-2 gap-2 w-full mt-4 p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Số câu đúng</span>
                    <strong className="text-emerald-700 font-mono font-black text-sm">{top2.totalCorrectQuestions}</strong>
                    <span className="text-[10px] text-slate-400">/{top2.totalQuestionsAnswered}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Tốc độ TB</span>
                    <strong className="text-sky-700 font-mono font-black text-sm">{formatTime(top2.averageTimePerExamSeconds)}</strong>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-1 mt-3">
                  {top2.weeklyBadges.slice(0, 2).map((badge) => (
                    <span 
                      key={badge.id} 
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md bg-gradient-to-r ${badge.bgGradient} ${badge.textColor}`}
                    >
                      {badge.title}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Rank 1 (Quán Quân - Gold Champion) */}
            {top1 && (
              <div 
                onClick={() => setSelectedStudent(top1)}
                className="bg-gradient-to-b from-amber-50/60 via-white to-amber-50/30 rounded-3xl p-6 border-2 border-amber-400 shadow-xl relative flex flex-col items-center text-center cursor-pointer order-1 md:order-2 md:-mt-4 hover:-translate-y-1.5 transition-all ring-4 ring-amber-400/20"
              >
                {/* Crown Banner */}
                <div className="absolute -top-6 px-4 py-1 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-amber-950 font-black text-xs flex items-center gap-1.5 shadow-lg ring-4 ring-white">
                  <span>👑 QUÁN QUÂN TUẦN</span>
                </div>

                <div className="mt-4 w-22 h-22 rounded-3xl overflow-hidden ring-4 ring-amber-400 shadow-xl mb-3 relative">
                  <img src={top1.avatarUrl} alt={top1.fullName} className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 inset-x-0 bg-amber-500/90 text-amber-950 text-[10px] font-black py-0.5 text-center">
                    #1 VÀNG
                  </div>
                </div>

                <h3 className="font-extrabold text-base text-slate-900 line-clamp-1">{top1.fullName}</h3>
                <p className="text-xs text-slate-600 font-medium line-clamp-1 mt-0.5">{top1.className}</p>
                <span className="text-[11px] font-bold text-amber-800 bg-amber-100/80 border border-amber-300 px-2.5 py-0.5 rounded-full mt-1.5">
                  📍 {top1.province} • {top1.track === 'BOTH' ? 'ICT & CS' : top1.track}
                </span>

                <div className="grid grid-cols-2 gap-3 w-full mt-4 p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-amber-800 uppercase block">Số câu đúng</span>
                    <strong className="text-emerald-700 font-mono font-black text-base">{top1.totalCorrectQuestions}</strong>
                    <span className="text-[10px] text-slate-500">/{top1.totalQuestionsAnswered}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-amber-800 uppercase block">Tốc độ TB</span>
                    <strong className="text-sky-700 font-mono font-black text-base">{formatTime(top1.averageTimePerExamSeconds)}</strong>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-1.5 mt-3">
                  {top1.weeklyBadges.slice(0, 3).map((badge) => (
                    <span 
                      key={badge.id} 
                      className={`text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs bg-gradient-to-r ${badge.bgGradient} ${badge.textColor}`}
                    >
                      {badge.title}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Rank 3 (Á Quân 2 - Bronze) */}
            {top3 && (
              <div 
                onClick={() => setSelectedStudent(top3)}
                className="bg-white rounded-3xl p-5 border-2 border-orange-200 shadow-sm hover:shadow-md transition-all relative flex flex-col items-center text-center cursor-pointer order-3 hover:-translate-y-1"
              >
                <div className="absolute -top-5 w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-600 to-orange-700 text-white font-black text-base flex items-center justify-center shadow-md ring-4 ring-white">
                  🥉
                </div>

                <div className="mt-3 w-18 h-18 rounded-2xl overflow-hidden ring-4 ring-amber-600/40 shadow-md mb-3">
                  <img src={top3.avatarUrl} alt={top3.fullName} className="w-full h-full object-cover" />
                </div>

                <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{top3.fullName}</h3>
                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{top3.className}</p>
                <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md mt-1">
                  📍 {top3.province}
                </span>

                <div className="grid grid-cols-2 gap-2 w-full mt-4 p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Số câu đúng</span>
                    <strong className="text-emerald-700 font-mono font-black text-sm">{top3.totalCorrectQuestions}</strong>
                    <span className="text-[10px] text-slate-400">/{top3.totalQuestionsAnswered}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Tốc độ TB</span>
                    <strong className="text-sky-700 font-mono font-black text-sm">{formatTime(top3.averageTimePerExamSeconds)}</strong>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-1 mt-3">
                  {top3.weeklyBadges.slice(0, 2).map((badge) => (
                    <span 
                      key={badge.id} 
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md bg-gradient-to-r ${badge.bgGradient} ${badge.textColor}`}
                    >
                      {badge.title}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Leaderboard Controls & Filters */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Period Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setPeriod('this_week')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                period === 'this_week'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🔥 Tuần này (Hiện tại)
            </button>
            <button
              onClick={() => setPeriod('last_week')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                period === 'last_week'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🏆 Tuần trước (Lưu danh)
            </button>
          </div>

          {/* Track Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Phân ban:</span>
            </span>

            <button
              onClick={() => setTrackFilter('ALL')}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                trackFilter === 'ALL'
                  ? 'bg-indigo-700 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Toàn bộ
            </button>

            <button
              onClick={() => setTrackFilter('ICT')}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                trackFilter === 'ICT'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Ứng dụng (ICT)
            </button>

            <button
              onClick={() => setTrackFilter('CS')}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                trackFilter === 'CS'
                  ? 'bg-teal-600 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Khoa học máy tính (CS)
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm thí sinh, trường, tỉnh..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 outline-hidden"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Leaderboard Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4 text-center w-16">Thứ hạng</th>
                <th className="py-3.5 px-4 min-w-[220px]">Thí sinh & Trường</th>
                <th className="py-3.5 px-4 text-center min-w-[140px]">
                  <div className="flex items-center justify-center gap-1 text-emerald-700">
                    <Target className="w-3.5 h-3.5" />
                    <span>Số câu đúng</span>
                  </div>
                </th>
                <th className="py-3.5 px-4 text-center min-w-[130px]">
                  <div className="flex items-center justify-center gap-1 text-sky-700">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Tốc độ hoàn thành</span>
                  </div>
                </th>
                <th className="py-3.5 px-4 text-center min-w-[110px]">Độ chính xác</th>
                <th className="py-3.5 px-4 text-center min-w-[100px]">Chuỗi & XP</th>
                <th className="py-3.5 px-4 text-right">Chi tiết</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs">
              {leaderboard.map((entry) => {
                const isCurrent = currentUser && entry.userId === currentUser.id;
                
                // Rank change indicator
                let rankDiff = 0;
                if (entry.previousRank) {
                  rankDiff = entry.previousRank - entry.rank;
                }

                return (
                  <tr 
                    key={entry.userId}
                    onClick={() => setSelectedStudent(entry)}
                    className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                      isCurrent ? 'bg-amber-50/60 font-semibold' : ''
                    }`}
                  >
                    {/* Rank Badge */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {entry.rank === 1 ? (
                          <span className="w-7 h-7 rounded-xl bg-amber-400 text-amber-950 font-black text-xs flex items-center justify-center shadow-xs">
                            🥇 1
                          </span>
                        ) : entry.rank === 2 ? (
                          <span className="w-7 h-7 rounded-xl bg-slate-300 text-slate-900 font-black text-xs flex items-center justify-center shadow-xs">
                            🥈 2
                          </span>
                        ) : entry.rank === 3 ? (
                          <span className="w-7 h-7 rounded-xl bg-amber-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                            🥉 3
                          </span>
                        ) : (
                          <span className="font-mono font-bold text-slate-600 text-sm">
                            #{entry.rank}
                          </span>
                        )}

                        {/* Rank change indicator */}
                        {rankDiff > 0 ? (
                          <span className="text-[10px] text-emerald-600 font-bold flex items-center" title={`Tăng ${rankDiff} bậc`}>
                            <ArrowUp className="w-3 h-3" />
                          </span>
                        ) : rankDiff < 0 ? (
                          <span className="text-[10px] text-rose-500 font-bold flex items-center" title={`Giảm ${Math.abs(rankDiff)} bậc`}>
                            <ArrowDown className="w-3 h-3" />
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-300 font-bold flex items-center">
                            <Minus className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Student Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 ring-2 ring-slate-200 shrink-0">
                          {entry.avatarUrl ? (
                            <img src={entry.avatarUrl} alt={entry.fullName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-slate-700 bg-indigo-100">
                              {entry.fullName.charAt(0)}
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 hover:text-indigo-600 transition-colors">
                              {entry.fullName}
                            </span>
                            {isCurrent && (
                              <span className="px-1.5 py-0.2 bg-amber-400 text-amber-950 rounded text-[9px] font-black uppercase">
                                Bạn
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                            <span className="line-clamp-1">{entry.className}</span>
                            <span>•</span>
                            <span className="font-medium text-slate-600">{entry.province}</span>
                          </div>

                          {/* Mini badges */}
                          {entry.weeklyBadges.length > 0 && (
                            <div className="flex items-center gap-1 mt-1">
                              {entry.weeklyBadges.slice(0, 2).map((badge) => (
                                <span 
                                  key={badge.id}
                                  className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${badge.textColor} bg-slate-100`}
                                >
                                  {badge.icon} {badge.title}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Correct Questions */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex flex-col items-center">
                        <div className="font-mono font-black text-sm text-emerald-700">
                          {entry.totalCorrectQuestions}
                          <span className="text-xs text-slate-400 font-normal"> / {entry.totalQuestionsAnswered}</span>
                        </div>
                        <div className="w-20 bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
                          <div 
                            className="bg-emerald-500 h-full rounded-full"
                            style={{ width: `${entry.accuracyRate}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Completion Speed */}
                    <td className="py-3.5 px-4 text-center font-mono">
                      <div className="font-bold text-slate-800 text-xs">
                        {formatTime(entry.averageTimePerExamSeconds)}
                        <span className="text-[10px] text-slate-400 block font-sans">TB / bài thi</span>
                      </div>
                    </td>

                    {/* Accuracy Rate */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-block px-2.5 py-1 rounded-lg font-mono font-bold text-xs bg-indigo-50 text-indigo-700">
                        {entry.accuracyRate}%
                      </span>
                    </td>

                    {/* Streak & XP */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="flex items-center gap-1 font-bold text-orange-600 text-xs">
                          <Flame className="w-3.5 h-3.5 fill-orange-500" />
                          <span>{entry.streakDays} ngày</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {entry.xpPoints} XP
                        </span>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {leaderboard.length === 0 && (
          <div className="p-12 text-center text-slate-500">
            <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-medium">Không tìm thấy thí sinh nào khớp với bộ lọc</p>
            <button
              onClick={() => { setSearchQuery(''); setTrackFilter('ALL'); }}
              className="mt-3 text-xs text-indigo-600 font-bold hover:underline"
            >
              Đặt lại bộ lọc
            </button>
          </div>
        )}
      </div>

      {/* Student Profile Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl overflow-hidden ring-2 ring-indigo-200">
                  {selectedStudent.avatarUrl ? (
                    <img src={selectedStudent.avatarUrl} alt={selectedStudent.fullName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-700 font-bold">
                      {selectedStudent.fullName.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">{selectedStudent.fullName}</h3>
                  <p className="text-xs text-slate-500">{selectedStudent.className} • {selectedStudent.province}</p>
                </div>
              </div>

              <button 
                onClick={() => setSelectedStudent(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Performance Stats Grid */}
            <div className="grid grid-cols-3 gap-3 my-4">
              <div className="bg-emerald-50 rounded-2xl p-3 text-center border border-emerald-100">
                <span className="text-[10px] uppercase font-bold text-emerald-800">Số câu đúng</span>
                <div className="text-lg font-black text-emerald-700 font-mono mt-0.5">
                  {selectedStudent.totalCorrectQuestions}
                </div>
                <span className="text-[10px] text-emerald-600">Đạt {selectedStudent.accuracyRate}%</span>
              </div>

              <div className="bg-sky-50 rounded-2xl p-3 text-center border border-sky-100">
                <span className="text-[10px] uppercase font-bold text-sky-800">Tốc độ TB</span>
                <div className="text-lg font-black text-sky-700 font-mono mt-0.5">
                  {formatTime(selectedStudent.averageTimePerExamSeconds)}
                </div>
                <span className="text-[10px] text-sky-600">trên mỗi đề thi</span>
              </div>

              <div className="bg-amber-50 rounded-2xl p-3 text-center border border-amber-100">
                <span className="text-[10px] uppercase font-bold text-amber-800">Điểm quy đổi TB</span>
                <div className="text-lg font-black text-amber-700 font-mono mt-0.5">
                  {selectedStudent.averageScore}
                </div>
                <span className="text-[10px] text-amber-600">{selectedStudent.streakDays} ngày liên tiếp</span>
              </div>
            </div>

            {/* Earned Badges */}
            <div className="space-y-2 mb-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Medal className="w-4 h-4 text-amber-500" />
                <span>Huy hiệu tuần đạt được</span>
              </h4>

              <div className="space-y-1.5">
                {selectedStudent.weeklyBadges.map((badge) => (
                  <div key={badge.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                    <span className="text-xl">{badge.icon}</span>
                    <div>
                      <div className="font-bold text-xs text-slate-900">{badge.title}</div>
                      <div className="text-[11px] text-slate-500">{badge.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSelectedStudent(null)}
              className="w-full py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
            >
              Đóng hồ sơ
            </button>
          </div>
        </div>
      )}

      {/* Rules & Fair Play Modal */}
      {showRulesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-indigo-700 font-bold text-base">
                <Trophy className="w-5 h-5 text-amber-500" />
                <span>Thể Lệ Xếp Hạng Đấu Trường</span>
              </div>
              <button onClick={() => setShowRulesModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-100">
                <strong className="text-indigo-900 block font-bold mb-1">🎯 Tiêu chí ưu tiên số 1: Số câu trả lời đúng</strong>
                <span>Xếp hạng dựa trên tổng số câu hỏi trắc nghiệm (Phần I & Phần II) thí sinh làm chính xác trong tuần.</span>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-100">
                <strong className="text-sky-900 block font-bold mb-1">⚡ Tiêu chí phụ số 2: Tốc độ hoàn thành</strong>
                <span>Khi 2 thí sinh có cùng số câu đúng, thí sinh có <strong>thời gian hoàn thành ít hơn (tốc độ nhanh hơn)</strong> sẽ được xếp hạng cao hơn.</span>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100">
                <strong className="text-amber-900 block font-bold mb-1">🔥 Điểm thưởng chuỗi (Streak Bonus)</strong>
                <span>Luyện đề liên tục 5-7 ngày sẽ nhận thêm huy hiệu và cộng điểm kinh nghiệm (XP) trên hồ sơ cá nhân.</span>
              </div>
            </div>

            <button
              onClick={() => setShowRulesModal(false)}
              className="w-full mt-5 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              Đã hiểu thể lệ
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

// Crown SVG helper icon
const CrownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
  </svg>
);
