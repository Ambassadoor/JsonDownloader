import React, { useState, useEffect } from "react";

const FileBrowser = ({ onClose, onSelectFiles }) => {
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    // Fetch files from Google Drive API
    async function fetchFiles() {
      try {
        const response = await fetch("/api/google-drive/files"); // Example endpoint
        const data = await response.json();
        setFiles(data.files);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    }
    fetchFiles();
  }, []);

  const handleFileSelect = (file) => {
    setSelectedFiles([...selectedFiles, file]);
  };

  const handleConfirmSelection = () => {
    onSelectFiles(selectedFiles);
  };

  return (
    <div>
      <h2>Select Files from Google Drive</h2>
      <ul>
        {files.map((file) => (
          <li key={file.id}>
            {file.name}
            <button onClick={() => handleFileSelect(file)}>Select</button>
          </li>
        ))}
      </ul>
      <button onClick={handleConfirmSelection}>Attach Selected Files</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default FileBrowser;
