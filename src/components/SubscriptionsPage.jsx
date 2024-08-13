import React, { useState, useContext, useEffect } from "react";
import { AppStateContext } from "../AppStateContext";
import CourseViewer from "./CourseViewer";
import createEventFromCourse from "./CalendarEntryGenerator";

const SubscriptionsPage = () => {
  const { subscribedCourses } = useContext(AppStateContext);
  const [currentCourseIndex, setCurrentCourseIndex] = useState(0);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [eventObjects, setEventObjects] = useState([]);

  useEffect(() => {
    const course = subscribedCourses[currentCourseIndex];
    setCurrentCourse(course);
    setEventObjects([createEventFromCourse(course)]);
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
      {eventObjects.length > 0 && <CourseViewer eventObjects={eventObjects} />}
    </div>
  );
};

export default SubscriptionsPage;
