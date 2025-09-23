"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  createTask,
  updateTask,
  fetchUsers,
  fetchStatuses,
} from "@/services/authService";
import { useAuth } from "@/context/AuthContext";
import { Status, Task, User } from "@/types";
import TextFields from "@/formComponents/TextFields";
import Selects from "@/formComponents/Select";
import DatePickers from "@/formComponents/Date";
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
  dueDate: z.string().nonempty("DueDate is required"),
  priority: z.enum(["low", "medium", "high"]),
  status: z.string().nonempty("Status is required"),
  assignee: z.string().nonempty("Assignee is required"),
});

type TaskFormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  editingTask?: Task | null;
}

export default function TaskModal({
  open,
  onClose,
  onSaved,
  editingTask,
}: Props) {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
      priority: "medium",
      status: "",
      assignee: user?.role === "Admin" ? "" : user?.id || "",
    },
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!user) return;

        if (user?.role === "Admin") {
          const res = await fetchUsers();
          setUsers(res.data.data || []);
        }
        const statusRes = await fetchStatuses();
        const fetchedStatuses = statusRes.data.data || [];
        setStatuses(fetchedStatuses);

        // Prefill for editing
        if (editingTask) {
          reset({
            title: editingTask.title,
            description: editingTask.description || "",
            // dueDate: editingTask.dueDate || "",
            dueDate: editingTask.dueDate
              ? new Date(editingTask.dueDate).toISOString()
              : "",
            priority: editingTask.priority as "low" | "medium" | "high",
            status:
              typeof editingTask.status === "string"
                ? editingTask.status
                : editingTask.status?.id || fetchedStatuses[0]?.id || "",
            assignee:
              typeof editingTask.assignee === "string"
                ? editingTask.assignee
                : editingTask.assignee?.id ||
                  (user?.role === "Admin" ? "" : user?.id || ""),
          });
        } else if (fetchedStatuses.length) {
          reset({
            title: "",
            description: "",
            dueDate: "",
            priority: "medium",
            status: fetchedStatuses.id || "",
            assignee: user?.role === "Admin" ? "" : user?.id || "",
          });
        }
      } catch (err) {
        toast.error("Error loading users or statuses");

        // console.error("Error loading users or statuses:", err);
      }
    };
    loadData();
  }, [user, editingTask, reset]);

  const onSubmit = async (data: TaskFormValues) => {
    try {
      const payload = {
        ...data,
        assignee: user?.role === "Admin" ? data.assignee : user?.id,
      };

      if (editingTask) {
        await updateTask({ ...payload, id: editingTask.id });
        toast.success("Task updated successfully");
      } else {
        await createTask(payload);
        toast.success("Task created successfully");
      }
      onSaved();
      onClose();

      if (!editingTask) {
        reset({
          title: "",
          description: "",
          dueDate: "",
          priority: "medium",
          status: statuses[0]?.id || "",
          assignee: user?.role === "Admin" ? "" : user?.id || "",
        });
      }
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message || "Error saving task. Please try again.";
      toast.error(errorMsg);
      console.error("Error saving task:", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{editingTask ? "Edit Task" : "Create Task"}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextFields
              name="title"
              control={control}
              label="Title"
              errors={errors}
            />
            <TextFields
              name="description"
              control={control}
              label="Description"
              errors={errors}
            />
            <DatePickers
              name="dueDate"
              control={control}
              label="Due Date"
              errors={errors}
            />
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
            <Selects
              name="status"
              control={control}
              placeholder="Select Status"
              options={statuses.map((s) => ({ value: s.id, label: s.name }))}
              errors={errors}
              rules={{ required: "Status is required" }}
            />
            {user?.role === "Admin" && (
              <Selects
                name="assignee"
                control={control}
                placeholder="Select User"
                options={users.map((u) => ({
                  value: u.id,
                  label: `${u.first_name} ${u.last_name} (${u.email})`,
                }))}
                errors={errors}
              />
            )}
          </Stack>
          <DialogActions sx={{ mt: 2 }}>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingTask ? "Update" : "Save"}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}
