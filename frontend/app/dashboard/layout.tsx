"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { DashboardContent } from "@/components/dashboard-content";
import { useAuth } from "@/context/auth-context";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { isAuthenticated, role, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/'); // Redirect to login if not authenticated
    } else if (role?.toLowerCase() !== 'admin') {
      alert("Bạn không có quyền truy cập trang này.");
      logout(); // Log out non-admin users
      router.push('/'); // Redirect to login
    }
  }, [isAuthenticated, role, router, logout]);

  if (!isAuthenticated || role?.toLowerCase() !== 'admin') {
    return null; // Don't render anything if not authorized
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        {children} {/* Render page content here */}
      </div>
    </div>
  );
}
