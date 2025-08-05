import { rrulestr } from "rrule";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Badge, Box } from "@mui/material";
import {
  DateCalendar,
  DayCalendarSkeleton,
  PickersDay,
} from "@mui/x-date-pickers";
// Add copy of recurring dates for reset functionality
// Add a undo/redo function by tracking dates as they're submitted
dayjs.extend(utc);

function RecurrenceDay(props) {
  const {
    rruleDates = [],
    exDates = [],
    rDates = [],
    day,
    outsideCurrentMonth,
    ...other
  } = props;

  const checkDateArray = (arr) => {
    return arr.some((recDay) => dayjs(recDay).isSame(day, "day"));
  };

  const isSelected =
    !outsideCurrentMonth &&
    (checkDateArray(rruleDates) || checkDateArray(rDates)) &&
    !checkDateArray(exDates);

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

export default function RecurrenceCalendar({
  formData,
  setCourseFormData,
  currentCourseIndex,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [rruleDates, setRruleDates] = useState([]);

  const [selectedDate, setSelectedDate] = useState(
    dayjs(formData.startDate.$d),
  );

  const fetchRecurringDates = () => {
    setIsLoading(true);
    setTimeout(() => {
      let startDate = dayjs(formData.startDate.$d);
      
      // If we have BYDAY specified, adjust start date to first valid occurrence
      if (formData.frequency === "WEEKLY" && formData.meetingDays?.length > 0) {
        const dayAbbrToNumber = {
          'SU': 0, 'MO': 1, 'TU': 2, 'WE': 3,
          'TH': 4, 'FR': 5, 'SA': 6
        };
        

        const meetingDayNumbers = formData.meetingDays.map(day => dayAbbrToNumber[day.slice(0,2).toUpperCase()]);
        const startDayOfWeek = startDate.day();
        
        // Check if start date is already a valid meeting day
        if (!meetingDayNumbers.includes(startDayOfWeek)) {
          // Find the next valid meeting day
          let nextValidDay = null;
          for (let i = 1; i <= 7; i++) {
            const checkDay = (startDayOfWeek + i) % 7;
            if (meetingDayNumbers.includes(checkDay)) {
              nextValidDay = checkDay;
              break;
            }
          }
          
          if (nextValidDay !== null) {
            const daysToAdd = nextValidDay > startDayOfWeek 
              ? nextValidDay - startDayOfWeek 
              : (7 - startDayOfWeek) + nextValidDay;
            startDate = startDate.add(daysToAdd, 'day');
          }
        }
      }

      let rruleString = `FREQ=${formData.frequency};UNTIL=${dayjs(formData.endDate.$d).format("YYYYMMDDTHHmmss[Z]")};DTSTART=${startDate.format("YYYYMMDDTHHmmss[Z]")}`;

      if (formData.frequency === "WEEKLY") {
        rruleString += `;BYDAY=${formData.meetingDays
          .map((day) => day.slice(0, 2))
          .join(",")}`;
      }
      console.log(formData.meetingDays)
      const rule = rrulestr(rruleString);
      const occurrences = rule.all();
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
    setSelectedDate(newDate);
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
          : data,
      ),
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
            rruleDates,
            rDates: formData.rDates || [],
            exDates: formData.exDates || [], // Pass recurring dates as a prop to RecurrenceDay
          },
        }}
      />
    </Box>
  );
}
