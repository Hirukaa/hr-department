
"use client";
import { PageHeader } from "@/components/common/page-header";
import { AttendanceCard } from "@/components/attendance/attendance-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/hooks/use-auth";
import { attendanceRecords, employees } from "@/lib/data";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function AttendancePage() {
    const { user } = useAuth();

    const userRecords = attendanceRecords.filter(r => r.employeeId === user?.employeeId).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const checkedInToday = attendanceRecords
        .filter(ar => ar.date === todayStr && ar.checkInTime && !ar.checkOutTime)
        .map(ar => {
            const employee = employees.find(e => e.id === ar.employeeId);
            return {...ar, employee};
        })
        .sort((a,b) => b.checkInTime!.getTime() - a.checkInTime!.getTime());


    return (
        <div className="space-y-6">
            <PageHeader
                title="Attendance"
                description="Check in and out for the day and view your attendance history."
            />
            <AttendanceCard />

            { user?.role === 'Admin HR' ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Live Attendance - Checked In Today</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Employee</TableHead>
                                    <TableHead>Check In Time</TableHead>
                                    <TableHead className="text-right">Confidence</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {checkedInToday.length > 0 ? checkedInToday.map(record => (
                                    <TableRow key={record.id}>
                                        <TableCell>
                                             <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarImage src={record.employee?.avatarUrl} alt={record.employee?.name}/>
                                                    <AvatarFallback>{record.employee?.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">{record.employee?.name}</p>
                                                    <p className="text-sm text-muted-foreground">{record.employee?.position}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{record.checkInTime ? format(record.checkInTime, 'p') : '-'}</TableCell>
                                        <TableCell className="text-right">
                                            {record.faceConfidence !== undefined && (
                                                <Badge variant={record.faceConfidence > 0.9 ? 'default' : 'secondary'}>
                                                    {Math.round(record.faceConfidence * 100)}%
                                                </Badge>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center h-24">No employees have checked in yet today.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            ) : (
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
                                {userRecords.length > 0 ? userRecords.map(record => (
                                    <TableRow key={record.id}>
                                        <TableCell>{format(new Date(record.date), 'MMM d, yyyy')}</TableCell>
                                        <TableCell>{record.checkInTime ? format(record.checkInTime, 'p') : '-'}</TableCell>
                                        <TableCell>{record.checkOutTime ? format(record.checkOutTime, 'p') : '-'}</TableCell>
                                        <TableCell>{record.type}</TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center h-24">You have no attendance records yet.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}


    