"use client";

import { useState } from "react";
import { TextField, Button, Container, Typography, Box, CircularProgress } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";

export default function CustomerLoginComponent() {
  const { control, handleSubmit } = useForm();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://dwinson-csm.duckdns.org/api/auth/customer-login",
        data
      );

      console.log("Login success:", response.data);
      setError("");

      const { access_token, role } = response.data;

      localStorage.setItem("token", access_token);
      localStorage.setItem("role", role);

      Cookies.set("token", access_token, { secure: true, sameSite: "Strict" });
      Cookies.set("role", role, { secure: true, sameSite: "Strict" });

      if (role === "customer") {
        router.push("/dashboard/customer");
      } else if (role === "employee") {
        router.push("/dashboard/employee");
      } else if (role === "admin") {
        router.push("/dashboard/admin");
      } else {
        setError("Invalid role, please contact support.");
        setLoading(false);
      }

    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid credentials or OTP.");
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: "white" }}>
        <Typography variant="h4" textAlign="center" gutterBottom>
          Customer Login
        </Typography>

        <Typography variant="h5" textAlign="center" gutterBottom>
          Welcome to MyBank System
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="username"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField {...field} label="Username" fullWidth margin="normal" required />
            )} />

          <Controller
            name="password"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField {...field} label="Password" type="password" fullWidth margin="normal" required />
            )} />

          <Controller
            name="otp_code"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField {...field} label="OTP Code" type="text" fullWidth margin="normal" required />
            )} />

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

        <Typography textAlign="center" sx={{ mt: 2 }}>
          Don't have an account?{" "}
          <Link href="/auth/customer-register">
            Register here
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}
