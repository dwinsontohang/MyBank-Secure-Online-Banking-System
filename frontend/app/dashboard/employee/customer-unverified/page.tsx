"use client";

import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Alert,
  CircularProgress
} from '@mui/material';
import axios from 'axios';

interface PendingCustomer {
  username: string;
  full_name: string;
}

export default function CustomerApproval() {
  const [pendingCustomers, setPendingCustomers] = useState<PendingCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingCustomer, setProcessingCustomer] = useState<string | null>(null);

  const fetchPendingCustomers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'https://dwinson-csm.duckdns.org/api/employee/pending-customers',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setPendingCustomers(response.data.pending_customers);
    } catch (err) {
      console.error('Error fetching pending customers:', err);
      setError('Failed to load pending customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingCustomers();
  }, []);

  const handleApproval = async (username: string, approve: boolean) => {
    try {
      setProcessingCustomer(username);
      const token = localStorage.getItem('token');
      
      await axios.post(
        `https://dwinson-csm.duckdns.org/api/employee/verify-customer?username=${username}&approve=${approve}`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Refresh the list after approval/rejection
      await fetchPendingCustomers();
      setError('');
    } catch (err) {
      console.error('Error processing customer:', err);
      setError(`Failed to ${approve ? 'approve' : 'reject'} customer`);
    } finally {
      setProcessingCustomer(null);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Customer Approval
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>Username</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No pending customers found
                </TableCell>
              </TableRow>
            ) : (
              pendingCustomers.map((customer) => (
                <TableRow key={customer.username}>
                  <TableCell>{customer.username}</TableCell>
                  <TableCell>{customer.full_name}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <Button
                        variant="contained"
                        color="success"
                        disabled={processingCustomer === customer.username}
                        onClick={() => handleApproval(customer.username, true)}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        disabled={processingCustomer === customer.username}
                        onClick={() => handleApproval(customer.username, false)}
                      >
                        Reject
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
