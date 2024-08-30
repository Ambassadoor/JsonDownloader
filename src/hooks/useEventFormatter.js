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
      `DTSTART:${formData.startDate.format("YYYYMMDD")}T${formData.startTime.format("HHmmss")}`,
      `RRULE:FREQ=${formData.frequency};${formData.recurrenceDates && formData.recurrenceDates.length > 0 ? `BYDAY=${formData.recurrenceDates.join(",")};` : ""}UNTIL=${formData.endDate.format("YYYYMMDD")}T${formData.endTime.format("HHmmss")}`,
    ],
    reminders: formData.reminders,
  };

  return {
    formattedData,
  };
};

export default useEventFormatter;
