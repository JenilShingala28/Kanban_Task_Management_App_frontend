"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import CustomLoader from "@/components/common/CustomLoader";

type Props = {
  allowedRoles: string[]; // e.g. ["Admin"]
  children: React.ReactNode;
};

export default function RoleGuard({ allowedRoles, children }: Props) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }

    if (!allowedRoles.includes(user.role || "")) {
      // Redirect to dashboard for your role
      const redirectUrl =
        user.role === "Admin" ? "/dashboard/admin" : "/dashboard/user";

      router.replace(redirectUrl);
    }
  }, [user, router, allowedRoles]);

  if (!user || !allowedRoles.includes(user.role || "")) {
    return <CustomLoader />;
  }

  return <>{children}</>;
}
