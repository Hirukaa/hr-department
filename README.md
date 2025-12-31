# FacetAttendance: AI-Powered HR Management System

![FacetAttendance Banner](https://placehold.co/1200x300/e2e8f0/2d3748?text=FacetAttendance)

FacetAttendance is a modern, internal Human Resources (HR) management system designed to streamline attendance, leave, and employee management. It leverages AI-powered face verification for secure and seamless check-ins, providing a robust solution for today's dynamic workplace.

Built with Next.js, ShadCN UI, and Genkit, this application offers a clean, responsive, and intuitive interface for both employees and HR administrators.

## ✨ Key Features

-   **Dashboard:** A personalized overview for employees and a comprehensive summary for HR admins.
-   **AI Face Verification:** Secure, camera-based check-in and check-out using Genkit for face matching.
-   **Attendance Tracking:** Employees can mark their attendance, and admins can monitor live attendance.
-   **Leave Management:** A complete system for employees to request leave and for admins to manage approvals.
-   **Employee Directory:** A central place for HR admins to view and manage employee profiles.
-   **Role-Based Access Control:** Different views and permissions for Employees, Supervisors, and HR Admins.
-   **Responsive Design:** A seamless experience across desktop and mobile devices.

## 🚀 Tech Stack

-   **Framework:** [Next.js](https://nextjs.org/) (App Router)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [ShadCN UI](https://ui.shadcn.com/)
-   **Generative AI:** [Genkit](https://firebase.google.com/docs/genkit)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **UI Components:** Radix UI

## 🏁 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   Node.js (v18 or newer recommended)
-   npm or yarn

### Installation

1.  Clone the repo:
    ```sh
    git clone https://github.com/your_username/your_repository.git
    ```
2.  Navigate to the project directory:
    ```sh
    cd your_repository
    ```
3.  Install NPM packages:
    ```sh
    npm install
    ```
4.  Run the development server:
    ```sh
    npm run dev
    ```
5.  Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## 🔐 Login Credentials

You can use the following mock accounts to test the different roles within the application:

-   **Admin HR:** `admin@facet.com` or `hr@facet.com`
-   **Supervisor:** `supervisor@facet.com`
-   **Employee:** `employee@facet.com` or `user@facet.com`
-   **Development Admin:** `dev@facet.com`

---

This project was built in [Firebase Studio](https://firebase.google.com/studio).