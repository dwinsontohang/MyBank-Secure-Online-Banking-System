"use client";

import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import { Logout as LogoutIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const drawerWidth = 240;

interface MenuItem {
  text: string;
  icon: React.ReactNode;
  path: string;
}

interface BaseSidebarProps {
  menuItems: MenuItem[];
  title: string;
}

export function BaseSidebar({ menuItems, title }: BaseSidebarProps) {
  const router = useRouter();

  const handleLogout = () => {
    const role = localStorage.getItem("role");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    Cookies.remove("token");
    Cookies.remove("role");
    
    // Redirect based on role
    if (role === "employee") {
      router.push("/auth/employee-login");
    } else if (role === "admin") {
      router.push("/auth/admin-login");
    } else {
      router.push("/auth/customer-login");
    }
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#1976d2",
          color: "white",
        },
      }}
    >
      <Box sx={{ overflow: "auto", height: "100%" }}>
        <Box sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>
        <Divider sx={{ backgroundColor: "rgba(255,255,255,0.12)" }} />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => router.push(item.path)}
                sx={{
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.08)",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider sx={{ backgroundColor: "rgba(255,255,255,0.12)" }} />
        <List>
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.08)",
                },
              }}
            >
              <ListItemIcon sx={{ color: "white" }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}
