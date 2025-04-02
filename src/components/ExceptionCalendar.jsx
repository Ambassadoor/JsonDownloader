import { rrulestr } from "rrule";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Badge, Box, Button } from "@mui/material";
import {
  DateCalendar,
  DayCalendarSkeleton,
  PickersDay,
} from "@mui/x-date-pickers";
import { format } from "date-fns";
// Add copy of recurring dates for reset functionality 
// Add a undo/redo function by tracking dates as they're submitted
dayjs.extend(utc);

function RecurrenceDay(props) {
  const { rruleDates = [], exDates = [], rDates = [], day, outsideCurrentMonth, ...other } = props;

  const checkDateArray = (arr) => {
    return arr.some((recDay) => dayjs(recDay).isSame(day, "day"))
  }

  const isSelected =
    !outsideCurrentMonth &&
    (checkDateArray(rruleDates) || checkDateArray(rDates)) &&
    !checkDateArray(exDates)


  return (
    <Badge
      key={day.toString()}
      overlap="circular"
      badgeContent={isSelected ? "🌟" : undefined} // Show star if the day is recurring
    >
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
      />
    </Badge>
  );
}

export default function RecurrenceCalendar({formData, setCourseFormData, currentCourseIndex}) {
  const [isLoading, setIsLoading] = useState(false);
  const [rruleDates, setRruleDates] = useState([]);


  const [selectedDate, setSelectedDate] = useState(dayjs(formData.startDate.$d));

  const fetchRecurringDates = () => {
    setIsLoading(true);
    setTimeout(() => {
      let rruleString = `FREQ=${formData.frequency};UNTIL=${dayjs(formData.endDate.$d).format("YYYYMMDDTHHmmss")};DTSTART=${dayjs(formData.startDate.$d).format("YYYYMMDDTHHmmss")};`;
      // Simulate calculating recurring dates using rrule (this would be your actual logic)
      if (formData.frequency === "WEEKLY") {
        rruleString += `BYDAY=${formData.meetingDays
          .map((day) => day.slice(0, 2))
          .join(",")}`;
      }

      const rule = rrulestr(rruleString);
      const occurrences = rule.all();

      // Convert dates to dayjs objects
      const dates = occurrences.map((date) => dayjs(date).format("YYYYMMDD"));
      setRruleDates(dates);
      setIsLoading(false);
    }); // Simulate server delay, adjust for actual use case
  };

  useEffect(() => {
    if (formData) {
      fetchRecurringDates();
    }
  }, [formData]);

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate)
    const formattedNewDate = newDate.format("YYYYMMDD");
    const toggleDate = (arr, date) =>
      arr.includes(date) ? arr.filter((d) => d !== date) : [...arr, date];

    let updatedExDates = formData.exDates || [];
    let updatedRDates = formData.rDates || [];

    // Compare user selected Date against rruleDates and update exDate or rDate states. 
    if (rruleDates.includes(formattedNewDate)) {
      updatedExDates = toggleDate(updatedExDates, formattedNewDate);
    } else {
      updatedRDates = toggleDate(updatedRDates, formattedNewDate);
    }

    setCourseFormData((prevData) =>
      prevData.map((data, index) =>
        index === currentCourseIndex
          ? { ...data, exDates: updatedExDates, rDates: updatedRDates }
          : data
  ))

    
  };




  return (
    <Box>
      <DateCalendar
        value={selectedDate}
        onChange={handleDateChange} // Controlled input, add your own handler if needed
        loading={isLoading}
        renderLoading={() => <DayCalendarSkeleton />}
        slots={{
          day: RecurrenceDay, // Custom day rendering with badges
        }}
        slotProps={{
          day: {
            rruleDates,
            rDates: formData.rDates || [],
            exDates: formData.exDates || [] // Pass recurring dates as a prop to RecurrenceDay
          },
        }}
      />
    </Box>
  );
}
