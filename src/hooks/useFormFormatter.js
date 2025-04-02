import { extractMeetingDays, getTimezones } from "../../server/utils/dateUtils";
import dayjs from "dayjs";

const useFormFormatter = (course) => {
  const timezones = getTimezones();

  // Format the initial form data for a course
  const formData = {
    summary: course["Course Name"] || "",
    location: course["Location"] || "",
    description:
      `Instructor: ${course["Instructor"]}\nStudents: ${course["Seats Filled"]}${course["Course Notes"] ? `\nNotes: ${course["Course Notes"]}` : ""}` ||
      "",
    startDate: dayjs(`${course["Start Date"]}T${course["Start Time"]}`) || dayjs(),
    endDate: dayjs(`${course["End Date"]}T${course["End Time"]}`) || dayjs(course["Start Date"]).add(1, "day"),
    startTime: dayjs(`${course["Start Date"]}T${course["Start Time"]}`) || dayjs(),
    endTime: dayjs(`${course["Start Date"]}T${course["End Time"]}`) || dayjs().add(1, "hour"),
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Chicago",
    meetingDays: extractMeetingDays(course["Meeting Days"]), // Safely handle meetingDays
    frequency: "WEEKLY",
  };

  return { formData, timezones };
};

export default useFormFormatter;
