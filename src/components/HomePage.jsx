import React, { useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CourseTable from "./CourseTable";
import SubscribedTable from "./SubscribedTable";
import SubscribeButton from "./SubscribeButton";
import { AppStateContext } from "../AppStateContext";
import "../styles/styles.css";

const HomePage = () => {
  const { setJsonData, setOriginalData } = useContext(AppStateContext);
  const navigate = useNavigate();

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
          subscribed: false, // Add subscribed field with default value
        }));
        setJsonData(dataWithIds);
        setOriginalData(dataWithIds);
      } catch (error) {
        console.error("Error checking or loading JSON file:", error);
      }
    };

    checkAndLoadData();
  }, []);

  const handleSubscribeButtonClick = () => {
    navigate("/subscriptions");
  };

  return (
    <div className="app-container">
      <div className="left-pane">
        <h1>Course Table</h1>
        <CourseTable />
      </div>
      <div className="right-pane">
        <h2>Subscribed Courses</h2>
        <SubscribeButton onClick={handleSubscribeButtonClick} />
        <SubscribedTable />
      </div>
    </div>
  );
};

export default HomePage;
