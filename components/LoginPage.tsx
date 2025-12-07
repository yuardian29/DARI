
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, User, ArrowRight, GraduationCap } from 'lucide-react';
import { Student } from '../types';
import { useData } from '../contexts/DataContext';

interface LoginPageProps {
  onLogin: (student: Student) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const { students, loading: dataLoading } = useData();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      // Logic: Find student by ID (NIS) from loaded data
      const student = students.find(s => s.id === username);
      
      // Password check: Default '123456' or specific password from sheet/mock
      const validPassword = student?.password || '123456';
      
      if (student && (password === validPassword || password === '123456')) {
        onLogin(student);
      } else {
        setError('Username atau Password salah. (Hint: Cek konstanta atau Google Sheet)');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-8 bg-indigo-50 text-center border-b border-indigo-100">
          <div className="inline-flex items-center justify-center mb-4 w-20 h-20 bg-indigo-100 rounded-full">
            <GraduationCap className="w-10 h-10 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Selamat Datang</h2>
          <p className="text-gray-500 mt-1">Sistem Informasi Akademik SD Mudel</p>
          <p className="text-indigo-600 text-xs font-semibold mt-1">SD Muhammadiyah 8 Kota Malang</p>
        </div>

        <div className="p-8">
          {dataLoading ? (
            <div className="text-center py-4">
               <div className="inline-block w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-2"></div>
               <p className="text-sm text-gray-500">Menghubungkan ke Database...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 text-center">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">NIS (Nomor Induk Siswa)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-900 bg-white placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Contoh: SD001"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-900 bg-white placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Masukkan password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    Masuk Aplikasi <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-8 text-center border-t border-gray-100 pt-6">
            <p className="text-sm text-gray-600 mb-3">Belum punya akun siswa?</p>
            <Link 
              to="/register" 
              className="inline-flex items-center justify-center text-sm font-semibold text-indigo-600 hover:text-indigo-500 hover:underline"
            >
              Daftar Siswa Baru (PPDB)
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
