// ---------- ROLE ----------
export interface Role {
  id: string;
  name: string;
  description?: string;
  is_deleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ---------- USER ----------
export interface User {
  id: string;
  first_name: string;
  last_name: string;
  mobile: string;
  email?: string;
  password?: string;
  role?: string | { _id: string; name: string };
  profile_picture?: string | null;
  token?: string | null;
  token_expires_at?: string | null;
  is_deleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ---------- STATUS ----------
export interface Status {
  id: string;
  name: string;
  order?: number;

  is_deleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ---------- TASK ----------
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: string | Status;
  assignee?: string | User;
  dueDate?: string;
  priority: "low" | "medium" | "high";
  is_deleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
