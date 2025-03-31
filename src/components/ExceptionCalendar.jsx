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
  const { updatedRecurringDates = [], day, outsideCurrentMonth, ...other } = props;

  const isSelected =
    !outsideCurrentMonth &&
    updatedRecurringDates.some((recDay) => dayjs(recDay).isSame(day, "day"));

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

export default function RecurrenceCalendar({formData}) {
  const [isLoading, setIsLoading] = useState(false);
  const [originalRecurringDates, setOriginalRecurringDates] = useState([]);
  const [updatedRecurringDates, setUpdatedRecurringDates] = useState([]);


  //const location = useLocation();
  //const formData = location.state?.formData;

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
      setOriginalRecurringDates(dates);
      setUpdatedRecurringDates(dates);
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

    // Properly update recurringDates with a new filtered array
    setUpdatedRecurringDates((prevDates) => {
      if (prevDates.includes(formattedNewDate)) {
        return prevDates.filter((date) => date !== formattedNewDate);
    } else {
        return [...prevDates, formattedNewDate];
      }
    });
    
  };

  //place holder for the data filtering. Will update once GUI layout is finalized. 
  const handleConfirm = () => {
    // Dates that were originally there but are no longer in the updated array
    const exdate = originalRecurringDates.filter(
      (date) => !updatedRecurringDates.includes(date)
    );
    // Dates that were added to the updated array that weren't originally there
    const rdate = updatedRecurringDates.filter(
      (date) => !originalRecurringDates.includes(date)
    );

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
            updatedRecurringDates, // Pass recurring dates as a prop to RecurrenceDay
          },
        }}
      />
    </Box>
  );
}
