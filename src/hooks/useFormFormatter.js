import { useState } from "react";
import { extractMeetingDays, getTimezones } from "../../server/utils/dateUtils";
import dayjs from "dayjs";

const useFormFormatter = (currentCourse) => {
  const timezones = getTimezones();

  const [formData, setFormData] = useState({
    summary: currentCourse["Course Name"] || "",
    location: currentCourse["Location"] || "",
    description:
      `Instructor: ${currentCourse["Instructor"]}\nStudents: ${currentCourse["Seats Filled"]}${currentCourse["Course Notes"] ? `\nNotes: ${currentCourse["Course Notes"]}` : ""}` ||
      "",
    startDate: dayjs(currentCourse["Start Date"]) || dayjs(),
    endDate:
      dayjs(currentCourse["End Date"]) ||
      dayjs(currentCourse["Start Date"]).add(1, "day"),
    startTime:
      dayjs(`${currentCourse["Start Date"]}T${currentCourse["Start Time"]}`) ||
      dayjs(),
    endTime:
      dayjs(`${currentCourse["Start Date"]}T${currentCourse["End Time"]}`) ||
      dayjs().add(1, "hour"),
    timeZone:
      Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Chicago",
    meetingDays: extractMeetingDays(currentCourse["Meeting Days"]) || [], // Initialize as empty array
    frequency: "WEEKLY",
  });

  const [userDataChange, setUserDataChange] = useState(false);

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setUserDataChange(true); // Fix typo here
  };

  const handleDayToggle = (newDays) => {
    setFormData((prevState) => ({
      ...prevState,
      meetingDays: newDays, // Use the updated days
    }));

    setUserDataChange(true); // Trigger state change flag
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (formData.frequency !== "WEEKLY") {
      setFormData((prev) => ({ ...prev, meetingDays: [] }));
    }
    // Further submission logic here
    if (userDataChange) {
      const updatedEvent = useEventFormatter(formData);
      console.log(updatedEvent);
    } else {
      console.log("No changes made");
    }
  };

  return {
    formData,
    timezones,
    handleInputChange,
    handleDayToggle,
    handleSubmit,
  };
};

export default useFormFormatter;
