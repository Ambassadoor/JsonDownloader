import React, { useContext, useState } from "react";
import axios from "axios";
import { Box } from "@mui/material";
import CourseTransferList from "./CourseTransferList";
import SemesterSelectorUI from "./SemesterSelectorUI";
import { AppStateContext } from "../AppStateContext";
import "../styles/styles.css";

const HomePage = () => {
  const { setOriginalData } = useContext(AppStateContext);
  const [selectedSemesterUrl, setSelectedSemesterUrl] = useState("");

  const handleSemesterSelection = async (url) => {
    setSelectedSemesterUrl(url);

    try {
      // Trigger the download check API
      const response = await axios.get("/api/check-download", {
        params: { url },
      });
      console.log("Download check response:", response.data);

      // Fetch the updated courses JSON file
      const { data: courses } = await axios.get("/downloads/courses.json");
      const dataWithIds = courses.map((course) => ({
        ...course,
        id: `${course["Course Code"]}-${course["Section Code"]}`,
      }));
      setOriginalData(dataWithIds);
    } catch (error) {
      console.error("Error triggering download:", error);
    }
  };

  return (
    <div className="app-container">
      <Box>
        <SemesterSelectorUI onSelectSemester={handleSemesterSelection} />
        <CourseTransferList />
      </Box>
    </div>
  );
};

export default HomePage;
