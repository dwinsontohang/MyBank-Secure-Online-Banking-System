"use client";

import { useState } from "react";
import { TextField, Button, Container, Typography, Box, CircularProgress } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function AdminLoginComponent() {
  const { control, handleSubmit } = useForm();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://dwinson-csm.duckdns.org/api/auth/admin-login",
        data
      );

      console.log("Login success:", response.data);
      setError("");

      const { access_token } = response.data;

      // Manually set role as admin since it's an admin-specific login
      localStorage.setItem("token", access_token);
      localStorage.setItem("role", "admin");

      Cookies.set("token", access_token, { secure: true, sameSite: "Strict" });
      Cookies.set("role", "admin", { secure: true, sameSite: "Strict" });

      router.push("/dashboard/admin");

    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid credentials.");
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: "white" }}>
        <Typography variant="h5" textAlign="center" gutterBottom>
          Admin Login
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="username"
            control={control}
            defaultValue=""
            rules={{ required: 'Username is required' }}
            render={({ field, fieldState: { error } }) => (
              <TextField 
                {...field}
                label="Username"
                fullWidth
                margin="normal"
                error={!!error}
                helperText={error?.message}
                required
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            defaultValue=""
            rules={{ required: 'Password is required' }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                error={!!error}
                helperText={error?.message}
                required
              />
            )}
          />

          <Controller
            name="otp_code"
            control={control}
            defaultValue=""
            rules={{ required: 'OTP is required' }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="OTP Code"
                type="text"
                fullWidth
                margin="normal"
                error={!!error}
                helperText={error?.message}
                required
              />
            )}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>

          {error && (
            <Typography color="error" textAlign="center" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </form>
      </Box>
    </Container>
  );
}
