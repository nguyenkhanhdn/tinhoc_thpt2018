import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TheoryProvider, useTheory } from './context/TheoryContext';
import { ExamProvider, useExam } from './context/ExamContext';
import { Navbar, NavTab } from './components/Navbar';
import { LandingPortal } from './components/LandingPortal';
import { ExamList } from './components/ExamList';
import { ExamTakingView } from './components/ExamTakingView';
import { ExamResultView } from './components/ExamResultView';
import { TheoryHub } from './components/TheoryHub';
import { QuestionNotebookView } from './components/QuestionNotebookView';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { TeacherStudio } from './components/TeacherStudio';
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';
import { QuickTheoryModal } from './components/QuickTheoryModal';
import { ShieldAlert, LogIn, Sparkles } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { currentUser, isAuthenticated, switchDemoRole } = useAuth();
  const { isExamRunning, currentResult, setCurrentResult, resetExamState } = useExam();
  const { quickTheoryModalId, setQuickTheoryModalId } = useTheory();

  const [activeTab, setActiveTab] = useState<NavTab>(() => {
    return isAuthenticated ? (currentUser?.role === 'teacher' ? 'teacher' : 'exams') : 'intro';
  });
  
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Sync default tab on login/logout state change
  useEffect(() => {
    if (!isAuthenticated) {
      if (activeTab === 'notebook' || activeTab === 'analytics' || activeTab === 'teacher') {
        setActiveTab('intro');
      }
    } else {
      if (activeTab === 'intro') {
        setActiveTab(currentUser?.role === 'teacher' ? 'teacher' : 'exams');
      } else if (currentUser?.role === 'student' && activeTab === 'teacher') {
        setActiveTab('exams');
      }
    }
  }, [isAuthenticated, currentUser?.role]);

  // Lesson ID for deep link to full theory view
  const [selectedTheoryLessonId, setSelectedTheoryLessonId] = useState<string | null>(null);

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleOpenQuickTheory = (lessonId: string) => {
    setQuickTheoryModalId(lessonId);
  };

  const handleOpenFullTheory = (lessonId: string) => {
    setSelectedTheoryLessonId(lessonId);
    setActiveTab('theory');
  };

  // If student is currently taking an exam in real-time
  if (isExamRunning) {
    return (
      <div className="min-h-screen bg-slate-100 font-sans text-slate-900">
        <ExamTakingView onOpenQuickTheory={handleOpenQuickTheory} />
        
        {/* Quick Theory reference Drawer/Modal during exam */}
        <QuickTheoryModal
          lessonId={quickTheoryModalId}
          onClose={() => setQuickTheoryModalId(null)}
          onOpenFullTheory={handleOpenFullTheory}
        />
      </div>
    );
  }

  // If exam has just been completed / viewing results
  if (currentResult) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
        <Navbar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            resetExamState();
            setActiveTab(tab);
          }}
          onOpenAuth={handleOpenAuth}
          onOpenProfile={() => setProfileModalOpen(true)}
        />

        <main className="flex-1">
          <ExamResultView
            onOpenQuickTheory={handleOpenQuickTheory}
            onGoToNotebook={() => {
              resetExamState();
              setActiveTab('notebook');
            }}
            onGoToExams={() => {
              resetExamState();
              setActiveTab('exams');
            }}
          />
        </main>

        <QuickTheoryModal
          lessonId={quickTheoryModalId}
          onClose={() => setQuickTheoryModalId(null)}
          onOpenFullTheory={handleOpenFullTheory}
        />

        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          initialMode={authModalMode}
        />

        <ProfileModal
          isOpen={profileModalOpen}
          onClose={() => setProfileModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {/* Primary Sticky Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={handleOpenAuth}
        onOpenProfile={() => setProfileModalOpen(true)}
      />

      {/* Main Tab Router */}
      <main className="flex-1">
        
        {/* Introduction / Portal View */}
        {activeTab === 'intro' && (
          <LandingPortal
            onOpenAuth={handleOpenAuth}
            onExploreExams={() => setActiveTab('exams')}
            onExploreTheory={() => setActiveTab('theory')}
          />
        )}

        {/* Exams View */}
        {activeTab === 'exams' && (
          <ExamList 
            onOpenQuickTheory={handleOpenQuickTheory} 
            onOpenAuth={handleOpenAuth}
          />
        )}

        {/* Theory Hub View */}
        {activeTab === 'theory' && (
          <TheoryHub
            initialLessonId={selectedTheoryLessonId}
            onStartLessonPractice={(topicId) => {
              setActiveTab('exams');
            }}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {/* Notebook View - Restricted for Authenticated Users */}
        {activeTab === 'notebook' && (
          isAuthenticated ? (
            <QuestionNotebookView onOpenQuickTheory={handleOpenQuickTheory} />
          ) : (
            <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 text-center shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Yêu cầu đăng nhập</h2>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Tính năng Sổ tay câu hỏi và lưu trữ câu sai yêu cầu tài khoản học sinh để đồng bộ hóa dữ liệu cá nhân.
              </p>
              <button
                onClick={() => handleOpenAuth('login')}
                className="mt-6 w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Đăng nhập ngay</span>
              </button>
            </div>
          )
        )}

        {/* Analytics View - Restricted for Authenticated Users */}
        {activeTab === 'analytics' && (
          isAuthenticated ? (
            <AnalyticsDashboard
              onOpenQuickTheory={handleOpenQuickTheory}
              onGoToExams={() => setActiveTab('exams')}
              onViewResult={(resultId) => {
                // Current result handled in context
              }}
            />
          ) : (
            <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 text-center shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Yêu cầu đăng nhập</h2>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Biểu đồ ma trận năng lực và lịch sử điểm số yêu cầu tài khoản để theo dõi lộ trình ôn luyện.
              </p>
              <button
                onClick={() => handleOpenAuth('login')}
                className="mt-6 w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Đăng nhập ngay</span>
              </button>
            </div>
          )
        )}

        {/* Teacher Studio View - Role restricted for Teacher */}
        {activeTab === 'teacher' && (
          isAuthenticated ? (
            currentUser?.role === 'teacher' ? (
              <TeacherStudio />
            ) : (
              <div className="max-w-lg mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 text-center shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Khu vực dành cho giáo viên</h2>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Tài khoản hiện tại của bạn có vai trò <strong>Học sinh</strong>. Để trải nghiệm tính năng biên soạn đề thi, xuất đề PDF và quản trị ngân hàng câu hỏi, bạn có thể chuyển đổi vai trò sang Giáo viên.
                </p>
                <button
                  onClick={() => switchDemoRole('teacher')}
                  className="mt-6 w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Chuyển sang vai trò Giáo viên để tiếp tục</span>
                </button>
              </div>
            )
          ) : (
            <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 text-center shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-4">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Khu vực dành cho giáo viên</h2>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Vui lòng đăng nhập với tài khoản Giáo viên để truy cập công cụ biên soạn bài giảng và quản trị ma trận đề thi.
              </p>
              <button
                onClick={() => handleOpenAuth('login')}
                className="mt-6 w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Đăng nhập giáo viên</span>
              </button>
            </div>
          )
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Tin học THPT</span>
            <span>• Hệ thống ôn thi tốt nghiệp THPT môn Tin học</span>
          </div>
          <div>
            Bám sát chương trình GDPT 2018 & cấu trúc định dạng đề thi của Bộ Giáo dục và Đào tạo
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      <QuickTheoryModal
        lessonId={quickTheoryModalId}
        onClose={() => setQuickTheoryModalId(null)}
        onOpenFullTheory={handleOpenFullTheory}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
      />

      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <TheoryProvider>
        <ExamProvider>
          <MainAppContent />
        </ExamProvider>
      </TheoryProvider>
    </AuthProvider>
  );
}

export default App;
