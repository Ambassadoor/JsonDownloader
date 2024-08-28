import React, { useState, useEffect, useContext } from "react";
import { AppStateContext } from "../AppStateContext";
import EventInstanceList from "./EventInstanceList";
import SelectedFiles from "./SelectedFiles";
import FileBrowser from "./FileBrowser";
import axios from "axios";

const FilesPage = () => {
  const { eventInstances, selectedFiles, setSelectedFiles } =
    useContext(AppStateContext);
  const [selectedInstanceId, setSelectedInstanceId] = useState(null);

  useEffect(() => {
    console.log("Event Instances:", eventInstances);
  }, [eventInstances]);

  const handleSelectInstance = (instanceId) => {
    setSelectedInstanceId(instanceId);
    setSelectedFiles([]);
  };

  const handleFileSelect = (file) => {
    setSelectedFiles((prevFiles) => [...prevFiles, file]); // Add the selected file to the list
  };

  const handleAttachFiles = async () => {
    console.log("Attaching Files");
    try {
      const response = await axios.post("/api/attach-files", {
        instanceId: selectedInstanceId,
        files: selectedFiles,
      });

      if (response.status === 200) {
        alert("Files attached successfully");
      } else {
        alert("Failed to attach files");
      }
    } catch (error) {
      console.error("Error attaching files:", error);
      alert("Failed to attach files");
    }
  };

  const handleDeleteEvents = async () => {
    try {
      const response = await axios.post("/api/delete-events", {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        alert("Events deleted successfully");
      } else {
        alert("Failed to delete events");
      }
    } catch (error) {
      console.error("Error deleting events:", error);
      alert("Failed to delete events");
    }
  };

  return (
    <div>
      <h1>Files Page</h1>
      {eventInstances && eventInstances.length > 0 ? (
        <>
          <EventInstanceList
            eventInstances={eventInstances[0].instances} // Access the instances array
            onSelectInstance={handleSelectInstance}
          />
          {selectedInstanceId && (
            <>
              <FileBrowser onFileSelect={handleFileSelect} />
              <SelectedFiles files={selectedFiles} />
              <button onClick={handleAttachFiles}>Attach Files</button>
            </>
          )}
          <button onClick={handleDeleteEvents}>Delete Events</button>
        </>
      ) : (
        <p>No event instances found.</p>
      )}
    </div>
  );
};

export default FilesPage;
