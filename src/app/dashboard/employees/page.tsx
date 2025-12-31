"use client";

import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { employees } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { Lock } from "lucide-react";

export default function EmployeesPage() {
    const { user } = useAuth();
    if (user?.role !== 'Admin HR') {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <Lock className="h-12 w-12 text-muted-foreground" />
                <h2 className="mt-4 text-2xl font-semibold">Access Denied</h2>
                <p className="mt-2 text-muted-foreground">This page is only accessible to Admin HR.</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Employee Management"
                description="View and manage all employee profiles in the system."
            />
            <Card>
                <CardHeader>
                    <CardTitle>All Employees</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Employee</TableHead>
                                <TableHead>Position</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {employees.map(employee => (
                                <TableRow key={employee.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={employee.avatarUrl} alt={employee.name}/>
                                                <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p>{employee.name}</p>
                                                <p className="text-sm text-muted-foreground">{employee.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{employee.position}</TableCell>
                                    <TableCell>{employee.department}</TableCell>
                                    <TableCell>
                                        <Badge variant={employee.status === 'Active' ? 'default' : 'destructive'}>
                                            {employee.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
