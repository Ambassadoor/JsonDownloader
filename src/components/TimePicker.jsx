import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';

export default function BasicTimePicker({ label, name, value, timezone, handleChange, id }) {
    const [timeValue, setTimeValue] = React.useState(value ? dayjs(value) : dayjs()); // Default to current time if value is not provided

    const handleTimeChange = (newTime) => {
      console.log(newTime)
      setTimeValue(newTime);
      handleChange(newTime, id, name); // Call the parent function with the new time value
    }

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
