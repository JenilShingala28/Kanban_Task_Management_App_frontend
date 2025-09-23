"use client";

import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { Box, FormLabel, Button, Typography } from "@mui/material";

type Props = {
  name: string;
  control: any;
  label: string;
  errors?: Record<string, any>;
  rules?: any;
};

export default function FileUpload({
  name,
  control,
  label,
  errors,
  rules,
}: Props) {
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange } }) => (
        <Box>
          <FormLabel sx={{ mr: 2 }}>{label}</FormLabel>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                onChange(file);
                setPreview(URL.createObjectURL(file));
              } else {
                onChange(undefined);
                setPreview(null);
              }
            }}
          />
          {preview && (
            <Box mt={1}>
              <img
                src={preview}
                alt="preview"
                width={100}
                style={{ borderRadius: 8 }}
              />
            </Box>
          )}
          {errors && errors[name] && (
            <Typography color="error" variant="caption" mt={1}>
              {errors[name]?.message}
            </Typography>
          )}
        </Box>
      )}
    />
  );
}
