import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Eye, EyeOff, AlertCircle, CheckCircle, Copy, Users } from 'lucide-react';
import { useAuth, demoAccounts } from '../contexts/AuthContext';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDemoAccounts, setShowDemoAccounts] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const success = login(username, password);

    if (success) {
      navigate('/dashboard');
    } else {
      setError('Tên đăng nhập hoặc mật khẩu không đúng');
      setLoading(false);
    }
  };

  const handleDemoLogin = (account: typeof demoAccounts[0]) => {
    setUsername(account.username);
    setPassword(account.password);
    setError('');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E6BB8] via-[#1a5d9e] to-[#155a9e] flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, white 2%, transparent 0%), 
                           radial-gradient(circle at 75px 75px, white 2%, transparent 0%)`,
          backgroundSize: '100px 100px'
        }}></div>
      </div>

      <div className="relative w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:block text-white">
          <div className="space-y-8">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-2xl">
                <span className="text-3xl font-bold bg-gradient-to-br from-[#1E6BB8] to-[#F7931E] bg-clip-text text-transparent">
                  BB
                </span>
              </div>
              <div>
                <h1 className="text-4xl font-bold">BLUEBOLT</h1>
                <p className="text-blue-200 text-sm">Financial Management System</p>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-6 mt-12">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Quản lý Thu Chi</h3>
                  <p className="text-blue-100">Theo dõi dòng tiền theo từng Business Unit một cách chi tiết và chính xác</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Phân quyền linh hoạt</h3>
                  <p className="text-blue-100">CEO/Admin xem toàn bộ, Trưởng BU chỉ xem đơn vị của mình</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Báo cáo Dashboard</h3>
                  <p className="text-blue-100">Biểu đồ trực quan, KPI realtime, xuất báo cáo đầy đủ</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-[#1E6BB8] to-[#155a9e] px-8 py-6 text-white">
            <h2 className="text-2xl font-bold mb-2">Đăng nhập hệ thống</h2>
            <p className="text-blue-100 text-sm">Nhập thông tin đăng nhập để tiếp tục</p>
          </div>

          {/* Login Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* Username */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tên đăng nhập (Email)
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="example@bluebolt.vn"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E6BB8] focus:border-transparent pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-[#1E6BB8] border-gray-300 rounded focus:ring-[#1E6BB8]" />
                  <span className="text-sm text-gray-600">Ghi nhớ đăng nhập</span>
                </label>
                <button type="button" className="text-sm text-[#1E6BB8] hover:underline font-medium">
                  Quên mật khẩu?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#1E6BB8] to-[#155a9e] text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang đăng nhập...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>Đăng nhập</span>
                  </>
                )}
              </button>
            </form>

            {/* Demo Accounts Toggle */}
            <div className="mt-6">
              <button
                onClick={() => setShowDemoAccounts(!showDemoAccounts)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#1E6BB8] hover:bg-blue-50 transition-all text-gray-600 hover:text-[#1E6BB8] font-medium"
              >
                <Users className="w-5 h-5" />
                <span>{showDemoAccounts ? 'Ẩn' : 'Hiện'} tài khoản demo</span>
              </button>
            </div>

            {/* Demo Accounts List */}
            {showDemoAccounts && (
              <div className="mt-6 border-t pt-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Tài khoản Demo (Click để điền)
                </h3>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {demoAccounts.map((account, index) => (
                    <div
                      key={index}
                      onClick={() => handleDemoLogin(account)}
                      className="group bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-[#1E6BB8] rounded-lg p-3 cursor-pointer transition-all"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                              account.user.role === 'CEO' ? 'bg-red-500' :
                              account.user.role === 'Admin' ? 'bg-blue-500' :
                              account.user.role === 'Trưởng BU' ? 'bg-orange-500' :
                              'bg-gray-500'
                            }`}>
                              {account.user.name.split(' ').slice(-1)[0].charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm text-gray-900 truncate">
                                {account.user.name}
                              </p>
                              <p className="text-xs text-gray-500">{account.user.role}</p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">{account.description}</p>
                          <div className="flex items-center gap-2 text-xs">
                            <code className="bg-white px-2 py-1 rounded border border-gray-200 font-mono text-gray-700">
                              {account.username}
                            </code>
                            <span className="text-gray-400">•</span>
                            <code className="bg-white px-2 py-1 rounded border border-gray-200 font-mono text-gray-700">
                              {account.password}
                            </code>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(`${account.username}\n${account.password}`);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white rounded transition-all"
                          title="Copy thông tin"
                        >
                          <Copy className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              © 2026 BLUEBOLT Corporation. Mọi quyền được bảo lưu.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
