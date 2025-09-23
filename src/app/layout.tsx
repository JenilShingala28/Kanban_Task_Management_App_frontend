"use client";
import * as React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { getTheme } from "@/theme";
import ModeSwitch from "@/components/ModeSwitch";
import { InitColorSchemeScript } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import Navbar from "@/components/common/Navbar";
import AuthProvider from "@/context/AuthContext";
import { Bounce, ToastContainer } from "react-toastify";
import "@/app/page.module.css";

export default function RootLayout(props: { children: React.ReactNode }) {
  const [mode, setMode] = React.useState<"system" | "light" | "dark">("system");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // 🔹 compute applied mode only on client
  const prefersDark =
    mounted && window.matchMedia("(prefers-color-scheme: dark)").matches;

  const appliedMode =
    mode === "system" ? (prefersDark ? "dark" : "light") : mode;

  const theme = React.useMemo(() => getTheme(appliedMode), [appliedMode]);

  // 🚨 Avoid mismatch: on server render a fallback light theme
  if (!mounted) {
    return (
      <html lang="en" suppressHydrationWarning>
        <body>
          <ThemeProvider theme={getTheme("light")}>
            <AuthProvider>
              <CssBaseline />
              {props.children}
            </AuthProvider>
          </ThemeProvider>
        </body>
      </html>
    );
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <InitColorSchemeScript attribute="class" />
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeProvider theme={theme}>
            <AuthProvider>
              {/* ✅ Wrap everything that needs useAuth */}
              <Navbar />
              <CssBaseline />
              <ModeSwitch mode={mode} setMode={setMode} />
              {props.children}
              <ToastContainer
                position="top-center"
                autoClose={1000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Bounce}
              />
            </AuthProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
