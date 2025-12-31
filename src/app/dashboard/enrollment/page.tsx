"use client";

import { PageHeader } from "@/components/common/page-header";
import { useAuth } from "@/hooks/use-auth";
import { Lock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function EnrollmentPage() {
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
                title="Face Enrollment"
                description="Enroll new employees by capturing their facial data."
            />
            <Card>
                <CardHeader>
                    <CardTitle>Enroll New Employee</CardTitle>
                    <CardDescription>This feature is under construction.</CardDescription>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground h-60 flex items-center justify-center border-2 border-dashed rounded-lg">
                    <p>Enrollment form with webcam capture will be implemented here.</p>
                </CardContent>
            </Card>
        </div>
    );
}
