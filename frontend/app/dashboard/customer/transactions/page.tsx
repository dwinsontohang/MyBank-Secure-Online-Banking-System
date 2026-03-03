"use client";

import { useEffect, useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box
} from '@mui/material';
import axios from 'axios';

interface Transaction {
  id: number;
  sender: string;
  receiver: string;
  amount: string;
  transaction_type: string;
  created_at: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication token not found');
          return;
        }

        const response = await axios.get(
          'https://dwinson-csm.duckdns.org/api/transactions/customer-transactions',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        if (response.data.transactions) {
          setTransactions(response.data.transactions);
        } else {
          setError('No transactions found');
        }
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError('Failed to load transactions. Please try again later.');
      }
    };

    fetchTransactions();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Transaction History
      </Typography>

      {error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>Transaction ID</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>From</TableCell>
                <TableCell>To</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.id}</TableCell>
                  <TableCell sx={{
                    textTransform: 'capitalize',
                    color: transaction.transaction_type === 'transfer' ? 'primary.main' : 'text.primary'
                  }}>
                    {transaction.transaction_type}
                  </TableCell>
                  <TableCell>{transaction.sender}</TableCell>
                  <TableCell>{transaction.receiver}</TableCell>
                  <TableCell align="right">
                    ${Number(transaction.amount).toFixed(2)}
                  </TableCell>
                  <TableCell>{formatDate(transaction.created_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
