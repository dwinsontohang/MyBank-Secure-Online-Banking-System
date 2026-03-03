"use client";

import { BaseSidebar } from './BaseSidebar';
import {
  Dashboard as DashboardIcon,
  History as TransactionIcon,
  Payments as CustomerTransactionIcon,
  VerifiedUser as ApprovalIcon,
} from "@mui/icons-material";

export default function EmployeeSidebar() {
  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard/employee" },
    { text: "Customer Unverified", icon: <ApprovalIcon />, path: "/dashboard/employee/customer-unverified" },
    { text: "Transaction History", icon: <TransactionIcon />, path: "/dashboard/employee/transaction-history" },
  ];

  return <BaseSidebar menuItems={menuItems} title="Employee Dashboard" />;
}
