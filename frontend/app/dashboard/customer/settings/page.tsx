"use client";

import { Box, Typography, Paper, List, ListItem, ListItemIcon, ListItemText, ListItemButton } from '@mui/material';
import { Lock as LockIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

export default function Settings() {
  const router = useRouter();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Settings
      </Typography>
      <Paper sx={{ mt: 2 }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => router.push('/dashboard/customer/settings/update-password')}>
              <ListItemIcon>
                <LockIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Change Password" 
                secondary="Update your account password"
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
}
