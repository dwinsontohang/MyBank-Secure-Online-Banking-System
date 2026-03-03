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
  Alert,
  CircularProgress,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';

interface Employee {
  username: string;
  full_name: string;
}

export default function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          'https://dwinson-csm.duckdns.org/api/admin/get-employees',
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        setEmployees(response.data.employees);
      } catch (err) {
        console.error('Error fetching employees:', err);
        setError('Failed to load employees');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleDelete = async (username: string) => {
    setSelectedEmployee(username);
    setDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!selectedEmployee) return;

    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `https://dwinson-csm.duckdns.org/api/admin/delete-employee?username=${selectedEmployee}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Remove employee from list
      setEmployees(employees.filter(emp => emp.username !== selectedEmployee));
      setError('');
    } catch (err) {
      console.error('Error deleting employee:', err);
      setError('Failed to delete employee');
    } finally {
      setProcessing(false);
      setDeleteDialog(false);
      setSelectedEmployee(null);
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
        Employee List
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
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
            {employees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No employees found
                </TableCell>
              </TableRow>
            ) : (
              employees.map((employee) => (
                <TableRow key={employee.username}>
                  <TableCell>{employee.username}</TableCell>
                  <TableCell>{employee.full_name}</TableCell>
                  <TableCell align="center">
                    <Button
                      startIcon={<DeleteIcon />}
                      color="error"
                      onClick={() => handleDelete(employee.username)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Confirmation Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this employee?
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialog(false)} 
            disabled={processing}
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmDelete} 
            color="error" 
            disabled={processing}
            startIcon={processing ? <CircularProgress size={20} /> : null}
          >
            {processing ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
