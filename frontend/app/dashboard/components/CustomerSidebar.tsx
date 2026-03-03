"use client";

import { BaseSidebar } from './BaseSidebar';
import {
  Dashboard as DashboardIcon,
  History as HistoryIcon,
  Password as PasswordIcon,
  MonetizationOn as MoneyIcon
} from "@mui/icons-material";

export default function CustomerSidebar() {
  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard/customer" },
    { text: "Update Password", icon: <PasswordIcon />, path: "/dashboard/customer/settings/update-password" },
    { text: "Transfer", icon: <MoneyIcon />, path: "/dashboard/customer/transfer" },
    { text: "Transactions", icon: <HistoryIcon />, path: "/dashboard/customer/transactions" },
  ];

  return <BaseSidebar menuItems={menuItems} title="Customer Dashboard" />;
}
