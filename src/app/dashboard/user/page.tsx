"use client";

import React from "react";
import { Container } from "@mui/material";
import KanbanBoard from "@/components/KanbanBoard";
import RoleGuard from "@/utils/roleGuard";

export default function UserDashboardPage() {
  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <RoleGuard allowedRoles={["User"]}>
        <KanbanBoard />
      </RoleGuard>
    </Container>
  );
}
