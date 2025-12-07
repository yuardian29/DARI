
import { ClassLevel, PaymentStatus, Student, PaymentRecord, ClassSchedule, MaterialItem, SchoolEvent } from './types';

export const STUDENTS: Student[] = [
  { id: 'SD001', name: 'Budi Santoso', classLevel: ClassLevel.FIVE, parentName: 'Agus Santoso', password: '123' },
  { id: 'SD002', name: 'Siti Aminah', classLevel: ClassLevel.THREE, parentName: 'Rahmat Hidayat', password: '123' },
  { id: 'SD003', name: 'Doni Pratama', classLevel: ClassLevel.ONE, parentName: 'Eko Pratama', password: '123' },
  { id: 'SD004', name: 'Ani Wijaya', classLevel: ClassLevel.SIX, parentName: 'Susilo Wijaya', password: '123' },
];

export const MOCK_PAYMENTS: PaymentRecord[] = [
  { id: 'PAY001', studentId: 'SD001', month: 'Juli', year: 2024, amount: 150000, status: PaymentStatus.PAID, datePaid: '2024-07-10' },
  { id: 'PAY002', studentId: 'SD001', month: 'Agustus', year: 2024, amount: 150000, status: PaymentStatus.PAID, datePaid: '2024-08-12' },
  { id: 'PAY003', studentId: 'SD001', month: 'September', year: 2024, amount: 150000, status: PaymentStatus.UNPAID },
  { id: 'PAY004', studentId: 'SD002', month: 'September', year: 2024, amount: 150000, status: PaymentStatus.UNPAID },
];

export const SCHEDULES: ClassSchedule[] = [
  {
    classLevel: ClassLevel.ONE,
    schedule: [
      { id: 'S1-M-1', day: 'Senin', period: '07:00 - 08:30', subject: 'Upacara & Tematik', teacher: 'Bu Rini' },
      { id: 'S1-M-2', day: 'Senin', period: '08:30 - 09:30', subject: 'Matematika Dasar', teacher: 'Pak Budi' },
      { id: 'S1-T-1', day: 'Selasa', period: '07:00 - 08:30', subject: 'Olahraga', teacher: 'Pak Jaya' },
      { id: 'S1-W-1', day: 'Rabu', period: '07:00 - 09:00', subject: 'Seni Budaya', teacher: 'Bu Sari' },
    ]
  },
  {
    classLevel: ClassLevel.FIVE,
    schedule: [
      { id: 'S5-M-1', day: 'Senin', period: '07:00 - 07:45', subject: 'Upacara', teacher: '-' },
      { id: 'S5-M-2', day: 'Senin', period: '07:45 - 09:15', subject: 'Matematika', teacher: 'Pak Hartono' },
      { id: 'S5-M-3', day: 'Senin', period: '09:30 - 11:00', subject: 'IPA', teacher: 'Bu Linda' },
      { id: 'S5-T-1', day: 'Selasa', period: '07:00 - 08:30', subject: 'Bahasa Indonesia', teacher: 'Pak Andi' },
      { id: 'S5-W-1', day: 'Rabu', period: '07:00 - 08:30', subject: 'Bahasa Inggris', teacher: 'Ms. Sarah' },
    ]
  }
];

export const MATERIALS: MaterialItem[] = [
  { id: 'M1', title: 'Pengenalan Angka 1-100', subject: 'Matematika', classLevel: ClassLevel.ONE, description: 'Modul dasar mengenal angka untuk siswa kelas 1.', downloadUrl: 'https://example.com/modul-1.pdf' },
  { id: 'M2', title: 'Mewarnai Hewan', subject: 'Seni Budaya', classLevel: ClassLevel.ONE, description: 'Lembar kerja mewarnai hewan darat.', downloadUrl: 'https://example.com/modul-2.pdf' },
  { id: 'M3', title: 'Pecahan Sederhana', subject: 'Matematika', classLevel: ClassLevel.FIVE, description: 'Panduan memahami pecahan biasa dan campuran.', downloadUrl: 'https://example.com/modul-3.pdf' },
  { id: 'M4', title: 'Sistem Pencernaan Manusia', subject: 'IPA', classLevel: ClassLevel.FIVE, description: 'Diagram dan penjelasan fungsi organ pencernaan.', downloadUrl: 'https://example.com/modul-4.pdf' },
  { id: 'M5', title: 'Photosynthesis Basics', subject: 'Bahasa Inggris', classLevel: ClassLevel.FIVE, description: 'Reading comprehension about plants.', downloadUrl: 'https://example.com/modul-5.pdf' },
];

export const MOCK_EVENTS: SchoolEvent[] = [
  { id: 'E1', title: 'Pembagian Rapor', date: '20 Desember 2024', description: 'Pengambilan rapor semester ganjil', category: 'academic' },
  { id: 'E2', title: 'Libur Semester', date: '23 Des - 5 Jan 2025', description: 'Libur panjang semester ganjil', category: 'holiday' },
  { id: 'E3', title: 'Pendaftaran Ekstrakurikuler', date: '10 - 15 Januari 2025', description: 'Pendaftaran ulang kegiatan ekskul', category: 'activity' },
];

export const MONTHS = [
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni'
];
