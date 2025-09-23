"use client";
import { blue, green, grey, red } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const getTheme = (mode: "light" | "dark") =>
  createTheme({
    palette: {
      mode,
      ...(mode === "light"
        ? {
            primary: { main: "#1976d2" },
            background: { default: "#edf7fe", paper: "#fff" },
            text: { primary: "#000", secondary: "#555" },
            secondary: { main: "#9c27b0" },
            error: { main: "#f44336" },
            warning: { main: "#ffa726" },
            info: { main: "#29b6f6" },
            success: { main: "#66bb6a" },
          }
        : {
            primary: { main: "#90caf9" },
            background: { default: "#121212", paper: "#1e1e1e" },
            text: { primary: "#fff", secondary: "#aaa" },
            secondary: { main: "#9c27b0" },
            error: { main: "#f44336" },
            warning: { main: "#ffa726" },
            info: { main: "#29b6f6" },
            success: { main: "#66bb6a" },
          }),
    },
    typography: {
      fontFamily: roboto.style.fontFamily,
    },
    components: {
      MuiButton: {
        defaultProps: {
          size: "large",
        },
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
        variants: [
          {
            props: { variant: "outlined" },
            style: {
              textTransform: "none",
              border: `1px dashed ${blue[500]}`,
              color: blue[500],
            },
          },
          {
            props: { variant: "contained" },
            style: {
              border: `1px solid  ${green[500]}`,
            },
          },
        ],
      },

      MuiTextField: {
        styleOverrides: {
          root: {
            marginTop: 8,
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            fontSize: "0.95rem",
          },
          input: {
            "&::placeholder": {
              color: grey[600],
              opacity: 1,
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            "& fieldset": {
              borderColor: grey[400],
            },
            "&:hover fieldset": {
              borderColor: grey[600],
            },
            "&.Mui-focused fieldset": {
              borderColor: "#1976d2",
              borderWidth: 2,
            },
          },
        },
      },

      MuiFormLabel: {
        styleOverrides: {
          root: ({ theme }) => ({
            color: theme.palette.text.primary,
            "& .MuiFormLabel-asterisk": {
              color: theme.palette.error.main,
            },
          }),
        },
      },
      MuiFormControl: {
        styleOverrides: {
          root: {
            marginTop: 7,
          },
        },
      },

      MuiFormHelperText: {
        styleOverrides: {
          root: {
            fontSize: "0.8rem",
            "&.Mui-error": {
              color: "red",
            },
          },
        },
      },

      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
          },
        },
      },

      MuiCardHeader: {
        styleOverrides: {
          root: {
            color: "#1976d2",
            fontWeight: 400,
            borderBottom: "1px solid",
            borderColor: "rgba(86, 116, 158, 0.79)",
          },
          title: {
            fontWeight: 400,
            color: "#1976d2",
          },
        },
      },
      MuiCardContent: {
        styleOverrides: {
          root: {
            padding: "16px 16px",
          },
        },
      },

      MuiAutocomplete: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            "& fieldset": {
              borderColor: grey[400],
            },
            "&:hover fieldset": {
              borderColor: grey[600],
            },
            "&.Mui-focused fieldset": {
              borderColor: "#1976d2",
              borderWidth: 2,
            },
          },
          option: {
            fontSize: "0.9rem",
          },
        },
      },

      MuiSwitch: {
        styleOverrides: {
          switchBase: {
            "&.Mui-checked": {
              color: "#1976d2",
            },
          },
          thumb: {
            height: 20,
            width: 20,
          },
          track: {
            borderRadius: 20,
            backgroundColor: grey[400],
            opacity: 1,
          },
        },
      },

      MuiCheckbox: {
        styleOverrides: {
          root: ({ theme }) => ({
            color: theme.palette.primary.main,
            "&.Mui-checked": {
              color: theme.palette.secondary.main,
            },
            "&.Mui-disabled": {
              color: grey[300],
            },
          }),
        },
      },
      MuiRadio: {
        defaultProps: {
          disableRipple: true,
        },
        styleOverrides: {
          root: {
            "&.Mui-checked": {
              color: green[500],
            },
          },
        },
      },
      MuiSlider: {
        styleOverrides: {
          root: {
            height: 6,
          },
          thumb: {
            height: 20,
            width: 20,
          },
          track: {
            height: 6,
          },
          rail: {
            height: 6,
            opacity: 0.4,
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            fontWeight: 500,
          },
          colorDefault: {
            backgroundColor: green[400],
          },
        },
      },
      MuiBadge: {
        styleOverrides: {
          badge: {
            fontSize: "0.7rem",
            fontWeight: 600,
            minWidth: 28,
            height: 28,
            borderRadius: 5,
            padding: "0 6px",
            border: `2px solid white`,
          },
        },
      },
      MuiTooltip: {
        defaultProps: {
          arrow: true,
        },
        styleOverrides: {
          tooltip: {
            backgroundColor: green[800],
            fontSize: "0.8rem",
            padding: "6px 10px",
            borderRadius: 6,
          },
          arrow: {
            color: grey[800],
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
          },
          h1: { fontSize: "2.25rem", fontWeight: 700 },
          h2: { fontSize: "1.75rem", fontWeight: 600 },
          h3: { fontSize: "1.5rem", fontWeight: 600 },
          h4: { fontSize: "1.25rem", fontWeight: 500 },
          h5: { fontSize: "1.1rem", fontWeight: 500 },
          h6: { fontSize: "1rem", fontWeight: 500 },
          body1: { fontSize: "0.95rem" },
          body2: { fontSize: "0.8rem", color: green[700] },
        },
      },

      //
      MuiAppBar: {
        defaultProps: {
          color: "secondary",
          position: "fixed",
        },
        styleOverrides: {
          root: {
            borderRadius: 0,
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.42)",
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: grey[50],
            borderRight: `1px solid ${grey[300]}`,
          },
        },
      },

      MuiList: {
        styleOverrides: {
          root: {
            paddingTop: 0,
            paddingBottom: 0,
          },
        },
      },

      MuiListItem: {
        styleOverrides: {
          root: {
            paddingTop: 4,
            paddingBottom: 4,
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: red[300],
            opacity: 1,
            height: 20,
          },
        },
      },

      // Tabs
      MuiTabs: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${grey[300]}`,
            minHeight: 44,
          },
          indicator: {
            height: 8,
            borderRadius: 3,
            backgroundColor: "#1976d2",
          },
        },
      },

      // Tab
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 500,
            fontSize: "0.95rem",
            minHeight: 44,
            padding: "6px 16px",
            "&.Mui-selected": {
              color: "#d21919ff",
            },
          },
        },
      },

      // Breadcrumbs
      MuiBreadcrumbs: {
        styleOverrides: {
          root: {
            fontSize: "0.9rem",
            color: red[700],
          },
        },
      },
    },
  });
