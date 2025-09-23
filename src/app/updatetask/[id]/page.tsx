"use client";
import React from "react";
import { Container } from "@mui/material";
import { useParams } from "next/navigation";
import TaskUpdatePage from "@/components/UpdateTask";

export default function TaskUpdtaePage() {
  const params = useParams();
  const id = params?.id as string;
  return (
    <Container disableGutters maxWidth="md" sx={{ py: 5 }}>
      <TaskUpdatePage taskId={id} />
    </Container>
  );
}
