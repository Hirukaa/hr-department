import { AppSidebar, MobileSidebarTrigger } from "@/components/common/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="p-4 md:p-6">
            <MobileSidebarTrigger />
            {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
