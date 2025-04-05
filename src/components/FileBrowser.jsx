import React, { useEffect, useState } from "react";
import axios from "axios";

const FileBrowser = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
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
    // Create the picker after the API loads and token is retrieved
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
        .setCallback(pickerCallback)
        .build();
      picker.setVisible(true);
    }
  };

  const pickerCallback = (data) => {
    if (data.action === window.google.picker.Action.PICKED) {
      const files = data.docs;
      for (const file of files) {
        setSelectedFiles((prevFiles) => [...prevFiles, file]);
      }
      // Handle the picked file (e.g., attach it to the event)
    }
  };

  return (
    <div>
      <h1>File Browser</h1>
      <button onClick={createPicker} disabled={!oauthToken}>
        Select File from Google Drive
      </button>
      <div>
        {selectedFiles.map((file, index) => (
          <div key={index}>
            <p>{file.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileBrowser;
