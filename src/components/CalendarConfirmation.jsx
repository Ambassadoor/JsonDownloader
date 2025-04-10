import React from "react";
import axios from "axios";
import { Button } from "@mui/material";
import eventSamples from "../../downloads/eventSample.json"; // Import the sample JSON file
import BasicTabs from "./Tabs";

const CalendarConfirmation = () => {
  const [eventSample, setEventSample] = React.useState(eventSamples); // Initialize with the sample data]);

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
      <BasicTabs 
        events={eventSample}
        />
      <Button variant="contained" onClick={handleReset}>
        Reset Calendar
      </Button>
    </div>
  );
};

export default CalendarConfirmation;
