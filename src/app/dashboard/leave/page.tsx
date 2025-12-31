
"use client";

import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { submitLeaveRequest } from "@/app/actions";
import { leaveRequests } from "@/lib/data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import React from "react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";


const leaveFormSchema = z.object({
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "A start date is required." }),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "An end date is required." }),
  reason: z.string().min(10, {
    message: "Reason must be at least 10 characters.",
  }).max(200, {
    message: "Reason must not be longer than 200 characters.",
  }),
}).refine(data => new Date(data.endDate) >= new Date(data.startDate), {
    message: "End date cannot be before start date.",
    path: ["endDate"],
});


export default function LeavePage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [userLeaveRequests, setUserLeaveRequests] = React.useState(leaveRequests.filter(lr => lr.employeeId === user?.employeeId));

    const form = useForm<z.infer<typeof leaveFormSchema>>({
        resolver: zodResolver(leaveFormSchema),
        defaultValues: {
            startDate: '',
            endDate: '',
            reason: '',
        }
    });

    const onSubmit = async (values: z.infer<typeof leaveFormSchema>) => {
        if (!user) {
            toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to submit a request.' });
            return;
        }
        
        const startDate = new Date(values.startDate);
        const endDate = new Date(values.endDate);

        const result = await submitLeaveRequest({
            employeeId: user.employeeId,
            employeeName: user.email, // Or find employee name from employees list
            startDate: startDate,
            endDate: endDate,
            reason: values.reason,
        });

        if (result.success) {
            toast({ title: 'Success', description: result.message });
            form.reset();
            // Refresh leave requests
            setUserLeaveRequests(prev => [...prev, {
              id: `leave-${Date.now()}`,
              employeeId: user.employeeId,
              employeeName: user.email,
              startDate: startDate,
              endDate: endDate,
              reason: values.reason,
              status: 'Pending'
            }]);
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.message });
        }
    };
    
    // For HR Admin to see all requests
    const allLeaveRequests = leaveRequests.sort((a,b) => b.startDate.getTime() - a.startDate.getTime());

    return (
        <div className="space-y-6">
            <PageHeader
                title="Leave Management"
                description="Request time off and view the status of your leave requests."
            />
            
            { user?.role !== 'Admin HR' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Request Leave</CardTitle>
                        <CardDescription>Fill out the form below to request time off.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <div className="flex flex-col sm:flex-row gap-4">
                                     <FormField
                                        control={form.control}
                                        name="startDate"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col flex-1">
                                                <FormLabel>Start Date</FormLabel>
                                                 <FormControl>
                                                    <Input type="date" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="endDate"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col flex-1">
                                                <FormLabel>End Date</FormLabel>
                                                 <FormControl>
                                                    <Input type="date" {...field} min={form.watch('startDate')}/>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="reason"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Reason for Leave</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Tell us a little bit about why you're requesting leave..."
                                                    className="resize-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" disabled={form.formState.isSubmitting}>
                                    {form.formState.isSubmitting ? 'Submitting...' : 'Submit Request'}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>{user?.role === 'Admin HR' ? 'All Leave Requests' : 'Your Leave History'}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                { user?.role === 'Admin HR' && <TableHead>Employee</TableHead> }
                                <TableHead>Start Date</TableHead>
                                <TableHead>End Date</TableHead>
                                <TableHead>Reason</TableHead>
                                <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {(user?.role === 'Admin HR' ? allLeaveRequests : userLeaveRequests).map(request => (
                                <TableRow key={request.id}>
                                    { user?.role === 'Admin HR' && <TableCell>{request.employeeName}</TableCell>}
                                    <TableCell>{format(request.startDate, 'MMM d, yyyy')}</TableCell>
                                    <TableCell>{format(request.endDate, 'MMM d, yyyy')}</TableCell>
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
