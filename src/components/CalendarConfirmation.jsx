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
    const batches = buildCalendarBatchPatch(changes);
    const userId = Cookies.get("userId");
    const allFailed = [];
    try {
      // Google's batch endpoint caps out at 50 sub-requests, so large change sets are
      // split into multiple batches and sent one at a time, with a short pause between
      // batches so we don't pile more load onto an already-strained rate-limit window.
      for (let i = 0; i < batches.length; i++) {
        if (i > 0) {
          await new Promise((resolve) => setTimeout(resolve, 1500));
        }

        const { body, boundary } = batches[i];
        const response = await axios.post(
          "/api/update",
          { body, boundary },
          { headers: { "x-user-id": userId } }
        );
        console.log(response.data.message);
        allFailed.push(...(response.data.failed || []));
      }

      if (allFailed.length > 0) {
        console.error(`${allFailed.length} event instance(s) failed to update:`, allFailed);
      }
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
