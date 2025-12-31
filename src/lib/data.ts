import { User, Employee, AttendanceRecord, LeaveRequest } from '@/types';
import { format } from 'date-fns';

export const users: User[] = [
  { id: 'user-1', email: 'hr@facet.com', role: 'Admin HR', employeeId: 'emp-1' },
  { id: 'user-2', email: 'supervisor@facet.com', role: 'Supervisor', employeeId: 'emp-2' },
  { id: 'user-3', email: 'employee@facet.com', role: 'Employee', employeeId: 'emp-3' },
  { id: 'user-4', email: 'dev@facet.com', role: 'Admin HR', employeeId: 'emp-6' },
];

export const employees: Employee[] = [
  {
    id: 'emp-1',
    internalId: 'FACET-001',
    name: 'Alice Johnson',
    position: 'HR Manager',
    department: 'Human Resources',
    status: 'Active',
    avatarUrl: 'https://picsum.photos/seed/emp1/100/100',
    faceEmbedding: 'embedding_string_for_alice_johnson_12345',
    email: 'hr@facet.com',
  },
  {
    id: 'emp-2',
    internalId: 'FACET-002',
    name: 'Bob Williams',
    position: 'Engineering Lead',
    department: 'Technology',
    status: 'Active',
    avatarUrl: 'https://picsum.photos/seed/emp2/100/100',
    faceEmbedding: 'embedding_string_for_bob_williams_67890',
    email: 'supervisor@facet.com',
  },
  {
    id: 'emp-3',
    internalId: 'FACET-003',
    name: 'Charlie Brown',
    position: 'Software Engineer',
    department: 'Technology',
    status: 'Active',
    avatarUrl: 'https://picsum.photos/seed/emp3/100/100',
    faceEmbedding: 'embedding_string_for_charlie_brown_54321',
    email: 'employee@facet.com',
  },
  {
    id: 'emp-4',
    internalId: 'FACET-004',
    name: 'Diana Prince',
    position: 'Marketing Specialist',
    department: 'Marketing',
    status: 'Active',
    avatarUrl: 'https://picsum.photos/seed/emp4/100/100',
    faceEmbedding: 'embedding_string_for_diana_prince_98765',
    email: 'diana@facet.com',
  },
  {
    id: 'emp-5',
    internalId: 'FACET-005',
    name: 'Ethan Hunt',
    position: 'Frontend Developer',
    department: 'Technology',
    status: 'Inactive',
    avatarUrl: 'https://picsum.photos/seed/emp5/100/100',
    email: 'ethan@facet.com',
  },
  {
    id: 'emp-6',
    internalId: 'FACET-006',
    name: 'Dev User',
    position: 'Developer',
    department: 'Technology',
    status: 'Active',
    avatarUrl: 'https://picsum.photos/seed/emp6/100/100',
    faceEmbedding: 'embedding_string_for_dev_user_1337',
    email: 'dev@facet.com',
  },
];

const today = new Date();
const todayStr = format(today, 'yyyy-MM-dd');
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const yesterdayStr = format(yesterday, 'yyyy-MM-dd');

export const attendanceRecords: AttendanceRecord[] = [
  {
    id: 'att-1',
    employeeId: 'emp-3',
    checkInTime: new Date(`${yesterdayStr}T09:05:00`),
    checkOutTime: new Date(`${yesterdayStr}T17:30:00`),
    faceConfidence: 0.95,
    location: { latitude: 34.0522, longitude: -118.2437 },
    type: 'Office',
    date: yesterdayStr,
  },
  {
    id: 'att-2',
    employeeId: 'emp-4',
    checkInTime: new Date(`${yesterdayStr}T08:58:00`),
    checkOutTime: new Date(`${yesterdayStr}T18:02:00`),
    faceConfidence: 0.98,
    location: { latitude: 34.0522, longitude: -118.2437 },
    type: 'Office',
    date: yesterdayStr,
  },
  {
    id: 'att-3',
    employeeId: 'emp-1',
    checkInTime: new Date(`${todayStr}T09:00:00`),
    faceConfidence: 0.99,
    location: { latitude: 34.0522, longitude: -118.2437 },
    type: 'Office',
    date: todayStr,
  },
];

export const leaveRequests: LeaveRequest[] = [
  {
    id: 'leave-1',
    employeeId: 'emp-3',
    employeeName: 'Charlie Brown',
    startDate: new Date('2024-08-20'),
    endDate: new Date('2024-08-21'),
    reason: 'Family event',
    status: 'Approved',
  },
  {
    id: 'leave-2',
    employeeId: 'emp-4',
    employeeName: 'Diana Prince',
    startDate: new Date('2024-09-01'),
    endDate: new Date('2024-09-05'),
    reason: 'Vacation',
    status: 'Pending',
  },
];

// In-memory store for new records
export let mockAttendanceDB: AttendanceRecord[] = [...attendanceRecords];
export let mockLeaveDB: LeaveRequest[] = [...leaveRequests];
