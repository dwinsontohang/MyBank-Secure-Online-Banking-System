"use client";

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
  Stack,
  CircularProgress
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';

interface CreateEmployeeForm {
  full_name: string;
  username: string;
  password: string;
  id_number: string; // New field for 6-digit ID
}

// Helper function to generate random 6-digit ID
const generateRandomId = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export default function CreateEmployee() {
  const { control, handleSubmit, reset, setValue } = useForm<CreateEmployeeForm>();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // Generate random ID on component mount
  useEffect(() => {
    setValue('id_number', generateRandomId());
  }, [setValue]);

  // Function to regenerate ID number
  const regenerateId = () => {
    setValue('id_number', generateRandomId());
  };

  const onSubmit = async (data: CreateEmployeeForm) => {
    setLoading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'https://dwinson-csm.duckdns.org/api/admin/create-employee',
        data,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setMessage({
        type: 'success',
        text: 'Employee created successfully'
      });
      reset();
      // Generate new random ID after successful submission
      setValue('id_number', generateRandomId());
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.response?.data?.detail || 'Failed to create employee'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Create Employee
      </Typography>

      <Paper sx={{ p: 3, maxWidth: 500 }}>
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
              name="id_number"
              control={control}
              defaultValue={generateRandomId()}
              rules={{ 
                required: 'ID Number is required',
                pattern: {
                  value: /^\d{6}$/,
                  message: 'ID must be a 6-digit number'
                }
              }}
              render={({ field, fieldState: { error } }) => (
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                  <TextField
                    {...field}
                    label="ID Number"
                    error={!!error}
                    helperText={error?.message}
                    fullWidth
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <Button 
                    variant="outlined" 
                    onClick={regenerateId}
                    sx={{ mt: 1 }}
                  >
                    Refresh
                  </Button>
                </Box>
              )}
            />

            <Controller
              name="full_name"
              control={control}
              defaultValue=""
              rules={{ 
                required: 'Full name is required',
                minLength: {
                  value: 3,
                  message: 'Name must be at least 3 characters'
                }
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Full Name"
                  error={!!error}
                  helperText={error?.message}
                  fullWidth
                />
              )}
            />

            <Controller
              name="username"
              control={control}
              defaultValue=""
              rules={{ 
                required: 'Username is required',
                minLength: {
                  value: 3,
                  message: 'Username must be at least 3 characters'
                }
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Username"
                  error={!!error}
                  helperText={error?.message}
                  fullWidth
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              defaultValue=""
              rules={{ 
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  type="password"
                  label="Password"
                  error={!!error}
                  helperText={error?.message}
                  fullWidth
                />
              )}
            />

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Creating...' : 'Create Employee'}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
