"use client";

import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LeavePage() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Leave Management"
                description="Request time off and view the status of your leave requests."
            />
            <Card>
                <CardHeader>
                    <CardTitle>Request Leave</CardTitle>
                    <CardDescription>This feature is under construction.</CardDescription>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground h-40 flex items-center justify-center border-2 border-dashed rounded-lg">
                    <p>Leave request form will be implemented here.</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Leave History / Pending Approvals</CardTitle>
                    <CardDescription>This feature is under construction.</CardDescription>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground h-60 flex items-center justify-center border-2 border-dashed rounded-lg">
                    <p>A table of leave requests will be implemented here.</p>
                </CardContent>
            </Card>
        </div>
    );
}
