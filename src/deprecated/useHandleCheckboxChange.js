import { useCallback, useContext } from "react";
import { AppStateContext } from "../AppStateContext";

export const useHandleCheckboxChange = () => {
  const { originalData, setOriginalData, subscribedData, setSubscribedData } =
    useContext(AppStateContext);
  return useCallback(
    (courseId) => {
      const updatedData = originalData.map((course) =>
        course.id === courseId
          ? { ...course, subscribed: !course.subscribed }
          : course,
      );

      setOriginalData(updatedData);

      const course = updatedData.find((c) => c.id === courseId);
      const isSubscribed = subscribedData.some((c) => c.id === courseId);

      if (isSubscribed) {
        setSubscribedData((prevCourses) =>
          prevCourses.filter((c) => c.id !== courseId),
        );
      } else {
        setSubscribedData((prevCourses) => [...prevCourses, course]);
      }
    },
    [originalData, setOriginalData, subscribedData, setSubscribedData],
  );
};
