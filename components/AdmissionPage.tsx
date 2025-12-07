
import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Calendar, FileText, CheckCircle, Clock, Edit2, X, Save, RefreshCw } from 'lucide-react';
import { Student } from '../types';
import { useData } from '../contexts/DataContext';

interface AdmissionContext {
  currentUser: Student;
  onUpdateUser: (data: Partial<Student>) => void;
}

const AdmissionPage: React.FC = () => {
  const { currentUser, onUpdateUser } = useOutletContext<AdmissionContext>();
  const { events, updateStudentProfile, refreshData, loading } = useData();

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    parentName: '',
    password: '',
    phone: '',
    address: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getEventColor = (category: string) => {
    switch (category) {
      case 'academic': return 'bg-indigo-500';
      case 'holiday': return 'bg-yellow-500';
      case 'activity': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const handleOpenEdit = () => {
    setEditFormData({
      name: currentUser.name,
      parentName: currentUser.parentName,
      password: currentUser.password || '',
      phone: currentUser.phone || '',
      address: currentUser.address || ''
    });
    setIsEditModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Call API to update sheet
    const success = await updateStudentProfile({
      id: currentUser.id,
      name: editFormData.name,
      parentName: editFormData.parentName,
      password: editFormData.password,
      phone: editFormData.phone,
      address: editFormData.address
    });

    if (success) {
      // Update local session
      onUpdateUser({
        name: editFormData.name,
        parentName: editFormData.parentName,
        password: editFormData.password,
        phone: editFormData.phone,
        address: editFormData.address
      });
      setIsEditModalOpen(false);
      alert("Data berhasil diperbarui!");
    } else {
      alert("Gagal memperbarui data. Cek koneksi atau coba lagi nanti.");
    }
    setIsSaving(false);
  };

  const handleRefreshEvents = async () => {
    setIsRefreshing(true);
    await refreshData();
    setIsRefreshing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Data Siswa</h2>
          <p className="text-gray-500 text-sm">Status data administrasi dan informasi akademik</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Card */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-indigo-600 p-6 text-white">
            <h3 className="text-lg font-bold flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Status Pendaftaran Ulang
            </h3>
            <p className="text-indigo-100 text-sm mt-1">Tahun Ajaran 2024/2025</p>
          </div>
          <div className="p-6">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-lg">Terdaftar</h4>
                <p className="text-gray-500 text-sm">Data siswa telah diverifikasi untuk semester ini.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h5 className="font-semibold text-gray-800 mb-3 flex justify-between items-center">
                  Detail Siswa
                  <span className="text-xs font-normal text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full border border-indigo-100">
                    ID: {currentUser.id}
                  </span>
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="block text-gray-500 text-xs uppercase tracking-wide">Nama Lengkap</span>
                    <span className="font-medium text-gray-900">{currentUser.name}</span>
                  </div>
                  <div>
                    <span className="block text-gray-500 text-xs uppercase tracking-wide">Nomor Induk (NIS)</span>
                    <span className="font-medium text-gray-900">{currentUser.id}</span>
                  </div>
                  <div>
                    <span className="block text-gray-500 text-xs uppercase tracking-wide">Kelas Saat Ini</span>
                    <span className="font-medium text-gray-900">{currentUser.classLevel}</span>
                  </div>
                  <div>
                    <span className="block text-gray-500 text-xs uppercase tracking-wide">Wali Murid</span>
                    <span className="font-medium text-gray-900">{currentUser.parentName}</span>
                  </div>
                  <div>
                    <span className="block text-gray-500 text-xs uppercase tracking-wide">Nomor HP</span>
                    <span className="font-medium text-gray-900">{currentUser.phone || '-'}</span>
                  </div>
                  <div className="md:col-span-2">
                    <span className="block text-gray-500 text-xs uppercase tracking-wide">Alamat</span>
                    <span className="font-medium text-gray-900">{currentUser.address || '-'}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                 <button 
                  onClick={handleOpenEdit}
                  className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium hover:underline"
                 >
                   <Edit2 className="w-4 h-4" />
                   Ajukan Perubahan Data
                 </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info / Events */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
             <div className="flex justify-between items-center mb-4">
               <h3 className="font-bold text-gray-800 flex items-center">
                 <Calendar className="w-5 h-5 mr-2 text-indigo-600" />
                 Jadwal Penting
               </h3>
               <button 
                onClick={handleRefreshEvents}
                disabled={isRefreshing}
                className={`p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-all ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`}
                title="Refresh dari Database"
               >
                 <RefreshCw className="w-4 h-4" />
               </button>
             </div>
             
             {isRefreshing && events.length > 0 && (
               <div className="mb-3 text-xs text-indigo-600 text-center animate-pulse">
                 Mengambil data terbaru...
               </div>
             )}

             {events.length === 0 ? (
               <div className="text-center py-4">
                  {loading ? (
                    <p className="text-sm text-gray-500">Memuat data...</p>
                  ) : (
                    <p className="text-sm text-gray-500 italic">Belum ada jadwal penting di database.</p>
                  )}
               </div>
             ) : (
               <ul className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                 {events.map((event) => (
                   <li key={event.id} className="flex items-start group">
                     <div className={`flex-shrink-0 w-2 h-2 mt-2 rounded-full ${getEventColor(event.category)} mr-3 group-hover:scale-125 transition-transform`}></div>
                     <div>
                       <p className="text-sm font-medium text-gray-800 group-hover:text-indigo-700 transition-colors">{event.title}</p>
                       <p className="text-xs text-gray-500">{event.date}</p>
                       {event.description && (
                         <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{event.description}</p>
                       )}
                     </div>
                   </li>
                 ))}
               </ul>
             )}
          </div>

          <div className="bg-orange-50 rounded-xl border border-orange-100 p-6">
            <h3 className="font-bold text-orange-800 mb-2 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Pendaftaran Ekskul
            </h3>
            <p className="text-sm text-orange-700 mb-4">
              Pendaftaran ekstrakurikuler (Pramuka, Futsal, Tari) akan dibuka sebentar lagi.
            </p>
            <button className="w-full py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors shadow-sm">
              Lihat Katalog Ekskul
            </button>
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all scale-100 max-h-[90vh] overflow-y-auto">
            <div className="bg-indigo-600 p-4 flex justify-between items-center text-white sticky top-0 z-10">
              <h3 className="font-bold text-lg">Perbarui Data Siswa</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="hover:bg-indigo-700 p-1 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">Nama Wali Murid</label>
                <input
                  type="text"
                  name="parentName"
                  value={editFormData.parentName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">Nomor HP (WhatsApp)</label>
                <input
                  type="tel"
                  name="phone"
                  value={editFormData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="08123456xxxx"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">Alamat Lengkap</label>
                <textarea
                  name="address"
                  value={editFormData.address}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="Jl. Contoh No. 123..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">Password Login</label>
                <input
                  type="text"
                  name="password"
                  value={editFormData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="Isi untuk mengubah password"
                />
                <p className="text-xs text-gray-500 mt-1">Kosongkan atau biarkan tetap jika tidak ingin mengubah password.</p>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  disabled={isSaving}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSaving ? (
                    <>Menyimpan...</>
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> Simpan Perubahan
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdmissionPage;
