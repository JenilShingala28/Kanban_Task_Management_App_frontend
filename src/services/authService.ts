import axios from "axios";

// const API_BASE = "http://localhost:7000";

const API_BASE =
  typeof window !== "undefined" &&
  window.location.hostname.includes("localhost")
    ? "http://localhost:7000"
    : "https://kanban-app-tx81.onrender.com";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json", "Cache-Control": "no-cache" },
});

// Attach token automatically if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ----------------- ROLE -----------------
export const createRole = (payload: any) => api.post("/role/create", payload);
export const fetchRoles = () => api.get("/role/getall");
export const fetchRoleById = (id: string) => api.get(`/role/get/${id}`);
export const updateRole = (payload: any) => api.put("/role/update", payload);
export const deleteRole = (id: string) => api.delete(`/role/delete?id=${id}`);

// ----------------- USER -----------------
export const registerUser = (payload: any) =>
  api.post("/user/register", payload);
export const loginUser = (payload: any) => api.post("/user/login", payload);
export const fetchUsers = () => api.get("/user/getall");
export const fetchUserById = (id: string) => api.get(`/user/get/${id}`);
export const updateUser = (payload: any) => api.put("/user/update", payload);
export const deleteUser = (id: string) => api.delete(`/user/delete?id=${id}`);

// ----------------- TASK -----------------
export const createTask = (payload: any) => api.post("/task/create", payload);

export const fetchPaginatedTasks = async (
  page: number = 1,
  pageSize: number = 10,
  search?: string,
  filter?: Record<string, any>,
  sort?: Record<string, "asc" | "desc">
) => {
  return api.post("/task/pagination", {
    page,
    pageSize,
    search,
    filter,
    sort,
  });
};

export const fetchTasks = () => api.get("/task/getall");
export const fetchTaskById = (id: string) => api.get(`/task/get/${id}`);
export const updateTask = (payload: any) => api.put("/task/update", payload);
export const deleteTask = (id: string) =>
  api.delete("/task/delete", { data: { id } });

export const moveTaskStatus = (payload: any) => api.put("/task/move", payload);

// export const fetchAll = () =>
//   axios.get("http://localhost:7000/task/get", {
//     headers: {
//       "Cache-Control": "no-cache",
//     },
//   });

// ----------------- STATUS -----------------
export const createStatus = (payload: any) =>
  api.post("/status/create", payload);
export const fetchStatuses = () => api.get("/status/getall");
export const fetchStatusById = (id: string) => api.get(`/status/get/${id}`);
export const updateStatus = (payload: any) =>
  api.put("/status/update", payload);
export const deleteStatus = (id: string) =>
  api.delete("/status/delete", { data: { id } });

export default api;
