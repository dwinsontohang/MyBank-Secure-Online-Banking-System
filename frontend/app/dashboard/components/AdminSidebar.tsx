"use client";

import { BaseSidebar } from './BaseSidebar';
import {
  Dashboard as DashboardIcon,
  PersonAdd as CreateEmployeeIcon,
  People as EmployeeListIcon,
} from "@mui/icons-material";

export default function AdminSidebar() {
  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard/admin" },
    { text: "Create Employee", icon: <CreateEmployeeIcon />, path: "/dashboard/admin/create-employee" },
    { text: "Employee List", icon: <EmployeeListIcon />, path: "/dashboard/admin/employee-list" },
  ];

  return <BaseSidebar menuItems={menuItems} title="Admin Dashboard" />;
}
