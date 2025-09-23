"use client";

import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Stack,
  Avatar,
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { fetchUserById, updateUser } from "@/services/authService";
import CustomLoader from "@/components/common/CustomLoader";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";

export default function EditProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState<any>({
    first_name: "",
    last_name: "",
    email: "",
    mobile: "",
    profile_picture: "",
  });
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<string | null>(null); // ✅ for showing preview
  const { updateUserData } = useAuth();

  useEffect(() => {
    if (!id) return;
    fetchUserById(id as string)
      .then((res) => {
        setForm(res.data.data);
        setPreview(res.data.data.profile_picture);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // ✅ Handle image input
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      setForm({ ...form, profile_picture: base64 }); // ✅ send Base64 to backend
      setPreview(base64); // ✅ update preview
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { first_name, last_name, email, mobile, profile_picture } = form;
      const res = await updateUser({
        id,
        first_name,
        last_name,
        email,
        mobile,
        profile_picture,
      });

      updateUserData(res.data.data);

      toast.success("Profile updated successfully!");

      router.push(`/profile/view/${id}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update profile");

      console.error("❌ Error updating user:", err);
    }
  };

  if (loading) return <CustomLoader />;

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h5" mb={3}>
        Update Profile
      </Typography>

      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <Avatar
            src={preview || form.profile_picture || "/default-avatar.png"}
            // src={form.profile_picture}
            sx={{ width: 80, height: 80, mb: 2 }}
          />
          <Button variant="outlined" component="label">
            Upload New Image
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </Button>
          <TextField
            name="first_name"
            label="First Name"
            value={form.first_name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="last_name"
            label="Last Name"
            value={form.last_name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="email"
            label="Email"
            value={form.email}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="mobile"
            label="Mobile"
            value={form.mobile}
            onChange={handleChange}
            fullWidth
          />
          <Button type="submit" variant="contained">
            Save Changes
          </Button>
        </Stack>
      </form>
    </Container>
  );
}
