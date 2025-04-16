import React, { useEffect } from "react";
import Cookies from "js-cookie";


const FileBrowser = React.memo(({ events, focusedTab, onBrowserSelect }) => {
  const oauthToken = Cookies.get("oauthToken");

  useEffect(() => {
    // Load the Picker API after the component mounts
    window.gapi.load("picker", { callback: onPickerApiLoad });
  }, [oauthToken]);

  const onPickerApiLoad = () => {
    if (oauthToken) {
      createPicker();
    }
  };
  const developerKey = process.env.REACT_APP_GOOGLE_DEVELOPER_KEY; 

  const createPicker = () => {
    if (oauthToken) {
      const picker = new window.google.picker.PickerBuilder()
        .addView(window.google.picker.ViewId.DOCS)
        .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
        .setOAuthToken(oauthToken)
        .setDeveloperKey(developerKey) // Replace with your Developer Key
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
