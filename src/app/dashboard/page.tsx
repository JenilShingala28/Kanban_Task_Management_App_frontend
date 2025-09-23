// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/context/AuthContext";

// export default function DashboardRedirect() {
//   const { user } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (!user) return;

//     if (user.role === "Admin") {
//       router.push("/dashboard/admin");
//     } else {
//       router.push("/dashboard/user");
//     }
//   }, [user]);

//   return null;
// }

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import CustomLoader from "@/components/common/CustomLoader";

export default function DashboardRedirect() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user is null → redirect to login
    if (user === null) {
      router.replace("/login");
      return;
    }

    // Redirect based on role
    if (user?.role === "Admin") {
      router.replace("/dashboard/admin");
    } else if (user?.role === "User") {
      router.replace("/dashboard/user");
    }
  }, [user, router]);

  // Show loader while checking auth
  if (user === undefined || user === null) {
    return <CustomLoader />;
  }

  return null;
}
