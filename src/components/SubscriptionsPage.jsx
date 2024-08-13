// src/components/SubscriptionsPage.jsx
import React, { useContext } from "react";
import { AppStateContext } from "../AppStateContext";
import CourseViewer from "./CourseViewer";
import createEventFromCourse from "./CalendarEntryGenerator";

const SubscriptionsPage = () => {
  const { subscribedCourses } = useContext(AppStateContext);
  const eventObjects = subscribedCourses.map(createEventFromCourse);

  return (
    <div>
      <h1>Subscribed Courses</h1>
      <table>
        <thead>
          <tr>
            <th>Course Code</th>
            <th>Section Code</th>
            <th>Course Name</th>
          </tr>
        </thead>
        <tbody>
          {subscribedCourses.map((course, index) => (
            <tr key={index}>
              <td>{course["Course Code"]}</td>
              <td>{course["Section Code"]}</td>
              <td>{course["Course Name"]}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <CourseViewer eventObjects={eventObjects} />
    </div>
  );
};

export default SubscriptionsPage;
