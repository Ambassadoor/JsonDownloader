import React from "react";
import { Button } from "@mui/material";

const ConfirmCoursesButton = ({ handleConfirmCoursesClick, disabled }) => {
  return (
    <Button onClick={handleConfirmCoursesClick} variant="contained" disabled={disabled}>
      Confirm Courses
    </Button>
  );
};

export default ConfirmCoursesButton;
