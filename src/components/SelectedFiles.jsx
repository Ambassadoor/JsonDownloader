import React from "react";

const SelectedFiles = ({ eventInstances }) => {
  return (
    <div>
      <h2>Selected Files</h2>
      {eventInstances.map((instance) => (
        <div key={instance.id}>
          <h3>
            {instance.summary} ({instance.start.dateTime})
          </h3>
          <ul>
            {instance.attachments && instance.attachments.length > 0 ? (
              instance.attachments.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))
            ) : (
              <li>No files attached</li>
            )}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default SelectedFiles;
