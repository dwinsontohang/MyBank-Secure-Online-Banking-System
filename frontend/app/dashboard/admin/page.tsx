"use client";

import { useEffect, useState } from 'react';
import { Typography, Box, Paper, CircularProgress } from '@mui/material';
import axios from 'axios';

interface Profile {
  message: string;
  username: string;
  role: string;
}

export default function AdminDashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication token not found');
          return;
        }

        const response = await axios.get(
          'https://dwinson-csm.duckdns.org/api/protected/profile',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setProfile(response.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" sx={{ mt: 2 }}>
        {error}
      </Typography>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          {profile?.message}
        </Typography>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Welcome back, Administrator {profile?.username}!
        </Typography>
        <Typography color="textSecondary">
          Access Level: {profile?.role}
        </Typography>
      </Paper>
    </Box>
  );
}
