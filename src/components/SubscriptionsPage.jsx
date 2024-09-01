import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppStateContext } from "../AppStateContext";
import CourseViewer from "./CourseViewer";
import createEventFromCourse from "./CalendarEntryGenerator";
import axios from "axios";

const dayMap = {
  Sun: "SU",
  Mon: "MO",
  Tues: "TU",
  Wed: "WE",
  Thurs: "TH",
  Fri: "FR",
  Sat: "SA",
};

const SubscriptionsPage = () => {
  const {
    subscribedData,
    eventObjects,
    setEventObjects,
    setEventInstances,
    currentCourseIndex,
    setCurrentCourseIndex,
  } = useContext(AppStateContext);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [currentEvent, setCurrentEvent] = useState({});
  const [selectedDays, setSelectedDays] = useState([]);
  const [frequency, setFrequency] = useState("WEEKLY");
  const [untilDate, setUntilDate] = useState(null);
  const [currentUntil, setCurrentUntil] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    setEventObjects(subscribedData.map(createEventFromCourse));
  }, [subscribedData, setEventObjects]);

  useEffect(() => {
    const course = subscribedData[currentCourseIndex];
    setCurrentCourse(course);
    if (eventObjects.length > 0) {
      const event = eventObjects[currentCourseIndex];
      setCurrentEvent(event);

      const rrule = event.recurrence?.[1];
      if (rrule) {
        const matchDays = rrule.match(/BYDAY=([^;]+)/);
        const matchUntil = rrule.match(/UNTIL=([^;]+)/);

        if (matchDays) {
          const days = matchDays[1]
            .split(",")
            .map((dayCode) =>
              Object.keys(dayMap).find((key) => dayMap[key] === dayCode),
            );
          setSelectedDays(days);
        }

        if (matchUntil) {
          setCurrentUntil(matchUntil[1]);
        }
      }
    }
  }, [currentCourseIndex, subscribedData, eventObjects]);

  const formatDateField = (date) => {
    return date.slice(0, 4) + "-" + date.slice(4, 6) + "-" + date.slice(6, 8);
  };

  const handleNextCourse = () => {
    setCurrentCourseIndex((prevIndex) =>
      prevIndex < subscribedData.length - 1 ? prevIndex + 1 : prevIndex,
    );
  };

  const handlePrevCourse = () => {
    setCurrentCourseIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : prevIndex,
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentEvent((prevEvent) => ({
      ...prevEvent,
      [name]: value,
    }));
  };

  const handleFrequencyChange = (e) => {
    const newFrequency = e.target.value;
    setFrequency(newFrequency);

    if (newFrequency === "DAILY") {
      setSelectedDays(Object.keys(dayMap));
    }
  };

  const handleDayToggle = (day) => {
    setSelectedDays((prevDays) => {
      if (prevDays.includes(day)) {
        const newDays = prevDays.filter((d) => d !== day);
        if (frequency === "DAILY") {
          setFrequency("WEEKLY");
        }
        return newDays;
      } else {
        return [...prevDays, day];
      }
    });
  };

  const handleUntilDateChange = (e) => {
    setUntilDate(e.target.value);
  };

  const formatDateTimeLocal = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const tzOffset = date.getTimezoneOffset() * 60000; // Offset in milliseconds
    const localDateTime = new Date(date.getTime() - tzOffset).toISOString();
    return localDateTime;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const endTime = currentEvent.end.dateTime.split("T")[1].split(".")[0];

    let untilWithTime;
    if (untilDate) {
      const untilDateObj = new Date(`${untilDate}T${endTime}`)
        .toISOString()
        .split(".")[0]
        .replace(/[-:]/g, "");
      untilWithTime = `${untilDateObj}Z`;
    } else {
      untilWithTime = currentUntil;
    }

    const byDay = selectedDays.map((day) => dayMap[day]).join(",");

    const rrule = `RRULE:FREQ=${frequency};BYDAY=${byDay};UNTIL=${untilWithTime}`;

    const updatedEvent = {
      ...currentEvent,
      recurrence: [
        `DTSTART:${
          new Date(currentEvent.start.dateTime)
            .toISOString()
            .replace(/[-:]/g, "")
            .split(".")[0]
        }Z`,
        rrule,
      ],
    };

    setEventObjects((prevEvents) => {
      const updatedEvents = prevEvents.map((event, index) =>
        index === currentCourseIndex ? updatedEvent : event,
      );
      console.log("Updated EventObjects State:", updatedEvents);
      return updatedEvents;
    });

    alert("Event updated successfully!");
  };

  const handleCreateEvents = async () => {
    try {
      const response = await axios.post(
        "/api/create-events",
        { eventObjects },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 200) {
        const { events } = response.data;
        setEventInstances(events);
        alert("Events created successfully");
        navigate("/files");
      } else {
        alert("Failed to create events");
      }
    } catch (error) {
      console.error("Error creating events:", error);
      alert("Failed to create events");
    }
  };
  const handleUiClick = async () => {
    navigate("/ui");
  };

  return (
    <div>
      <button onClick={handleUiClick}>UI</button>
      <h1>Subscribed Courses</h1>
      <div>
        <button onClick={handlePrevCourse} disabled={currentCourseIndex === 0}>
          Previous
        </button>
        {currentCourse && (
          <span>
            {`Viewing course ${currentCourseIndex + 1} of ${
              subscribedData.length
            }: ${currentCourse["Course Name"]}`}
          </span>
        )}
        <button
          onClick={handleNextCourse}
          disabled={currentCourseIndex === subscribedData.length - 1}
        >
          Next
        </button>
      </div>

      <br></br>

      {currentEvent && (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Summary:</label>
            <input
              type="text"
              name="summary"
              value={currentEvent.summary || ""}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Location:</label>
            <input
              type="text"
              name="location"
              value={currentEvent.location || ""}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Description:</label>
            <textarea
              name="description"
              value={currentEvent.description || ""}
              onChange={handleInputChange}
            />
          </div>

          {/* Start Date and Time Fields */}
          <div>
            <label>Start Date:</label>
            <input
              type="date"
              name="startDate"
              value={
                currentEvent.start
                  ? currentEvent.start.dateTime.split("T")[0]
                  : ""
              }
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Start Time:</label>
            <input
              type="time"
              name="startTime"
              value={
                currentEvent.start
                  ? formatDateTimeLocal(currentEvent.start.dateTime)
                      .split("T")[1]
                      .split(".")[0]
                  : ""
              }
              onChange={handleInputChange}
            />
          </div>

          {/* End Date and Time Fields */}
          <div>
            <label>End Date:</label>
            <input
              type="date"
              name="endDate"
              value={
                currentEvent.end
                  ? formatDateField(
                      currentEvent.recurrence[1]
                        .match(/UNTIL=([^;]+)/)[1]
                        .split("T")[0],
                    )
                  : ""
              }
              onChange={handleUntilDateChange}
            />
          </div>
          <div>
            <label>End Time:</label>
            <input
              type="time"
              name="endTime"
              value={
                currentEvent.end
                  ? formatDateTimeLocal(currentEvent.end.dateTime)
                      .split("T")[1]
                      .split(".")[0]
                  : ""
              }
              onChange={handleInputChange}
            />
          </div>

          {/* Recurrence Inputs */}
          <div>
            <label>Frequency:</label>
            <select value={frequency} onChange={handleFrequencyChange}>
              <option value="DAILY">Daily</option>
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
            </select>
          </div>
          <div>
            <label>Select Days:</label>
            <div style={{ display: "flex", gap: "5px" }}>
              {Object.keys(dayMap).map((day) => (
                <button
                  type="button"
                  key={day}
                  onClick={() => handleDayToggle(day)}
                  style={{
                    backgroundColor: selectedDays.includes(day)
                      ? "lightblue"
                      : "lightgray",
                    color: selectedDays.includes(day) ? "black" : "darkgray",
                    border: "1px solid gray",
                    padding: "5px",
                    cursor: "pointer",
                  }}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
          <button type="submit">Update Event</button>
        </form>
      )}

      {eventObjects.length > 0 && (
        <CourseViewer currentCourseIndex={currentCourseIndex} />
      )}
      <button onClick={handleCreateEvents}>
        Create Google Calendar Events
      </button>
    </div>
  );
};

export default SubscriptionsPage;
