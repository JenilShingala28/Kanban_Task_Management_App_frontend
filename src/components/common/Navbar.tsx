"use client";

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  IconButton,
} from "@mui/material";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { user, role, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar alt="Kanban Icon" src="/logo.ico" />
          <Typography
            variant="h6"
            component={Link}
            href="/dashboard"
            sx={{
              textDecoration: "none",
              color: "inherit",
              fontWeight: "bold",
            }}
          >
            Kanban App
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          {user ? (
            <>
              <Button color="inherit" component={Link} href="/dashboard">
                Dashboard
              </Button>
              <Button color="inherit" component={Link} href="/tasklist">
                Task List
              </Button>
              {role === "User" && (
                <>
                  <Button color="inherit" component={Link} href="/user/tasks">
                    Manage Tasks
                  </Button>
                  <Button
                    color="inherit"
                    component={Link}
                    href="/user/statuses"
                  >
                    View Statuses
                  </Button>
                </>
              )}
              {role === "Admin" && (
                <>
                  <Button color="inherit" component={Link} href="/admin/tasks">
                    Manage Tasks
                  </Button>
                  <Button
                    color="inherit"
                    component={Link}
                    href="/admin/statuses"
                  >
                    Manage Statuses
                  </Button>
                </>
              )}
              <IconButton
                onClick={() => router.push(`/profile/view/${user?.id}`)}
              >
                <Avatar
                  sx={{
                    border: 1,
                    borderColor: "text.secondary",
                    borderStyle: "solid",
                    boxShadow: "0px 6px 15px rgba(255, 128, 0, 0.4)",
                  }}
                  src={user?.profile_picture || "/default-avatar.png"}
                  alt={user?.first_name || "User"}
                />
              </IconButton>

              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} href="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} href="/register">
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
