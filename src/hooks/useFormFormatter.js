import { extractMeetingDays, getTimezones } from "../../server/utils/dateUtils";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const DATE_TIME_FORMAT = "YYYY-MM-DDThh:mm A";

const useFormFormatter = (course) => {
  const timezones = getTimezones();
  console.log(course)
  // Format the initial form data for a course
  const startDateTime = dayjs(`${course["Start Date"]}T${course["Start Time"]}`, DATE_TIME_FORMAT);
  const endDateTime = dayjs(`${course["End Date"]}T${course["End Time"]}`, DATE_TIME_FORMAT);

  const formData = {
    summary: course["Course Name"] || "",
    location: course["Location"] || "",
    description:
      `Instructor: ${course["Instructor"]}\nStudents: ${course["Seats Filled"]}${course["Course Notes"] ? `\nNotes: ${course["Course Notes"]}` : ""}` ||
      "",
    startDate: startDateTime.isValid() ? startDateTime : dayjs(),
    endDate: endDateTime.isValid() ? endDateTime : dayjs(course["Start Date"]).add(1, "day"),
    startTime: startDateTime.isValid() ? startDateTime : dayjs(),
    endTime: endDateTime.isValid() ? endDateTime : dayjs().add(1, "hour"),
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Chicago",
    meetingDays: extractMeetingDays(course["Meeting Days"]), // Safely handle meetingDays
    frequency: "WEEKLY",
    exDates: [],
    rDates: [],
  };

  return { formData, timezones };
};

export default useFormFormatter;
