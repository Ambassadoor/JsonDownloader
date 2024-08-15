import React, { createContext, useState } from "react";

const AppStateContext = createContext();

const AppStateProvider = ({ children }) => {
  const [subscribedCourses, setSubscribedCourses] = useState([]);
  const [jsonData, setJsonData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [eventObjects, setEventObjects] = useState([]);
  const [excludedDates, setExcludedDates] = useState([]);

  return (
    <AppStateContext.Provider
      value={{
        subscribedCourses,
        setSubscribedCourses,
        jsonData,
        setJsonData,
        originalData,
        setOriginalData,
        eventObjects,
        setEventObjects,
        excludedDates,
        setExcludedDates,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export { AppStateContext, AppStateProvider };
