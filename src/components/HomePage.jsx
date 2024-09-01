import React, { useContext, useEffect } from "react";
import axios from "axios";
import CourseTransferList from "./CourseTransferList";
import { AppStateContext } from "../AppStateContext";
import "../styles/styles.css";

const HomePage = () => {
  const { setOriginalData } = useContext(AppStateContext);

  useEffect(() => {
    const checkAndLoadData = async () => {
      try {
        const response = await axios.get("/api/check-download", {
          params: { hours: 24 },
        });
        console.log("Check Download Response:", response.data);

        const dataResponse = await axios.get("/downloads/courses.json");
        const dataWithIds = dataResponse.data.map((course) => ({
          ...course,
          id: `${course["Course Code"]}-${course["Section Code"]}`,
        }));
        setOriginalData(dataWithIds);
      } catch (error) {
        console.error("Error checking or loading JSON file:", error);
      }
    };

    checkAndLoadData();
  }, []);

  return (
    <div className="app-container">
      <CourseTransferList />
    </div>
  );
};

export default HomePage;
