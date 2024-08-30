import React, { useState, useEffect, useContext, useMemo } from "react";
import { TextField, Grid, List, ListItemButton, ListItemText, Checkbox, Paper, Pagination, Typography, ListItemIcon } from "@mui/material";
import { AppStateContext } from "../AppStateContext";

const ITEMS_PER_PAGE = 100;

const CourseTransferList = () => {
  const { originalData } = useContext(AppStateContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [subscribedData, setSubscribedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    return originalData
      .filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
      .filter((item) => !subscribedData.some((subscribedItem) => subscribedItem.id === item.id));
  }, [searchTerm, originalData, subscribedData]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleToggle = (course) => {
    const isSubscribed = subscribedData.some((item) => item.id === course.id);
    if (isSubscribed) {
      setSubscribedData(subscribedData.filter((item) => item.id !== course.id));
    } else {
      setSubscribedData([...subscribedData, course]);
    }
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedPageData = useMemo(() => filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE), [filteredData, startIndex]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <TextField
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearch}
          fullWidth
        />
      </Grid>

      <Grid item xs={12}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={5}>
            <Paper style={{ maxHeight: '400px', overflow: 'auto' }}>
              <List dense>
                {displayedPageData.length > 0 ? (
                  displayedPageData.map((course) => (
                    <ListItemButton key={course.id} onClick={() => handleToggle(course)}>
                        <ListItemIcon>
                            <Checkbox
                                checked={subscribedData.some((item) => item.id === course.id)}
                                tabIndex={-1}
                                disableRipple
                            />
                        </ListItemIcon>
                      <ListItemText 
                        disableTypography
                        primary={<Typography style={{fontWeight: 'bold'}}>{course['Course Name']}</Typography>}
                        secondary={
                          <span>
                            <Typography>Course/Section Code: {course.id}</Typography>
                            <Typography>Instructor: {course['Instructor']}</Typography>
                            <Typography>Start Time: {course['Start Time']}</Typography>
                            <Typography>Meeting Days: {course['Meeting Days']}</Typography>
                            <Typography>Location: {course['Location']}</Typography>
                          </span>
                        } />
                    </ListItemButton>
                  ))
                ) : (
                  <ListItemText primary="No courses available" />
                )}
              </List>
            </Paper>
            <Pagination count={Math.ceil(filteredData.length / ITEMS_PER_PAGE)} page={currentPage} onChange={handlePageChange} />
          </Grid>

          <Grid item xs={5} >
            <Paper   style={{
                        minHeight: '400px',
                        overflow: 'auto',
                        display: subscribedData.length > 0 ? 'block' : 'flex',
                        justifyContent: subscribedData.length > 0 ? 'flex-start' : 'center',
                        alignItems: subscribedData.length > 0 ? 'flex-start' : 'center',
  }}>
              <List dense>
                {subscribedData.length > 0 ? (
                  subscribedData.map((course) => (
                    <ListItemButton key={course.id} onClick={() => handleToggle(course)}>
                      <Checkbox
                        checked
                        tabIndex={-1}
                        disableRipple
                      />
                      <ListItemText primary={course['Course Name']} />
                    </ListItemButton>
                  ))
                ) : (
                  <ListItemText primary="No courses subscribed" style={{ textAlign: 'center' }}/>
                )}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CourseTransferList;
