"use client";
import TaskListPage from "@/components/TaskList";
import { Container } from "@mui/material";
import React from "react";

export default function page() {
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <TaskListPage />
    </Container>
  );
}
