import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';

export default function BasicTimePicker({ timezone, label, handleInputChange, value, name }) {

    const timeValue = value ? dayjs(value) : dayjs(); // Default to current time if value is not provided

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker 
        name={name}
        label={label}
        value={timeValue}
        timezone={timezone}
        onChange={handleInputChange}
        sx={{ width: { xs: "100%", sm: "400px"}}} />
    </LocalizationProvider>
  );
}
