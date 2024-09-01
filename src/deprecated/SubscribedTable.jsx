import React, { useContext } from "react";
import { useHandleCheckboxChange } from "./useHandleCheckboxChange";
import { AppStateContext } from "../AppStateContext";

const SubscribedTable = () => {
  const { subscribedData } = useContext(AppStateContext);
  const handleCheckboxChange = useHandleCheckboxChange();

  return (
    <table id="subscribedTable">
      <thead>
        <tr>
          <th></th>
          <th>Course Code</th>
          <th>Section Code</th>
          <th>Course Name</th>
        </tr>
      </thead>
      <tbody id="subscribedBody">
        {subscribedData.map((course, index) => (
          <tr key={index}>
            <td>
              <input
                type="checkbox"
                checked={true}
                onChange={() => handleCheckboxChange(course.id)}
              />
            </td>
            <td>{course["Course Code"]}</td>
            <td>{course["Section Code"]}</td>
            <td>{course["Course Name"]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SubscribedTable;
