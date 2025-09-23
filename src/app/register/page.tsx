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
import { registerUser } from "@/services/authService";
import { useRouter } from "next/navigation";
import TextFields from "@/formComponents/TextFields";
import FileUpload from "@/formComponents/FileUpload";
import { toast } from "react-toastify";

// ---- Schema ----
const schema = z.object({
  first_name: z
    .string()
    .nonempty("First name required")
    .min(2, "First name required at last 2 caracter"),
  last_name: z
    .string()
    .nonempty("Last name is required")
    .min(2, "Last name required at last 2 character"),
  email: z.string().nonempty("Email is required").email("Invalid email format"),
  password: z
    .string()
    .nonempty("Password is required")
    .min(6, "Password must be at least 6 characters"),
  profile_picture: z
    .any()
    .refine(
      (file) =>
        file instanceof File ||
        (Array.isArray(file) && file[0] instanceof File),
      { message: "Profile picture is required" }
    ),
});

type RegisterValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      profile_picture: null,
    },
  });

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const onSubmit = async (data: RegisterValues) => {
    try {
      let payload: any = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
      };

      // Handle profile picture if uploaded
      const file =
        data.profile_picture instanceof File
          ? data.profile_picture
          : Array.isArray(data.profile_picture)
          ? data.profile_picture[0]
          : null;

      if (file instanceof File) {
        const base64Image = await fileToBase64(file);
        payload.profile_picture = base64Image; // only send if file exists
      }

      const res = await registerUser(payload);

      console.log("✅ Registered:", res.data);
      // router.push("/login");

      if (res.data.status) {
        toast.success("Registered successfully!");
        router.push("/login");
      } else {
        toast.error(res.data.message || "Registration failed");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong during registration"
      );
      // console.error("❌ Registration failed:", error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Card>
        <CardHeader title="Register" />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <TextFields
                name="first_name"
                control={control}
                label="First Name"
                placeholder="Enter your first name"
                errors={errors}
                rules={{ required: "First name is required" }}
              />
              <TextFields
                name="last_name"
                control={control}
                label="Last Name"
                placeholder="Enter your last name"
                errors={errors}
                rules={{ required: "Last name is required" }}
              />
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

              <FileUpload
                name="profile_picture"
                control={control}
                label="Profile Picture"
                errors={errors}
                // rules={{ required: "profile_picture is required" }}
              />

              <Button type="submit" variant="contained" fullWidth>
                Register
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}
