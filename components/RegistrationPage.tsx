
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, GraduationCap } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const RegistrationPage: React.FC = () => {
  const { registerApplicant } = useData();
  const [formData, setFormData] = useState({
    fullName: '',
    parentName: '',
    phone: '',
    address: '',
    targetClass: '1'
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const success = await registerApplicant(formData);

    if (success) {
      setSubmitted(true);
    } else {
      alert("Gagal mengirim data. Pastikan internet lancar atau coba lagi nanti.");
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Pendaftaran Berhasil!</h2>
          <p className="text-gray-600 mb-8">
            Data siswa <strong>{formData.fullName}</strong> telah kami terima di sistem kami. 
            Silakan tunggu konfirmasi selanjutnya dari panitia PPDB.
          </p>
          <Link 
            to="/login"
            className="inline-block w-full bg-indigo-600 text-white font-medium py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Kembali ke Halaman Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4 sm:px-6">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between mb-8">
          <Link to="/login" className="flex items-center text-gray-500 hover:text-indigo-600 transition-colors">
            <ArrowLeft className="w-5 h-5 mr-1" /> Kembali
          </Link>
          <div className="flex items-center text-indigo-800 font-bold text-xl">
            <GraduationCap className="w-8 h-8 mr-2" />
            SD Mudel
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-indigo-600 px-8 py-6">
            <h1 className="text-2xl font-bold text-white">Formulir Pendaftaran Siswa Baru</h1>
            <p className="text-indigo-100 mt-2">Isi data di bawah ini untuk mendaftar tahun ajaran 2024/2025.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-900 mb-1">Nama Lengkap Calon Siswa</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="Contoh: Ahmad Dahlan"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Daftar Kelas</label>
                <select
                  name="targetClass"
                  value={formData.targetClass}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                >
                  <option value="1">Kelas 1</option>
                  <option value="2">Kelas 2 (Pindahan)</option>
                  <option value="3">Kelas 3 (Pindahan)</option>
                  <option value="4">Kelas 4 (Pindahan)</option>
                  <option value="5">Kelas 5 (Pindahan)</option>
                  <option value="6">Kelas 6 (Pindahan)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">No. WhatsApp Orang Tua</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="0812xxxx"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-900 mb-1">Nama Orang Tua / Wali</label>
                <input
                  type="text"
                  name="parentName"
                  required
                  value={formData.parentName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="Nama Ayah atau Ibu"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-900 mb-1">Alamat Lengkap</label>
                <textarea
                  name="address"
                  required
                  rows={3}
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="Jalan, Nomor rumah, RT/RW, Kelurahan..."
                ></textarea>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Mengirim Data...' : 'Kirim Pendaftaran'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
