"use client";

import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { attendanceRecords, leaveRequests } from "@/lib/data";
import { format } from "date-fns";
import { AttendanceStatus } from "@/types";
import { Clock, CalendarCheck, CalendarOff } from "lucide-react";

export function EmployeeDashboard() {
  const { user } = useAuth();
  const todayStr = format(new Date(), "yyyy-MM-dd");

  const todaysAttendance = attendanceRecords.find(
    (ar) => ar.employeeId === user?.employeeId && ar.date === todayStr
  );

  let attendanceStatus: AttendanceStatus = "Absent";
  if (todaysAttendance) {
    attendanceStatus = todaysAttendance.checkOutTime ? "Checked Out" : "Checked In";
  }

  const userLeaveRequests = leaveRequests.filter(
    (lr) => lr.employeeId === user?.employeeId
  );
  
  const approvedLeaveDays = userLeaveRequests
    .filter(lr => lr.status === 'Approved')
    .reduce((acc, lr) => {
        const days = (lr.endDate.getTime() - lr.startDate.getTime()) / (1000 * 3600 * 24) + 1;
        return acc + days;
    }, 0);
  
  const leaveBalance = 12 - approvedLeaveDays; // Assuming 12 days quota

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Attendance</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Badge
                variant={
                  attendanceStatus === "Checked In"
                    ? "default"
                    : attendanceStatus === "Checked Out"
                    ? "secondary"
                    : "destructive"
                }
                className="text-lg"
              >
                {attendanceStatus}
              </Badge>
            </div>
            {todaysAttendance?.checkInTime && (
              <p className="text-xs text-muted-foreground">
                Checked in at {format(todaysAttendance.checkInTime, "p")}
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leave Balance</CardTitle>
            <CalendarOff className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leaveBalance} Days</div>
            <p className="text-xs text-muted-foreground">
              {approvedLeaveDays} days taken this year
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Leave Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dates</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userLeaveRequests.slice(0, 3).map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    {format(request.startDate, "MMM d")} - {format(request.endDate, "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>{request.reason}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={request.status === 'Approved' ? 'default' : request.status === 'Pending' ? 'secondary' : 'destructive'}>
                        {request.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
