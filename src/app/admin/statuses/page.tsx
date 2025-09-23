"use client";

import React, { useEffect, useState } from "react";
import { Grid, Typography, Button, useTheme } from "@mui/material";
import { fetchStatuses, deleteStatus } from "@/services/authService";
import StatusModal from "@/components/StatusModel";
import { Status } from "@/types";
import CustomLoader from "@/components/common/CustomLoader";
import RoleGuard from "@/utils/roleGuard";
import { toast } from "react-toastify";

export default function AdminStatusesPage() {
  const theme = useTheme();
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editingStatus, setEditingStatus] = useState<Status | null>(null);

  const loadStatuses = async () => {
    try {
      setLoading(true);
      const res = await fetchStatuses();
      // setStatuses(res.data.data || []);

      const fetchedStatuses: Status[] = res.data.data || [];

      fetchedStatuses.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

      setStatuses(fetchedStatuses);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to load tasks";
      toast.error(msg);
      console.error("Error fetching statuses:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this status?")) {
      try {
        await deleteStatus(id);
        loadStatuses();
      } catch (err) {
        console.error("Error deleting status:", err);
      }
    }
  };

  const handleEdit = (status: Status) => {
    setEditingStatus(status);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setEditingStatus(null);
    setOpenModal(false);
  };

  useEffect(() => {
    loadStatuses();
  }, []);

  return (
    <RoleGuard allowedRoles={["Admin"]}>
      <div style={{ padding: "20px", marginTop: "20px" }}>
        <Typography variant="h3" color="primary.main" gutterBottom>
          Manage Statuses
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenModal(true)}
          sx={{ my: 2 }}
        >
          Create Status
        </Button>

        {loading ? (
          <CustomLoader />
        ) : (
          <Grid container spacing={2} sx={{ my: 2 }}>
            {statuses.map((status) => (
              <Grid
                size={{ xs: 12, sm: 6, md: 4 }}
                key={status.id}
                sx={{
                  border: 1,
                  borderColor: "text.secondary",
                  borderStyle: "solid",
                  boxShadow: "0px 8px 20px rgba(0,0,0,0.2)",
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: 3,
                  padding: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  {status.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {status.order ?? "-"}
                </Typography>

                <div>
                  <Button
                    sx={{
                      ml: 1,
                      mr: 2,
                      borderRadius: 2,
                      border: 1,
                      borderColor: "text.secondary",
                      borderStyle: "solid",
                      boxShadow: "0px 8px 20px rgba(0,0,0,0.2)",
                      backgroundColor: theme.palette.background.default,
                    }}
                    size="small"
                    onClick={() => handleEdit(status)}
                  >
                    Edit
                  </Button>
                  <Button
                    sx={{
                      borderRadius: 2,
                      border: 1,
                      borderColor: "text.secondary",
                      borderStyle: "solid",
                      boxShadow: "0px 8px 20px rgba(0,0,0,0.2)",
                      backgroundColor: theme.palette.background.default,
                    }}
                    size="small"
                    color="error"
                    onClick={() => handleDelete(status.id)}
                  >
                    Delete
                  </Button>
                </div>
              </Grid>
            ))}
          </Grid>
        )}

        <StatusModal
          open={openModal}
          onClose={handleCloseModal}
          onSaved={loadStatuses}
          editingStatus={editingStatus}
        />
      </div>
    </RoleGuard>
  );
}
