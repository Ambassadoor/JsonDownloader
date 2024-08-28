import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppStateContext } from "../AppStateContext";
import CourseViewer from "./CourseViewer";
import createEventFromCourse from "./CalendarEntryGenerator";
import axios from "axios";

const SubscriptionsPage = () => {
  const {
    subscribedCourses,
    eventObjects,
    setEventObjects,
    setEventInstances,
  } = useContext(AppStateContext);
  const [currentCourseIndex, setCurrentCourseIndex] = useState(0);
  const [currentCourse, setCurrentCourse] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setEventObjects(subscribedCourses.map(createEventFromCourse));
  }, [subscribedCourses, setEventObjects]);

  useEffect(() => {
    const course = subscribedCourses[currentCourseIndex];
    setCurrentCourse(course);
  }, [currentCourseIndex, subscribedCourses]);

  const handleNextCourse = () => {
    setCurrentCourseIndex((prevIndex) =>
      prevIndex < subscribedCourses.length - 1 ? prevIndex + 1 : prevIndex,
    );
  };

  const handlePrevCourse = () => {
    setCurrentCourseIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : prevIndex,
    );
  };

  const handleCreateEvents = async () => {
    try {
      const response = await axios.post(
        "/api/create-events",
        { eventObjects },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 200) {
        const { events } = response.data;
        // Store the instances in the context
        setEventInstances(events); // Set all event instances

        alert("Events created successfully");

        // Redirect to /files page
        navigate("/files");
      } else {
        alert("Failed to create events");
      }
    } catch (error) {
      console.error("Error creating events:", error);
      alert("Failed to create events");
    }
  };

  return (
    <div>
      <h1>Subscribed Courses</h1>
      <div>
        <button onClick={handlePrevCourse} disabled={currentCourseIndex === 0}>
          Previous
        </button>
        {currentCourse && (
          <span>
            {`Viewing course ${currentCourseIndex + 1} of ${
              subscribedCourses.length
            }: ${currentCourse["Course Name"]}`}
          </span>
        )}
        <button
          onClick={handleNextCourse}
          disabled={currentCourseIndex === subscribedCourses.length - 1}
        >
          Next
        </button>
      </div>
      {eventObjects.length > 0 && (
        <CourseViewer currentCourseIndex={currentCourseIndex} />
      )}
      <button onClick={handleCreateEvents}>
        Create Google Calendar Events
      </button>
    </div>
  );
};

export default SubscriptionsPage;
