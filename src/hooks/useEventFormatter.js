import dayjs from "dayjs";

const useEventFormatter = (formData) => {
  const formattedData = {
    summary: formData.summary,
    location: formData.location,
    description: formData.description,
    start: {
      dateTime: `${formData.startDate.format("YYYY-MM-DD")}T${formData.startTime.format("HH:mm:ss")}`,
      timeZone: formData.timeZone,
    },
    end: {
      dateTime: `${formData.startDate.format("YYYY-MM-DD")}T${formData.endTime.format("HH:mm:ss")}`,
      timeZone: formData.timeZone,
    },
    recurrence: [
      formData.exDates.length > 0 ? `EXDATE:${formData.exDates.join(",")}` : "",
      formData.rDates.length > 0 ? `RDATE:${formData.rDates.join(",")}` : "",
      `RRULE:FREQ=${formData.frequency};${formData.meetingDays && formData.meetingDays.length > 0 ? `BYDAY=${formData.meetingDays.join(",")};` : ""}UNTIL=${formData.endDate.format("YYYYMMDD")}T${formData.endTime.format("HHmmss[Z]")}`,
    ],
    reminders: formData.reminders || null,
  };

  return {
    formattedData,
  };
};

export default useEventFormatter;
