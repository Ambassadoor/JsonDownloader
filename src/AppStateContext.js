import React, { createContext, useState } from "react";

const AppStateContext = createContext();

const AppStateProvider = ({ children }) => {
  const [subscribedData, setSubscribedData] = useState([]);
  const [jsonData, setJsonData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [eventObjects, setEventObjects] = useState([]);
  const [excludedDates, setExcludedDates] = useState([]);
  const [eventInstances, setEventInstances] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [currentCourseIndex, setCurrentCourseIndex] = useState(0);
  const [formData, setFormData] = useState();

  return (
    <AppStateContext.Provider
      value={{
        subscribedData,
        setSubscribedData,
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
        selectedFiles,
        setSelectedFiles,
        currentCourseIndex,
        setCurrentCourseIndex,
        formData,
        setFormData,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export { AppStateContext, AppStateProvider };
