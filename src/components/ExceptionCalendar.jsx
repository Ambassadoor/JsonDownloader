import { rrulestr } from "rrule";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Badge, Box } from "@mui/material";
import {
  DateCalendar,
  DayCalendarSkeleton,
  PickersDay,
} from "@mui/x-date-pickers";

dayjs.extend(utc);

function RecurrenceDay(props) {
  const { recurringDates = [], day, outsideCurrentMonth, ...other } = props;

  const isSelected =
    !outsideCurrentMonth &&
    recurringDates.some((recDay) => dayjs(recDay).isSame(day, "day"));

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

export default function RecurrenceCalendar() {
  const [isLoading, setIsLoading] = useState(false);
  const [recurringDates, setRecurringDates] = useState([]);

  const location = useLocation();
  const formData = location.state?.formData;

  const fetchRecurringDates = () => {
    setIsLoading(true);
    setTimeout(() => {
      console.log(dayjs(formData.endDate));
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
      setRecurringDates(dates);
      setIsLoading(false);
    }); // Simulate server delay, adjust for actual use case
  };

  useEffect(() => {
    if (formData) {
      fetchRecurringDates();
    }
  }, [formData]);

  const handleDateSelect = (newDate) => {
    const formattedNewDate = newDate.format("YYYYMMDD");

    // Properly update recurringDates with a new filtered array
    setRecurringDates((prevDates) => {
      const updatedDates = prevDates.filter(
        (date) => date !== formattedNewDate,
      );
      return updatedDates; // Return new state
    });
  };

  const handleDateChange = (newDate) => {
    handleDateSelect(newDate);
  };

  return (
    <Box>
      <DateCalendar
        value={dayjs(formData.startDate.$d)}
        onChange={handleDateChange} // Controlled input, add your own handler if needed
        loading={isLoading}
        renderLoading={() => <DayCalendarSkeleton />}
        slots={{
          day: RecurrenceDay, // Custom day rendering with badges
        }}
        slotProps={{
          day: {
            recurringDates, // Pass recurring dates as a prop to RecurrenceDay
          },
        }}
      />
    </Box>
  );
}
