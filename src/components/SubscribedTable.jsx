import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Grid } from '@mui/material';

const SubscribedTable = ({
  subscribedCourses,
  setSubscribedCourses,
  originalData,
  setOriginalData,
  setJsonData, // Add this to update jsonData in the CourseTable
}) => {
  const handleCheckboxChange = (courseId) => {
    const isSubscribed = subscribedCourses.some((c) => c.id === courseId);

    if (isSubscribed) {
      const updatedCourses = subscribedCourses.filter((c) => c.id !== courseId);
      setSubscribedCourses(updatedCourses);
      updateOriginalData(courseId, false, updatedCourses);
    } else {
      const course = originalData.find((c) => c.id === courseId);
      const updatedCourses = [...subscribedCourses, course];
      setSubscribedCourses(updatedCourses);
      updateOriginalData(courseId, true, updatedCourses);
    }
  };

  const updateOriginalData = (courseId, subscribed, updatedCourses) => {
    const updatedData = originalData.map((course) =>
      course.id === courseId ? { ...course, subscribed } : course,
    );
    setOriginalData(updatedData);
    setJsonData(updatedData); // Trigger re-render of CourseTable
  };

  return (
    <Grid item>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          checkboxSelection={false}
          disableRowSelectionOnClick
          rows={subscribedCourses}
          columns={[
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
            { field: 'Course Code', headerName: 'Course Code', width: 150 },
            { field: 'Section Code', headerName: 'Section Code', width: 150 },
            { field: 'Course Name', headerName: 'Course Name', width: 300 },
          ]}
          pageSize={10}
        />
      </div>
    </Grid>
  );
};

export default SubscribedTable;
