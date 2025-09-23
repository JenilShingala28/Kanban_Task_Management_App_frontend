"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

type Mode = "system" | "light" | "dark";

export default function ModeSwitch({
  mode,
  setMode,
}: {
  mode: Mode;
  setMode: (m: Mode) => void;
}) {
  return (
    <Box
      sx={{
        position: "fixed",
        top: { xs: 56, sm: 64 },
        right: 16,
        marginTop: 2,
        p: 1,
        borderRadius: 2,
        boxShadow: 2,
        bgcolor: "background.paper",
        color: "text.primary",
        zIndex: (theme) => theme.zIndex.appBar + 1,
      }}
    >
      <FormControl size="small">
        <InputLabel id="mode-select-label">Theme</InputLabel>
        <Select
          labelId="mode-select-label"
          value={mode}
          onChange={(e) => setMode(e.target.value as Mode)}
          label="Theme"
        >
          <MenuItem value="system">System</MenuItem>
          <MenuItem value="light">Light</MenuItem>
          <MenuItem value="dark">Dark</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
