"use client";

import React from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Stack,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { loginUser } from "@/services/authService";
import { useRouter } from "next/navigation";
import TextFields from "@/formComponents/TextFields";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";

const schema = z.object({
  email: z.string().nonempty("Email is required").email("Invalid email format"),
  password: z
    .string()
    .nonempty("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

type LoginValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginValues) => {
    try {
      const res = await loginUser(data);
      const { token, user } = res.data.data;

      // Handle role whether it’s string or object
      const roleName = user.role?.name || user.role;

      toast.success("Login successful!");
      login(user, token, roleName);

      setTimeout(() => router.push("/dashboard"), 1600);
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Login failed!";
      toast.error(message);
      // console.error("❌ Login failed:", error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Card>
        <CardHeader title="Login" />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <TextFields
                name="email"
                control={control}
                label="Email"
                type="email"
                placeholder="Enter your email"
                errors={errors}
                rules={{ required: "Email is required" }}
              />
              <TextFields
                name="password"
                control={control}
                label="Password"
                type="password"
                placeholder="Enter your password"
                errors={errors}
                rules={{ required: "Password is required" }}
              />
              <Button type="submit" variant="contained" fullWidth>
                Login
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}
