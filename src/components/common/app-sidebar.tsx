"use client";

import { usePathname } from 'next/navigation';
import {
  BarChart,
  CalendarOff,
  Clock,
  LayoutDashboard,
  LogOut,
  ScanFace,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { employees } from '@/lib/data';

const adminNavItems = [
  { href: '/dashboard', icon: <LayoutDashboard />, label: 'Dashboard' },
  { href: '/dashboard/attendance', icon: <Clock />, label: 'Attendance' },
  { href: '/dashboard/employees', icon: <Users />, label: 'Employees' },
  { href: '/dashboard/enrollment', icon: <ScanFace />, label: 'Enrollment' },
  { href: '/dashboard/leave', icon: <CalendarOff />, label: 'Leave' },
  { href: '/dashboard/reports', icon: <BarChart />, label: 'Reports' },
];

const supervisorNavItems = [
    { href: '/dashboard', icon: <LayoutDashboard />, label: 'Dashboard' },
    { href: '/dashboard/attendance', icon: <Clock />, label: 'Attendance' },
    { href: '/dashboard/leave', icon: <CalendarOff />, label: 'Leave' },
];

const employeeNavItems = [
  { href: '/dashboard', icon: <LayoutDashboard />, label: 'Dashboard' },
  { href: '/dashboard/attendance', icon: <Clock />, label: 'Attendance' },
  { href: '/dashboard/leave', icon: <CalendarOff />, label: 'Leave' },
];


export function AppSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  
  const navItems = user?.role === 'Admin HR' ? adminNavItems : user?.role === 'Supervisor' ? supervisorNavItems : employeeNavItems;
  
  const employee = employees.find(e => e.id === user?.employeeId);

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3">
          <ShieldCheck className="size-8 text-primary" />
          <span className="text-xl font-semibold">FacetAttendance</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={{ children: item.label }}
              >
                <a href={item.href}>
                  {item.icon}
                  <span>{item.label}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-3">
           <Avatar className="h-9 w-9">
             <AvatarImage src={employee?.avatarUrl} alt={employee?.name} />
             <AvatarFallback>{employee?.name.charAt(0)}</AvatarFallback>
           </Avatar>
           <div className="flex flex-col">
             <span className="text-sm font-medium">{employee?.name}</span>
             <span className="text-xs text-muted-foreground">{employee?.position}</span>
           </div>
         </div>
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton onClick={logout} tooltip={{ children: 'Logout' }}>
                    <LogOut />
                    <span>Logout</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export function MobileSidebarTrigger() {
    return <SidebarTrigger className="md:hidden" />;
}
