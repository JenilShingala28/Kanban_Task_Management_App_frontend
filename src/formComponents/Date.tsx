"use client";

import React from "react";
import { Controller } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

type Props = {
  name: string;
  control: any;
  label: string;
  rules?: any;
  errors?: any;
};

export default function DatePickers({
  name,
  control,
  label,
  rules,
  errors,
}: Props) {
  const error = !!errors?.[name];
  const helperText = errors?.[name]?.message || "";

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <DatePicker
            {...field}
            label={label}
            value={field.value ? dayjs(field.value) : null}
            onChange={(date) => {
              if (date && date.isValid()) {
                field.onChange(date.toDate().toISOString());
              } else {
                field.onChange("");
              }
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                error: error,
                helperText: helperText,
              },
            }}
          />
        )}
      />
    </LocalizationProvider>
  );
}
