import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useExam } from '../context/ExamContext';
import { 
  GraduationCap, 
  BookOpen, 
  FileText, 
  Bookmark, 
  BarChart3, 
  UserCheck, 
  LogOut, 
  User, 
  Sparkles,
  Lock,
  Compass,
  Zap,
  LogIn,
  UserPlus
} from 'lucide-react';

export type NavTab = 'intro' | 'exams' | 'theory' | 'notebook' | 'analytics' | 'teacher';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onOpenProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAuth,
  onOpenProfile
}) => {
  const { currentUser, isAuthenticated, logout, switchDemoRole } = useAuth();
  const { bookmarks } = useExam();

  const userBookmarksCount = bookmarks.filter(b => !currentUser || b.userId === currentUser.id).length;

  const handleRestrictedTabClick = (tab: NavTab) => {
    if (!isAuthenticated) {
      onOpenAuth('login');
      return;
    }
    setActiveTab(tab);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Title */}
          <div 
            onClick={() => setActiveTab(isAuthenticated ? (currentUser?.role === 'teacher' ? 'teacher' : 'exams') : 'intro')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-600 to-indigo-700 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-all">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-slate-900">
                  Tin học THPT
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200/80 rounded-full">
                  GDPT 2018
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Hệ thống ôn thi & khảo sát tốt nghiệp THPT quốc gia
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs - Role-based & Auth-gated */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80">
            
            {/* Unauthenticated Mode Tabs */}
            {!isAuthenticated && (
              <>
                <button
                  onClick={() => setActiveTab('intro')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'intro'
                      ? 'bg-white text-indigo-700 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Tổng quan & Quy chế thi</span>
                </button>

                <button
                  onClick={() => setActiveTab('exams')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'exams'
                      ? 'bg-white text-indigo-700 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Đề thi mẫu</span>
                </button>

                <button
                  onClick={() => setActiveTab('theory')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'theory'
                      ? 'bg-white text-indigo-700 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Thư viện lý thuyết</span>
                </button>

                <button
                  onClick={() => handleRestrictedTabClick('notebook')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-600 hover:bg-white/40 transition-all group"
                  title="Yêu cầu đăng nhập để mở sổ tay cá nhân"
                >
                  <Lock className="w-3 h-3 text-amber-500 group-hover:scale-110 transition-transform" />
                  <span>Sổ tay câu hỏi</span>
                </button>

                <button
                  onClick={() => handleRestrictedTabClick('analytics')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-600 hover:bg-white/40 transition-all group"
                  title="Yêu cầu đăng nhập để xem phân tích năng lực"
                >
                  <Lock className="w-3 h-3 text-emerald-500 group-hover:scale-110 transition-transform" />
                  <span>Phân tích năng lực</span>
                </button>

                <button
                  onClick={() => handleRestrictedTabClick('teacher')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-indigo-600 hover:bg-white/40 transition-all group"
                  title="Dành cho giáo viên: Yêu cầu đăng nhập"
                >
                  <Lock className="w-3 h-3 text-purple-500 group-hover:scale-110 transition-transform" />
                  <span>Góc giáo viên</span>
                </button>
              </>
            )}

            {/* Authenticated Student Mode Tabs */}
            {isAuthenticated && currentUser?.role === 'student' && (
              <>
                <button
                  onClick={() => setActiveTab('exams')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'exams'
                      ? 'bg-white text-indigo-700 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Đề thi & luyện tập</span>
                </button>

                <button
                  onClick={() => setActiveTab('theory')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'theory'
                      ? 'bg-white text-indigo-700 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Thư viện lý thuyết</span>
                </button>

                <button
                  onClick={() => setActiveTab('notebook')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all relative ${
                    activeTab === 'notebook'
                      ? 'bg-white text-amber-700 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Sổ tay câu hỏi</span>
                  {userBookmarksCount > 0 && (
                    <span className="px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[10px] font-bold">
                      {userBookmarksCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'analytics'
                      ? 'bg-white text-emerald-700 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Phân tích năng lực</span>
                </button>

                <button
                  onClick={() => setActiveTab('intro')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'intro'
                      ? 'bg-white text-indigo-700 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Thông tin kỳ thi</span>
                </button>
              </>
            )}

            {/* Authenticated Teacher Mode Tabs */}
            {isAuthenticated && currentUser?.role === 'teacher' && (
              <>
                <button
                  onClick={() => setActiveTab('teacher')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'teacher'
                      ? 'bg-gradient-to-r from-indigo-600 to-sky-600 text-white font-bold shadow-xs'
                      : 'text-indigo-700 hover:bg-indigo-50'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Góc giáo viên</span>
                </button>

                <button
                  onClick={() => setActiveTab('exams')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'exams'
                      ? 'bg-white text-indigo-700 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Ngân hàng đề thi</span>
                </button>

                <button
                  onClick={() => setActiveTab('theory')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'theory'
                      ? 'bg-white text-indigo-700 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Thư viện lý thuyết</span>
                </button>

                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'analytics'
                      ? 'bg-white text-emerald-700 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Thống kê học sinh</span>
                </button>

                <button
                  onClick={() => setActiveTab('intro')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'intro'
                      ? 'bg-white text-indigo-700 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Quy chế kỳ thi</span>
                </button>
              </>
            )}
          </nav>

          {/* Right Action: User Menu & Role Switch / Login */}
          <div className="flex items-center gap-2">
            
            {/* Authenticated User Actions */}
            {isAuthenticated && currentUser ? (
              <div className="flex items-center gap-2">
                {/* Quick Role Switcher */}
                <div className="hidden lg:flex items-center gap-1 bg-slate-100/80 border border-slate-200/80 rounded-2xl p-1 text-[11px]">
                  <span className="text-slate-500 px-1 font-medium">Vai trò:</span>
                  <button
                    onClick={() => {
                      switchDemoRole('student');
                      if (activeTab === 'teacher') setActiveTab('exams');
                    }}
                    className={`px-2.5 py-1 rounded-xl font-medium transition-all ${
                      currentUser.role === 'student'
                        ? 'bg-indigo-600 text-white font-bold shadow-xs'
                        : 'text-slate-600 hover:bg-slate-200/60'
                    }`}
                  >
                    Học sinh
                  </button>
                  <button
                    onClick={() => {
                      switchDemoRole('teacher');
                      setActiveTab('teacher');
                    }}
                    className={`px-2.5 py-1 rounded-xl font-medium transition-all ${
                      currentUser.role === 'teacher'
                        ? 'bg-indigo-600 text-white font-bold shadow-xs'
                        : 'text-slate-600 hover:bg-slate-200/60'
                    }`}
                  >
                    Giáo viên
                  </button>
                </div>

                {/* Profile Pill */}
                <button
                  onClick={onOpenProfile}
                  className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:bg-slate-50 transition-all text-left"
                >
                  <div className="w-8 h-8 rounded-xl overflow-hidden bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-xs">
                    {currentUser.avatarUrl ? (
                      <img src={currentUser.avatarUrl} alt={currentUser.fullName} className="w-full h-full object-cover" />
                    ) : (
                      currentUser.fullName.charAt(0)
                    )}
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-xs font-bold text-slate-800 leading-tight">
                      {currentUser.fullName}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {currentUser.province} • {currentUser.role === 'teacher' ? 'GV Tin học' : 'Học sinh 12'}
                    </div>
                  </div>
                </button>

                <button
                  onClick={logout}
                  title="Đăng xuất"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* Unauthenticated Actions */
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 rounded-xl transition-all shadow-xs"
                >
                  Đăng ký
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-100 overflow-x-auto gap-1">
          {!isAuthenticated ? (
            <>
              <button
                onClick={() => setActiveTab('intro')}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg shrink-0 ${
                  activeTab === 'intro' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600'
                }`}
              >
                Tổng quan
              </button>
              <button
                onClick={() => setActiveTab('exams')}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg shrink-0 ${
                  activeTab === 'exams' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600'
                }`}
              >
                Đề thi
              </button>
              <button
                onClick={() => setActiveTab('theory')}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg shrink-0 ${
                  activeTab === 'theory' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600'
                }`}
              >
                Lý thuyết
              </button>
              <button
                onClick={() => onOpenAuth('login')}
                className="px-2.5 py-1 text-xs font-bold text-amber-600 bg-amber-50 rounded-lg flex items-center gap-1 shrink-0"
              >
                <Lock className="w-3 h-3" /> Đăng nhập
              </button>
            </>
          ) : currentUser?.role === 'student' ? (
            <>
              <button
                onClick={() => setActiveTab('exams')}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg shrink-0 ${
                  activeTab === 'exams' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600'
                }`}
              >
                Đề thi
              </button>
              <button
                onClick={() => setActiveTab('theory')}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg shrink-0 ${
                  activeTab === 'theory' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600'
                }`}
              >
                Lý thuyết
              </button>
              <button
                onClick={() => setActiveTab('notebook')}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg shrink-0 ${
                  activeTab === 'notebook' ? 'bg-amber-50 text-amber-700 font-bold' : 'text-slate-600'
                }`}
              >
                Sổ tay ({userBookmarksCount})
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg shrink-0 ${
                  activeTab === 'analytics' ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-600'
                }`}
              >
                Phân tích
              </button>
              <button
                onClick={() => setActiveTab('intro')}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg shrink-0 ${
                  activeTab === 'intro' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600'
                }`}
              >
                Quy chế
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveTab('teacher')}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg shrink-0 ${
                  activeTab === 'teacher' ? 'bg-indigo-700 text-white font-bold' : 'text-indigo-700'
                }`}
              >
                Biên soạn
              </button>
              <button
                onClick={() => setActiveTab('exams')}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg shrink-0 ${
                  activeTab === 'exams' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600'
                }`}
              >
                Đề thi
              </button>
              <button
                onClick={() => setActiveTab('theory')}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg shrink-0 ${
                  activeTab === 'theory' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600'
                }`}
              >
                Lý thuyết
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg shrink-0 ${
                  activeTab === 'analytics' ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-600'
                }`}
              >
                Thống kê
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
