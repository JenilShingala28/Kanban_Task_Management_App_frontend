"use client";
import CustomLoader from "@/components/common/CustomLoader";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

type User = {
  id: string;
  first_name: string;
  last_name?: string;
  mobile?: string;
  email?: string;
  role?: string;
  profile_picture?: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  role: string | null;
  login: (userData: User, token: string, role: string) => void;
  logout: () => void;
  updateUserData: (updatedUser: User) => void; // ✅ new
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const logoutTimeout = React.useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  useEffect(() => {
    const storedUser =
      typeof window !== "undefined" ? localStorage.getItem("user") : null;
    const storedToken =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const storedRole =
      typeof window !== "undefined" ? localStorage.getItem("role") : null;
    const storedExpiry = localStorage.getItem("expiry");

    if (storedUser && storedToken && storedRole && storedExpiry) {
      const expiryTime = parseInt(storedExpiry, 10);
      const now = Date.now();

      if (now < expiryTime) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
        setRole(storedRole);

        // Auto logout after remaining time
        const timeout = expiryTime - now;
        if (logoutTimeout.current) clearTimeout(logoutTimeout.current);
        logoutTimeout.current = setTimeout(() => {
          logout();
        }, timeout);
      } else {
        logout(); // expired
      }
    }

    setLoading(false);
  }, []);

  const login = (userData: User, token: string, role: string) => {
    setUser(userData);
    setToken(token);
    setRole(role);

    const expiry = Date.now() + 60 * 60 * 1000; // 1 hour in ms
    localStorage.setItem("expiry", expiry.toString());

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);

    if (logoutTimeout.current) clearTimeout(logoutTimeout.current);
    logoutTimeout.current = setTimeout(() => {
      logout();
    }, 60 * 60 * 1000);
  };

  const updateUserData = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setRole(null);

    if (logoutTimeout.current) clearTimeout(logoutTimeout.current);

    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("expiry");
    }

    router.push("/"); // 👈 redirect to home after logout
  };

  if (loading) return <CustomLoader />;

  return (
    <AuthContext.Provider
      value={{ user, token, role, login, logout, updateUserData }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
