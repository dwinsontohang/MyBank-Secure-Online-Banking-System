"use client";

import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
  Stack
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import axios from 'axios';

interface Transaction {
  id: number;
  sender: string;
  receiver: string;
  amount: string;
  transaction_type: string;
  created_at: string;
}

export default function TransactionHistory() {
  const [username, setUsername] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `https://dwinson-csm.duckdns.org/api/transactions/history/${username}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setTransactions(response.data.transactions);
      setSearched(true);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to fetch transactions');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Transaction History
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            label="Customer Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            size="small"
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={loading}
            startIcon={<SearchIcon />}
          >
            Search
          </Button>
        </Stack>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        searched && (
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
                {transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No transactions found
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((transaction) => (
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
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )
      )}
    </Box>
  );
}
