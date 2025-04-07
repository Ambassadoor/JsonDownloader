import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const formattedTime = (dateTime) => dayjs(dateTime).tz("America/Chicago").format("h:mm A z");

export default function BasicTabs({ tabs }) {
  const [selectedTab, setSelectedTab] = React.useState(0); // Main tab
  const [selectedSubTab, setSelectedSubTab] = React.useState(0); // Subtab for instances

  const handleTabClick = (event, newValue) => {
    setSelectedTab(newValue);
    setSelectedSubTab(0); // Reset subtab when switching main tabs
  };

  const handleSubTabClick = (event, newValue) => {
    setSelectedSubTab(newValue);
  };

  return (
    <Box sx={{ display: "flex", height: "100%" }}>
      {/* Primary Tabs */}
      <Box
        sx={{
          width: "20%", // Adjust the width of the primary tabs
          borderRight: 1,
          borderColor: "divider",
          overflowY: "auto", // Add scrolling if the tabs are too long
        }}
      >
        <Tabs
          variant="scrollable"
          value={selectedTab}
          onChange={handleTabClick}
          aria-label="main tabs"
          orientation="vertical"
        >
          {tabs.map((tab, index) => (
            <Tab
              label={tab.event.summary}
              {...a11yProps(index)}
              key={index}
            />
          ))}
        </Tabs>
      </Box>

      {/* Subtabs and Content */}
      <Box sx={{ flexGrow: 1, p: 2 }}>
        {tabs[selectedTab]?.instances?.length > 0 ? (
          <>
            {/* Subtabs */}
            <Tabs
              variant="scrollable"
              value={selectedSubTab}
              onChange={handleSubTabClick}
              aria-label="subtabs"
              sx={{ borderBottom: 1, borderColor: "divider" }}
            >
              {tabs[selectedTab].instances.map((instance, i) => (
                <Tab
                  label={dayjs(instance.start?.dateTime).format("MMMM D, YYYY") || "No start time available"}
                  {...a11yProps(i)}
                  key={i}
                />
              ))}
            </Tabs>

            {/* Render Instance Details */}
            {selectedSubTab !== null && (
              <Box sx={{ mt: 2 }}>
                <h3>Instance Details</h3>
                <p><strong>Description:</strong> {tabs[selectedTab].instances[selectedSubTab]?.description || "No description available"}</p>
                <p><strong>Location:</strong> {tabs[selectedTab].instances[selectedSubTab]?.location || "No location available"}</p>
                <p><strong>Start Time:</strong> {formattedTime(tabs[selectedTab].instances[selectedSubTab]?.start?.dateTime) || "No start time available"}</p>
                <p><strong>End Time:</strong> {formattedTime(tabs[selectedTab].instances[selectedSubTab]?.end?.dateTime) || "No end time available"}</p>
              </Box>
            )}
          </>
        ) : (
          <p>No instances available for this event.</p>
        )}
      </Box>
    </Box>
  );
}
