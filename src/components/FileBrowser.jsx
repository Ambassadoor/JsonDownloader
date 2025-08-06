import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios"

const FileBrowser = React.memo(({ events, focusedTab, onBrowserSelect }) => {
  const [oauthToken, setOauthToken] = useState(null);
  const [isPickerLoaded, setIsPickerLoaded] = useState(false);

  useEffect(() => {
    const getAccessToken = async () => {
      try {
        const userId = Cookies.get("userId");
        console.log(userId)
        if (!userId) return;

        const response = await axios.get("/api/access-token", {
          headers: { "x-user-id": userId },
        });
        console.log(response.data)
        setOauthToken(response.data.accessToken);
      } catch (error) {
        console.error("Error getting access token:", error);
      }
    };

    getAccessToken();
  }, []);

  useEffect(() => {
    // Load the Picker API when component mounts, but don't create picker yet
    if (window.gapi && !isPickerLoaded) {
      window.gapi.load("picker", { 
        callback: () => {
          console.log("Picker API loaded");
          setIsPickerLoaded(true);
        }
      });
    }
  }, [isPickerLoaded]);

  const developerKey = process.env.REACT_APP_GOOGLE_DEVELOPER_KEY; 

  const createPicker = () => {
    if (oauthToken && isPickerLoaded) {
      console.log("Creating picker with token:", oauthToken);
      const picker = new window.google.picker.PickerBuilder()
        .addView(window.google.picker.ViewId.DOCS)
        .enableFeature(window.google.picker.Feature.MULTISELECT_ENABLED)
        .setOAuthToken(oauthToken)
        .setDeveloperKey(developerKey)
        .setCallback((data) => pickerCallback(data, events[focusedTab]?.event?.id))
        .build();
      picker.setVisible(true);
    } else {
      console.log("Cannot create picker - token:", !!oauthToken, "loaded:", isPickerLoaded);
    }
  };

  const pickerCallback = (data, eventId) => {
    if (data.action === window.google.picker.Action.PICKED) {
      const files = data.docs;
      onBrowserSelect(eventId, files);
    }
  };

  return (
    <div>
      <button 
        onClick={createPicker} 
        disabled={!oauthToken || !isPickerLoaded}
      >
        Select Files for this Course
      </button>
    </div>
  );
});

export default FileBrowser;
