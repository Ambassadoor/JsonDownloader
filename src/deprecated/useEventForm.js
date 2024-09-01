import { useState, useEffect } from "react";
import { formatUntilDate, getTimezones } from "../../server/utils/dateUtils";
import dayjs from "dayjs";
import useEventFormatter from "../hooks/useEventFormatter";

const useEventForm = (defaultEvent) => {
  const timezones = getTimezones();

  const [formData, setFormData] = useState({
    summary: defaultEvent?.summary || "",
    description: defaultEvent?.description || "",
    location: defaultEvent?.location || "",
    startDate: dayjs(defaultEvent?.start?.dateTime) || dayjs(),
    startTime: dayjs(defaultEvent?.start?.dateTime) || dayjs(),
    endTime: dayjs(defaultEvent?.end?.dateTime) || startTime.add(1, "hour"),
    endDate:
      dayjs(
        formatUntilDate(
          defaultEvent?.recurrence?.[1]?.match(/UNTIL=([^;]+)/)[1],
        ),
      ) || startDate.add(1, "day"),
    timeZone: defaultEvent?.start.timeZone || "America/New_York",
    frequency:
      defaultEvent?.recurrence?.[1]?.match(/FREQ=([^;]+)/)?.[1] || "WEEKLY",
    recurrenceDates:
      defaultEvent?.recurrence?.[1]?.match(/BYDAY=([^;]+)/)[1].split(",") || [],
  });

  const [userDataChange, setUserDataChange] = useState(false);

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setUserDataChange(true);
  };

  const handleDayToggle = (dayMap, value) => {
    setFormData((prevState) => {
      const { recurrenceDates } = prevState;
      const dayString = dayMap[value];
      const updatedDates = recurrenceDates.includes(dayString)
        ? recurrenceDates.filter((d) => d !== dayString)
        : [...recurrenceDates, dayString];

      setUserDataChange(true);
      return { ...prevState, recurrenceDates: updatedDates };
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (formData.frequency !== "WEEKLY") {
      setFormData((prev) => ({ ...prev, recurrenceDates: [] }));
    }
    // Further submission logic here
    if (userDataChange) {
      const updatedEvent = useEventFormatter(formData);
      console.log(updatedEvent);
    } else {
      console.log(defaultEvent);
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

export default useEventForm;
