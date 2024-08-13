import React, { useState } from "react";

const ExcludeDates = ({ onExcludeDates }) => {
  const [inputDate, setInputDate] = useState("");
  const [excludedDates, setExcludedDates] = useState([]);

  // Validate and add date to exclusion list
  const handleAddDate = () => {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/; // Regex pattern for YYYY-MM-DD
    if (datePattern.test(inputDate)) {
      if (!excludedDates.includes(inputDate)) {
        setExcludedDates([...excludedDates, inputDate]);
        setInputDate(""); // Clear input after adding
      } else {
        alert("Date already excluded.");
      }
    } else {
      alert("Invalid date format. Please use YYYY-MM-DD.");
    }
  };

  // Handle text input changes
  const handleInputChange = (e) => {
    setInputDate(e.target.value);
  };

  return (
    <div>
      <input
        type="text"
        value={inputDate}
        onChange={handleInputChange}
        placeholder="YYYY-MM-DD"
      />
      <button onClick={handleAddDate}>Add Date</button>

      {/* Display list of excluded dates */}
      {excludedDates.length > 0 && (
        <ul>
          {excludedDates.map((date, index) => (
            <li key={index}>{date}</li>
          ))}
        </ul>
      )}

      {/* Pass excluded dates to parent component */}
      <button onClick={() => onExcludeDates(excludedDates)}>Remove</button>
    </div>
  );
};

export default ExcludeDates;
