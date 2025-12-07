
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Student, PaymentRecord, ClassSchedule, MaterialItem, PaymentStatus, SchoolEvent } from '../types';
import { fetchSheetData, postToSheet } from '../services/sheetsService';
import { STUDENTS, MOCK_PAYMENTS, SCHEDULES, MATERIALS, MOCK_EVENTS } from '../constants';

interface DataContextType {
  students: Student[];
  payments: PaymentRecord[];
  schedules: ClassSchedule[];
  materials: MaterialItem[];
  events: SchoolEvent[];
  academicYear: string;
  loading: boolean;
  refreshData: () => Promise<void>;
  updatePaymentStatus: (id: string, status: PaymentStatus) => Promise<void>;
  addStudent: (student: Student) => Promise<boolean>;
  updateStudentProfile: (student: Partial<Student> & { id: string }) => Promise<boolean>;
  registerApplicant: (applicantData: any) => Promise<boolean>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [schedules, setSchedules] = useState<ClassSchedule[]>([]);
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [academicYear, setAcademicYear] = useState('2024/2025');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    // Attempt to fetch from Google Sheets
    const sheetData = await fetchSheetData();
    
    // If sheet data is empty (likely because sheet isn't configured/public), fallback to constants
    if (sheetData.students.length === 0) {
      console.log("Using Mock Data (Fallback)");
      setStudents(STUDENTS);
      setPayments(MOCK_PAYMENTS);
      setSchedules(SCHEDULES);
      setMaterials(MATERIALS);
      setEvents(MOCK_EVENTS);
      setAcademicYear('2024/2025');
    } else {
      console.log("Using Google Sheet Data");
      setStudents(sheetData.students);
      setPayments(sheetData.payments);
      setSchedules(sheetData.schedules);
      setMaterials(sheetData.materials);
      setEvents(sheetData.events.length > 0 ? sheetData.events : MOCK_EVENTS);
      
      if (sheetData.settings && sheetData.settings.academicYear) {
        setAcademicYear(sheetData.settings.academicYear);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const updatePaymentStatus = async (id: string, status: PaymentStatus) => {
    // Optimistic UI Update
    const datePaid = new Date().toLocaleDateString('id-ID');
    setPayments(prev => prev.map(p => 
      p.id === id ? { ...p, status, datePaid } : p
    ));

    // Send to Google Sheet
    await postToSheet('updatePayment', {
      id: id,
      status: status,
      datePaid: datePaid
    });
  };

  const addStudent = async (student: Student): Promise<boolean> => {
    // Legacy: Directly add student (used by admin logic if any)
    const result = await postToSheet('registerStudent', student);
    
    if (result.success || result.message?.includes('dikirim')) {
      setStudents(prev => [...prev, student]);
      return true;
    }
    return false;
  };

  const registerApplicant = async (applicantData: any): Promise<boolean> => {
    // New Logic: Register to "Registrations" sheet
    const result = await postToSheet('registerApplicant', applicantData);
    return result.success || result.message?.includes('dikirim');
  };

  const updateStudentProfile = async (updatedData: Partial<Student> & { id: string }): Promise<boolean> => {
    const result = await postToSheet('updateStudent', updatedData);

    if (result.success || result.message?.includes('dikirim')) {
      // Optimistic UI Update in global state
      setStudents(prev => prev.map(s => 
        s.id === updatedData.id ? { ...s, ...updatedData } : s
      ));
      return true;
    }
    return false;
  };

  return (
    <DataContext.Provider value={{ 
      students, 
      payments, 
      schedules, 
      materials,
      events, 
      academicYear,
      loading, 
      refreshData: loadData,
      updatePaymentStatus,
      addStudent,
      updateStudentProfile,
      registerApplicant
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
