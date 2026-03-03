"use client";

import dynamic from 'next/dynamic';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Dynamically import MUI components with SSR disabled
const Box = dynamic(() => import('@mui/material/Box'), { ssr: false });
const Container = dynamic(() => import('@mui/material/Container'), { ssr: false });

// Dynamically import sidebars
const AdminSidebar = dynamic(() => import("./components/AdminSidebar"), { ssr: false });
const CustomerSidebar = dynamic(() => import("./components/CustomerSidebar"), { ssr: false });
const EmployeeSidebar = dynamic(() => import("./components/EmployeeSidebar"), { ssr: false });

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isClient, setIsClient] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    const userRole = localStorage.getItem("role");
    if (!userRole) {
      router.push("/auth/customer-login");
      return;
    }
    setRole(userRole);
  }, [router]);

  if (!isClient) {
    return null;
  }

  const getSidebar = () => {
    switch (role) {
      case "admin":
        return <AdminSidebar />;
      case "customer":
        return <CustomerSidebar />;
      case "employee":
        return <EmployeeSidebar />;
      default:
        return null;
    }
  };

  return (
    <>
      {getSidebar()}
      <Container
        sx={{
          ml: { sm: `${240}px` }, // 240px is drawer width
          pt: 3,
          pb: 3,
          minHeight: "100vh",
          bgcolor: "#f5f5f5",
        }}
      >
        {children}
      </Container>
    </>
  );
}