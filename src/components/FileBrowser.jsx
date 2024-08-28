import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppStateContext } from "../AppStateContext";

const FileBrowser = () => {
  const { eventInstances, selectedFiles, setSelectedFiles } =
    useContext(AppStateContext);
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
        .setOAuthToken(oauthToken)
        .setDeveloperKey("AIzaSyCZ_NpeJ9n8UtCwBfu009QoZLbcbyXSKAY") // Replace with your Developer Key
        .setCallback(pickerCallback)
        .build();
      picker.setVisible(true);
    }
  };

  const pickerCallback = (data) => {
    if (data.action === window.google.picker.Action.PICKED) {
      const file = data.docs[0];
      console.log("Picked file:", file);
      setSelectedFiles([...selectedFiles, file]);
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
        {selectedFiles.length > 0 && (
          <div>
            <h3>Selected Files:</h3>
            {selectedFiles.map((file, index) => (
              <div key={index}>
                <p>{file.name}</p>
                <a href={file.url} target="_blank" rel="noopener noreferrer">
                  View File
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileBrowser;
