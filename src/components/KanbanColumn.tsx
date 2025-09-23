"use client";

import React from "react";
import { Paper, Typography, Stack, Chip, useTheme } from "@mui/material";
import TaskCard from "./TaskCard";
import { Task, Status } from "@/types";

import { useDroppable } from "@dnd-kit/core";

interface KanbanColumnProps {
  status: Status;
  tasks: Task[];
  statuses: Status[];
  onMoveTask: (taskId: string, statusId: string) => void;
}

export default function KanbanColumn({
  status,
  tasks,
  statuses,
  onMoveTask,
}: KanbanColumnProps) {
  const theme = useTheme();

  const { setNodeRef } = useDroppable({ id: status.id });

  return (
    <Paper
      ref={setNodeRef}
      sx={{
        p: 2,
        minHeight: "100%",
        backgroundColor: theme.palette.background.default,
        borderRadius: 2,
        border: 1,
        borderColor: "text.secondary",
        borderStyle: "solid",
        boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
      }}
    >
      {/* Column Title */}

      <Chip
        label={` ${status.name} (${tasks.length})`} // order: [${status.order ?? "-"}]
        color="primary"
        sx={{ mb: 2, width: "100%", fontWeight: "bold", borderRadius: 1 }}
      />
      {/* Tasks */}
      <Stack spacing={2}>
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            currentStatus={status}
            statuses={statuses}
            onMoveTask={onMoveTask}
          />
        ))}
      </Stack>
    </Paper>
  );
}
