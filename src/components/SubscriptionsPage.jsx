import React, { useState, useContext, useEffect } from "react";
import { AppStateContext } from "../AppStateContext";
import CourseViewer from "./CourseViewer";
import createEventFromCourse from "./CalendarEntryGenerator";

const SubscriptionsPage = () => {
  const { subscribedCourses, eventObjects, setEventObjects } =
    useContext(AppStateContext);
  const [currentCourseIndex, setCurrentCourseIndex] = useState(0);
  const [currentCourse, setCurrentCourse] = useState(null);

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
    console.log(eventObjects);
    try {
      const response = await fetch("/api/create-events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventObjects }),
      });

      if (response.ok) {
        alert("Events created successfully");
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
