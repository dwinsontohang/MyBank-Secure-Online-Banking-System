"use client";

import { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface RegisterForm {
  full_name: string;
  username: string;
  password: string;
  id_number: string;
}

export default function CustomerRegister() {
  const { control, handleSubmit, reset } = useForm<RegisterForm>();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const generateIdNumber = () => {
    return Math.floor(Math.random() * 9000000000 + 1000000000).toString();
  };

  const onSubmit = async (data: RegisterForm) => {
    try {
      const registrationData = {
        ...data,
        id_number: generateIdNumber()
      };

      await axios.post(
        "https://dwinson-csm.duckdns.org/api/auth/register",
        registrationData
      );

      setSuccess(true);
      setError("");
      reset();
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/auth/customer-login");
      }, 2000);

    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.response?.data?.detail || "Registration failed. Please try again.");
      setSuccess(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: "white" }}>
        <Typography variant="h5" textAlign="center" gutterBottom>
          Customer Registration
        </Typography>

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Registration successful! Redirecting to login...
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
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
                fullWidth
                margin="normal"
                error={!!error}
                helperText={error?.message}
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
                fullWidth
                margin="normal"
                error={!!error}
                helperText={error?.message}
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
                fullWidth
                margin="normal"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>

          <Typography textAlign="center">
            Already have an account?{" "}
            <Link href="/auth/customer-login">
              Login here
            </Link>
          </Typography>
        </form>
      </Box>
    </Container>
  );
}
