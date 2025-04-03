import React, { createContext, useState } from "react";

const AppStateContext = createContext();

const AppStateProvider = ({ children }) => {
  const [subscribedData, setSubscribedData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [currentCourseIndex, setCurrentCourseIndex] = useState(0);


  return (
    <AppStateContext.Provider
      value={{
        subscribedData,
        setSubscribedData,
        originalData,
        setOriginalData,
        currentCourseIndex,
        setCurrentCourseIndex,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export { AppStateContext, AppStateProvider };
