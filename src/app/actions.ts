"use server";

import { verifyFace, type FaceVerificationInput } from "@/ai/flows/face-verification";
import { employees, mockAttendanceDB } from "@/lib/data";
import { getDistance } from "@/lib/utils";
import { format } from "date-fns";

const OFFICE_COORDINATES = {
  latitude: 34.052235,
  longitude: -118.243683,
};
const MAX_DISTANCE_METERS = 100;

interface CheckInRequest {
  employeeId: string;
  livePhotoDataUri: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

export async function checkInOrOut(request: CheckInRequest, type: 'in' | 'out') {
  const employee = employees.find((e) => e.id === request.employeeId);
  if (!employee || !employee.faceEmbedding) {
    return { success: false, message: "Employee not found or not enrolled." };
  }

  // 1. Location Validation - DISABLED FOR DEVELOPMENT
  // const distance = getDistance(
  //   request.location.latitude,
  //   request.location.longitude,
  //   OFFICE_COORDINATES.latitude,
  //   OFFICE_COORDINATES.longitude
  // );

  // if (distance > MAX_DISTANCE_METERS) {
  //   return {
  //     success: false,
  //     message: `Location validation failed. You are ${Math.round(distance)} meters away from the office. Please be within ${MAX_DISTANCE_METERS}m.`,
  //   };
  // }
  
  // 2. Face Verification
  const verificationInput: FaceVerificationInput = {
    livePhotoDataUri: request.livePhotoDataUri,
    enrolledFaceEmbedding: employee.faceEmbedding,
  };

  try {
    const verificationResult = await verifyFace(verificationInput);

    if (!verificationResult.isMatch) {
      return {
        success: false,
        message: `Face verification failed. Confidence: ${Math.round(verificationResult.confidenceScore * 100)}%. Please try again.`,
      };
    }
    
    // 3. Record Attendance
    const now = new Date();
    const todayStr = format(now, 'yyyy-MM-dd');

    const existingRecord = mockAttendanceDB.find(
      (r) => r.employeeId === request.employeeId && r.date === todayStr
    );
    
    if (type === 'in') {
      if (existingRecord?.checkInTime) {
         return { success: false, message: "You have already checked in today." };
      }

      if (existingRecord) {
        existingRecord.checkInTime = now;
        existingRecord.faceConfidence = verificationResult.confidenceScore;
        existingRecord.location = request.location;
      } else {
        const newRecord = {
          id: `att-${Date.now()}`,
          employeeId: request.employeeId,
          date: todayStr,
          checkInTime: now,
          type: 'Office' as const,
          faceConfidence: verificationResult.confidenceScore,
          location: request.location,
        };
        mockAttendanceDB.push(newRecord);
      }
      return { success: true, message: `Check-in successful! Confidence: ${Math.round(verificationResult.confidenceScore * 100)}%` };
    } else { // Check out
        if (!existingRecord || !existingRecord.checkInTime) {
            return { success: false, message: "You must check in before you can check out." };
        }
        if (existingRecord.checkOutTime) {
            return { success: false, message: "You have already checked out today." };
        }
        existingRecord.checkOutTime = now;
        return { success: true, message: "Check-out successful. Have a great day!" };
    }

  } catch (error) {
    console.error("An error occurred during face verification:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please contact support.",
    };
  }
}
