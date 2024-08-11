import React, { createContext, useState } from "react";

export const SubscribedCoursesContext = createContext();

export const SubscribedCoursesProvider = ({ children }) => {
  const [subscribedCourses, setSubscribedCourses] = useState([]);

  return (
    <SubscribedCoursesContext.Provider
      value={{ subscribedCourses, setSubscribedCourses }}
    >
      {children}
    </SubscribedCoursesContext.Provider>
  );
};
