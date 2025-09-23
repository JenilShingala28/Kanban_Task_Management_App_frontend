"use client";
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Stack,
  Card,
  CardHeader,
  CardContent,
  Grid,
  FormLabel,
  Box,
  Button,
  Avatar,
  useTheme,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import * as z from "zod";

import {
  createTask,
  updateTask,
  fetchUsers,
  fetchStatuses,
  fetchTaskById,
} from "@/services/authService";
import { useAuth } from "@/context/AuthContext";
import TextFields from "@/formComponents/TextFields";
import Selects from "@/formComponents/Select";
import DatePickers from "@/formComponents/Date";
import CustomLoader from "./common/CustomLoader";
import { toast } from "react-toastify";

const schema = z.object({
  title: z
    .string()
    .nonempty("Title is required")
    .min(4, "Title must be at least 4 characters"),
  description: z
    .string()
    .nonempty("Description is required")
    .min(5, "Description must be at least 5 characters"),
  dueDate: z.string().nonempty("Due Date is required"),
  priority: z.enum(["low", "medium", "high"]),
  status: z.string().nonempty("Status is required"),
  assignee: z.string().nonempty("Assignee is required"),
});

type TaskFormValues = z.infer<typeof schema>;

type TaskUpdateProps = {
  taskId: string;
};

export default function TaskUpdatePage({ taskId }: TaskUpdateProps) {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { user } = useAuth();
  const theme = useTheme();

  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const statusRes = await fetchStatuses();
        setStatuses(statusRes.data.data || []);

        if (user?.role === "Admin") {
          const userRes = await fetchUsers();
          setUsers(userRes.data.data || []);
        }

        if (id) {
          const res = await fetchTaskById(id);
          const fetchedTask = res.data.data;
          setTask(fetchedTask);

          reset({
            title: fetchedTask.title,
            description: fetchedTask.description || "",
            dueDate: fetchedTask.dueDate || "",
            // dueDate: fetchedTask.dueDate
            //   ? new Date(fetchedTask.dueDate).toISOString()
            //   : "",
            priority: fetchedTask.priority as "low" | "medium" | "high",
            status:
              typeof fetchedTask.status === "string"
                ? fetchedTask.status
                : fetchedTask.status?.id || statuses[0]?.id || "",
            assignee:
              typeof fetchedTask.assignee === "string"
                ? fetchedTask.assignee
                : fetchedTask.assignee?.id ||
                  (user?.role === "Admin" ? "" : user?.id || ""),
          });
        } else {
          reset({
            title: "",
            description: "",
            dueDate: "",
            priority: "medium",
            status: statuses[0]?.id || "",
            assignee: user?.role === "Admin" ? "" : user?.id || "",
          });
        }

        setLoading(false);
      } catch (err: any) {
        console.error(err);
        toast.error(err.response?.data?.message || "Failed to load data");

        setLoading(false);
      }
    };

    loadData();
  }, [taskId, user, reset]);

  const submitHandler = async (data: TaskFormValues) => {
    try {
      if (id) {
        await updateTask({ ...data, id: id });
        toast.success("Task updated successfully!");
      } else {
        await createTask({
          ...data,
          assignee: user?.role === "Admin" ? data.assignee : user?.id,
        });
        toast.success("Task created successfully!");
      }
      router.push(`/viewtask/${id}`); // ✅ go to task detail page
    } catch (err: any) {
      console.error(err);
      // toast.error(err.response?.data?.message || "Failed to save task");
    }
  };

  if (loading) return <CustomLoader />;

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{ py: 3, backgroundColor: theme.palette.background.default }}
    >
      <Typography variant="h5" mb={3} sx={{ ml: 3 }}>
        {taskId ? "Update Task" : "Create Task"}
      </Typography>

      <form onSubmit={handleSubmit(submitHandler)}>
        <Stack spacing={3} sx={{ mx: 3 }}>
          {/* Task Details */}
          <Card>
            <CardHeader title="Task Details" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormLabel>Title</FormLabel>
                  <TextFields
                    name="title"
                    control={control}
                    label=""
                    errors={errors}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormLabel required>Description</FormLabel>
                  <TextFields
                    name="description"
                    control={control}
                    label=""
                    errors={errors}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormLabel required>Due Date</FormLabel>
                  <DatePickers
                    name="dueDate"
                    control={control}
                    label=""
                    errors={errors}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormLabel required>Priority</FormLabel>
                  <Selects
                    name="priority"
                    control={control}
                    options={[
                      { value: "low", label: "Low" },
                      { value: "medium", label: "Medium" },
                      { value: "high", label: "High" },
                    ]}
                    errors={errors}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Status & Assignee */}
          <Card>
            <CardHeader title="Status & Assignment" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormLabel required>Status</FormLabel>
                  <Selects
                    name="status"
                    control={control}
                    options={statuses.map((s) => ({
                      value: s.id,
                      label: s.name,
                    }))}
                    errors={errors}
                  />
                </Grid>
                {user?.role === "Admin" && (
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormLabel required>Assignee</FormLabel>
                    <Selects
                      name="assignee"
                      control={control}
                      options={users.map((u) => ({
                        value: u.id,
                        label: `${u.first_name} ${u.last_name}`,
                      }))}
                      errors={errors}
                    />
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>

          <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
            <Button variant="outlined" onClick={() => router.push("/tasklist")}>
              Cancel
            </Button>

            <Button type="submit" variant="contained">
              {taskId ? "Update" : "Save"}
            </Button>
          </Box>
        </Stack>
      </form>
    </Container>
  );
}
