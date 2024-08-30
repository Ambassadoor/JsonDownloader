import React, { useState, useContext } from "react";
import { AppStateContext } from "../AppStateContext";
import {
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Box,
  Grid,
} from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

const EventUI = () => {
  const { eventObjects, currentCourseIndex } = useContext(AppStateContext);
  const defaultEvent = eventObjects?.[currentCourseIndex] || {};
  
  dayjs.extend(utc);
  const formatUntilDate = (untilDate) => {
    return dayjs(untilDate, "YYYYMMDDTHHmmssZ").format(
      "YYYY-MM-DDTHH:mm:ss[Z]",
    );
  };
  
  const [formData, setFormData] = useState({
    summary: defaultEvent?.summary || "",
    description: defaultEvent?.description || "",
    location: defaultEvent?.location || "",
    startDate: dayjs(defaultEvent?.start?.dateTime) || dayjs(),
    startTime: dayjs(defaultEvent?.start?.dateTime) || dayjs(),
    endTime: dayjs(defaultEvent?.end?.dateTime) || dayjs(),
    endDate:
      dayjs(
        formatUntilDate(
          defaultEvent?.recurrence?.[1]?.match(/UNTIL=([^;]+)/)[1],
        ),
      ) || dayjs(),
    frequency:
      defaultEvent?.recurrence?.[1]?.match(/FREQ=([^;]+)/)?.[1] || "Weekly",
    recurrenceDates:
      defaultEvent?.recurrence?.[1]?.match(/BYDAY=([^;]+)/)[1].split(",") || [],
  });

  const dayMap = {
    Sun: "SU",
    Mon: "MO",
    Tues: "TU",
    Wed: "WE",
    Thur: "TH",
    Fri: "FR",
    Sat: "SA",
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDayToggle = (e) => {
    const { value } = e.target;
    setFormData((prevState) => {
      const { recurrenceDates } = prevState;
      const dayString = dayMap[value];

      const updatedDates = recurrenceDates.includes(dayString)
        ? recurrenceDates.filter((d) => d !== dayString)
        : [...recurrenceDates, dayString];

      console.log(updatedDates);

      return {
        ...prevState,
        recurrenceDates: updatedDates,
      };
    });
  };

  return (
    <Box component="form">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Summary"
            name="summary"
            value={formData.summary}
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Description"
            name="description"
            multiline
            value={formData.description}
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <DatePicker
            label="Start Date"
            value={formData.startDate}
            onChange={(date) =>
              setFormData((prev) => ({ ...prev, startDate: date }))
            }
            fullWidth
            maxDate={formData.endDate}
          />
        </Grid>
        <Grid item xs={6}>
          <DatePicker
            label="Until"
            value={formData.endDate}
            onChange={(date) =>
              setFormData((prev) => ({ ...prev, endDate: date }))
            }
            fullWidth
            minDate={formData.startDate}
          />
        </Grid>
        <Grid item xs={6}>
          <TimePicker
            label="Start Time"
            value={formData.startTime}
            onChange={(time) =>
              setFormData((prev) => ({ ...prev, startTime: time }))
            }
            fullWidth
            maxTime={formData.endTime}
          />
        </Grid>
        <Grid item xs={6}>
          <TimePicker
            label="End Time"
            value={formData.endTime}
            onChange={(time) =>
              setFormData((prev) => ({ ...prev, endTime: time }))
            }
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
              onChange={handleInputChange}
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
                selected={
                  formData.recurrenceDates.includes(dayString) ? true : false
                }
                onChange={handleDayToggle}
              >
                {day}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EventUI;
