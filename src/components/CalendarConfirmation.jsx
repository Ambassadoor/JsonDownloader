import React from "react";
import axios from "axios";
import { Button } from "@mui/material";
import { useLocation } from "react-router-dom";
import FileBrowser from "./FileBrowser";

const CalendarConfirmation = () => {
  const location = useLocation();
  console.log(location.state);

  const handleReset = async () => {
    try {
      const response = await axios.post("/api/delete-events");
      console.log(response.data.message);
    } catch (error) {
      console.error("Error resetting calendar:", error);
    }
  };

  return (
    <div>
      <h1>Calendar Confirmation</h1>
      <p>This is the CalendarConfirmation component.</p>
      <div>
        {location.state.eventData.map((event, index) => (
          <div key={index}>
            <h2>{event.event.summary}</h2>
            {event.instances.map((instance, i) => (
              <p key={i}>{instance.start.dateTime}</p>
            ))}
          </div>
        ))}
      </div>
      <Button variant="contained" onClick={handleReset}>
        Reset Calendar
      </Button>
      <div>
        <FileBrowser />
      </div>
    </div>
  );
};

export default CalendarConfirmation;
