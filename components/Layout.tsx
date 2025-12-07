
import React, { useEffect, useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { CreditCard, Calendar, BookOpen, Menu, X, LogOut, FileText, UserCircle, GraduationCap, Download } from 'lucide-react';
import { Student } from '../types';

interface LayoutProps {
  currentUser: Student;
  onLogout: () => void;
  onUpdateUser: (data: Partial<Student>) => void;
}

const Layout: React.FC<LayoutProps> = ({ currentUser, onLogout, onUpdateUser }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Listen for the 'beforeinstallprompt' event to show install button
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const navItems = [
    { path: '/payment', label: 'Pembayaran SPP', icon: <CreditCard className="w-5 h-5" /> },
    { path: '/schedule', label: 'Jadwal Sekolah', icon: <Calendar className="w-5 h-5" /> },
    { path: '/materials', label: 'Materi Belajar', icon: <BookOpen className="w-5 h-5" /> },
    { path: '/admission', label: 'Data Siswa', icon: <FileText className="w-5 h-5" /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-indigo-800 text-white shadow-xl">
        <div className="p-6 flex items-center space-x-3 border-b border-indigo-700">
          <GraduationCap className="w-10 h-10 text-indigo-200" />
          <div>
            <h1 className="text-xl font-bold tracking-wide">SD Mudel</h1>
            <p className="text-xs text-indigo-300">SD Muhammadiyah 8</p>
          </div>
        </div>
        
        {/* User Profile Summary in Sidebar */}
        <div className="p-4 bg-indigo-900 bg-opacity-30 border-b border-indigo-700">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 p-2 rounded-full">
              <UserCircle className="w-6 h-6 text-indigo-200" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{currentUser.name}</p>
              <p className="text-xs text-indigo-300">Kelas {currentUser.classLevel}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                  isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-indigo-200 hover:bg-indigo-700 hover:text-white'
                }`
              }
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
          
          {/* Install App Button (Desktop) */}
          {deferredPrompt && (
            <button
              onClick={handleInstallClick}
              className="flex items-center space-x-3 px-4 py-3 w-full text-left text-indigo-200 hover:bg-indigo-700 hover:text-white rounded-lg transition-colors"
            >
              <Download className="w-5 h-5" />
              <span className="font-medium">Install Aplikasi</span>
            </button>
          )}
        </nav>
        <div className="p-4 border-t border-indigo-700">
          <button 
            onClick={onLogout}
            className="flex items-center space-x-3 px-4 py-2 w-full text-indigo-200 hover:text-white hover:bg-indigo-700 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Keluar</span>
          </button>
          <div className="mt-4 text-center text-xs text-indigo-300">
            &copy; 2024 SD Mudel System
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" onClick={toggleMobileMenu}></div>
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-indigo-800 text-white z-30 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 flex items-center justify-between border-b border-indigo-700">
          <div className="flex items-center space-x-3">
            <GraduationCap className="w-8 h-8 text-indigo-200" />
            <span className="font-bold">SD Mudel</span>
          </div>
          <button onClick={toggleMobileMenu}>
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* User Profile Mobile */}
        <div className="p-4 bg-indigo-900 bg-opacity-30 border-b border-indigo-700">
          <div className="flex items-center space-x-3">
             <div className="bg-indigo-600 p-2 rounded-full">
              <UserCircle className="w-6 h-6 text-indigo-200" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">{currentUser.name}</p>
              <p className="text-xs text-indigo-300">Kelas {currentUser.classLevel}</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2 flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-indigo-600' : 'hover:bg-indigo-700'
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}

          {/* Install App Button (Mobile) */}
          {deferredPrompt && (
            <button
              onClick={() => {
                handleInstallClick();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center space-x-3 px-4 py-3 w-full text-left text-indigo-100 hover:bg-indigo-700 rounded-lg transition-colors"
            >
              <Download className="w-5 h-5" />
              <span>Install Aplikasi</span>
            </button>
          )}
        </nav>
        <div className="p-4 border-t border-indigo-700">
           <button 
            onClick={onLogout}
            className="flex items-center space-x-3 px-4 py-3 w-full text-indigo-100 hover:bg-indigo-700 rounded-lg"
          >
            <LogOut className="w-5 h-5" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="bg-white shadow-sm md:hidden flex items-center justify-between p-4 sticky top-0 z-10">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-8 h-8 text-indigo-600" />
            <h1 className="font-bold text-gray-800">SD Mudel</h1>
          </div>
          <div className="flex items-center gap-2">
            {/* Quick Install Icon for Mobile Header if prompt available */}
            {deferredPrompt && (
              <button 
                onClick={handleInstallClick}
                className="text-indigo-600 p-1 rounded hover:bg-indigo-50 mr-2"
                title="Install Aplikasi"
              >
                <Download className="w-6 h-6" />
              </button>
            )}
            <button onClick={toggleMobileMenu} className="text-gray-600 p-1 rounded hover:bg-gray-100">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet context={{ currentUser, onUpdateUser }} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
