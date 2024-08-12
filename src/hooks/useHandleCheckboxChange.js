import { useCallback, useContext } from "react";
import { AppStateContext } from "../AppStateContext";

export const useHandleCheckboxChange = () => {
  const {
    originalData,
    setOriginalData,
    subscribedCourses,
    setSubscribedCourses,
  } = useContext(AppStateContext);
  return useCallback(
    (courseId) => {
      const updatedData = originalData.map((course) =>
        course.id === courseId
          ? { ...course, subscribed: !course.subscribed }
          : course,
      );

      setOriginalData(updatedData);

      const course = updatedData.find((c) => c.id === courseId);
      const isSubscribed = subscribedCourses.some((c) => c.id === courseId);

      if (isSubscribed) {
        setSubscribedCourses((prevCourses) =>
          prevCourses.filter((c) => c.id !== courseId),
        );
      } else {
        setSubscribedCourses((prevCourses) => [...prevCourses, course]);
      }
    },
    [originalData, setOriginalData, subscribedCourses, setSubscribedCourses],
  );
};
