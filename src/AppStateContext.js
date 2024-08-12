import React, { createContext, useState } from "react";

const AppStateContext = createContext();

const AppStateProvider = ({ children }) => {
  const [subscribedCourses, setSubscribedCourses] = useState([]);
  const [jsonData, setJsonData] = useState([]);
  const [originalData, setOriginalData] = useState([]);

  return (
    <AppStateContext.Provider
      value={{
        subscribedCourses,
        setSubscribedCourses,
        jsonData,
        setJsonData,
        originalData,
        setOriginalData,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export { AppStateContext, AppStateProvider };
