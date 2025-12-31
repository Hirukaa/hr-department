# **App Name**: FacetAttendance

## Core Features:

- Authentication & Roles: Secure login/logout with JWT. Role-based access (Admin HR, Supervisor, Employee).
- Employee Management: Maintain employee profiles with document uploads and status control. Read-only access for employees, full access for HR.
- Face Enrollment: Admin HR enrolls faces via webcam, generates embeddings, and stores them securely. Enrollment is required before attendance.
- Face Verification: Capture live image during attendance, compare face embedding, return confidence score, and reject if below threshold. The confidence score is used as a tool to improve overall attendance-system accuracy.
- Attendance System: Check-in/out with timestamp, face confidence, and GPS location. Location validation uses office coordinates and a radius. Includes attendance types (Office, WFH, Duty) and prevents duplicate attendance per day.
- Leave Management: Handle leave requests with approval workflow (Supervisor -> HR), leave quota calculation, and leave history.
- Reporting: Generate attendance, leave, and performance reports. Export to Excel/PDF.

## Style Guidelines:

- Primary color: Deep Blue (#3F51B5) to convey professionalism and trust.
- Background color: Light Gray (#ECEFF1) to provide a clean and neutral backdrop.
- Accent color: Soft Green (#8BC34A) to highlight key actions and approvals.
- Body and headline font: 'Inter' sans-serif font providing a modern, machined, objective and neutral feel.
- Use minimalist icons to represent actions and data categories.
- Employ a clean, grid-based layout for clear data presentation.
- Subtle transitions and animations to provide feedback on user actions.