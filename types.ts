
export enum ClassLevel {
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
  SIX = 6
}

export interface Student {
  id: string;
  name: string;
  classLevel: ClassLevel;
  parentName: string;
  password?: string; // Added for login
  phone?: string;
  address?: string;
}

export enum PaymentStatus {
  PAID = 'LUNAS',
  UNPAID = 'BELUM LUNAS',
  PENDING = 'MENUNGGU KONFIRMASI'
}

export interface PaymentRecord {
  id: string;
  studentId: string;
  month: string;
  year: number;
  amount: number;
  status: PaymentStatus;
  datePaid?: string;
}

export interface ScheduleItem {
  id: string;
  day: string;
  period: string;
  subject: string;
  teacher: string;
}

export interface ClassSchedule {
  classLevel: ClassLevel;
  schedule: ScheduleItem[];
}

export interface MaterialItem {
  id: string;
  title: string;
  subject: string;
  description: string;
  classLevel: ClassLevel;
  downloadUrl?: string; // Mock URL
}

export interface SchoolEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  category: 'academic' | 'holiday' | 'activity';
}
