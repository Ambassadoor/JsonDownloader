import React, { useState, useEffect, useContext } from "react";
import moment from "moment";
import { rrulestr } from "rrule";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { AppStateContext } from "../AppStateContext";

const createRecurringEvents = (event) => {
  const { recurrence, start, end, ...rest } = event;

  if (recurrence && recurrence.length > 1) {
    const dtstartString = recurrence[0].split(":")[1];
    const ruleString = `${recurrence[1]};DTSTART=${dtstartString}`;
    const rule = rrulestr(ruleString);

    const duration = moment(end.dateTime).diff(
      moment(start.dateTime),
      "minutes",
    );

    return rule.all().map((date) => {
      return {
        ...rest,
        start: new Date(date),
        end: new Date(moment(date).add(duration, "minutes").toISOString()),
      };
    });
  } else {
    return [
      {
        ...event,
        start: new Date(start.dateTime),
        end: new Date(end.dateTime),
      },
    ];
  }
};

const CourseViewer = ({ currentCourseIndex }) => {
  const { eventObjects, setEventObjects } = useContext(AppStateContext);
  const [highlightedDates, setHighlightedDates] = useState([]);
  const [excludedDates, setExcludedDates] = useState([]); // Array for each course's excludedDates
  const [history, setHistory] = useState([]);
  const [currentSteps, setCurrentSteps] = useState([]);
  const [inputDate, setInputDate] = useState("");

  useEffect(() => {
    const allEvents = createRecurringEvents(eventObjects[currentCourseIndex]);
    const dates = allEvents.map(
      (event) => event.start.toISOString().split("T")[0],
    );
    setHighlightedDates(dates);

    if (!history[currentCourseIndex]) {
      const newHistory = [...history];
      newHistory[currentCourseIndex] = [];
      setHistory(newHistory);
    }
    if (
      !currentSteps[currentCourseIndex] &&
      currentSteps[currentCourseIndex] !== 0
    ) {
      const newCurrentSteps = [...currentSteps];
      newCurrentSteps[currentCourseIndex] = 0;
      setCurrentSteps(newCurrentSteps);
    }

    // Set the excluded dates for the current course
    if (!excludedDates[currentCourseIndex]) {
      const newExcludedDates = [...excludedDates];
      newExcludedDates[currentCourseIndex] =
        eventObjects[currentCourseIndex].exdate || [];
      setExcludedDates(newExcludedDates);
    }
  }, [eventObjects, currentCourseIndex]);

  const handleDateClick = (date) => {
    const dateString = date.toISOString().split("T")[0];
    const courseExcludedDates = excludedDates[currentCourseIndex] || [];
    if (highlightedDates.includes(dateString)) {
      const newExcludedDates = courseExcludedDates.includes(dateString)
        ? courseExcludedDates
        : [...courseExcludedDates, dateString];
      updateExcludedDates(newExcludedDates);
      updateHistory(newExcludedDates);
    }
  };

  const updateExcludedDates = (newExcludedDates) => {
    const updatedExcludedDates = [...excludedDates];
    updatedExcludedDates[currentCourseIndex] = newExcludedDates;
    setExcludedDates(updatedExcludedDates);
  };

  const handleInputChange = (e) => {
    setInputDate(e.target.value);
  };

  const handleAddDate = () => {
    const courseExcludedDates = excludedDates[currentCourseIndex] || [];
    if (moment(inputDate, "YYYY-MM-DD", true).isValid()) {
      if (!courseExcludedDates.includes(inputDate)) {
        const newExcludedDates = [...courseExcludedDates, inputDate];
        updateExcludedDates(newExcludedDates);
        updateHistory(newExcludedDates);
        setInputDate(""); // Clear the input field after adding
      }
    } else {
      alert("Please enter a valid date in the format YYYY-MM-DD.");
    }
  };

  const handleDeselectDate = (date) => {
    const courseExcludedDates = excludedDates[currentCourseIndex] || [];
    const newExcludedDates = courseExcludedDates.filter((d) => d !== date);
    updateExcludedDates(newExcludedDates);
    updateHistory(newExcludedDates);
  };

  const updateHistory = (newExcludedDates) => {
    const newHistory = [...history];
    newHistory[currentCourseIndex] = newHistory[currentCourseIndex].slice(
      0,
      currentSteps[currentCourseIndex] + 1,
    );
    newHistory[currentCourseIndex].push(newExcludedDates);
    setHistory(newHistory);

    const newCurrentSteps = [...currentSteps];
    newCurrentSteps[currentCourseIndex] =
      newHistory[currentCourseIndex].length - 1;
    setCurrentSteps(newCurrentSteps);
  };

  const handleUndo = () => {
    if (currentSteps[currentCourseIndex] > 0) {
      // Ensure we only decrement if steps are greater than 0
      const newCurrentSteps = [...currentSteps];
      newCurrentSteps[currentCourseIndex] -= 1;
      setCurrentSteps(newCurrentSteps);
      setExcludedDates((prevExcludedDates) => {
        const updatedExcludedDates = [...prevExcludedDates];
        updatedExcludedDates[currentCourseIndex] =
          history[currentCourseIndex][newCurrentSteps[currentCourseIndex]];
        return updatedExcludedDates;
      });
    } else if (currentSteps[currentCourseIndex] === 0) {
      // Clear the excluded dates if it's the first step
      setExcludedDates((prevExcludedDates) => {
        const updatedExcludedDates = [...prevExcludedDates];
        updatedExcludedDates[currentCourseIndex] = [];
        return updatedExcludedDates;
      });
      const newCurrentSteps = [...currentSteps];
      newCurrentSteps[currentCourseIndex] = -1; // Set it to -1 only if it's the first step
      setCurrentSteps(newCurrentSteps);
    }
  };

  const handleRedo = () => {
    if (
      currentSteps[currentCourseIndex] <
      history[currentCourseIndex].length - 1
    ) {
      const newCurrentSteps = [...currentSteps];
      newCurrentSteps[currentCourseIndex] += 1;
      setCurrentSteps(newCurrentSteps);
      setExcludedDates((prevExcludedDates) => {
        const updatedExcludedDates = [...prevExcludedDates];
        updatedExcludedDates[currentCourseIndex] =
          history[currentCourseIndex][newCurrentSteps[currentCourseIndex]];
        return updatedExcludedDates;
      });
    }
  };

  const handleRemoveDates = () => {
    // Update the eventObject for the current course with excluded dates
    const updatedEventObjects = eventObjects.map((event, index) => {
      if (index === currentCourseIndex) {
        const eventTime = moment(event.start.dateTime).format("HHmmss");
        const formattedExdates = excludedDates[currentCourseIndex].map((date) =>
          moment(date, "YYYY-MM-DD").format(`YYYYMMDD[T]${eventTime}`),
        );

        // Create the EXDATE string without timezone info
        const exdateString = `EXDATE:${formattedExdates.join(",")}`;

        // Update the recurrence array to include the EXDATE string
        const updatedRecurrence = [...event.recurrence];
        updatedRecurrence.push(exdateString);

        return {
          ...event,
          recurrence: updatedRecurrence, // Include the EXDATE in the recurrence array
        };
      }
      return event; // Return the event unchanged if it's not the current one
    });

    setEventObjects(updatedEventObjects); // Update the eventObjects in AppStateContext
  };

  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const dateString = date.toISOString().split("T")[0];
      const courseExcludedDates = excludedDates[currentCourseIndex] || [];
      if (courseExcludedDates.includes(dateString)) {
        return "excluded-date";
      }
      return highlightedDates.includes(dateString) ? "highlight" : null;
    }
    return null;
  };

  return (
    <div style={{ height: "500px" }}>
      <h2>Course Calendar</h2>
      <Calendar tileClassName={tileClassName} onClickDay={handleDateClick} />
      <div style={{ marginTop: "10px" }}>
        <input
          type="text"
          value={inputDate}
          onChange={handleInputChange}
          placeholder="YYYY-MM-DD"
        />
        <button onClick={handleAddDate}>Add Date</button>
      </div>
      <div style={{ marginTop: "10px" }}>
        <button
          onClick={handleUndo}
          disabled={currentSteps[currentCourseIndex]?.length === 0}
        >
          Undo
        </button>
        <button
          onClick={handleRedo}
          disabled={
            currentSteps[currentCourseIndex] >=
            history[currentCourseIndex]?.length - 1
          }
        >
          Redo
        </button>
        <button onClick={handleRemoveDates}>Remove Selected Dates</button>
      </div>

      {/* Table to display excluded dates */}
      <div style={{ marginTop: "20px" }}>
        <h3>Excluded Dates</h3>
        {(excludedDates[currentCourseIndex] || []).length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {excludedDates[currentCourseIndex].map((date, index) => (
                <tr key={index}>
                  <td>{date}</td>
                  <td>
                    <input
                      type="checkbox"
                      onChange={() => handleDeselectDate(date)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No dates excluded yet.</p>
        )}
      </div>
    </div>
  );
};

export default CourseViewer;
