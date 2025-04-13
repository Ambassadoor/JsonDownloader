import * as React from "react";
import { Box, Select, MenuItem, Checkbox, ListItemText } from "@mui/material";

export default function FileSelector({
  focusedFiles,
  onFileChange,
  focusedId,
  updatedInstances
}) {
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    // Update the instanceFiles state for the specific eventId and instanceId
    const updatedFiles = typeof value === "string" ? value.split(",") : value
    // Propagate the changes to the parent component
    onFileChange(updatedFiles, focusedId, "attachments");
  };

  return (
    <Box>
      <Select
        multiple
        value={updatedInstances[focusedId]?.attachments|| []} // Use files for the specific event and instance
        onChange={handleChange}
        renderValue={(selected) =>
          selected.map((file) => file.name).join(", ") // Display selected file names
        }
      >
        {focusedFiles.map((file) => (
          <MenuItem key={file.name} value={file}>
            <Checkbox
              checked={
                updatedInstances[focusedId]?.attachments?.some(
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