import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import dayjs from "dayjs";

function a11yProps(index) {
  return {
    id: `simple-subtab-${index}`,
    "aria-controls": `simple-subtabpanel-${index}`,
  };
}

const SubTabs = React.memo(({ instances, selectedSubTab, handleSubTabClick }) => (
  <Tabs
    variant="scrollable"
    scrollButtons="auto"
    allowScrollButtonsMobile
    value={selectedSubTab}
    onChange={handleSubTabClick}
    aria-label="subtabs"
    sx={{
      borderBottom: 1,
      borderColor: "divider",
      maxWidth: "600px",
    }}
  >
    {instances.map((instance, i) => (
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
));

export default SubTabs;