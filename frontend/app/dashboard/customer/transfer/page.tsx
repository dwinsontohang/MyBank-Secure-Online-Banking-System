"use client";

import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  CircularProgress,
  Alert,
  InputAdornment
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';

interface TransferFormData {
  receiver_username: string;
  amount: number;
}

export default function Transfer() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { control, handleSubmit, reset, formState: { errors } } = useForm<TransferFormData>();

  const onSubmit = async (data: TransferFormData) => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        setLoading(false);
        return;
      }

      // Ensure amount is a number
      const payload = {
        receiver_username: data.receiver_username,
        amount: Number(data.amount)
      };

      // Call the API
      const response = await axios.post(
        'https://dwinson-csm.duckdns.org/api/transactions/transfer',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSuccess(`Successfully transferred ${data.amount} to ${data.receiver_username}`);
      reset(); // Reset form after successful submission
    } catch (err: any) {
      console.error('Transfer error:', err);
      setError(err.response?.data?.message || 'Failed to process transfer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Transfer Funds
      </Typography>
      
      <Paper sx={{ p: 3, maxWidth: 500, mx: 'auto', mt: 2 }}>
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="receiver_username"
            control={control}
            defaultValue=""
            rules={{ required: 'Receiver username is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Receiver Username"
                fullWidth
                margin="normal"
                error={!!errors.receiver_username}
                helperText={errors.receiver_username?.message}
                disabled={loading}
              />
            )}
          />
          
          <Controller
            name="amount"
            control={control}
            defaultValue={0}
            rules={{ 
              required: 'Amount is required',
              min: { value: 0.01, message: 'Amount must be greater than 0' },
              validate: value => 
                !isNaN(Number(value)) || 'Amount must be a valid number'
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Amount"
                type="number"
                fullWidth
                margin="normal"
                error={!!errors.amount}
                helperText={errors.amount?.message}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                disabled={loading}
              />
            )}
          />
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Transfer'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
