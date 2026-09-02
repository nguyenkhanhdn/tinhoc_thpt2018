import React, { useState } from 'react';
import { useExam } from '../context/ExamContext';
import { useTheory } from '../context/TheoryContext';
import { 
  GraduationCap, 
  Sparkles, 
  CheckCircle2, 
  FileText, 
  BookOpen, 
  Bookmark, 
  BarChart3, 
  Cpu, 
  Layers, 
  ShieldCheck, 
  HelpCircle, 
  Lock, 
  LogIn, 
  UserPlus, 
  ArrowRight, 
  Clock, 
  Award, 
  ListChecks, 
  Target, 
  Compass, 
  Lightbulb, 
  Users, 
  Check, 
  Zap,
  Code2,
  ChevronRight
} from 'lucide-react';

interface LandingPortalProps {
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onExploreExams: () => void;
  onExploreTheory: () => void;
}

export const LandingPortal: React.FC<LandingPortalProps> = ({
  onOpenAuth,
  onExploreExams,
  onExploreTheory
}) => {
  const { exams } = useExam();
  const { topics, lessons } = useTheory();

  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  return (
    <div className="space-y-12 pb-16">
      
      {/* 1. Hero Introduction Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-900 via-indigo-800 to-slate-900 text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          
          {/* Guest Status Badge */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20">
            <div className="flex items-center gap-2 text-xs font-medium text-amber-300">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Chế độ xem trước (Chưa đăng nhập)</span>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <span className="text-slate-200 hidden sm:inline">Vui lòng đăng nhập để bắt đầu làm bài và lưu kết quả</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="text-xs font-bold text-white bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Đăng nhập</span>
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="text-xs font-bold text-indigo-900 bg-amber-300 hover:bg-amber-200 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Đăng ký miễn phí</span>
              </button>
            </div>
          </div>

          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/30 border border-indigo-400/40 rounded-full text-xs font-bold text-sky-200 mb-4 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Chương trình giáo dục phổ thông 2018 • Bộ Giáo dục và Đào tạo</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white">
              Hệ thống ôn thi tốt nghiệp THPT môn Tin học
            </h1>
            
            <p className="mt-4 text-sm sm:text-base text-indigo-100 font-normal leading-relaxed">
              Nền tảng khảo sát chất lượng, luyện thi chuẩn cấu trúc định dạng đề thi mới nhất từ Bộ GD&ĐT. Tích hợp ngân hàng câu hỏi bẫy, thư viện lý thuyết sơ đồ và phân tích năng lực thông minh.
            </p>

            {/* Primary Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => onOpenAuth('login')}
                className="flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>Đăng nhập để vào làm bài thi</span>
              </button>

              <button
                onClick={onExploreExams}
                className="flex items-center justify-center gap-2 py-3 px-5 bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm rounded-2xl border border-white/25 backdrop-blur-sm transition-all"
              >
                <FileText className="w-4 h-4 text-sky-300" />
                <span>Xem danh sách đề thi ({exams.length})</span>
              </button>

              <button
                onClick={onExploreTheory}
                className="flex items-center justify-center gap-2 py-3 px-5 bg-white/10 hover:bg-white/20 text-indigo-100 font-semibold text-xs sm:text-sm rounded-2xl border border-white/15 backdrop-blur-sm transition-all"
              >
                <BookOpen className="w-4 h-4 text-indigo-300" />
                <span>Xem lý thuyết trọng tâm</span>
              </button>
            </div>

            {/* Stats Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 text-left">
                <div className="text-[11px] text-indigo-200">Thời gian thi chuẩn</div>
                <div className="text-xl font-black text-white mt-0.5">50 phút</div>
                <div className="text-[10px] text-indigo-300 mt-0.5">Đồng hồ đếm ngược</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 text-left">
                <div className="text-[11px] text-indigo-200">Quy mô đề thi</div>
                <div className="text-xl font-black text-amber-300 mt-0.5">28 câu / 10đ</div>
                <div className="text-[10px] text-indigo-300 mt-0.5">Phần I (24c) + Phần II (4c)</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 text-left">
                <div className="text-[11px] text-indigo-200">Phân luồng định hướng</div>
                <div className="text-xl font-black text-sky-300 mt-0.5">ICT & CS</div>
                <div className="text-[10px] text-indigo-300 mt-0.5">Ứng dụng & Khoa học máy tính</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 text-left">
                <div className="text-[11px] text-indigo-200">Ngân hàng câu hỏi</div>
                <div className="text-xl font-black text-emerald-300 mt-0.5">500+ câu</div>
                <div className="text-[10px] text-indigo-300 mt-0.5">Có giải thích chi tiết</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Cấu trúc & Quy chế kỳ thi tốt nghiệp THPT 2025 môn Tin học */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full border border-indigo-200 mb-2">
            <Compass className="w-3.5 h-3.5 text-indigo-600" />
            <span>Quy chế thi tốt nghiệp THPT 2025</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Cấu trúc định dạng đề thi mới của Bộ GD&ĐT
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Tìm hiểu chi tiết các dạng thức câu hỏi, phương pháp tính điểm và phân bố nội dung kiến thức trong đề thi tốt nghiệp THPT 2025 môn Tin học.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card Phần I */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:border-indigo-200 transition-all">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center font-black text-lg">
                I
              </div>
              <span className="px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-xs font-bold">
                6,0 điểm (60%)
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              Phần I: Câu trắc nghiệm nhiều lựa chọn
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Gồm <strong>24 câu hỏi</strong> (từ câu 1 đến câu 24). Mỗi câu hỏi có 4 phương án A, B, C, D và thí sinh chỉ chọn duy nhất 1 phương án đúng.
            </p>

            <div className="mt-4 space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs">
              <div className="flex items-center justify-between text-slate-700">
                <span>Số lượng câu hỏi:</span>
                <strong className="text-slate-900">24 câu</strong>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span>Điểm mỗi câu đúng:</span>
                <strong className="text-indigo-600 font-bold">0,25 điểm</strong>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span>Cấp độ tư duy:</span>
                <span className="text-slate-700">Nhận biết & Thông hiểu</span>
              </div>
            </div>
          </div>

          {/* Card Phần II */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:border-indigo-200 transition-all">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-black text-lg">
                II
              </div>
              <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold">
                4,0 điểm (40%)
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              Phần II: Câu trắc nghiệm Đúng/Sai đa ý
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Gồm <strong>4 câu hỏi</strong> (từ câu 1 đến câu 4). Mỗi câu có một ngữ cảnh/đoạn mã chung kèm theo <strong>4 ý a, b, c, d</strong> để thí sinh chọn Đúng hoặc Sai.
            </p>

            <div className="mt-4 space-y-2 bg-amber-50/60 p-3.5 rounded-2xl border border-amber-100 text-xs">
              <div className="font-bold text-amber-900 mb-1">Cách tính điểm lũy tiến từng câu (tối đa 1.0đ/câu):</div>
              <div className="grid grid-cols-2 gap-2 text-slate-700">
                <div className="flex justify-between bg-white p-2 rounded-xl border border-amber-200/60">
                  <span>Đúng 1 ý:</span>
                  <strong className="text-indigo-700">0,10 điểm</strong>
                </div>
                <div className="flex justify-between bg-white p-2 rounded-xl border border-amber-200/60">
                  <span>Đúng 2 ý:</span>
                  <strong className="text-indigo-700">0,25 điểm</strong>
                </div>
                <div className="flex justify-between bg-white p-2 rounded-xl border border-amber-200/60">
                  <span>Đúng 3 ý:</span>
                  <strong className="text-indigo-700">0,50 điểm</strong>
                </div>
                <div className="flex justify-between bg-white p-2 rounded-xl border border-amber-200/60">
                  <span>Đúng 4 ý:</span>
                  <strong className="text-emerald-700">1,00 điểm</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 6 Chủ đề kiến thức GDPT 2018 */}
        <div className="mt-8 bg-slate-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Layers className="w-5 h-5 text-sky-400" />
              <span>Phân bổ 6 chủ đề kiến thức môn Tin học THPT</span>
            </h3>
            <p className="text-xs text-slate-300 max-w-3xl mb-6">
              Nội dung thi bao quát toàn bộ chương trình lớp 10, 11 và trọng tâm lớp 12, phân tách rõ ràng giữa kiến thức cốt lõi và 2 định hướng tự chọn.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
                <div className="text-xs font-bold text-sky-300">Chủ đề A • Cốt lõi</div>
                <div className="text-sm font-bold text-white mt-1">Máy tính và xã hội tri thức</div>
                <p className="text-xs text-slate-300 mt-1">Lịch sử máy tính, trí tuệ nhân tạo (AI), hệ điều hành và phần cứng.</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
                <div className="text-xs font-bold text-sky-300">Chủ đề B • Cốt lõi</div>
                <div className="text-sm font-bold text-white mt-1">Mạng máy tính & Internet</div>
                <p className="text-xs text-slate-300 mt-1">Giao thức TCP/IP, thiết bị mạng, điện toán đám mây, an toàn kết nối.</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
                <div className="text-xs font-bold text-sky-300">Chủ đề D • Cốt lõi</div>
                <div className="text-sm font-bold text-white mt-1">Đạo đức, pháp luật & Văn hóa số</div>
                <p className="text-xs text-slate-300 mt-1">Bản quyền phần mềm, an toàn thông tin cá nhân, luật an ninh mạng.</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
                <div className="text-xs font-bold text-emerald-300">Định hướng ICT</div>
                <div className="text-sm font-bold text-white mt-1">Tin học ứng dụng</div>
                <p className="text-xs text-slate-300 mt-1">Đồ họa số, biên tập video, HTML/CSS, phần mềm văn phòng nâng cao.</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
                <div className="text-xs font-bold text-purple-300">Định hướng CS</div>
                <div className="text-sm font-bold text-white mt-1">Khoa học máy tính</div>
                <p className="text-xs text-slate-300 mt-1">Lập trình Python nâng cao, giải thuật đệ quy/sắp xếp, CSDL quan hệ & SQL.</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
                <div className="text-xs font-bold text-amber-300">Chủ đề F • Cốt lõi</div>
                <div className="text-sm font-bold text-white mt-1">Hướng nghiệp với Tin học</div>
                <p className="text-xs text-slate-300 mt-1">Các nhóm nghề nghiệp CNTT, vai trò của chuyển đổi số và kỹ năng tương lai.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Giới thiệu các tính năng độc quyền của hệ thống */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 text-sky-700 text-xs font-bold rounded-full border border-sky-200 mb-2">
            <Zap className="w-3.5 h-3.5 text-sky-600" />
            <span>Hệ sinh thái ôn luyện thông minh</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Các tính năng nổi bật của hệ thống
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Được thiết kế chuyên biệt để giúp học sinh bứt phá điểm 9+ và hỗ trợ giáo viên tối ưu hóa công tác kiểm tra đánh giá.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Feature 1 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Phòng thi trực tuyến bấm giờ chuẩn 50 phút
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Mô phỏng chân thực phòng thi tốt nghiệp THPT, tự động phân nhóm câu hỏi, lưu bài liên tục chống mất dữ liệu, đồng hồ đếm ngược và tự động thu bài khi hết giờ.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1 text-indigo-600 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Chấm điểm tự động
              </span>
              <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded-md">Cần đăng nhập</span>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Thư viện tóm tắt lý thuyết & Sơ đồ tư duy
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Hệ thống hóa toàn bộ bài học với sơ đồ cô đọng, mục "Ghi nhớ nhanh" và đặc biệt là danh sách "Cạm bẫy hay gặp" giúp học sinh tránh mất điểm oan.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1 text-sky-600 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Mở xem nhanh khi thi
              </span>
              <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded-md">Cần đăng nhập</span>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mb-4">
                <Bookmark className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Sổ tay câu hỏi & Tự động lưu câu sai
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Tự động thu thập mọi câu hỏi bạn làm sai trong các lần thi thử, cho phép gắn cờ câu bẫy, viết ghi chú cá nhân và tạo đề luyện lại riêng các câu sai.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1 text-amber-600 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Cá nhân hóa 100%
              </span>
              <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded-md">Cần đăng nhập</span>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Chẩn đoán năng lực & Radar điểm mạnh/yếu
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Biểu đồ ma trận phân tích tỷ lệ đúng theo từng chuyên đề (Python, SQL, Mạng, An ninh số...), đưa ra cảnh báo lỗ hổng kiến thức và dự báo điểm thi thực tế.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Báo cáo trực quan
              </span>
              <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded-md">Cần đăng nhập</span>
            </div>
          </div>

          {/* Feature 5 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Góc giáo viên: Soạn đề thi & Ngân hàng ma trận
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Công cụ biên soạn chuyên biệt cho thầy cô: Tạo đề thi mới, xuất đề thi PDF/Word có đáp án, quản lý ngân hàng câu hỏi Đúng/Sai và thống kê kết quả học sinh.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1 text-purple-600 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Dành cho Giáo viên
              </span>
              <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded-md">Quyền Giáo viên</span>
            </div>
          </div>

          {/* Feature 6 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Bảng vinh danh & Thi đua top điểm cao
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Bảng xếp hạng thành tích học sinh toàn quốc theo điểm số, thời gian nộp bài và số lượng bài thi hoàn thành. Kích thích động lực học tập mỗi ngày.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1 text-rose-600 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Xếp hạng thời gian thực
              </span>
              <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded-md">Cần đăng nhập</span>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Khu vực xem trước đề thi mẫu (Trạng thái Chưa kích hoạt / Locked Preview) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-100/80 border border-slate-200 rounded-3xl p-6 sm:p-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-slate-900">
                  Xem trước kho đề thi chuẩn cấu trúc
                </h3>
                <span className="px-2.5 py-0.5 text-[11px] font-bold bg-amber-100 text-amber-800 rounded-full border border-amber-200">
                  Khóa tương tác
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Đăng nhập tài khoản để kích hoạt đồng hồ bấm giờ và bắt đầu làm bài thi.
              </p>
            </div>

            <button
              onClick={() => onOpenAuth('login')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 self-start sm:self-auto"
            >
              <LogIn className="w-4 h-4" />
              <span>Đăng nhập để mở khóa</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {exams.slice(0, 3).map((exam) => (
              <div 
                key={exam.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs relative overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 text-[10px] font-bold bg-indigo-50 text-indigo-700 rounded-lg">
                      {exam.targetTrack === 'ALL' ? 'Chung (ICT + CS)' : exam.targetTrack}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-500">
                      <Clock className="w-3.5 h-3.5" /> {exam.timeMinutes} phút
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 line-clamp-2">
                    {exam.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">
                    {exam.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                    <span>Số câu: <strong>{exam.questionCount} câu</strong></span>
                    <span>Thang điểm: <strong className="text-indigo-600">10,0đ</strong></span>
                  </div>

                  {/* Disabled Action Button with Login Trigger */}
                  <button
                    onClick={() => onOpenAuth('login')}
                    className="w-full py-2 px-3 bg-slate-100 hover:bg-indigo-50 text-slate-500 hover:text-indigo-700 font-bold text-xs rounded-xl border border-dashed border-slate-300 hover:border-indigo-300 transition-all flex items-center justify-center gap-2"
                  >
                    <Lock className="w-3.5 h-3.5 text-amber-500" />
                    <span>Đăng nhập để làm bài</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={onExploreExams}
              className="text-xs font-bold text-indigo-700 hover:text-indigo-800 inline-flex items-center gap-1"
            >
              <span>Xem toàn bộ danh sách {exams.length} đề thi trong kho</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* 5. Khối FAQ / Hướng dẫn đạt điểm cao môn Tin học */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 text-xs font-bold rounded-full border border-amber-200 mb-2">
            <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
            <span>Kinh nghiệm & Chiến thuật làm bài</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Những điều cần biết về kỳ thi môn Tin học
          </h2>
        </div>

        <div className="space-y-3">
          {[
            {
              q: '1. Chiến thuật phân bổ thời gian 50 phút như thế nào là tối ưu nhất?',
              a: 'Gợi ý phân bổ chuẩn: 18–20 phút cho Phần I (24 câu trắc nghiệm đơn, tương đương ~45s/câu); 25 phút cho Phần II (4 câu Đúng/Sai đa ý, đọc kỹ từng đoạn mã Python/SQL/ngữ cảnh); 5 phút cuối để rà soát lại toàn bộ phiếu trả lời, đảm bảo không bỏ sót ý nào.'
            },
            {
              q: '2. Phần II Đúng/Sai có những lưu ý gì về cách chấm điểm?',
              a: 'Phần II áp dụng cách tính điểm lũy tiến cho mỗi câu: Đúng 1 ý được 0.1đ; đúng 2 ý được 0.25đ; đúng 3 ý được 0.5đ; đúng cả 4 ý được trọn vẹn 1.0đ. Vì vậy, việc suy luận cẩn thận để đúng từ 3 đến 4 ý sẽ mang lại lợi thế điểm số vượt trội.'
            },
            {
              q: '3. Sự khác nhau giữa 2 định hướng Tin học ứng dụng (ICT) và Khoa học máy tính (CS)?',
              a: 'Định hướng ICT tập trung vào kỹ năng sử dụng công cụ số, xử lý ảnh/video, thiết kế web HTML/CSS và văn phòng nâng cao. Định hướng CS đào sâu vào tư duy lập trình thuật toán (Python, giải thuật đệ quy, sắp xếp, tìm kiếm) và cơ sở dữ liệu quan hệ SQL.'
            },
            {
              q: '4. Làm thế nào để sử dụng hệ thống này ôn tập hiệu quả nhất?',
              a: 'Bước 1: Làm 1 đề khảo sát ban đầu để hệ thống tự động phân tích Radar năng lực. Bước 2: Vào Thư viện lý thuyết đọc phần "Cạm bẫy hay gặp" ở các chủ đề bị điểm thấp. Bước 3: Mở Sổ tay câu hỏi để luyện lại 100% các câu đã từng làm sai đến khi đạt điểm tuyệt đối.'
            }
          ].map((item, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs transition-all"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-sm text-slate-900 hover:text-indigo-600 transition-colors"
              >
                <span>{item.q}</span>
                <ChevronRight className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${activeFaq === idx ? 'rotate-90 text-indigo-600' : ''}`} />
              </button>

              {activeFaq === idx && (
                <div className="px-4 sm:px-5 pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 6. CTA Bottom Card */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-sky-500 via-indigo-600 to-indigo-700 rounded-3xl p-8 sm:p-10 text-white text-center shadow-lg relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Sẵn sàng bứt phá điểm 9+ môn Tin học?
            </h3>
            <p className="text-xs sm:text-sm text-sky-100 mt-3 leading-relaxed">
              Đăng nhập ngay để kích hoạt đầy đủ bài thi bấm giờ, sổ tay câu hỏi cá nhân và bản đồ chẩn đoán năng lực hoàn toàn miễn phí.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <button
                onClick={() => onOpenAuth('register')}
                className="px-6 py-3 bg-white text-indigo-900 hover:bg-sky-50 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4 text-indigo-600" />
                <span>Đăng ký tài khoản mới</span>
              </button>

              <button
                onClick={() => onOpenAuth('login')}
                className="px-6 py-3 bg-indigo-950/40 hover:bg-indigo-950/60 border border-white/30 text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Đã có tài khoản • Đăng nhập</span>
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
