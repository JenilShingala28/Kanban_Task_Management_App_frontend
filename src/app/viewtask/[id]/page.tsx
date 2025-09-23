"use client";
import React, { useEffect, useState } from "react";
import { Container, Typography, Box } from "@mui/material";
import { useParams } from "next/navigation";
import TaskDetail from "@/components/TaskDetail";

export default function TaskViewPage() {
  const params = useParams();
  const id = params?.id as string;
  return (
    <Container disableGutters maxWidth="md" sx={{ py: 2 }}>
      <TaskDetail formId={id} />
    </Container>
  );
}
