"use client";
import KanbanBoard from "@/components/KanbanBoard";
import RoleGuard from "@/utils/roleGuard";
import { Container } from "@mui/material";
import React from "react";

export default function DashboardPage() {
  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <RoleGuard allowedRoles={["Admin"]}>
        <KanbanBoard />
      </RoleGuard>
    </Container>
  );
}
