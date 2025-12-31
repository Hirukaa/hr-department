"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserX } from "lucide-react";
import { employees, attendanceRecords } from "@/lib/data";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function HRDashboard() {
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const activeEmployees = employees.filter(e => e.status === 'Active');
  const checkedInToday = attendanceRecords.filter(
    (ar) => ar.date === todayStr && ar.checkInTime
  );

  const notCheckedInEmployees = activeEmployees.filter(
    (emp) => !checkedInToday.some((ar) => ar.employeeId === emp.id)
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeEmployees.length}</div>
            <p className="text-xs text-muted-foreground">Active employees</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Checked In Today</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{checkedInToday.length}</div>
            <p className="text-xs text-muted-foreground">
              out of {activeEmployees.length} active employees
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Not Checked In</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notCheckedInEmployees.length}</div>
            <p className="text-xs text-muted-foreground">
              Employees have not checked in today
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employees Not Checked In Today</CardTitle>
        </CardHeader>
        <CardContent>
          {notCheckedInEmployees.length > 0 ? (
            <ul className="space-y-4">
              {notCheckedInEmployees.map((employee) => (
                <li key={employee.id} className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={employee.avatarUrl} />
                    <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{employee.name}</p>
                    <p className="text-sm text-muted-foreground">{employee.position}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-muted-foreground">
              All active employees have checked in. Great job, team!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
