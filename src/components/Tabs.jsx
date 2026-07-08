import * as React from "react";
import Box from "@mui/material/Box";
import PrimaryTabs from "./PrimaryTabs";
import SubTabs from "./SubTabs";
import InstanceDetails from "./InstanceDetails";

export default function BasicTabs({ events, handleChangeLog }) {

  const [focusedTabIndex, setFocusedTabIndex] = React.useState(0);
  const [focusedSubTabIndex, setFocusedSubTabIndex] = React.useState(0);  
  const [browserFiles, setBrowserFiles ] = React.useState({});
  const [updatedInstances, setUpdatedInstances] = React.useState({});

  const focusedId = events[focusedTabIndex].instances[focusedSubTabIndex]?.id
  const focusedFiles = browserFiles[events[focusedTabIndex].event.id] ?? []


  const handleTabClick = (event, value) => {
    setFocusedTabIndex(value);
    setFocusedSubTabIndex(0);
  }

  const handleSubTabClick = (event, value) => {
    setFocusedSubTabIndex(value);
  }

  const handleBrowserSelect = (eventId, files) => {
    const combined = [...(browserFiles[eventId] ?? []), ...files]
    const validPairs = combined.filter(file => file.id !== undefined && file.name !== undefined).map(file => [file.id, file])

    const dedupedFiles = Array.from(new Map(validPairs).values())
    setBrowserFiles({ ...browserFiles, [eventId]: dedupedFiles });

  }

  React.useEffect(() => {
    handleChangeLog(updatedInstances);
  }, [updatedInstances]);

  const handleInstanceDetailChange = (value, instanceId, property, checked) => {
    if (property !== "attachments") {
      setUpdatedInstances(prev => ({
        ...prev,
        [instanceId]: {
          ...(prev[instanceId] ?? {}),
          [property]: value,
        }
      }));
      return;
    }

    setUpdatedInstances(prev => {
      const existingAttachments = prev[instanceId]?.attachments ?? [];
      const newAttachments = checked
        ? [
            ...existingAttachments,
            ...value.filter(
              (attachment) => !existingAttachments.some((file) => file.id === attachment.id)
            ),
          ]
        : existingAttachments.filter(
            (file) => !value.some((attachment) => attachment.id === file.id)
          );

      return {
        ...prev,
        [instanceId]: {
          ...(prev[instanceId] ?? {}),
          attachments: newAttachments,
        },
      };
    });
  }

  // Attach (or detach) a single file across every instance of the focused course in one state update
  const handleAttachToAllChange = (file, instanceIds, checked) => {
    setUpdatedInstances(prev => {
      const next = { ...prev };
      for (const instanceId of instanceIds) {
        const existingAttachments = next[instanceId]?.attachments ?? [];
        const newAttachments = checked
          ? existingAttachments.some((f) => f.id === file.id)
            ? existingAttachments
            : [...existingAttachments, file]
          : existingAttachments.filter((f) => f.id !== file.id);

        next[instanceId] = {
          ...(next[instanceId] ?? {}),
          attachments: newAttachments,
        };
      }
      return next;
    });
  }


  return (
    <Box sx={{ display: "flex", height: "100%" }}>
      <PrimaryTabs
        events={events}
        focusedTab={focusedTabIndex}
        handleTabClick={handleTabClick}
        handleBrowserSelect={handleBrowserSelect}
        browserFiles={browserFiles}
        handleChange={handleInstanceDetailChange}
        handleAttachToAllChange={handleAttachToAllChange}
        focusedFiles={focusedFiles}
      />
      <Box sx={{ flexGrow: 1, p: 2 }}>
        <h2>Dates</h2>
        {events[focusedTabIndex].instances?.length > 0 ? (
          <>
            <SubTabs
              instances={events[focusedTabIndex].instances}
              focusedSubTabIndex={focusedSubTabIndex}
              handleSubTabClick={handleSubTabClick}
            />
            {focusedSubTabIndex !== null && (
              <InstanceDetails
                selectedInstanceData={events[focusedTabIndex].instances[focusedSubTabIndex]}
                focusedTabIndex={focusedSubTabIndex}
                handleChange={handleInstanceDetailChange}
                updatedInstances={updatedInstances}
                focusedId={focusedId}
                focusedFiles={focusedFiles}
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
