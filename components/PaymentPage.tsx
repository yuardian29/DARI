
import React, { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { MONTHS } from '../constants';
import { PaymentRecord, PaymentStatus, Student } from '../types';
import { CheckCircle, XCircle, AlertCircle, Banknote } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const PaymentPage: React.FC = () => {
  const { currentUser } = useOutletContext<{ currentUser: Student }>();
  const { payments, loading } = useData();

  const studentPayments = useMemo(() => 
    payments.filter(p => p.studentId === currentUser.id), 
  [payments, currentUser.id]);

  // Helper to generate missing payment records for display if they don't exist in mock data
  const getPaymentForMonth = (month: string): PaymentRecord | null => {
    return studentPayments.find(p => p.month === month) || null;
  };

  const currentYear = 2024;

  if (loading) return <div className="p-8 text-center text-gray-500">Memuat data pembayaran...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Pembayaran SPP</h2>
          <p className="text-gray-500 text-sm">Status pembayaran SPP Anda</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Info Card */}
        <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 h-fit">
          <h3 className="text-lg font-semibold text-indigo-900 mb-4 flex items-center gap-2">
            <Banknote className="w-5 h-5" />
            Info Tagihan
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-indigo-600">Nama Siswa:</span>
              <span className="font-medium text-gray-800">{currentUser.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-indigo-600">NIS:</span>
              <span className="font-medium text-gray-800">{currentUser.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-indigo-600">Kelas:</span>
              <span className="font-medium text-gray-800">{currentUser.classLevel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-indigo-600">Wali Murid:</span>
              <span className="font-medium text-gray-800">{currentUser.parentName}</span>
            </div>
            <div className="pt-4 border-t border-indigo-200 mt-2">
              <div className="flex justify-between items-center">
                <span className="text-indigo-600">Tagihan Bulanan:</span>
                <span className="font-bold text-lg text-indigo-900">Rp 150.000</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h3 className="font-semibold text-gray-800">Riwayat Tagihan Tahun Ajaran {currentYear}/{currentYear+1}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Bulan</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Tanggal Bayar</th>
                </tr>
              </thead>
              <tbody>
                {MONTHS.map((month) => {
                  const record = getPaymentForMonth(month);
                  const isPaid = record?.status === PaymentStatus.PAID;
                  const isPending = record?.status === PaymentStatus.PENDING;
                  
                  return (
                    <tr key={month} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{month}</td>
                      <td className="px-6 py-4">
                        {isPaid ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" /> Lunas
                          </span>
                        ) : isPending ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <AlertCircle className="w-3 h-3 mr-1" /> Menunggu
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <XCircle className="w-3 h-3 mr-1" /> Belum Lunas
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {record?.datePaid || '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
