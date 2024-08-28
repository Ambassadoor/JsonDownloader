import React from "react";

const SelectedFiles = ({ files }) => {
  return (
    <div>
      <h3>Selected Files</h3>
      <ul>
        {files.map((file) => (
          <li key={file.id}>
            <img
              src={file.iconLink}
              alt={file.name}
              style={{ marginRight: 8 }}
            />
            {file.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SelectedFiles;
