"use client";
import React from "react";
import { Controller } from "react-hook-form";
import {
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
  InputLabel,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";

type Option = {
  value: string;
  label: string;
};

type Props = {
  name: string;
  control: any;
  label?: string;
  placeholder?: string;
  options: Option[];
  rules?: any;
  errors?: any;
};

export default function Selects({
  name,
  control,
  label,
  placeholder,
  options,
  rules,
  errors,
}: Props) {
  const error = !!errors?.[name];
  const helperText = errors?.[name]?.message || "";

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <FormControl fullWidth error={error}>
          {label && <InputLabel>{label}</InputLabel>}

          <Select {...field} displayEmpty>
            {placeholder && (
              <MenuItem value="">
                <Typography sx={{ color: grey }}>{placeholder}</Typography>
              </MenuItem>
            )}
            {options.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>

          {error && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
      )}
    />
  );
}
