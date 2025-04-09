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
    selectedTabData,
    state,
    handleInstanceChange,
    handleFileChange,
  }) => (
    <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
      <h3>Instance Details</h3>
      <TextField
        label="Description"
        name="description"
        value={
          state.editedInstances[selectedTabData.event?.id]?.[
            selectedInstanceData?.id
          ]?.description ??
          selectedInstanceData?.description ??
          ""
        }
        onChange={(event) =>
          handleInstanceChange(event.target.name, event.target.value)
        }
        multiline
        sx={{ width: { xs: "100%", sm: "400px" } }}
      />
      <TextField
        label="Location"
        name="location"
        value={
          state.editedInstances[selectedTabData.event?.id]?.[
            selectedInstanceData?.id
          ]?.location ??
          selectedInstanceData?.location ??
          ""
        }
        onChange={(event) =>
          handleInstanceChange(event.target.name, event.target.value)
        }
        sx={{ width: { xs: "100%", sm: "400px" } }}
      />
      <BasicTimePicker
        label="Start Time"
        name="dateTime"
        value={selectedInstanceData?.start?.dateTime || dayjs()}
        timezone={selectedInstanceData?.start?.timeZone || "America/Chicago"}
        handleInputChange={(newValue) =>
          handleInstanceChange("start", newValue?.toISOString())
        }
      />
      <BasicTimePicker
        label="End Time"
        name="dateTime"
        value={selectedInstanceData?.end?.dateTime || dayjs()}
        timezone={selectedInstanceData?.end?.timeZone || "America/Chicago"}
        handleInputChange={(newValue) =>
          handleInstanceChange("end", newValue?.toISOString())
        }
      />
      <FileSelector
        selectedFiles={state.selectedFiles[selectedTabData.event?.id] || []}
        onFileChange={handleFileChange}
        eventId={selectedTabData.event?.id}
        instanceId={selectedInstanceData?.id}
        instanceFiles={state.instanceFiles}
      />
    </Box>
  )
);

export default InstanceDetails;