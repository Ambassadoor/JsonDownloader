import React from "react";

const FileInput = ({ setJsonData }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const jsonData = JSON.parse(e.target.result);
      console.log("Loaded JSON Data:", jsonData);
      setJsonData(jsonData);
    };

    reader.readAsText(file);
  };

  return (
    <div>
      <input type="file" id="fileInput" onChange={handleFileChange} />
    </div>
  );
};

export default FileInput;
