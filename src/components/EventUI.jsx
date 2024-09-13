import React, { useContext } from "react";
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
import useFormFormatter from "../hooks/useFormFormatter";

const dayButtonLabels = ["SUN", "MON", "TUES", "WED", "THURS", "FRI", "SAT"];

const EventUI = () => {
  const { currentCourseIndex, subscribedData } = useContext(AppStateContext);
  const currentCourse = subscribedData[currentCourseIndex];

  const {
    formData,
    timezones,
    handleInputChange,
    handleDayToggle,
    handleSubmit,
  } = useFormFormatter(currentCourse);

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
            onChange={(event, newValue) =>
              handleInputChange("timeZone", newValue)
            }
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
          <ToggleButtonGroup
            value={
              formData.frequency !== "WEEKLY"
                ? formData.frequency === "DAILY"
                  ? dayButtonLabels
                  : []
                : formData.meetingDays
            }
            onChange={(e, newDays) => handleDayToggle(newDays)}
            disabled={formData.frequency !== "WEEKLY"}
          >
            {dayButtonLabels.map((day) => (
              <ToggleButton key={day} value={day}>
                {day}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" name="submit">
            Submit
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EventUI;
