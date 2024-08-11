import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { TextField, Grid } from '@mui/material';

const CourseTable = ({
  jsonData,
  originalData,
  setJsonData,
  subscribedCourses,
  setSubscribedCourses,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    setFilteredData(jsonData);

    if (jsonData.length > 0) {
      const cols = Object.keys(jsonData[0]).map((key) => ({    
        field: key,
        headerName: key,
        width: 150,
      }));
      setColumns([
        {
          field: 'select',
          headerName: '',
          renderCell: (params) => (
            <input
              type="checkbox"
              checked={subscribedCourses.some(
                (course) => course.id === params.row.id,
              )}
              onChange={() => handleCheckboxChange(params.row.id)}
            />
          ),
          width: 50,
        },
        ...cols,
      ]);
    }
  }, [jsonData]);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = originalData.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(value),
      ),
    );
    setFilteredData(filtered);
    setJsonData(filtered);
  };

  const handleCheckboxChange = (courseId) => {
    const course = originalData.find((c) => c.id === courseId);
    const isSubscribed = subscribedCourses.some((c) => c.id === courseId);

    if (isSubscribed) {
      setSubscribedCourses((prevCourses) =>
        prevCourses.filter((c) => c.id !== courseId),
      );
      updateOriginalData(courseId, false);
    } else {
      setSubscribedCourses((prevCourses) => [...prevCourses, course]);
      updateOriginalData(courseId, true);
    }
  };

  const updateOriginalData = (courseId, subscribed) => {
    const updatedData = originalData.map((course) =>
      course.id === courseId ? { ...course, subscribed } : course,
    );
    setJsonData(updatedData);
  };

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <TextField
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearch}
          fullWidth
        />
      </Grid>
      <Grid item>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
          columnVisibilityModel={{
            id: false,
            subscribed: false
          }}
            rows={filteredData}
            columns={columns}
            pageSizeOptions={[10,50,100]}
            checkboxSelection={false}
            disableRowSelectionOnClick
            sx={{
              '& .MuiDataGrid-footerContainer': {
                justifyContent: 'flex-start', // Aligns the pagination controls to the left
              },
            }}
          />
        </div>
      </Grid>
    </Grid>
  );
};

export default CourseTable;
