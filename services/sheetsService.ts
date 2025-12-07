
import { Student, PaymentRecord, ClassSchedule, MaterialItem, ClassLevel, PaymentStatus, ScheduleItem, SchoolEvent } from '../types';

// CONFIGURATION
// Replace 'SHEET_ID' with your actual Google Sheet ID
const SHEET_ID = '1ZqBeJ_voF-ZljZ-3PEZ1XTJLKeKYrk4KP8jZVoUaI-w';

// PASTE YOUR APPS SCRIPT WEB APP URL HERE AFTER DEPLOYING
// Example: 'https://script.google.com/macros/s/AKfycbx.../exec'
export const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxRlpLJsZK8GWYsS8wPMkD73acMjUMnGQ3jj2udbJdd5NmB-WKJ6Y75Z9cA1oAZKp1lQw/exec'; 

export const fetchSheetData = async () => {
  if (!APPS_SCRIPT_URL) {
    console.warn("APPS_SCRIPT_URL not configured.");
    return { students: [], payments: [], schedules: [], materials: [], events: [], settings: {} };
  }

  try {
    // Fetch all data from Apps Script via doGet
    // Adding timestamp to bypass browser caching
    const response = await fetch(`${APPS_SCRIPT_URL}?action=getAll&t=${new Date().getTime()}`);
    
    if (!response.ok) {
       throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    
    const data = await response.json();

    return {
      students: normalizeStudents(data.students || []),
      payments: normalizePayments(data.payments || []),
      schedules: normalizeSchedules(data.schedule || []),
      materials: normalizeMaterials(data.materials || []),
      events: normalizeEvents(data.events || []),
      settings: normalizeSettings(data.settings || [])
    };
  } catch (error) {
    console.error("Could not fetch data from Apps Script:", error);
    // Return empty arrays to let Context use fallback data if needed
    return { students: [], payments: [], schedules: [], materials: [], events: [], settings: {} };
  }
};

/**
 * Send data to Google Apps Script
 */
export const postToSheet = async (action: string, data: any) => {
  if (!APPS_SCRIPT_URL) {
    console.warn("APPS_SCRIPT_URL not configured. Data will not be saved permanently.");
    return { success: false, message: "URL Script belum dikonfigurasi" };
  }

  try {
    // IMPORTANT: removed 'Content-Type': 'application/json' header to prevent CORS preflight issues
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', 
      body: JSON.stringify({ action, data }),
    });

    // With 'no-cors', we can't read the response body. 
    // We assume success if no network error occurred.
    return { success: true, message: "Permintaan dikirim (Cek Sheet)" };
  } catch (error) {
    console.error("Error posting to sheet:", error);
    return { success: false, message: "Gagal menghubungi server" };
  }
};


// --- Normalization Helpers ---

const normalizeStudents = (data: any[]): Student[] => {
  return data.map(row => ({
    id: String(row.id),
    name: row.name,
    classLevel: Number(row.classLevel) as ClassLevel,
    parentName: row.parentName,
    password: String(row.password) || '123456',
    phone: row.phone ? String(row.phone) : undefined,
    address: row.address ? String(row.address) : undefined
  })).filter(s => s.id && s.name);
};

const normalizePayments = (data: any[]): PaymentRecord[] => {
  return data.map(row => ({
    id: String(row.id),
    studentId: String(row.studentId),
    month: row.month,
    year: Number(row.year),
    amount: Number(row.amount),
    status: row.status as PaymentStatus,
    datePaid: row.datePaid ? String(row.datePaid) : undefined
  })).filter(p => p.id && p.studentId);
};

const normalizeSchedules = (data: any[]): ClassSchedule[] => {
  // Group flat schedule rows into ClassSchedule objects
  const grouped = new Map<number, ScheduleItem[]>();

  data.forEach(row => {
    const level = Number(row.classLevel);
    if (!grouped.has(level)) grouped.set(level, []);
    
    grouped.get(level)?.push({
      id: String(row.id),
      day: row.day,
      period: row.period,
      subject: row.subject,
      teacher: row.teacher
    });
  });

  const schedules: ClassSchedule[] = [];
  grouped.forEach((items, level) => {
    schedules.push({
      classLevel: level as ClassLevel,
      schedule: items
    });
  });

  return schedules;
};

const normalizeMaterials = (data: any[]): MaterialItem[] => {
  return data.map(row => ({
    id: String(row.id),
    title: row.title,
    subject: row.subject,
    classLevel: Number(row.classLevel) as ClassLevel,
    description: row.description,
    downloadUrl: row.downloadUrl
  })).filter(m => m.id && m.title);
};

const normalizeEvents = (data: any[]): SchoolEvent[] => {
  return data.map(row => ({
    id: String(row.id),
    title: row.title,
    date: row.date, // Assumed string from sheet
    description: row.description,
    category: row.category as 'academic' | 'holiday' | 'activity'
  })).filter(e => e.id && e.title);
};

const normalizeSettings = (data: any[]): Record<string, string> => {
  const settings: Record<string, string> = {};
  data.forEach(row => {
    if (row.key && row.value) {
      settings[String(row.key)] = String(row.value);
    }
  });
  return settings;
};
