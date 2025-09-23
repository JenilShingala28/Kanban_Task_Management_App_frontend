"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Stack,
  Avatar,
  Button,
  Container,
  Divider,
  Paper,
  useTheme,
  Grid,
} from "@mui/material";
import { green, red } from "@mui/material/colors";
import { useParams, useRouter } from "next/navigation";
import { fetchTaskById } from "@/services/authService";
import CustomLoader from "./common/CustomLoader";

// interface Status {
//   id: string;
//   name: string;
// }

// interface Assignee {
//   id: string;
//   first_name: string;
//   last_name: string;
//   email: string;
//   profile_picture?: string | null;
// }

// interface Task {
//   id: string;
//   title: string;
//   description?: string;
//   dueDate?: string | null;
//   status?: Status | null;
//   assignee?: Assignee | null;
//   priority?: string;
// }

type TaskViewsProps = {
  formId: string;
};

export default function TaskDetail({ formId }: TaskViewsProps) {
  const router = useRouter();
  const theme = useTheme();
  const params = useParams();
  const id = params?.id as string;
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return;
        const res = await fetchTaskById(id);
        setTask(res.data.data);
      } catch (err) {
        console.error("Error fetching task:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <CustomLoader />;

  if (!task) {
    return (
      <Container sx={{ py: 5 }}>
        <Typography variant="h6">Task not found</Typography>
        <Button variant="contained" onClick={() => router.push("/tasks")}>
          Back to Tasks
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 1 }}>
      <Typography
        variant="h4"
        sx={{ mb: 4, color: theme.palette.primary.main, textAlign: "center" }}
      >
        Task Details
      </Typography>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          backgroundColor: theme.palette.background.paper,
          border: 1,
          borderColor: "text.secondary",
          borderStyle: "solid",
          boxShadow: "0px 8px 20px rgba(0,0,0,0.2)",
        }}
      >
        <Typography variant="h2" gutterBottom textAlign={"center"}>
          {task.title}
        </Typography>

        <Divider />

        <Grid>
          <Typography variant="h3" sx={{ m: 3 }}>
            <strong>Description:</strong> {task.description || "-"}
          </Typography>
        </Grid>
        <Grid container spacing={4} sx={{ mt: 5, mb: 3, px: 10 }}>
          {/* Left side - Details */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={2}>
              <Typography variant="h4">
                <strong style={{ fontSize: "1.25rem", fontWeight: 500 }}>
                  Due Date:
                </strong>{" "}
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString()
                  : "-"}
              </Typography>

              <Stack direction="row" spacing={1} alignItems="center">
                <strong style={{ fontSize: "1.25rem", fontWeight: 500 }}>
                  Status:
                </strong>
                <Chip
                  label={task.status?.name || "-"}
                  size="small"
                  sx={{
                    py: 2,
                    fontSize: "1.25rem",
                    fontWeight: 500,
                    borderRadius: 1,
                    backgroundColor:
                      task.status?.name === "Done" ? green[100] : red[100],
                    color: task.status?.name === "Done" ? green[800] : red[800],
                  }}
                />
              </Stack>

              {task.assignee && (
                <>
                  <Typography variant="h4">
                    <strong style={{ fontSize: "1.25rem", fontWeight: 500 }}>
                      Name:
                    </strong>{" "}
                    {task.assignee.first_name} {task.assignee.last_name}
                  </Typography>
                  <Typography variant="h4">
                    <strong style={{ fontSize: "1.25rem", fontWeight: 500 }}>
                      Email:
                    </strong>{" "}
                    {task.assignee.email}
                  </Typography>
                </>
              )}

              <Typography variant="h4">
                <strong style={{ fontSize: "1.25rem", fontWeight: 500 }}>
                  Priority:
                </strong>{" "}
                {task.priority || "-"}
              </Typography>
            </Stack>
          </Grid>

          {/* Right side - Avatar */}
          <Grid
            size={{ xs: 12, md: 4 }}
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{
              borderRadius: 3,
              border: 1,
              borderColor: "text.secondary",
              borderStyle: "solid",
              boxShadow: "0px 8px 20px rgba(0,0,0,0.2)",
            }}
          >
            {task.assignee?.profile_picture ? (
              <Avatar
                src={task.assignee.profile_picture}
                alt={task.assignee.first_name}
                sx={{ width: 150, height: 150 }}
              />
            ) : (
              <Avatar sx={{ width: 150, height: 150 }}>
                {task.assignee?.first_name?.[0] || "?"}
              </Avatar>
            )}
          </Grid>
        </Grid>

        <Divider />

        {/* Back Button */}
        <Box mt={4} display="flex" justifyContent="center">
          <Button variant="contained" onClick={() => router.push("/tasklist")}>
            Back to Tasks
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
