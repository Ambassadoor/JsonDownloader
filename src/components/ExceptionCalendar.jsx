import { rrulestr } from "rrule";
import React, { useState, useEffect } from "react";
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

export default function RecurrenceCalendar({ formData }) {
  const [isLoading, setIsLoading] = useState(false);
  const [recurringDates, setRecurringDates] = useState([]);

  const fetchRecurringDates = () => {
    setIsLoading(true);
    setTimeout(() => {
      // Simulate calculating recurring dates using rrule (this would be your actual logic)
      const rruleString = `FREQ=${formData.frequency};BYDAY=${formData.meetingDays
        .map((day) => day.slice(0, 2))
        .join(
          ",",
        )};UNTIL=${formData.endDate.format("YYYYMMDDTHHmmss")};DTSTART=${formData.startDate.format("YYYYMMDDTHHmmss")}`;
      const rule = rrulestr(rruleString);
      const occurrences = rule.all();

      // Convert dates to dayjs objects
      const dates = occurrences.map((date) => dayjs(date).format("YYYYMMDD"));
      setRecurringDates(dates);
      setIsLoading(false);
    }, 1000); // Simulate server delay, adjust for actual use case
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
        value={formData.startDate}
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
