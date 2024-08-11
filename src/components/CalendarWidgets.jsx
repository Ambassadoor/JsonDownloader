import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function CourseCalendar({ courses, events }) {
  const [selectedCourse, setSelectedCourse] = useState(courses[0]);
  const [date, setDate] = useState(new Date());

  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value);
  };

  const handleDateChange = (date) => {
    setDate(date);
  };

  const getHighlightedDays = () => {
    const selectedEvents = events[selectedCourse] || [];
    return selectedEvents.map((event) => new Date(event.date));
  };

  return (
    <div>
      <select onChange={handleCourseChange} value={selectedCourse}>
        {courses.map((course) => (
          <option key={course} value={course}>
            {course}
          </option>
        ))}
      </select>
      <Calendar
        onChange={handleDateChange}
        value={date}
        tileClassName={({ date, view }) => {
          if (view === "month") {
            const highlightedDays = getHighlightedDays();
            if (
              highlightedDays.some(
                (highlightedDate) =>
                  date.toDateString() === highlightedDate.toDateString(),
              )
            ) {
              return "highlighted";
            }
          }
        }}
      />
    </div>
  );
}

export default CourseCalendar;
