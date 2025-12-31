"use client";

import { useAuth } from '@/hooks/use-auth';
import { PageHeader } from '@/components/common/page-header';
import { HRDashboard } from '@/components/dashboard/hr-dashboard';
import { EmployeeDashboard } from '@/components/dashboard/employee-dashboard';
import { employees } from '@/lib/data';

export default function DashboardPage() {
  const { user } = useAuth();
  
  if (!user) {
    return null; // Or a loading skeleton
  }
  
  const employee = employees.find(e => e.id === user.employeeId);
  const firstName = employee?.name.split(' ')[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${firstName}!`}
        description="Here's a summary of your activities and team status."
      />
      {user.role === 'Admin HR' ? <HRDashboard /> : <EmployeeDashboard />}
    </div>
  );
}
