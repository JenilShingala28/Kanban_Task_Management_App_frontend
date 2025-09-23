"use client";

import React, { useEffect, useState } from "react";
import { Grid, Typography, Button, Stack, Box, useTheme } from "@mui/material";
import KanbanColumn from "@/components/KanbanColumn";
import TaskModal from "@/components/TaskModel";
import {
  fetchStatuses,
  fetchTasks,
  moveTaskStatus,
} from "@/services/authService";
import { Status, Task } from "@/types";
import { useAuth } from "@/context/AuthContext";

import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";

import "react-toastify/dist/ReactToastify.css";
import CustomLoader from "./common/CustomLoader";
import { toast } from "react-toastify";

export default function KanbanBoard() {
  const { user } = useAuth();
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const loadData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const [statusRes, taskRes] = await Promise.all([
        fetchStatuses(),
        fetchTasks(),
      ]);

      let allStatuses: Status[] = statusRes.data.data || [];
      let allTasks: Task[] = taskRes.data.data || [];

      allStatuses.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

      setStatuses(allStatuses);
      setTasks(allTasks);
    } catch (err: any) {
      // toast.error(err.response?.data?.message || "Failed to load board!");

      console.error("Error loading board:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    console.log("Logged-in user:", user);
  }, [user]);

  const handleMoveTask = async (taskId: string, statusId: string) => {
    try {
      await moveTaskStatus({ id: taskId, status: statusId });
      loadData();
    } catch (err: any) {
      // toast.error(err.response?.data?.message || "Failed to move task!");
      console.error("Error moving task:", err);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const newStatusId = over.id as string;

    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const oldStatusId =
      typeof task.status === "string" ? task.status : task.status.id;

    if (newStatusId !== oldStatusId) {
      // Show toast BEFORE reloading
      const oldStatusName =
        statuses.find((s) => s.id === oldStatusId)?.name || "Unknown";
      const newStatusName =
        statuses.find((s) => s.id === newStatusId)?.name || "Unknown";
      try {
        // Move task
        await moveTaskStatus({ id: taskId, status: newStatusId });
        toast.success(
          `Task moved from "${oldStatusName}" to "${newStatusName}"`
        );

        loadData();
      } catch (err: any) {
        console.error("Error moving task:", err);
        toast.error(err.response?.data?.message || "Failed to move task!");
      }
    }
  };

  if (loading) return <CustomLoader />;

  return (
    <>
      <Typography variant="h3" color="primary.main" gutterBottom>
        Kanban Board
      </Typography>

      <Button
        variant="contained"
        onClick={() => setModalOpen(true)}
        sx={{ my: 3 }}
      >
        Create Task
      </Button>

      {tasks.length === 0 ? (
        <Typography variant="h6" color="text.secondary">
          No tasks provided.
        </Typography>
      ) : (
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <Box
            sx={{
              display: "flex",
              gap: 2,
              overflowX: "auto",
              pb: 2,
              scrollbarWidth: "thin",
            }}
          >
            {statuses.map((status) => (
              <Box key={status.id} sx={{ minWidth: 400, flexShrink: 0 }}>
                <KanbanColumn
                  status={status}
                  statuses={statuses}
                  tasks={tasks.filter(
                    (t) =>
                      (typeof t.status === "string"
                        ? t.status
                        : t.status.id) === status.id
                  )}
                  onMoveTask={handleMoveTask}
                />
              </Box>
            ))}
          </Box>
        </DndContext>
      )}

      {modalOpen && (
        <TaskModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSaved={loadData}
        />
      )}
    </>
  );
}
