import React from "react";
import { Button } from "@mui/material";

const ConfirmCoursesButton = ({ handleConfirmCoursesClick }) => {
  return (
    <Button onClick={handleConfirmCoursesClick} variant="contained">
      Confirm Courses
    </Button>
  );
};

export default ConfirmCoursesButton;
