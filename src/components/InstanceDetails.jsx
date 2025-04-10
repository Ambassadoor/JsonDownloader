import React from "react";
import { TextField, Box } from "@mui/material";
import BasicTimePicker from "./TimePicker";
import FileSelector from "./FileSelector";

import dayjs from "dayjs";
import tz from "dayjs/plugin/timezone";
dayjs.extend(tz);

const InstanceDetails = React.memo(
  ({
    selectedInstanceData,
    focusedTabIndex,
    browserFiles,
    handleChange,
    updatedInstances,
  }) => (
    <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
      <h3>Instance Details</h3>
      <TextField
        label="Description"
        name="description"
        value={
          updatedInstances[selectedInstanceData?.id]?.description ??
          selectedInstanceData?.description
        }
        onChange={(e) => handleChange(e.target.value, selectedInstanceData?.id, "description")}
        multiline
        sx={{ width: { xs: "100%", sm: "400px" } }}
      />
      <TextField
        label="Location"
        name="location"
        value={
          updatedInstances[selectedInstanceData?.id]?.location ??
          selectedInstanceData?.location
        }
        onChange={(e) => handleChange(e.target.value, selectedInstanceData?.id, "location")}
        sx={{ width: { xs: "100%", sm: "400px" } }}
      />
      <BasicTimePicker
        label="Start Time"
        name="start"
        id={selectedInstanceData?.id}
        value={updatedInstances[selectedInstanceData?.id]?.start ??
        selectedInstanceData?.start?.dateTime
        }
        timezone={selectedInstanceData?.start?.timeZone || "America/Chicago"}
        handleChange={handleChange}
      />
      <BasicTimePicker
        label="End Time"
        name="end"
        value={selectedInstanceData?.end?.dateTime || dayjs()}
        timezone={selectedInstanceData?.end?.timeZone || "America/Chicago"}
        handleChange={handleChange}
        id={selectedInstanceData?.id}
      />

    </Box>
  )
);

export default InstanceDetails;