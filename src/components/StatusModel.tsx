"use client";

import React, { useEffect } from "react";
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
import { createStatus, updateStatus } from "@/services/authService";
import { Status } from "@/types";
import TextFields from "@/formComponents/TextFields";
import NumberField from "@/formComponents/NumberFeild";
import { toast } from "react-toastify";

// ---- Schema ----
const schema = z.object({
  name: z
    .string()
    .nonempty("Status name is required")
    .min(2, "Status name must be at least 2 characters"),
  order: z
    .number()
    .optional()
    .refine((val) => val === undefined || val >= 0, {
      message: "Order must be a positive number",
    }),
});

type StatusFormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  editingStatus?: Status | null;
}

export default function StatusModal({
  open,
  onClose,
  onSaved,
  editingStatus,
}: Props) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StatusFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      order: 0,
    },
  });

  useEffect(() => {
    if (editingStatus) {
      reset({ name: editingStatus.name, order: editingStatus.order });
    } else {
      reset({ name: "", order: 0 });
    }
  }, [editingStatus, reset]);

  const onSubmit = async (data: StatusFormValues) => {
    try {
      if (editingStatus) {
        await updateStatus({ ...data, id: editingStatus.id });
        toast.success("Status updated successfully");
      } else {
        await createStatus(data);
        toast.success("Status created successfully");
      }
      onSaved();
      onClose();
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMsg);
      // console.error("Error saving status:", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth disableEnforceFocus={false}>
      <DialogTitle>
        {editingStatus ? "Edit Status" : "Create Status"}
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextFields
              name="name"
              control={control}
              label="Status Name"
              errors={errors}
              rules={{ required: "Status name is required" }}
            />
            <NumberField
              name="order"
              control={control}
              label="Order"
              errors={errors}
            />
          </Stack>

          <DialogActions sx={{ mt: 2 }}>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingStatus ? "Update" : "Save"}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}
