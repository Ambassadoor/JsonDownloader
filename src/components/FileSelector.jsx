import * as React from "react";
import { Box, Select, MenuItem, Checkbox, ListItemText } from "@mui/material";

export default function FileSelector({
  focusedFiles,
  onFileChange,
  focusedId,
  updatedInstances
}) {
  const handleChange = (event) => {

    // Compares the existing number of attachments to the new number of attachments
    const currentAttachmentLength = updatedInstances[focusedId]?.attachments?.length || 0
    const newAttachmentLength = event.target.value.length

    const checked = newAttachmentLength > currentAttachmentLength


    // If the number of attachments has increased, find the new files and call onFileChange with them
    if (checked) {
      const addedFiles = event.target.value.filter(
        (file) => !updatedInstances[focusedId]?.attachments?.includes(file)
      ) || []
      onFileChange(addedFiles, focusedId, "attachments", checked);
      // If the number of attachments has decreased, find the removed files and call onFileChange with them
    } else { 
      const removedFiles = updatedInstances[focusedId]?.attachments?.filter(
        (file) => !event.target.value.includes(file)
      ) || [] 
      onFileChange(removedFiles, focusedId, "attachments", checked);
    }
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