import React, { useState, useEffect } from "react";
import axios from "axios";

const FileBrowser = ({ onFileSelect }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get("/api/drive-files");
        setFiles(response.data.files);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching files:", error);
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  const handleFileClick = (file) => {
    onFileSelect(file); // Pass the selected file to the parent component
  };

  return (
    <div>
      <h3>Google Drive Files</h3>
      {loading ? (
        <p>Loading files...</p>
      ) : (
        <ul>
          {files.map((file) => (
            <li key={file.id} onClick={() => handleFileClick(file)}>
              <img
                src={file.iconLink}
                alt={file.name}
                style={{ marginRight: 8 }}
              />
              {file.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileBrowser;
