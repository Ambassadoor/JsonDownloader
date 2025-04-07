import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { TextField } from "@mui/material";
import BasicTimePicker from "./TimePicker";

dayjs.extend(utc);
dayjs.extend(timezone);

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const formattedTime = (dateTime) =>
  dayjs(dateTime).tz("America/Chicago").format("h:mm A z");

export default function BasicTabs({ tabs, setEventSample }) {
  const [selectedTab, setSelectedTab] = React.useState(0); // Main tab
  const [selectedSubTab, setSelectedSubTab] = React.useState(0); // Subtab for instances

  const handleTabClick = (event, newValue) => {
    setSelectedTab(newValue);
    setSelectedSubTab(0); // Reset subtab when switching main tabs
  };

  const handleSubTabClick = (event, newValue) => {
    setSelectedSubTab(newValue);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    // Update the state for the selected tab and subtab
    setEventSample((prevData) =>
      prevData.map((event, eventIndex) => {
        if (eventIndex === selectedTab) {
          return {
            ...event,
            instances: event.instances.map((instance, instanceIndex) => {
              if (instanceIndex === selectedSubTab) {
                return {
                  ...instance,
                  [name]: value, // Update the specific property (e.g., description, location)
                };
              }
              return instance;
            }),
          };
        }
        return event;
      }),
    );
  };


  const handleTimeChange = (name, newValue) => {
    const isoValue = newValue?.toISOString(); // Convert dayjs object to ISO string
  
    setEventSample((prevData) =>
      prevData.map((event, eventIndex) => {
        if (eventIndex === selectedTab) {
          return {
            ...event,
            instances: event.instances.map((instance, instanceIndex) => {
              if (instanceIndex === selectedSubTab) {
                return {
                  ...instance,
                  [name]: {
                    ...instance[name], // Preserve other properties (e.g., timeZone)
                    dateTime: isoValue, // Update the dateTime property
                  },
                };
              }
              return instance;
            }),
          };
        }
        return event;
      })
    );
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
            <Tab label={tab.event.summary} {...a11yProps(index)} key={index} />
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
              scrollButtons="auto"
              allowScrollButtonsMobile
              value={selectedSubTab}
              onChange={handleSubTabClick}
              aria-label="subtabs"
              sx={{ borderBottom: 1, borderColor: "divider", maxWidth: "600px" }}
            >
              {tabs[selectedTab].instances.map((instance, i) => (
                <Tab
                  label={
                    dayjs(instance.start?.dateTime).format("ddd MMMM D, YYYY") ||
                    "No start time available"
                  }
                  {...a11yProps(i)}
                  key={i}
                />
              ))}
            </Tabs>

            {/* Render Instance Details */}
            {selectedSubTab !== null && (
              <Box
                sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}
              >
                <h3>Instance Details</h3>
                <TextField
                  label="Description"
                  name="description" // Add the name attribute
                  value={
                    tabs[selectedTab].instances[selectedSubTab]?.description ||
                    ""
                  }
                  onChange={handleInputChange} // Bind to handleInputChange
                  multiline
                  sx={{ width: { xs: "100%", sm: "400px" } }}
                />
                <TextField
                  label="Location"
                  name="location" // Add the name attribute
                  value={
                    tabs[selectedTab].instances[selectedSubTab]?.location || ""
                  }
                  onChange={handleInputChange} // Bind to handleInputChange
                  sx={{ width: { xs: "100%", sm: "400px" } }}
                />
                <BasicTimePicker
                  label="Start Time"
                  name="dateTime" // Add the name attribute
                  value={
                    tabs[selectedTab].instances[selectedSubTab]?.start
                      ?.dateTime || dayjs()
                  }
                  timezone={
                    tabs[selectedTab].instances[selectedSubTab]?.start
                      ?.timeZone || "America/Chicago"
                  }
                  handleInputChange={(newValue) => handleTimeChange("start", newValue)}
                />
                <BasicTimePicker
                  label="end"
                  name="dateTime"
                  value={
                    tabs[selectedTab].instances[selectedSubTab]?.end
                      ?.dateTime || dayjs()
                  }
                  timezone={
                    tabs[selectedTab].instances[selectedSubTab]?.end
                      ?.timeZone || "America/Chicago"
                  }
                  handleInputChange={(newValue) => handleTimeChange("end", newValue)}
                />
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
