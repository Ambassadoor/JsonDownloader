import React, { useEffect, useState, } from "react";
import axios from "axios";

const FileBrowser = React.memo(({ events, focusedTab, onBrowserSelect }) => {
  const [oauthToken, setOauthToken] = useState("");

  useEffect(() => {
    // Load the Picker API after the component mounts
    window.gapi.load("picker", { callback: onPickerApiLoad });

    // Fetch the OAuth token from the server
    const fetchToken = async () => {
      try {
        const response = await axios.get("/api/get-token");
        setOauthToken(response.data.access_token);
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };

    fetchToken();
  }, []);

  const onPickerApiLoad = () => {
    if (oauthToken) {
      createPicker();
    }
  };

  const createPicker = () => {
    if (oauthToken) {
      const picker = new window.google.picker.PickerBuilder()
        .addView(window.google.picker.ViewId.DOCS)
        .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
        .setOAuthToken(oauthToken)
        .setDeveloperKey("AIzaSyCZ_NpeJ9n8UtCwBfu009QoZLbcbyXSKAY") // Replace with your Developer Key
        .setCallback((data) => pickerCallback(data, events[focusedTab]?.event?.id))
        .build();
      picker.setVisible(true);
    }
  };

  const pickerCallback = (data, eventId) => {
    if (data.action === window.google.picker.Action.PICKED) {
      const files = data.docs;
      onBrowserSelect(eventId, files); // Pass the selected files and event ID to the parent
    }
  };

  return (
    <div>
      <button onClick={createPicker} disabled={!oauthToken}>
        Select Files for this Course
      </button>
    </div>
  );
});

export default FileBrowser;
