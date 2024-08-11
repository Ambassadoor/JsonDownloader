// src/components/SubscriptionsPage.jsx
import React, { useContext } from "react";
import { SubscribedCoursesContext } from "../SubscribedCoursesContext";

const SubscriptionsPage = () => {
  const { subscribedCourses } = useContext(SubscribedCoursesContext);

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
    </div>
  );
};

export default SubscriptionsPage;
