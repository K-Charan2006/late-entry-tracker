export interface User {
  username: string;
  role: 'HOD' | 'TEACHER';
  branch_access: string;
}

export interface Student {
  hallticket_id: string;
  name: string;
  branch: string;
  section: string;
  year: number;
}

export interface LateLog {
  id: number;
  hallticket_id: string;
  reason: string;
  timestamp: string;
  date: string;
  name?: string;
  branch?: string;
  section?: string;
  year?: number;
}
