"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/hooks/use-auth";
import { attendanceRecords } from "@/lib/data";
import { AttendanceStatus } from "@/types";
import { WebcamCapture } from "@/components/common/webcam-capture";
import { useToast } from "@/hooks/use-toast";
import { checkInOrOut } from "@/app/actions";
import { Loader2 } from "lucide-react";

export function AttendanceCard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [status, setStatus] = useState<AttendanceStatus>("Absent");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"in" | "out">("in");
  const [isLoading, setIsLoading] = useState(false);
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);

  useEffect(() => {
    if (user) {
      const todayStr = format(new Date(), "yyyy-MM-dd");
      const todaysRecord = attendanceRecords.find(
        (ar) => ar.employeeId === user.employeeId && ar.date === todayStr
      );
      if (todaysRecord) {
        setStatus(todaysRecord.checkOutTime ? "Checked Out" : "Checked In");
        if(todaysRecord.checkInTime) setCheckInTime(todaysRecord.checkInTime);
      }
    }
  }, [user]);

  const handleOpenModal = (type: "in" | "out") => {
    setModalType(type);
    setIsModalOpen(true);
  };
  
  const handleCapture = (imageSrc: string) => {
    setIsLoading(true);
    // Get location
    if (!navigator.geolocation) {
        toast({ variant: 'destructive', title: 'Error', description: 'Geolocation is not supported by your browser.' });
        setIsLoading(false);
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const location = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            };
            
            if (!user) return;
            
            const result = await checkInOrOut({
                employeeId: user.employeeId,
                livePhotoDataUri: imageSrc,
                location,
            }, modalType);

            if (result.success) {
                toast({ title: 'Success', description: result.message, variant: 'default' });
                // Optimistically update UI
                if(modalType === 'in') {
                    setStatus("Checked In");
                    setCheckInTime(new Date());
                } else {
                    setStatus("Checked Out");
                }
                setIsModalOpen(false);
            } else {
                toast({ title: 'Failed', description: result.message, variant: 'destructive' });
            }
            setIsLoading(false);
        },
        () => {
            toast({ variant: 'destructive', title: 'Error', description: 'Unable to retrieve your location. Please enable location services.' });
            setIsLoading(false);
        }
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Mark Your Attendance</CardTitle>
          <CardDescription>
            {`Today is ${format(new Date(), "eeee, MMMM d, yyyy")}. Your status is: ${status}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => handleOpenModal("in")}
            disabled={status !== "Absent"}
            className="w-full sm:w-auto flex-1 bg-primary hover:bg-primary/90"
            size="lg"
          >
            Check In
          </Button>
          <Button
            onClick={() => handleOpenModal("out")}
            disabled={status !== "Checked In"}
            className="w-full sm:w-auto flex-1"
            variant="outline"
            size="lg"
          >
            Check Out
          </Button>
        </CardContent>
      </Card>

      <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {modalType === "in" ? "Check In Verification" : "Check Out Verification"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Please position your face in the center of the frame and capture your photo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-96">
                <Loader2 className="h-16 w-16 animate-spin text-primary"/>
                <p className="mt-4 text-muted-foreground">Verifying, please wait...</p>
            </div>
          ) : (
            <WebcamCapture onCapture={handleCapture} />
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
