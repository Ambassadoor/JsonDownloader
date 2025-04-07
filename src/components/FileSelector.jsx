import * as React from "react";
import { Box, Select, MenuItem, Checkbox, ListItemText } from "@mui/material";

export default function FileSelector({
  selectedFiles,
  onFileChange,
  eventId,
  instanceId,
  instanceFiles,
}) {
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    // Update the instanceFiles state for the specific eventId and instanceId
    const updatedFiles = typeof value === "string" ? value.split(",") : value;

    const updatedInstanceFiles = {
      ...instanceFiles,
      [eventId]: {
        ...(instanceFiles[eventId] || {}),
        [instanceId]: updatedFiles, // Update files for the specific instance
      },
    };

    // Propagate the changes to the parent component
    onFileChange(updatedInstanceFiles);
  };

  return (
    <Box>
      <Select
        multiple
        value={instanceFiles[eventId]?.[instanceId] || []} // Use files for the specific event and instance
        onChange={handleChange}
        renderValue={(selected) =>
          selected.map((file) => file.name).join(", ") // Display selected file names
        }
      >
        {selectedFiles.map((file) => (
          <MenuItem key={file.name} value={file}>
            <Checkbox
              checked={
                instanceFiles[eventId]?.[instanceId]?.some(
                  (selectedFile) => selectedFile.name === file.name
                ) || false
              }
            />
            <ListItemText primary={file.name} />
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
}