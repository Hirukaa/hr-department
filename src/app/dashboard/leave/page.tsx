
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { submitLeaveRequest } from "@/app/actions";
import { leaveRequests } from "@/lib/data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import React from "react";
import type { DateRange } from "react-day-picker";

const leaveFormSchema = z.object({
  dateRange: z.object({
    from: z.date({
      required_error: "A start date is required.",
    }),
    to: z.date({
      required_error: "An end date is required.",
    }),
  }),
  reason: z.string().min(10, {
    message: "Reason must be at least 10 characters.",
  }).max(200, {
    message: "Reason must not be longer than 200 characters.",
  }),
});

export default function LeavePage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [userLeaveRequests, setUserLeaveRequests] = React.useState(leaveRequests.filter(lr => lr.employeeId === user?.employeeId));
    const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

    const form = useForm<z.infer<typeof leaveFormSchema>>({
        resolver: zodResolver(leaveFormSchema),
    });

    const onSubmit = async (values: z.infer<typeof leaveFormSchema>) => {
        if (!user) {
            toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to submit a request.' });
            return;
        }

        const result = await submitLeaveRequest({
            employeeId: user.employeeId,
            employeeName: user.email, // Or find employee name from employees list
            startDate: values.dateRange.from,
            endDate: values.dateRange.to,
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
              startDate: values.dateRange.from,
              endDate: values.dateRange.to,
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
                                <FormField
                                    control={form.control}
                                    name="dateRange"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Leave Dates</FormLabel>
                                            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-[300px] justify-start text-left font-normal",
                                                                !field.value?.from && "text-muted-foreground"
                                                            )}
                                                        >
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {field.value?.from ? (
                                                                field.value.to ? (
                                                                    <>
                                                                        {format(field.value.from, "LLL dd, y")} -{" "}
                                                                        {format(field.value.to, "LLL dd, y")}
                                                                    </>
                                                                ) : (
                                                                    format(field.value.from, "LLL dd, y")
                                                                )
                                                            ) : (
                                                                <span>Pick a date range</span>
                                                            )}
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        initialFocus
                                                        mode="range"
                                                        defaultMonth={field.value?.from}
                                                        selected={field.value}
                                                        onSelect={(range) => {
                                                            field.onChange(range);
                                                            if (range?.from && range?.to) {
                                                              setIsCalendarOpen(false);
                                                            }
                                                          }}
                                                        numberOfMonths={2}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormDescription>
                                                Select the start and end date for your leave.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
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
