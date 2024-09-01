import React, { useState, useContext, useMemo } from "react";
import { Grid, Typography } from "@mui/material";
import { AppStateContext } from "../AppStateContext";
import TransferList from "./transferList";
import SearchBar from "./SearchBar";


const CourseTransferList = () => {
  const { originalData } = useContext(AppStateContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [subscribedData, setSubscribedData] = useState([]);

  const filteredData = useMemo(() => {
    return originalData
      .filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
      .filter((item) => !subscribedData.some((subscribedItem) => subscribedItem.id === item.id));
  }, [searchTerm, originalData, subscribedData]);


  const handleToggle = (course) => {
    const isSubscribed = subscribedData.some((item) => item.id === course.id);
    if (isSubscribed) {
      setSubscribedData(subscribedData.filter((item) => item.id !== course.id));
    } else {
      setSubscribedData([...subscribedData, course]);
    }
  };

  return (
    <Grid 
      container direction='column'>
      <Grid container>
        <Grid item xs={6}>
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        </Grid>
      </Grid>
      <Grid container justifyContent='center'>
          <Grid item xs={6}>
            <Typography variant="h4">All Courses</Typography>
            <TransferList 
              list={filteredData}
              emptyMessage={'Loading'}
              primaryText={'Course Name'}
              secondaryText={['Instructor', 'Start Time', 'Meeting Days', 'Location', 'Course Notes']}
              handleToggle={handleToggle}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h4">My Courses</Typography>
            <TransferList
            list={subscribedData}
            emptyMessage={"No subscribed courses."}
            primaryText={'Course Name'}
            secondaryText={['Instructor', 'Start Time', 'Meeting Days', 'Location', 'Course Notes']}
            handleToggle={handleToggle}
            isChecked
            />
          </Grid>
      </Grid>
    </Grid>
  );
};

export default CourseTransferList;
