import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';

export default function BasicTimePicker({ label, name, value, timezone, handleChange, id }) {
   
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker 
        name={name}
        label={label}
        value={dayjs(value)}
        timezone={timezone}
        onChange={(newValue) => handleChange(newValue, id, name)}
        sx={{ width: { xs: "100%", sm: "400px"}}} />
    </LocalizationProvider>
  );
}
