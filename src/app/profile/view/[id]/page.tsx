"use client";

import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Avatar,
  Stack,
  Button,
  Card,
  CardContent,
  useTheme,
  Box,
  Grid,
  Divider,
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { fetchUserById } from "@/services/authService";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BadgeIcon from "@mui/icons-material/Badge";
import CustomLoader from "@/components/common/CustomLoader";

export default function ViewProfilePage() {
  const theme = useTheme();
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchUserById(id as string)
      .then((res) => setUser(res.data.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <CustomLoader />;

  return (
    <Container maxWidth="sm" sx={{ mt: 3, mb: 2 }}>
      <Card
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 2,
          borderRadius: 2,
          border: 1,
          borderColor: "text.secondary",
          borderStyle: "solid",
          boxShadow: "0px 8px 20px rgba(0,0,0,0.2)",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            boxShadow: "0px 12px 25px rgba(0,0,0,0.3)",
          },
        }}
      >
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid size={{}}>
              <Avatar
                src={user.profile_picture}
                alt={user.first_name}
                sx={{
                  width: 120,
                  height: 120,
                  border: 2,
                  borderColor: "text.secondary",
                  borderStyle: "solid",
                  boxShadow: "0px 6px 15px rgba(255, 128, 0, 0.3)",
                  backgroundColor: theme.palette.background.default,
                }}
              />
            </Grid>
            <Grid size={{}}>
              <Typography variant="h5" fontWeight="bold">
                {user.first_name} {user.last_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Profile Overview
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Info Section */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }} display="flex" alignItems="center" gap={1}>
              <EmailIcon color="primary" />
              <Typography>
                <strong>Email:</strong> {user.email}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12 }} display="flex" alignItems="center" gap={1}>
              <PhoneIcon color="primary" />
              <Typography>
                <strong>Mobile:</strong> {user.mobile}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12 }} display="flex" alignItems="center" gap={1}>
              <BadgeIcon color="primary" />
              <Typography>
                <strong>Role:</strong> {user.role}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Actions */}
          <Box textAlign="center">
            <Button
              variant="contained"
              size="large"
              onClick={() => router.push(`/profile/edit/${user.id}`)}
            >
              Edit Profile
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
