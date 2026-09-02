import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { VIETNAM_PROVINCES } from '../data/provinces';
import { UserRole, Gender } from '../types';
import { X, User, Lock, Mail, Phone, Calendar, MapPin, CheckCircle, GraduationCap, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('2007-01-01');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState<Gender>('Nam');
  const [province, setProvince] = useState('Hà Nội');
  const [role, setRole] = useState<UserRole>('student');
  const [targetScore, setTargetScore] = useState<number>(9.0);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const res = await login(username, password);
    setIsLoading(false);

    if (res.success) {
      onClose();
    } else {
      setError(res.message || 'Đăng nhập thất bại.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !fullName.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      setError('Vui lòng điền đầy đủ tất cả các thông tin bắt buộc.');
      return;
    }

    setIsLoading(true);
    const res = await register({
      username: username.trim(),
      fullName: fullName.trim(),
      birthDate,
      email: email.trim(),
      phone: phone.trim(),
      gender,
      province,
      password,
      role,
      targetScore: role === 'student' ? targetScore : undefined,
      track: 'BOTH',
      avatarUrl: gender === 'Nữ'
        ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    });

    setIsLoading(false);
    if (res.success) {
      onClose();
    } else {
      setError(res.message || 'Đăng ký không thành công.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-md">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {mode === 'login' ? 'Đăng nhập tài khoản' : 'Đăng ký thành viên mới'}
              </h2>
              <p className="text-sky-100 text-xs mt-0.5">
                Hệ thống ôn thi tốt nghiệp THPT môn Tin học
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex gap-2 mt-4 bg-black/15 p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(null); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                mode === 'login' ? 'bg-white text-blue-900 shadow-xs' : 'text-blue-100 hover:text-white'
              }`}
            >
              Đăng nhập
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(null); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                mode === 'register' ? 'bg-white text-blue-900 shadow-xs' : 'text-blue-100 hover:text-white'
              }`}
            >
              Đăng ký tài khoản
            </button>
          </div>
        </div>

        {/* Content Form */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
              <span className="font-semibold">Lỗi:</span>
              <span>{error}</span>
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Tên đăng nhập</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="ví dụ: hocsinh12 hoặc giaovien_tin"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Mật khẩu</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu..."
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-medium text-sm rounded-xl transition-colors shadow-sm disabled:opacity-50"
                >
                  {isLoading ? 'Đang xác thực...' : 'Đăng nhập ngay'}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3.5">
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Vai trò tài khoản:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`py-2 px-3 text-xs font-medium rounded-xl border flex items-center justify-center gap-2 transition-all ${
                      role === 'student'
                        ? 'border-sky-600 bg-sky-50/70 text-sky-700 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    Học sinh luyện thi
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('teacher')}
                    className={`py-2 px-3 text-xs font-medium rounded-xl border flex items-center justify-center gap-2 transition-all ${
                      role === 'teacher'
                        ? 'border-purple-600 bg-purple-50/70 text-purple-700 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Giáo viên biên soạn
                  </button>
                </div>
              </div>

              {/* Username & FullName */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Tên đăng nhập <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="ví dụ: quannm12a"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nguyễn Minh Quân"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>
              </div>

              {/* Birth Date & Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Ngày sinh <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="date"
                      required
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Giới tính <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as Gender)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden bg-white"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0912345678"
                      className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Province & Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Tỉnh / Thành phố <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <select
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden bg-white"
                    >
                      {VIETNAM_PROVINCES.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Mật khẩu <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Tối thiểu 6 ký tự..."
                      className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {role === 'student' && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Mục tiêu điểm số môn Tin học (0 - 10.0): <span className="font-bold text-blue-600">{targetScore}</span>
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="10"
                    step="0.5"
                    value={targetScore}
                    onChange={(e) => setTargetScore(parseFloat(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>
              )}

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-medium text-sm rounded-xl transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  {isLoading ? 'Đang tạo tài khoản...' : 'Hoàn tất đăng ký'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
