"use client";

import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Box,
  Stack,
  Paper,
  useTheme,
  Fade,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { Task } from "@/types";
import CustomLoader from "./CustomLoader";

const images = [
  "/Screenshot (0).png",
  "/Screenshot (0.1).png",
  "/Screenshot (1).png",
  "/Screenshot (1.1).png",
  "/Screenshot (2).png",
  "/Screenshot (2.1).png",
  "/Screenshot (3).png",
  "/Screenshot (3.1).png",
  "/Screenshot (4).png",
  "/Screenshot (4.1).png",
  "/Screenshot (5).png",
  "/Screenshot (5.1).png",
  "/Screenshot (6).png",
  "/Screenshot (6.1).png",
];

// const columns = ["To Do", "In progress", "Review", "Done"];

export default function LandingPage() {
  const router = useRouter();
  const theme = useTheme();
  // const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // useEffect(() => {
  //   const loadTasks = async () => {
  //     try {
  //       const res = await fetchAll();
  //       setTasks(res.data.data || []);
  //     } catch (err) {
  //       console.error("Error fetching tasks:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   loadTasks();
  // }, []);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <CustomLoader />;
  }

  return (
    <Box>
      {/* Image Slider */}
      <Box
        sx={{
          width: "100%",
          height: 500,
          borderRadius: 3,
          overflow: "hidden",
          position: "relative",
          boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
        }}
      >
        {images.map((img, index) => (
          <Fade in={index === currentIndex} key={index} timeout={800}>
            <Box
              component="img"
              src={img}
              alt={`Screenshot ${index}`}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                position: "absolute",
                top: 0,
                left: 0,
              }}
            />
          </Fade>
        ))}
      </Box>
      {/* Hero Section */}
      <Box
        sx={{
          textAlign: "center",
          mt: 5,
          py: 10,
          background: "linear-gradient(135deg, #1976d2 30%, #42a5f5 90%)",
          color: "white",
          borderRadius: 5,
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" fontWeight="bold" gutterBottom>
            Kanban Todo App
          </Typography>
          <Typography variant="h6" sx={{ mb: 4 }}>
            Organize your tasks. Stay productive. Collaborate with your team.
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
          >
            <Button
              variant="contained"
              size="large"
              sx={{ backgroundColor: "white", color: "primary.main" }}
              onClick={() => router.push("/register")}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{ borderColor: "white", color: "white" }}
              onClick={() => router.push("/login")}
            >
              Login
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
          Why Choose Kanban Todo App?
        </Typography>
        <Grid container spacing={4} sx={{ mt: 5 }}>
          {[
            {
              title: "📝 Task Management",
              desc: "Create, update, and delete tasks with ease. Assign due dates and priorities.",
            },
            {
              title: "📊 Kanban Board",
              desc: "Move tasks across statuses like To Started, In Progress, Review, and Done. Visualize progress clearly.",
            },
            {
              title: "🔐 Roles & Permissions",
              desc: "Users manage their own tasks. Admins manage all tasks and statuses.",
            },
          ].map((feature, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                sx={{
                  borderRadius: 3,
                  border: 1,
                  borderColor: "text.secondary",
                  borderStyle: "solid",
                  boxShadow: "0px 8px 20px rgba(0,0,0,0.2)",
                  height: "100%",
                }}
              >
                <CardContent>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary">{feature.desc}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Kanban Preview Section */}
      {/* <Box>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            fontWeight="bold"
            align="center"
            gutterBottom
          >
            A Glimpse of Your Workflow
          </Typography>
          <Paper sx={{ mt: 5, p: 4, borderRadius: 5 }}>
            <Grid container spacing={2}>
              {columns.map((col, i) => (
                <Grid size={{ xs: 12, md: 3 }} key={i}>
                  <Paper
                    elevation={3}
                    sx={{
                      p: 2,
                      minHeight: 300,
                      borderRadius: 3,
                      border: 1,
                      borderColor: "text.secondary",
                      borderStyle: "solid",
                      boxShadow: "0px 8px 20px rgba(0,0,0,0.2)",
                      backgroundColor: theme.palette.background.default,
                    }}
                  >
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      color="primary"
                      gutterBottom
                    >
                      {col}
                    </Typography>
                    {tasks
                      .filter(
                        (task) =>
                          task.status &&
                          typeof task.status !== "string" &&
                          task.status.name.trim() === col
                      )
                      .slice(0, 2)
                      .map((task) => (
                        <Box
                          key={task.id}
                          sx={{
                            p: 1,
                            mb: 2,
                            borderRadius: 2,
                            border: 1,
                            borderColor: "text.secondary",
                            borderStyle: "solid",
                            boxShadow: "0px 8px 20px rgba(0,0,0,0.2)",
                            backgroundColor: theme.palette.background.paper,
                          }}
                        >
                          <Typography fontWeight="bold" variant="h5">
                            {task.title}
                          </Typography>
                          <Typography color="text.secondary">
                            {task.description}
                          </Typography>
                        </Box>
                      ))}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Container>
      </Box> */}

      {/* Roles Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
          Roles & Permissions
        </Typography>
        <Grid container spacing={4} sx={{ mt: 5 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              sx={{
                borderRadius: 3,
                border: 1,
                borderColor: "text.secondary",
                borderStyle: "solid",
                boxShadow: "0px 8px 20px rgba(0,0,0,0.2)",
                height: "100%",
              }}
            >
              <CardContent>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  👤 User
                </Typography>
                <Typography color="text.secondary">
                  • Register & login <br />
                  • Create, read, update, and delete their own tasks <br />
                  • Move tasks across statuses <br />• Dashboard with personal
                  tasks
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              sx={{
                borderRadius: 3,
                border: 1,
                borderColor: "text.secondary",
                borderStyle: "solid",
                boxShadow: "0px 8px 20px rgba(0,0,0,0.2)",
                height: "100%",
              }}
            >
              <CardContent>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  🛠️ Admin
                </Typography>
                <Typography color="text.secondary">
                  • Manage all tasks <br />
                  • Assign tasks to users <br />
                  • Create & manage statuses <br />• Dashboard with all tasks
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* CTA Footer */}
      <Box
        sx={{
          textAlign: "center",
          py: 8,
          background: "linear-gradient(135deg, #42a5f5 30%, #1976d2 90%)",
          color: "white",
          borderRadius: 5,
        }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Ready to boost your productivity?
        </Typography>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
          sx={{ mt: 2 }}
        >
          <Button
            variant="contained"
            size="large"
            sx={{ backgroundColor: "white", color: "primary.main" }}
            onClick={() => router.push("/register")}
          >
            Get Started
          </Button>
          <Button
            variant="outlined"
            size="large"
            sx={{ borderColor: "white", color: "white" }}
            onClick={() => router.push("/login")}
          >
            Login
          </Button>
        </Stack>
      </Box>

      {/* Footer */}
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        sx={{ py: 4 }}
      >
        © {new Date().getFullYear()} Kanban Todo App. All rights reserved.
      </Typography>
    </Box>
  );
}
