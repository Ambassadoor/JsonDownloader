import React, { useState, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Typography, Box } from "@mui/material";
import { AppStateContext } from "../AppStateContext";
import TransferList from "./transferList";
import SearchBar from "./SearchBar";
import ConfirmCoursesButton from "./ConfirmCoursesButton";

const CourseTransferList = () => {
  const { originalData, subscribedData, setSubscribedData } =
    useContext(AppStateContext);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredData = useMemo(() => {
    return originalData
      .filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      )
      .filter(
        (item) =>
          !subscribedData.some(
            (subscribedItem) => subscribedItem.id === item.id,
          ),
      );
  }, [searchTerm, originalData, subscribedData]);

  const handleToggle = (course) => {
    const isSubscribed = subscribedData.some((item) => item.id === course.id);
    if (isSubscribed) {
      setSubscribedData(subscribedData.filter((item) => item.id !== course.id));
    } else {
      setSubscribedData([...subscribedData, course]);
    }
  };

  const handleConfirmCoursesClick = () => {
    navigate("/ui");
  };

  return (
    <Box sx={{ p: 4 }}>
      {" "}
      {/* Add padding around the edges */}
      <Grid container direction="row" spacing={4} justifyContent="center">
        {" "}
        {/* Parent Row Container */}
        {/* Titles Container */}
        <Grid container direction="row" spacing={2} justifyContent="center">
          <Grid item xs={6}>
            <Typography variant="h4" align="left">
              All Courses
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h4" align="left">
              My Courses
            </Typography>
          </Grid>
        </Grid>
        {/* Search Bar Container */}
        <Grid container direction="row" spacing={2}>
          <Grid item xs={6}>
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </Grid>
          <Grid item xs={6} alignContent={"center"}>
            <ConfirmCoursesButton
              handleConfirmCoursesClick={handleConfirmCoursesClick}
            />
          </Grid>
        </Grid>
        {/* Transfer Lists Container */}
        <Grid container direction="row" spacing={2} justifyContent="center">
          <Grid item xs={6}>
            <TransferList
              list={filteredData}
              emptyMessage={"No courses available"}
              primaryText={"Course Name"}
              secondaryText={[
                "id",
                "Instructor",
                "Start Time",
                "Meeting Days",
                "Location",
                "Course Notes",
              ]}
              handleToggle={handleToggle}
            />
          </Grid>
          <Grid item xs={6}>
            <TransferList
              list={subscribedData}
              emptyMessage={"No subscribed courses."}
              primaryText={"Course Name"}
              secondaryText={[
                "id",
                "Instructor",
                "Start Time",
                "Meeting Days",
                "Location",
                "Course Notes",
              ]}
              handleToggle={handleToggle}
              isChecked
            />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CourseTransferList;
