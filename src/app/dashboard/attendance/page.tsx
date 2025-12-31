"use client";
import { PageHeader } from "@/components/common/page-header";
import { AttendanceCard } from "@/components/attendance/attendance-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/hooks/use-auth";
import { attendanceRecords } from "@/lib/data";
import { format } from "date-fns";

export default function AttendancePage() {
    const { user } = useAuth();

    const userRecords = attendanceRecords.filter(r => r.employeeId === user?.employeeId).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="space-y-6">
            <PageHeader
                title="Attendance"
                description="Check in and out for the day and view your attendance history."
            />
            <AttendanceCard />

            <Card>
                <CardHeader>
                    <CardTitle>Attendance History</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Check In</TableHead>
                                <TableHead>Check Out</TableHead>
                                <TableHead>Type</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {userRecords.map(record => (
                                <TableRow key={record.id}>
                                    <TableCell>{format(new Date(record.date), 'MMM d, yyyy')}</TableCell>
                                    <TableCell>{record.checkInTime ? format(record.checkInTime, 'p') : '-'}</TableCell>
                                    <TableCell>{record.checkOutTime ? format(record.checkOutTime, 'p') : '-'}</TableCell>
                                    <TableCell>{record.type}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
