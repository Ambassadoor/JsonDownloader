import React from "react";
import axios from "axios";
import { Button } from "@mui/material";
import eventSample from "../../downloads/eventSample.json"; // Import the sample JSON file
import FileBrowser from "./FileBrowser";

const CalendarConfirmation = () => {
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
        {eventSample.map((event, index) => (
          <div key={index}>
            <h2>{event.event.summary}</h2>
            {event.instances.map((instance, i) => (
              <p key={i}>{instance.start?.dateTime || "No start time available"}</p>
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
