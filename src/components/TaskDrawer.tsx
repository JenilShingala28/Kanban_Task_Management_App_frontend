"use client";

import React from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Avatar,
  Chip,
  Stack,
  Card,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { Task, User, Status } from "@/types";

interface TaskDrawerProps {
  open: boolean;
  onClose: () => void;
  task?: Task | null;
}

export default function TaskDrawer({ open, onClose, task }: TaskDrawerProps) {
  if (!task) return null; // only render when both open & task exist

  // If assignee or status is string, normalize it for display
  const assignee = typeof task.assignee === "string" ? null : task.assignee;
  const status =
    typeof task.status === "string"
      ? { id: "", name: task.status }
      : task.status;
  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "error";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "default";
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: 350,
          height: "100%",
          borderRadius: "16px 0 0 16px",
          backgroundColor: "background.default",
        },
      }}
    >
      {/* Drawer content */}
      <Box sx={{ p: 2, overflowY: "auto", height: "100%" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            pt: 1,
            pl: 1,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Task Details
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />
        <Typography variant="h5" fontWeight="600" sx={{ mt: 2 }}>
          {task.title}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <strong>Description:</strong>

          {task.description && (
            <Typography
              variant="body1"
              sx={{
                m: 1,
                p: 1,
                border: 1,
                borderRadius: 2,
                borderColor: "text.secondary",
                borderStyle: "solid",
                boxShadow: "0px 8px 20px rgba(0,0,0,0.2)",
                // backgroundColor: theme.palette.background.default,
              }}
            >
              {task.description}
            </Typography>
          )}
        </Box>

        <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
          Due Date :{" "}
          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"}
        </Typography>

        <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 2 }}>
          Priority :{" "}
          <Chip
            label={task.priority ? task.priority.toUpperCase() : "N/A"}
            color={getPriorityColor(task.priority)}
          />
        </Typography>

        <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 2 }}>
          Status :{" "}
          <Chip
            label={status.name || "Unknown"}
            color="primary"
            variant="outlined"
          />
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
          Assignee
        </Typography>
        {assignee ? (
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              src={assignee.profile_picture || undefined}
              sx={{ width: 48, height: 48 }}
            >
              {assignee.first_name[0]}
            </Avatar>
            <Box>
              <Typography fontWeight="600">
                {assignee.first_name} {assignee.last_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {assignee.email}
              </Typography>
            </Box>
          </Stack>
        ) : (
          <Typography color="text.secondary">Unassigned</Typography>
        )}
      </Box>
    </Drawer>
  );
}
