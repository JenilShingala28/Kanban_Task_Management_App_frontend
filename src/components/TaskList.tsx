"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Chip,
  Button,
  Stack,
  TextField,
  Avatar,
} from "@mui/material";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { green, red } from "@mui/material/colors";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import {
  deleteTask,
  fetchPaginatedTasks,
  fetchTasks,
} from "@/services/authService"; // your API service
import CustomLoader from "./common/CustomLoader";

interface Status {
  id: string;
  name: string;
}

interface Assignee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  profile_picture?: string | null;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string | null;
  status?: Status | null;
  assignee?: Assignee | null;
  priority?: string;
}

export default function TaskListPage() {
  const theme = useTheme();
  const router = useRouter();

  const [rows, setRows] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [rowCount, setRowCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });

  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>(search);

  const [sort, setSort] = useState<Record<string, "asc" | "desc">>({
    createdAt: "asc",
  });

  const [filter, setFilter] = useState<Record<string, any>>({});
  const [debouncedFilter, setDebouncedFilter] =
    useState<Record<string, any>>(filter);

  // debounce search + filter
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setDebouncedFilter(filter);
    }, 1000);
    return () => clearTimeout(handler);
  }, [search, filter]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await fetchPaginatedTasks(
        paginationModel.page + 1,
        paginationModel.pageSize,
        debouncedSearch,
        debouncedFilter,
        sort
      );

      const data = (res.data?.data || []).map((row: any) => ({
        ...row,
        id: row._id || row.id,
      }));

      setRows(data);
      setRowCount(res.data?.pagination?.totalRecords || 0);
    } catch (error) {
      console.error("❌ Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [paginationModel, debouncedSearch, debouncedFilter, sort]);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 230 },
    { field: "title", headerName: "Title", width: 200 },
    {
      field: "description",
      headerName: "Description",
      width: 250,
    },
    {
      field: "dueDate",
      headerName: "Due Date",
      width: 180,
      renderCell: (params) => {
        if (!params.value) return "-";
        const d = new Date(params.value as string);
        return d.toLocaleDateString("en-IN", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.value?.name || "-"}
          size="small"
          sx={{
            backgroundColor:
              params.value?.name === "Done" ? green[100] : red[100],
            color: params.value?.name === "Done" ? green[800] : red[800],
            fontWeight: 600,
          }}
        />
      ),
    },
    {
      field: "assignee",
      headerName: "Assignee",
      width: 200,
      renderCell: (params) => {
        const a = params.value as Assignee;
        if (!a) return "-";
        return (
          <Stack direction="row" alignItems="center" spacing={1} py={2.5}>
            <Avatar src={a.profile_picture ?? undefined} />

            <Stack spacing={0} lineHeight={1}>
              <Typography
                variant="body2"
                fontWeight="bold"
                sx={{ lineHeight: 1.2, m: 1 }}
              >
                {a.first_name} {a.last_name}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ lineHeight: 1.2, m: 1 }}
              >
                {a.email}
              </Typography>
            </Stack>
          </Stack>
        );
      },
    },
    { field: "priority", headerName: "Priority", width: 120 },

    {
      field: "actions",
      headerName: "Actions",
      width: 227,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Stack
          direction="row"
          spacing={1}
          sx={{
            marginTop: 5,
          }}
        >
          <Button
            variant="outlined"
            size="small"
            onClick={() => router.push(`/updatetask/${params.row.id}`)}
          >
            Update
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => router.push(`/viewtask/${params.row.id}`)}
          >
            View
          </Button>

          <Button
            variant="outlined"
            size="small"
            sx={{ borderColor: "red", color: "red" }}
            onClick={async () => {
              if (!window.confirm("Are you sure you want to delete this task?"))
                return;

              try {
                await deleteTask(params.row.id); // ✅ call your delete API
                fetchData(); // ✅ reload the table
              } catch (err: any) {
                console.error("❌ Error deleting task:", err);
                alert(err.response?.data?.message || "Failed to delete task");
              }
            }}
          >
            Delete
          </Button>
        </Stack>
      ),
    },
  ];

  if (loading) return <CustomLoader />;

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{ py: 1, backgroundColor: theme.palette.background.default }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mt={7}
        mb={2}
        px={3}
      >
        <Typography variant="h3" color="primary.main">
          Task List
        </Typography>
        <TextField
          size="small"
          placeholder="Search…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 1 }}
        />
        <Button
          variant="contained"
          onClick={() => router.push("/tasks/create")}
        >
          + Add New Task
        </Button>
      </Stack>

      <Box sx={{ height: 600, width: "100%", px: 3 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id}
          loading={loading}
          rowCount={rowCount}
          showCellVerticalBorder
          sortingMode="server"
          onSortModelChange={(newSortModel) => {
            if (newSortModel.length > 0) {
              const { field, sort: direction } = newSortModel[0];
              setSort({ [field]: direction as "asc" | "desc" });
            } else {
              setSort({ createdAt: "asc" });
            }
          }}
          filterMode="server"
          onFilterModelChange={(newFilterModel) => {
            const filterObj: Record<string, any> = {};

            newFilterModel.items.forEach((item) => {
              if (!item?.field || !item.value) return;

              let value: any = item.value;

              // regex for string fields
              if (["title", "description", "priority"].includes(item.field)) {
                value = { $regex: value, $options: "i" };
              }

              filterObj[item.field] = value;
            });

            setFilter(filterObj);
          }}
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 20]}
          getRowHeight={() => 110}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          sx={{
            backgroundColor: theme.palette.background.paper,
            borderRadius: 2,
            boxShadow: 2,
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: theme.palette.grey[200],
              fontWeight: "bold",
            },
          }}
        />
      </Box>
    </Container>
  );
}
