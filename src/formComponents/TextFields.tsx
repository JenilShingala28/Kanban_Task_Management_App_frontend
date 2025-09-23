"use client";

import React from "react";
import { Controller } from "react-hook-form";
import { TextField } from "@mui/material";

type Props = {
  name: string;
  control: any;
  label: string;
  placeholder?: string;
  type?: "text" | "number" | "email" | "password";
  rules?: any;
  errors?: any;
};

export default function TextFields({
  name,
  control,
  label,
  placeholder,
  type = "text",
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
        <TextField
          {...field}
          type={type}
          label={label}
          placeholder={placeholder}
          fullWidth
          error={error}
          helperText={helperText}
        />
      )}
    />
  );
}
