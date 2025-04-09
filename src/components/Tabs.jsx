import * as React from "react";
import Box from "@mui/material/Box";
import PrimaryTabs from "./PrimaryTabs";
import SubTabs from "./SubTabs";
import InstanceDetails from "./InstanceDetails";
import FileBrowser from "./FileBrowser";

export default function BasicTabs({ tabs, setEventSample }) {
  const [state, setState] = React.useState({
    selectedTab: 0,
    selectedSubTab: 0,
    instanceFiles: {},
    selectedFiles: {},
    editedInstances: {},
  });

  const updateState = (key, updater) => {
    try {
      setState((prevState) => ({
        ...prevState,
        [key]: updater(prevState[key]),
      }));
    } catch (error) {
      console.error(`Error updating state for key "${key}":`, error);
    }
  };

  const updateNestedState = (prevState, eventId, instanceId, key, value) => ({
    ...prevState,
    [eventId]: {
      ...(prevState[eventId] || {}),
      [instanceId]: {
        ...(prevState[eventId]?.[instanceId] || {}),
        [key]: value,
      },
    },
  });

  const selectedTabData = React.useMemo(() => {
    try {
      return tabs[state.selectedTab] || {};
    } catch (error) {
      console.error("Error deriving selectedTabData:", error);
      return {};
    }
  }, [tabs, state.selectedTab]);

  const selectedInstanceData = React.useMemo(() => {
    try {
      return selectedTabData.instances?.[state.selectedSubTab] || {};
    } catch (error) {
      console.error("Error deriving selectedInstanceData:", error);
      return {};
    }
  }, [selectedTabData, state.selectedSubTab]);

  const handleTabClick = React.useCallback((event, newValue) => {
    try {
      updateState("selectedTab", () => newValue);
      updateState("selectedSubTab", () => 0);
    } catch (error) {
      console.error("Error handling tab click:", error);
    }
  }, []);

  const handleSubTabClick = React.useCallback((event, newValue) => {
    try {
      updateState("selectedSubTab", () => newValue);
    } catch (error) {
      console.error("Error handling subtab click:", error);
    }
  }, []);

  const handleInstanceChange = React.useCallback(
    (key, value) => {
      try {
        const eventId = selectedTabData.event?.id;
        const instanceId = selectedInstanceData?.id;

        if (!eventId || !instanceId) {
          throw new Error("Missing eventId or instanceId for instance change");
        }

        updateState("editedInstances", (prevEdits) =>
          updateNestedState(prevEdits, eventId, instanceId, key, value),
        );
      } catch (error) {
        console.error("Error handling instance change:", error);
      }
    },
    [selectedTabData, selectedInstanceData],
  );

  const handleFileSelect = React.useCallback((eventId, files) => {
    try {
      if (!eventId || !files) {
        throw new Error("Missing eventId or files for file selection");
      }

      updateState("selectedFiles", (prevFiles) => ({
        ...prevFiles,
        [eventId]: [...(prevFiles[eventId] || []), ...files],
      }));
    } catch (error) {
      console.error("Error handling file selection:", error);
    }
  }, []);

  const handleFileChange = React.useCallback((updatedInstanceFiles) => {
    try {
      if (!updatedInstanceFiles) {
        throw new Error("Missing updatedInstanceFiles for file change");
      }

      updateState("instanceFiles", () => updatedInstanceFiles);
    } catch (error) {
      console.error("Error handling file change:", error);
    }
  }, []);

  return (
    <Box sx={{ display: "flex", height: "100%" }}>
      <PrimaryTabs
        tabs={tabs}
        selectedTab={state.selectedTab}
        handleTabClick={handleTabClick}
        handleFileSelect={handleFileSelect}
        selectedFiles={state.selectedFiles
          }
      />
      <Box sx={{ flexGrow: 1, p: 2 }}>
        <h2>Dates</h2>
        {selectedTabData.instances?.length > 0 ? (
          <>
            <SubTabs
              instances={selectedTabData.instances}
              selectedSubTab={state.selectedSubTab}
              handleSubTabClick={handleSubTabClick}
            />
            {state.selectedSubTab !== null && (
              <InstanceDetails
                selectedInstanceData={selectedInstanceData}
                selectedTabData={selectedTabData}
                state={state}
                handleInstanceChange={handleInstanceChange}
                handleFileChange={handleFileChange}
                handleFileSelect={handleFileSelect}
              />
            )}
          </>
        ) : (
          <p>No instances available for this event.</p>
        )}
      </Box>
    </Box>
  );
}
