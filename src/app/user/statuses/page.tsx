"use client";

import React, { useEffect, useState } from "react";
import { Grid, Typography, Button, useTheme } from "@mui/material";
import { fetchStatuses } from "@/services/authService";
import { Status } from "@/types";
import CustomLoader from "@/components/common/CustomLoader";
import RoleGuard from "@/utils/roleGuard";
import { toast } from "react-toastify";

export default function userStatusesPage() {
  const theme = useTheme();
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [loading, setLoading] = useState(true);

  const loadStatuses = async () => {
    try {
      setLoading(true);
      const res = await fetchStatuses();
      // setStatuses(res.data.data || []);

      const fetchedStatuses: Status[] = res.data.data || [];

      fetchedStatuses.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

      setStatuses(fetchedStatuses);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to fetch statuses";
      toast.error(msg);
      console.error("Error fetching statuses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatuses();
  }, []);

  return (
    <RoleGuard allowedRoles={["User"]}>
      <div style={{ padding: "20px", marginTop: "20px" }}>
        <Typography variant="h3" color="primary.main" gutterBottom>
          View Statuses
        </Typography>

        {loading ? (
          <CustomLoader />
        ) : (
          <Grid container spacing={2} sx={{ m: 4 }}>
            {statuses.map((status) => (
              <Grid
                size={{ xs: 12, sm: 6, md: 4 }}
                key={status.id}
                sx={{
                  borderRadius: 3,
                  border: 1,
                  borderColor: "text.secondary",
                  borderStyle: "solid",
                  boxShadow: "0px 8px 20px rgba(0,0,0,0.2)",
                  backgroundColor: theme.palette.background.paper,

                  padding: 2,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  {status.name}
                </Typography>
              </Grid>
            ))}
          </Grid>
        )}
      </div>
    </RoleGuard>
  );
}
