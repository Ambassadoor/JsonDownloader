import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import FileBrowser from "./FileBrowser";
import { Checkbox, Stack } from "@mui/material";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const PrimaryTabs = React.memo(({ events, focusedTab, handleTabClick, handleBrowserSelect, handleChange, handleAttachToAllChange, focusedFiles }) =>
  
  (
  <Box
    sx={{
      width: "20%",
      borderRight: 1,
      borderColor: "divider",
      overflowY: "auto",
    }}
  >
    <h2>Courses</h2>
    <Tabs
      variant="scrollable"
      value={focusedTab}
      onChange={handleTabClick}
      aria-label="main tabs"
      orientation="vertical"
    >
      {events.map((event, index) => (
        <Tab label={event.event.summary} key={index} {...a11yProps(index)} />
      ))}
    </Tabs>
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <FileBrowser
        events={events}
        focusedTab={focusedTab}
        onBrowserSelect={handleBrowserSelect}
      />
    </Box>
    {focusedFiles?.length > 0 && (
  <Box sx={{ p: 2, border: "1px solid #ccc", borderRadius: "8px" }}>
    <Stack spacing={2}>
      {/* Header Row */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <h3>Selected Files</h3>
        <h3>Attach to all?</h3>
      </Stack>

      {/* File Rows */}
      {focusedFiles.map((file, index) => (
        <Stack
          key={index}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ borderBottom: "1px solid #eee", pb: 1, mb: 1 }}
        >
          <p>{file.name}</p>
          <Checkbox
            value={file}
            onChange={(e) =>
              handleAttachToAllChange(
                file,
                events[focusedTab].instances.map((instance) => instance.id),
                e.target.checked
              )
            } />
        </Stack>
      ))}
    </Stack>
  </Box>
)}
  </Box>
));

export default PrimaryTabs;
