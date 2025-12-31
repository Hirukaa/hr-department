export type Role = 'Admin HR' | 'Supervisor' | 'Employee';

export interface User {
  id: string;
  email: string;
  role: Role;
  employeeId: string;
}

export interface Employee {
  id: string;
  internalId: string;
  name: string;
  position: string;
  department: string;
  status: 'Active' | 'Inactive';
  avatarUrl: string;
  faceEmbedding?: string; // Mock embedding
  email: string;
}

export type AttendanceStatus = 'Checked In' | 'Checked Out' | 'On Leave' | 'Absent';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  checkInTime?: Date;
  checkOutTime?: Date;
  faceConfidence?: number;
  location?: {
    latitude: number;
    longitude: number;
  };
  type: 'Office' | 'WFH' | 'Official Duty';
  date: string; // YYYY-MM-DD
}

export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: LeaveStatus;
  employeeName: string;
}
