import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import {RRule, RRuleSet} from "rrule"

dayjs.extend(utc);

const useEventFormatter = (formData) => {
  // Formatter for start and end times (ISO format is acceptable here)
  const dateTimeFormatter = (date, time) => {
    return `${dayjs(date).format("YYYY-MM-DD")}T${dayjs(time).format("HH:mm:ss")}`;
  };

  // Formatter for recurrence dates (must follow RFC 5545: no dashes/colons)
  const recurrenceDateFormatter = (date, time) => {
    return `${dayjs(date).format("YYYYMMDD")}T${dayjs(time).format("HHmmss")}`;
  };

  // Create UNTIL value in UTC in the proper format
  const untilUTC = dayjs(
    `${formData.endDate.format("YYYY-MM-DD")}T${formData.endTime.format("HH:mm:ss")}`
  )
    .utc()
    .format("YYYYMMDDTHHmmss[Z]");

const getNextValidDate = (startDate, byDay) => {
  const  rule = new RRule({
    freq: RRule.WEEKLY,
    dtstart: startDate,
    byweekday: byDay.map(day => day.slice(0,2)),
    count: 1
  })

  return rule.after(startDate, true);
}

let dtstart = formData.startDate.$d

if (formData.frequency === "WEEKLY") {
  dtstart = getNextValidDate(dtstart, formData.meetingDays)
}

  const formattedData = {
    summary: formData.summary,
    location: formData.location,
    description: formData.description,
    start: {
      dateTime: dateTimeFormatter(dtstart, formData.startTime),
      timeZone: formData.timeZone,
    },
    end: {
      dateTime: dateTimeFormatter(dtstart, formData.endTime),
      timeZone: formData.timeZone,
    },
    recurrence: [
      // RRULE with UNTIL in UTC
      `RRULE:FREQ=${formData.frequency};${
        formData.meetingDays && formData.meetingDays.length > 0
          ? `BYDAY=${formData.meetingDays.map(day => day.slice(0, 2).toUpperCase()).join(",")};`
          : ""
      }UNTIL=${untilUTC}`,
      // EXDATE using proper recurrence date format
      formData.exDates.length > 0
        ? `EXDATE;TZID=${formData.timeZone}:${formData.exDates
            .map((date) => recurrenceDateFormatter(date, formData.startTime))
            .join(",")}`
        : "",
      // RDATE using proper recurrence date format
      formData.rDates.length > 0
        ? `RDATE;TZID=${formData.timeZone}:${formData.rDates
            .map((date) => recurrenceDateFormatter(date, formData.startTime))
            .join(",")}`
        : "",
    ],
    reminders: formData.reminders || null,
  };

  return { formattedData };
};

export default useEventFormatter;
