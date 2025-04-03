import React, { useContext, useState, useEffect } from "react";
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
import { ArrowLeft, ArrowRight } from "@mui/icons-material";
import RecurrenceCalendar from "./ExceptionCalendar";

const dayButtonLabels = ["SUN", "MON", "TUES", "WED", "THURS", "FRI", "SAT"];

const EventUI = () => {
  const { currentCourseIndex, setCurrentCourseIndex, subscribedData } =
    useContext(AppStateContext);

  // State to store form data for all courses
  const [courseFormData, setCourseFormData] = useState([]);

  // Initialize courseFormData when subscribedData changes
  useEffect(() => {
    setCourseFormData(
      subscribedData.map((course) => useFormFormatter(course).formData),
    );
  }, [subscribedData]);

  // Update the form data for the current course
  const handleInputChange = (name, value) => {
    console.log(name, value);
    setCourseFormData((prevData) =>
      prevData.map((data, index) =>
        index === currentCourseIndex ? { ...data, [name]: value } : data,
      ),
    );
  };

  // Handle day toggle
  const handleDayToggle = (newDays) => {
    setCourseFormData((prevData) =>
      prevData.map((data, index) =>
        index === currentCourseIndex ? { ...data, meetingDays: newDays } : data,
      ),
    );
  };

  // Submit handler
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Submitted data:", courseFormData[currentCourseIndex]);
  };

  // Navigation handlers
  const handleNextCourse = () => {
    if (currentCourseIndex < subscribedData.length - 1) {
      setCurrentCourseIndex(currentCourseIndex + 1);
    }
  };

  const handlePrevCourse = () => {
    if (currentCourseIndex > 0) {
      setCurrentCourseIndex(currentCourseIndex - 1);
    }
  };


  const formData = courseFormData[currentCourseIndex] || {};

  return (
    <Grid>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Summary"
              name="summary"
              value={formData.summary || ""}
              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              name="description"
              multiline
              value={formData.description || ""}
              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Location"
              name="location"
              value={formData.location || ""}
              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              name="timeZone"
              options={formData.timezones || []}
              value={formData.timeZone || ""}
              onChange={(event, newValue) =>
                handleInputChange("timeZone", newValue)
              }
              renderInput={(params) => (
                <TextField {...params} label="Timezone" />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <DatePicker
              label="Start Date"
              value={formData.startDate || null}
              onChange={(date) => handleInputChange("startDate", date)}
              fullWidth
              maxDate={formData.endDate}
            />
          </Grid>
          <Grid item xs={6}>
            <DatePicker
              label="Until"
              value={formData.endDate || null}
              onChange={(date) => handleInputChange("endDate", date)}
              fullWidth
              minDate={formData.startDate}
            />
          </Grid>
          <Grid item xs={6}>
            <TimePicker
              label="Start Time"
              value={formData.startTime || null}
              onChange={(time) => handleInputChange("startTime", time)}
              fullWidth
              maxTime={formData.endTime}
            />
          </Grid>
          <Grid item xs={6}>
            <TimePicker
              label="End Time"
              value={formData.endTime || null}
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
                value={formData.frequency || ""}
                onChange={(e) =>
                  handleInputChange(e.target.name, e.target.value)
                }
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
                  : formData.meetingDays || []
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
            <Button
              variant="contained"
              name="Previous"
              startIcon={<ArrowLeft />}
              onClick={handlePrevCourse}
              disabled={currentCourseIndex === 0}
            >
              Previous
            </Button>
            <Button
              variant="contained"
              name="Next"
              endIcon={<ArrowRight />}
              onClick={handleNextCourse}
              disabled={currentCourseIndex === subscribedData.length - 1}
            >
              Next
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" name="submit">
              Submit
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Box>
        {formData.description?.length > 0 ? (
          <RecurrenceCalendar
            formData={formData}
            setCourseFormData={setCourseFormData}
            currentCourseIndex={currentCourseIndex}
          />
        ) : (
          <p>Loading</p>
        )}
      </Box>
    </Grid>
  );
};

export default EventUI;
