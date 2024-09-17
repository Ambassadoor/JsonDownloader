import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { extractMeetingDays, getTimezones } from "../../server/utils/dateUtils";
import dayjs from "dayjs";

const useFormFormatter = (currentCourseIndex, subscribedData) => {
  const timezones = getTimezones();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    summary: "",
    location: "",
    description: "",
    startDate: dayjs(),
    endDate: dayjs().add(1, "day"),
    startTime: dayjs(),
    endTime: dayjs().add(1, "hour"),
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Chicago",
    meetingDays: [],
    frequency: "WEEKLY",
  });

  const [userDataChange, setUserDataChange] = useState(false);

  // useEffect to update formData whenever currentCourseIndex changes
  useEffect(() => {
    const currentCourse = subscribedData[currentCourseIndex];

    if (currentCourse) {
      setFormData({
        summary: currentCourse["Course Name"] || "",
        location: currentCourse["Location"] || "",
        description:
          `Instructor: ${currentCourse["Instructor"]}\nStudents: ${currentCourse["Seats Filled"]}${currentCourse["Course Notes"] ? `\nNotes: ${currentCourse["Course Notes"]}` : ""}` ||
          "",
        startDate:
          dayjs(`${currentCourse["Start Date"]}T${currentCourse["Start Time"]}`) ||
          dayjs(),
        endDate:
          dayjs(`${currentCourse["End Date"]}T${currentCourse["End Time"]}`) ||
          dayjs(currentCourse["Start Date"]).add(1, "day"),
        startTime:
          dayjs(`${currentCourse["Start Date"]}T${currentCourse["Start Time"]}`) ||
          dayjs(),
        endTime:
          dayjs(`${currentCourse["Start Date"]}T${currentCourse["End Time"]}`) ||
          dayjs().add(1, "hour"),
        timeZone:
          Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Chicago",
        meetingDays: extractMeetingDays(currentCourse["Meeting Days"]) || [],
        frequency: "WEEKLY",
      });
    }
  }, [currentCourseIndex, subscribedData]); // Dependency array includes currentCourseIndex and subscribedData

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setUserDataChange(true);
  };

  const handleDayToggle = (newDays) => {
    setFormData((prevState) => ({
      ...prevState,
      meetingDays: newDays,
    }));
    setUserDataChange(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (formData.frequency !== "WEEKLY") {
      setFormData((prev) => ({ ...prev, meetingDays: [] }));
    }

    navigate("/calendar", { state: { formData } });
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
