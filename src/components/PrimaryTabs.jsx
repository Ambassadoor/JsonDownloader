import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import FileBrowser from "./FileBrowser";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const PrimaryTabs = React.memo(({ events, focusedTab, handleTabClick, handleBrowserSelect, browserFiles }) => (
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
    {browserFiles[events[focusedTab].event.id]?.length > 0 && (
        <Box sx={{ p: 2 }}>
          <h3>Selected Files:</h3>
          <ul>
            {browserFiles[events[focusedTab].event.id].map(
              (file, index) => (
                <li key={index}>{file.name}</li>
              ),
            )}
          </ul>
        </Box>
      )}
  </Box>
));

export default PrimaryTabs;
