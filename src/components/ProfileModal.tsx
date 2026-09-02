import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useExam } from '../context/ExamContext';
import { VIETNAM_PROVINCES } from '../data/provinces';
import { Gender } from '../types';
import { X, User, Mail, Phone, Calendar, MapPin, Award, CheckCircle, GraduationCap, ShieldCheck, History, BookMarked } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, updateProfile } = useAuth();
  const { examResults, bookmarks } = useExam();

  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [birthDate, setBirthDate] = useState(currentUser?.birthDate || '2007-01-01');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [gender, setGender] = useState<Gender>(currentUser?.gender || 'Nam');
  const [province, setProvince] = useState(currentUser?.province || 'Hà Nội');
  const [targetScore, setTargetScore] = useState(currentUser?.targetScore || 9.0);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen || !currentUser) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      fullName,
      birthDate,
      email,
      phone,
      gender,
      province,
      targetScore: currentUser.role === 'student' ? targetScore : undefined
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const userResults = examResults.filter(r => r.userId === currentUser.id);
  const avgScore = userResults.length > 0
    ? (userResults.reduce((acc, r) => acc + r.score, 0) / userResults.length).toFixed(2)
    : 'Chưa có';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-16 h-16 rounded-2xl border-2 border-white/30 overflow-hidden bg-sky-500 flex items-center justify-center shadow-lg">
              {currentUser.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt={currentUser.fullName} className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-white" />
              )}
            </div>
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl font-bold">{currentUser.fullName}</h2>
                <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                  currentUser.role === 'teacher' ? 'bg-purple-500/30 text-purple-200 border border-purple-400/30' : 'bg-white/20 text-sky-100 border border-white/30'
                }`}>
                  {currentUser.role === 'teacher' ? 'Giáo viên Tin học' : 'Thí sinh luyện thi'}
                </span>
              </div>
              <p className="text-sky-100 text-xs mt-1">
                Tên đăng nhập: <span className="font-mono font-semibold text-white">@{currentUser.username}</span> | Tham gia: {currentUser.createdAt}
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-white/20">
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-2.5 text-center border border-white/10">
              <div className="flex items-center justify-center gap-1.5 text-sky-100 text-xs mb-0.5">
                <History className="w-3.5 h-3.5" />
                <span>Số bài đã thi</span>
              </div>
              <div className="text-lg font-bold text-white">{userResults.length}</div>
            </div>
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-2.5 text-center border border-white/10">
              <div className="flex items-center justify-center gap-1.5 text-sky-100 text-xs mb-0.5">
                <Award className="w-3.5 h-3.5" />
                <span>Điểm TB</span>
              </div>
              <div className="text-lg font-bold text-amber-300">{avgScore}</div>
            </div>
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-2.5 text-center border border-white/10">
              <div className="flex items-center justify-center gap-1.5 text-sky-100 text-xs mb-0.5">
                <BookMarked className="w-3.5 h-3.5" />
                <span>Câu lưu sổ tay</span>
              </div>
              <div className="text-lg font-bold text-emerald-300">
                {bookmarks.filter(b => b.userId === currentUser.id).length}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {isSaved && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-2xl flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Cập nhật thông tin hồ sơ thành công!</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Họ và tên</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Ngày sinh</label>
              <input
                type="date"
                required
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Số điện thoại</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Giới tính</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-hidden bg-white"
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Tỉnh / Thành phố</label>
              <select
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-hidden bg-white"
              >
                {VIETNAM_PROVINCES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          {currentUser.role === 'student' && (
            <div className="p-3.5 bg-sky-50/70 border border-sky-100 rounded-2xl">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-semibold text-sky-900">Mục tiêu điểm thi tốt nghiệp THPT:</span>
                <span className="text-sm font-bold text-sky-700">{targetScore} / 10.0</span>
              </div>
              <input
                type="range"
                min="5"
                max="10"
                step="0.25"
                value={targetScore}
                onChange={(e) => setTargetScore(parseFloat(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer"
              />
            </div>
          )}

          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 border border-slate-200 text-slate-700 text-xs font-medium rounded-xl hover:bg-slate-50 transition-colors"
            >
              Đóng
            </button>
            <button
              type="submit"
              className="py-2 px-5 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white text-xs font-medium rounded-xl transition-colors shadow-xs"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
