
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
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";


const leaveFormSchema = z.object({
  startDate: z.date({
    required_error: "A start date is required.",
  }),
  endDate: z.date({
    required_error: "An end date is required.",
  }),
  reason: z.string().min(10, {
    message: "Reason must be at least 10 characters.",
  }).max(200, {
    message: "Reason must not be longer than 200 characters.",
  }),
}).refine(data => data.endDate >= data.startDate, {
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
            reason: '',
        }
    });

    const onSubmit = async (values: z.infer<typeof leaveFormSchema>) => {
        if (!user) {
            toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to submit a request.' });
            return;
        }
        
        const result = await submitLeaveRequest({
            employeeId: user.employeeId,
            employeeName: user.email, // Or find employee name from employees list
            startDate: values.startDate,
            endDate: values.endDate,
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
              startDate: values.startDate,
              endDate: values.endDate,
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
                                <div className="flex flex-col sm:flex-row gap-4 items-end">
                                     <FormField
                                        control={form.control}
                                        name="startDate"
                                        render={({ field }) => (
                                          <FormItem className="flex flex-col flex-1">
                                            <FormLabel>Start Date</FormLabel>
                                            <Popover>
                                              <PopoverTrigger asChild>
                                                <FormControl>
                                                  <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                      "pl-3 text-left font-normal",
                                                      !field.value && "text-muted-foreground"
                                                    )}
                                                  >
                                                    {field.value ? (
                                                      format(field.value, "PPP")
                                                    ) : (
                                                      <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                  </Button>
                                                </FormControl>
                                              </PopoverTrigger>
                                              <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                  mode="single"
                                                  selected={field.value}
                                                  onSelect={field.onChange}
                                                  disabled={(date) =>
                                                    date < new Date(new Date().setHours(0,0,0,0))
                                                  }
                                                  initialFocus
                                                />
                                              </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                      <div className="mx-4 text-muted-foreground hidden sm:block">to</div>
                                    <FormField
                                        control={form.control}
                                        name="endDate"
                                        render={({ field }) => (
                                          <FormItem className="flex flex-col flex-1">
                                            <FormLabel>End Date</FormLabel>
                                            <Popover>
                                              <PopoverTrigger asChild>
                                                <FormControl>
                                                  <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                      "pl-3 text-left font-normal",
                                                      !field.value && "text-muted-foreground"
                                                    )}
                                                  >
                                                    {field.value ? (
                                                      format(field.value, "PPP")
                                                    ) : (
                                                      <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                  </Button>
                                                </FormControl>
                                              </PopoverTrigger>
                                              <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                  mode="single"
                                                  selected={field.value}
                                                  onSelect={field.onChange}
                                                  disabled={(date) =>
                                                    date < (form.watch('startDate') || new Date(new Date().setHours(0,0,0,0)))
                                                  }
                                                  initialFocus
                                                />
                                              </PopoverContent>
                                            </Popover>
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
