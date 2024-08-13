import React, { useState, useEffect } from "react";
import moment from "moment";
import { rrulestr } from "rrule";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

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

const CourseViewer = ({ eventObjects, onExcludedDates }) => {
  const [highlightedDates, setHighlightedDates] = useState([]);
  const [excludedDates, setExcludedDates] = useState([]);
  const [history, setHistory] = useState([[]]);
  const [currentStep, setCurrentStep] = useState(0);
  const [inputDate, setInputDate] = useState("");

  useEffect(() => {
    const allEvents = eventObjects.flatMap(createRecurringEvents);
    const dates = allEvents.map(
      (event) => event.start.toISOString().split("T")[0],
    );
    setHighlightedDates(dates);
  }, [eventObjects]);

  const handleDateClick = (date) => {
    const dateString = date.toISOString().split("T")[0];
    if (highlightedDates.includes(dateString)) {
      const newExcludedDates = excludedDates.includes(dateString)
        ? excludedDates
        : [...excludedDates, dateString];
      setExcludedDates(newExcludedDates);
      updateHistory(newExcludedDates);
    }
  };

  const handleInputChange = (e) => {
    setInputDate(e.target.value);
  };

  const handleAddDate = () => {
    if (moment(inputDate, "YYYY-MM-DD", true).isValid()) {
      if (!excludedDates.includes(inputDate)) {
        const newExcludedDates = [...excludedDates, inputDate];
        setExcludedDates(newExcludedDates);
        updateHistory(newExcludedDates);
        setInputDate(""); // Clear the input field after adding
      }
    } else {
      alert("Please enter a valid date in the format YYYY-MM-DD.");
    }
  };

  const updateHistory = (newExcludedDates) => {
    const newHistory = history.slice(0, currentStep + 1);
    setHistory([...newHistory, newExcludedDates]);
    setCurrentStep(newHistory.length);
  };

  const handleUndo = () => {
    if (currentStep > 0) {
      setCurrentStep((prevStep) => prevStep - 1);
      setExcludedDates(history[currentStep - 1]);
    }
  };

  const handleRedo = () => {
    if (currentStep < history.length - 1) {
      setCurrentStep((prevStep) => prevStep + 1);
      setExcludedDates(history[currentStep + 1]);
    }
  };

  const handleRemoveDates = () => {
    onExcludedDates(excludedDates);
  };

  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const dateString = date.toISOString().split("T")[0];
      if (excludedDates.includes(dateString)) {
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
        <button onClick={handleUndo} disabled={currentStep === 0}>
          Undo
        </button>
        <button
          onClick={handleRedo}
          disabled={currentStep >= history.length - 1}
        >
          Redo
        </button>
        <button onClick={handleRemoveDates}>Remove Selected Dates</button>
      </div>
    </div>
  );
};

export default CourseViewer;
