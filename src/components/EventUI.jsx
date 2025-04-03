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
import { getTimezones } from "../../server/utils/dateUtils";
import useEventFormatter from "../hooks/useEventFormatter";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const dayButtonLabels = ["SUN", "MON", "TUES", "WED", "THURS", "FRI", "SAT"];
const timeZones = getTimezones();

const EventUI = () => {
  const navigate = useNavigate();
  const { currentCourseIndex, setCurrentCourseIndex, subscribedData } =
    useContext(AppStateContext)

  // State to store form data for all courses
  const [courseFormData, setCourseFormData] = useState([]);
  const [eventData, setEventData] = useState([]);

  // Initialize courseFormData when subscribedData changes
  useEffect(() => {
    setCourseFormData(
      subscribedData.map((course) => useFormFormatter(course).formData),
    );
  }, [subscribedData]);

  useEffect(() => {
    console.log("Event Data:", eventData);
  }, [eventData]);

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
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Submitted data:", courseFormData[currentCourseIndex]);
  
    // Collect formatted events in a local variable
    const formattedEvents = courseFormData.map((data) => {
      const event = useEventFormatter(data).formattedData;
      console.log(event);
      return event;
    });
  
    try {
      // Send the formatted events directly in the POST request
      const response = await axios.post("/api/create-events", {
        events: formattedEvents,
      });
      console.log("Response:", response.data);
  
      // Optionally update the state with the response data
      setEventData(response.data.events || []);
    } catch (error) {
      console.error("Error creating events:", error);
    }
  
    // Navigate to the confirmation page with the formatted events
    navigate("/calendar_confirmation", { state: { eventData: formattedEvents } });
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
              options={timeZones || []}
              value={formData.timeZone || null}
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
