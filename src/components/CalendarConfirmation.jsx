import React from "react";
import axios from "axios";
import { Button } from "@mui/material";
import BasicTabs from "./Tabs";
import { useLocation } from "react-router-dom";
import buildCalendarBatchPatch from "../hooks/useBatchFormatter";
import Cookies from "js-cookie";

const CalendarConfirmation = () => {

  const location = useLocation();
  const eventSample = location.state?.eventData || null;
  const [changes, setChanges] = React.useState({});

  const handleChangeLog = (change) => {
    setChanges(change);
  }


  const handleReset = async () => {
    const userId = Cookies.get("userId");
    try {
      const response = await axios.post(
        "/api/delete-events",
         {},
        { headers: { "x-user-id": userId } },
      );
      console.log(response.data.message);
    } catch (error) {
      console.error("Error resetting calendar:", error);
    }
  };

  const handleSubmit = async () => {
    const { body, boundary } = buildCalendarBatchPatch(changes);
    const userId = Cookies.get("userId");
    try {
      const response = await axios.post(
        "/api/update",
         { body, boundary},
         { headers: { "x-user-id": userId } }
        );
      console.log(response.data.message);
    } catch (error) {
      console.error("Error submitting changes:", error);
    }
  }

  return (
    <div>
      <BasicTabs 
        events={eventSample}
        handleChangeLog={handleChangeLog}
        />
      <Button variant="contained" onClick={handleReset}>
        Reset Calendar
      </Button>
      <Button variant="contained" onClick={handleSubmit}>
        Submit Changes
      </Button>
    </div>
  );
};

export default CalendarConfirmation;
