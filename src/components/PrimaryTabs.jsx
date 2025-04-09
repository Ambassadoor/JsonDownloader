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

const PrimaryTabs = React.memo(({ tabs, selectedTab, handleTabClick, handleFileSelect, selectedFiles }) => (
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
      value={selectedTab}
      onChange={handleTabClick}
      aria-label="main tabs"
      orientation="vertical"
    >
      {tabs.map((tab, index) => (
        <Tab label={tab.event.summary} key={index} {...a11yProps(index)} />
      ))}
    </Tabs>
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <FileBrowser
        events={tabs}
        selectedTab={selectedTab}
        onFileSelect={handleFileSelect}
      />
    </Box>
    {selectedFiles[tabs[selectedTab]?.event?.id]?.length > 0 && (
        <Box sx={{ p: 2 }}>
          <h3>Selected Files:</h3>
          <ul>
            {selectedFiles[tabs[selectedTab]?.event?.id].map(
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
