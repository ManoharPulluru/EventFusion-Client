import * as React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import TextField from "@mui/material/TextField"; // Ensure you have this import for rendering the input
import dayjs from "dayjs"; // Import dayjs for date manipulation

export default function FirstComponent({ onFromDateChange, onToDateChange, fromDate, toDate }) {
  // Convert string dates to Day.js objects if necessary
  const fromDateObj = typeof fromDate === 'string' ? dayjs(fromDate) : fromDate;
  const toDateObj = typeof toDate === 'string' ? dayjs(toDate) : toDate;

  return (
    <div className="CalanderDiv">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimePicker
          className="dateAndTimePicker"
          label="From Date & Time"
          value={fromDateObj}
          onChange={onFromDateChange}
          // Use textField prop instead of renderInput
          textField={(params) => <TextField {...params} />}
        />
        <DateTimePicker
          className="dateAndTimePicker"
          label="To Date & Time"
          value={toDateObj}
          onChange={onToDateChange}
          textField={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
    </div>
  );
}
