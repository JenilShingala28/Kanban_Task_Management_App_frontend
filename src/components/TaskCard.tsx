"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  useTheme,
  Box,
} from "@mui/material";
import { Task, Status } from "@/types";
import TaskDrawer from "./TaskDrawer";

import { useDraggable } from "@dnd-kit/core";

interface TaskCardProps {
  task: Task;
  currentStatus: Status;
  statuses: Status[];
  onMoveTask: (taskId: string, statusId: string) => void;
}

export default function TaskCard({
  task,
  currentStatus,
  statuses,
  onMoveTask,
}: TaskCardProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const priority = (task.priority || "medium").toLowerCase();
  const theme = useTheme();

  // Make draggable
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
    });

  return (
    <>
      <Card
        ref={setNodeRef}
        sx={{
          p: 1,
          borderRadius: 2,
          border: 1,
          borderColor: "text.secondary",
          borderStyle: "solid",
          boxShadow: "0px 8px 20px rgba(0,0,0,0.2)",
          backgroundColor: theme.palette.background.paper,
          transform: transform
            ? `translate(${transform.x}px, ${transform.y}px)`
            : undefined,
          opacity: isDragging ? 0.3 : 1,
          cursor: "grab",
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{
              cursor: "pointer",
              "&:hover": { textDecoration: "none" },
            }}
            onClick={() => setDrawerOpen(true)}
          >
            {task.title}
          </Typography>

          <Box {...listeners}>
            {task.description && (
              <Typography
                variant="subtitle1"
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                {task.description}
              </Typography>
            )}
            {task.dueDate && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1, mb: 1 }}
              >
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </Typography>
            )}
            {/* Priority */}
            <Typography
              variant="caption"
              sx={{
                mt: 1,
                px: 1,
                py: 0.5,
                borderRadius: 1,
                color: "white",
                bgcolor:
                  priority === "high"
                    ? "error.main"
                    : priority === "medium"
                    ? "warning.main"
                    : priority === "low"
                    ? "success.main"
                    : "grey.500",
              }}
            >
              {priority.toUpperCase()}
            </Typography>

            {/* {task.status && (
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                status:{" "}
                {typeof task.status === "string"
                  ? statuses.find((s) => s.id === task.status)?.name ||
                    "Unknown"
                  : task.status.name}
              </Typography>
            )}
            {typeof task.assignee !== "string" && task.assignee && (
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                Assigned to: {task.assignee.first_name}{" "}
                {task.assignee.last_name}
              </Typography>
            )} */}
          </Box>
        </CardContent>
      </Card>

      {/* Drawer for details */}
      <TaskDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        task={drawerOpen ? task : null}
      />
    </>
  );
}
