"use client";

import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Stack
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';

interface UpdatePasswordForm {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export default function UpdatePassword() {
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const { control, handleSubmit, watch, reset } = useForm<UpdatePasswordForm>();
  
  const newPassword = watch('new_password');

  const onSubmit = async (data: UpdatePasswordForm) => {
    try {
      if (data.new_password !== data.confirm_password) {
        setMessage({ type: 'error', text: 'New passwords do not match' });
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        setMessage({ type: 'error', text: 'Not authenticated' });
        return;
      }

      await axios.patch(
        'https://dwinson-csm.duckdns.org/api/customer/update-password',
        {
          old_password: data.current_password,
          new_password: data.new_password
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage({ type: 'success', text: 'Password updated successfully' });
      reset(); // Clear form

    } catch (err: any) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.detail || 'Failed to update password'
      });
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Update Password
        </Typography>

        {message && (
          <Alert 
            severity={message.type} 
            sx={{ mb: 2 }}
            onClose={() => setMessage(null)}
          >
            {message.text}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <Controller
              name="current_password"
              control={control}
              defaultValue=""
              rules={{ required: 'Current password is required' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Current Password"
                  type="password"
                  error={!!error}
                  helperText={error?.message}
                  fullWidth
                />
              )}
            />

            <Controller
              name="new_password"
              control={control}
              defaultValue=""
              rules={{ 
                required: 'New password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters'
                }
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="New Password"
                  type="password"
                  error={!!error}
                  helperText={error?.message}
                  fullWidth
                />
              )}
            />

            <Controller
              name="confirm_password"
              control={control}
              defaultValue=""
              rules={{
                required: 'Please confirm your password',
                validate: (value) => 
                  value === newPassword || 'Passwords do not match'
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Confirm New Password"
                  type="password"
                  error={!!error}
                  helperText={error?.message}
                  fullWidth
                />
              )}
            />

            <Button 
              type="submit" 
              variant="contained" 
              size="large"
              sx={{ mt: 2 }}
            >
              Update Password
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
