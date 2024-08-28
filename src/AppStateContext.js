import React, { createContext, useState } from "react";

const AppStateContext = createContext();

const AppStateProvider = ({ children }) => {
  const [subscribedCourses, setSubscribedCourses] = useState([]);
  const [jsonData, setJsonData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [eventObjects, setEventObjects] = useState([]);
  const [excludedDates, setExcludedDates] = useState([]);
  const [eventInstances, setEventInstances] = useState([]);

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
        eventInstances,
        setEventInstances,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export { AppStateContext, AppStateProvider };
