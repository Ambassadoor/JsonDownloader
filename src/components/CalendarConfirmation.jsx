import React, { useEffect } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import eventSamples from "../../downloads/eventSample.json"; // Import the sample JSON file
import FileBrowser from "./FileBrowser";
import BasicTabs from "./Tabs";

const CalendarConfirmation = () => {
  const [eventSample, setEventSample] = React.useState(eventSamples); // Initialize with the sample data]);



  console.log("Event Sample:", eventSample);
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
        tabs={eventSample}
        setEventSample={setEventSample}
        />
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
