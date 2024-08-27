import React, { useEffect, useState, useContext } from "react";
import { AppStateContext } from "../AppStateContext";
import EventInstanceList from "./EventInstanceList";
import SelectedFiles from "./SelectedFiles";
import axios from "axios";

const FilesPage = () => {
  const { eventInstances } = useContext(AppStateContext);
  const [selectedInstanceId, setSelectedInstanceId] = useState(null);

  useEffect(() => {
    // Assuming `eventInstances` is already set in the context with the correct structure
    console.log("Event Instances:", eventInstances);
  }, [eventInstances]);

  const handleSelectInstance = (instanceId) => {
    setSelectedInstanceId(instanceId);
  };

  const handleDeleteEvents = async () => {
    try {
      const response = await axios.post('/api/delete-events',{
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status = 200) {
        alert('Events deleted successfully')
      } else {
        alert('Failed to create events')
      }
    } catch (error) {
      console.error('Error creating events:', error);
      alert('Failed to create events');
    }
  }
  
  return (
    <div>
      <h1>Files Page</h1>
      {eventInstances && eventInstances.length > 0 ? (
        <>
          <EventInstanceList
            eventInstances={eventInstances[0].instances} // Access the instances array
            onSelectInstance={handleSelectInstance}
          />
          <SelectedFiles
            eventInstances={eventInstances[0].instances.filter(
              (instance) => instance.id === selectedInstanceId,
            )}
          />
          <button onClick={handleDeleteEvents}>Delete Events</button>
        </>
      ) : (
        <p>No event instances found.</p>
      )}
    </div>
  );
};

export default FilesPage;
