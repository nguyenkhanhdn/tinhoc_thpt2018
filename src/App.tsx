import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TheoryProvider, useTheory } from './context/TheoryContext';
import { ExamProvider, useExam } from './context/ExamContext';
import { Navbar } from './components/Navbar';
import { ExamList } from './components/ExamList';
import { ExamTakingView } from './components/ExamTakingView';
import { ExamResultView } from './components/ExamResultView';
import { TheoryHub } from './components/TheoryHub';
import { QuestionNotebookView } from './components/QuestionNotebookView';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { LeaderboardView } from './components/LeaderboardView';
import { TeacherStudio } from './components/TeacherStudio';
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';
import { QuickTheoryModal } from './components/QuickTheoryModal';

const MainAppContent: React.FC = () => {
  const { currentUser } = useAuth();
  const { isExamRunning, currentResult, setCurrentResult, resetExamState } = useExam();
  const { quickTheoryModalId, setQuickTheoryModalId } = useTheory();

  const [activeTab, setActiveTab] = useState<'exams' | 'theory' | 'notebook' | 'analytics' | 'leaderboard' | 'teacher'>('exams');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [profileModalOpen, setProfileModalOpen] = useState(false);

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
            onGoToLeaderboard={() => {
              resetExamState();
              setActiveTab('leaderboard');
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
        {activeTab === 'exams' && (
          <ExamList onOpenQuickTheory={handleOpenQuickTheory} />
        )}

        {activeTab === 'theory' && (
          <TheoryHub
            initialLessonId={selectedTheoryLessonId}
            onStartLessonPractice={(topicId) => {
              setActiveTab('exams');
            }}
          />
        )}

        {activeTab === 'notebook' && (
          <QuestionNotebookView onOpenQuickTheory={handleOpenQuickTheory} />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard
            onOpenQuickTheory={handleOpenQuickTheory}
            onGoToExams={() => setActiveTab('exams')}
            onViewResult={(resultId) => {
              // Current result is already set in context
            }}
          />
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardView
            onGoToExams={() => setActiveTab('exams')}
            onOpenQuickTheory={handleOpenQuickTheory}
          />
        )}

        {activeTab === 'teacher' && (
          currentUser?.role === 'teacher' ? (
            <TeacherStudio />
          ) : (
            <div className="max-w-xl mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 shadow-md text-center">
              <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">Quyền truy cập bị giới hạn</h2>
              <p className="text-xs text-slate-600 mb-6 leading-relaxed">
                Chức năng quản lý và biên soạn Ngân hàng đề thi / câu hỏi chỉ dành riêng cho tài khoản có vai trò <strong>Giáo viên</strong>. Tài khoản học sinh không thể truy cập khu vực này.
              </p>
              <button
                onClick={() => setActiveTab('exams')}
                className="px-5 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                Quay lại danh sách đề thi
              </button>
            </div>
          )
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Tin học THPT 2025</span>
            <span>• Hệ thống ôn thi và khảo sát chất lượng tốt nghiệp quốc gia</span>
          </div>
          <div>
            Bám sát chương trình GDPT 2018 và định dạng đề thi Bộ Giáo dục và Đào tạo
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
