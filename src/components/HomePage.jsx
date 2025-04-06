import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { Box, Button } from "@mui/material";
import CourseTransferList from "./CourseTransferList";
import SemesterSelectorUI from "./SemesterSelectorUI";
import { AppStateContext } from "../AppStateContext";
import "../styles/styles.css";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const { setOriginalData } = useContext(AppStateContext);
  const [selectedSemesterUrl, setSelectedSemesterUrl] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      try {
        const response = await axios.get("/api/check-token");
        if (response.data.authUrl) {
          window.location.href = response.data.authUrl;
        }
      } catch (error) {
        console.error("Error checking token:", error);
      }
    }
    checkToken();
  },[])

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

  const handleButtonClick = () => {
    navigate("/calendar_confirmation");
  }

  return (
    <div className="app-container">
      <Box>
        <Button variant="contained" onClick={handleButtonClick}>Test Drive</Button>
        <SemesterSelectorUI onSelectSemester={handleSemesterSelection} />
        <CourseTransferList />
      </Box>
    </div>
  );
};

export default HomePage;
