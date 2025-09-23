"use client";

import React, { useEffect, useState } from "react";
import { Grid, Typography, Button, useTheme, Box } from "@mui/material";
import { fetchTasks, deleteTask } from "@/services/authService";
import { Task } from "@/types";
import TaskModal from "@/components/TaskModel";
import CustomLoader from "@/components/common/CustomLoader";
import RoleGuard from "@/utils/roleGuard";
import { toast } from "react-toastify";

export default function AdminTasksPage() {
  const theme = useTheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const res = await fetchTasks();
      setTasks(res.data.data || []);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to load tasks";
      toast.error(msg);
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(id);
        loadTasks();
      } catch (err) {
        console.error("Error deleting task:", err);
      }
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setEditingTask(null);
    setOpenModal(false);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <RoleGuard allowedRoles={["Admin"]}>
      <div style={{ padding: "20px", marginTop: "20px" }}>
        <Typography variant="h3" color="primary.main" gutterBottom>
          Manage All Tasks
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenModal(true)}
          sx={{ my: 2 }}
        >
          Create Task
        </Button>

        {loading ? (
          <CustomLoader />
        ) : (
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {tasks.map((task) => (
              <Grid
                key={task.id}
                size={{ xs: 12, sm: 6, md: 4 }}
                style={{
                  border: 1,
                  borderColor: "text.secondary",
                  borderStyle: "solid",
                  boxShadow: "0px 8px 20px rgba(0,0,0,0.2)",
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: "8px",
                  padding: "12px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <Typography variant="h4" sx={{ m: 1 }}>
                    {task.title}
                  </Typography>
                  {task.description && (
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      color="text.secondary"
                      sx={{ m: 1 }}
                    >
                      {task.description}
                    </Typography>
                  )}
                  {task.dueDate && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontSize={20}
                      sx={{ m: 1 }}
                    >
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </Typography>
                  )}
                  <Typography variant="h6" sx={{ m: 1 }}>
                    Status:{" "}
                    {typeof task.status === "string"
                      ? task.status
                      : task.status?.name}
                  </Typography>
                  <Box m={1}>
                    <label>Priority:</label>
                    <Typography
                      variant="caption"
                      sx={{
                        mx: 1,
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        color: "white",
                        bgcolor:
                          task.priority === "high"
                            ? "error.main"
                            : task.priority === "medium"
                            ? "warning.main"
                            : task.priority === "low"
                            ? "success.main"
                            : "grey.500",
                      }}
                    >
                      {typeof task.priority === "string"
                        ? task.priority
                        : task.priority}{" "}
                    </Typography>
                  </Box>

                  {typeof task.assignee !== "string" && task.assignee && (
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ m: 1 }}
                      fontSize={15}
                    >
                      Assigned to: {task.assignee.first_name}{" "}
                      {task.assignee.last_name}
                    </Typography>
                  )}
                </div>

                <div style={{ marginTop: "12px" }}>
                  <Button
                    sx={{
                      ml: 1,
                      mr: 2,
                      borderRadius: 2,
                      border: 1,
                      borderColor: "text.secondary",
                      borderStyle: "solid",
                      boxShadow: "0px 8px 20px rgba(0,0,0,0.2)",
                      backgroundColor: theme.palette.background.default,
                    }}
                    size="small"
                    onClick={() => handleEdit(task)}
                  >
                    Edit
                  </Button>
                  <Button
                    sx={{
                      borderRadius: 2,
                      border: 1,
                      borderColor: "text.secondary",
                      borderStyle: "solid",
                      boxShadow: "0px 8px 20px rgba(0,0,0,0.2)",
                      backgroundColor: theme.palette.background.default,
                    }}
                    size="small"
                    color="error"
                    onClick={() => handleDelete(task.id)}
                  >
                    Delete
                  </Button>
                </div>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Modal for Create or Edit */}
        <TaskModal
          open={openModal}
          onClose={handleCloseModal}
          onSaved={loadTasks}
          editingTask={editingTask}
        />
      </div>
    </RoleGuard>
  );
}
