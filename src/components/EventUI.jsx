import React, { useContext } from 'react';
import { AppStateContext } from "../AppStateContext";
import {
  Autocomplete,
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Box,
  Grid,
  Button,
} from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import useEventForm from '../hooks/useEventForm';

const dayMap = {
  Sun: "SU",
  Mon: "MO",
  Tues: "TU",
  Wed: "WE",
  Thur: "TH",
  Fri: "FR",
  Sat: "SA",
};

const EventUI = () => {
  const { eventObjects, currentCourseIndex } = useContext(AppStateContext);
  const defaultEvent = eventObjects?.[currentCourseIndex] || {};

  const {
    formData,
    timezones,
    handleInputChange,
    handleDayToggle,
    handleSubmit,
  } = useEventForm(defaultEvent);

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Summary"
            name="summary"
            value={formData.summary}
            onChange={(e) => handleInputChange(e.target.name, e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Description"
            name="description"
            multiline
            value={formData.description}
            onChange={(e) => handleInputChange(e.target.name, e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Location"
            name="location"
            value={formData.location}
            onChange={(e) => handleInputChange(e.target.name, e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Autocomplete
            name="timeZone"
            options={timezones}
            value={formData.timeZone}
            onChange={(event, newValue) => handleInputChange("timeZone", newValue)}
            renderInput={(params) => <TextField {...params} label="Timezone" />}
          />
        </Grid>
        <Grid item xs={6}>
          <DatePicker
            label="Start Date"
            value={formData.startDate}
            onChange={(date) => handleInputChange("startDate", date)}
            fullWidth
            maxDate={formData.endDate}
          />
        </Grid>
        <Grid item xs={6}>
          <DatePicker
            label="Until"
            value={formData.endDate}
            onChange={(date) => handleInputChange("endDate", date)}
            fullWidth
            minDate={formData.startDate}
          />
        </Grid>
        <Grid item xs={6}>
          <TimePicker
            label="Start Time"
            value={formData.startTime}
            onChange={(time) => handleInputChange("startTime", time)}
            fullWidth
            maxTime={formData.endTime}
          />
        </Grid>
        <Grid item xs={6}>
          <TimePicker
            label="End Time"
            value={formData.endTime}
            onChange={(time) => handleInputChange("endTime", time)}
            fullWidth
            minTime={formData.startTime}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Frequency</InputLabel>
            <Select
              label="Frequency"
              name="frequency"
              value={formData.frequency}
              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
            >
              <MenuItem value={"DAILY"}>DAILY</MenuItem>
              <MenuItem value={"WEEKLY"}>WEEKLY</MenuItem>
              <MenuItem value={"MONTHLY"}>MONTHLY</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <p>Select Days</p>
          <ToggleButtonGroup>
            {Object.entries(dayMap).map(([day, dayString]) => (
              <ToggleButton
                variant="contained"
                key={day}
                value={day}
                selected={formData.frequency === "WEEKLY" && formData.recurrenceDates.includes(dayString)}
                onChange={(e) => handleDayToggle(dayMap, e.target.value)}
                disabled={formData.frequency !== "WEEKLY"}
              >
                {day}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" name="submit" value="Submit">Submit</Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EventUI;
