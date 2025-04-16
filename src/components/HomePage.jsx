import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { Box } from "@mui/material";
import CourseTransferList from "./CourseTransferList";
import SemesterSelectorUI from "./SemesterSelectorUI";
import { AppStateContext } from "../AppStateContext";
import "../styles/styles.css";

const HomePage = () => {
  const { setOriginalData } = useContext(AppStateContext);

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
    };
    checkToken();
  }, []);

  const handleSemesterSelection = async (url) => {

    const addIds = (courses) => {
      return courses.map((course) => ({
        ...course,
        id: `${course["Course Code"].trim()}-${course["Section Code"].trim()}`,
      }));
    }

    try {
      // Trigger the download check API
      const response = await axios.get("/api/check-download", {
        params: { url },
      });
      console.log("Download check response:", response.data);

      let courses;
      if (response.data.method === "scrapeTable") {
        courses = response.data.data;
      } else if (response.data.method === "runPuppeteer") {
        // Fetch the updated courses JSON file
        const { data } = await axios.get("/downloads/courses.json");
        courses = data;
      }

      if (courses) {
        const dataWithIds = addIds(courses);
        setOriginalData(dataWithIds);
      }
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
