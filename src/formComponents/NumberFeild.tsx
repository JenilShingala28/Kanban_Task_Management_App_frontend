"use client";
import React from "react";
import { Controller } from "react-hook-form";
import { TextField } from "@mui/material";

type Props = {
  name: string;
  control: any;
  label?: string;
  placeholder?: string;
  rules?: any;
  errors?: any;
};

export default function NumberField({
  name,
  control,
  label,
  placeholder,
  rules,
  errors,
}: Props) {
  const error = !!errors?.[name];

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <TextField
          {...field}
          type="number"
          label={label}
          placeholder={placeholder}
          fullWidth
          error={error}
          helperText={errors?.[name]?.message}
          value={field.value ?? ""}
          onChange={(e) =>
            field.onChange(e.target.value ? Number(e.target.value) : "")
          }
        />
      )}
    />
  );
}
