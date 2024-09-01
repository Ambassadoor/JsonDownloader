import React, { useState, useEffect, useContext } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { TextField, Grid } from "@mui/material";
import { useHandleCheckboxChange } from "./useHandleCheckboxChange";
import { AppStateContext } from "../AppStateContext";

const CourseTable = ({}) => {
  const { jsonData, setJsonData, originalData, subscribedData } =
    useContext(AppStateContext);
  const handleCheckboxChange = useHandleCheckboxChange();

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    if (jsonData.length > 0) {
      const cols = Object.keys(jsonData[0]).map((key) => ({
        field: key,
        headerName: key,
        width: 150,
      }));
      setColumns([
        {
          field: "select",
          headerName: "",
          renderCell: (params) => (
            <input
              type="checkbox"
              checked={subscribedData.some(
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
    setFilteredData(jsonData); // Initialize filteredData with jsonData
  }, [jsonData, subscribedData]);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    filterData(value, originalData);
  };

  const filterData = (term, data) => {
    const filtered = data.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(term),
      ),
    );
    setFilteredData(filtered);
    setJsonData(filtered); // Update jsonData with the filtered data
  };

  useEffect(() => {
    filterData(searchTerm, originalData); // Reapply the search filter whenever originalData changes
  }, [originalData]);

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
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            columnVisibilityModel={{
              id: false,
              subscribed: false,
            }}
            rows={filteredData}
            columns={columns}
            pageSizeOptions={[10, 50, 100]}
            checkboxSelection={false}
            disableRowSelectionOnClick
            sx={{
              "& .MuiDataGrid-footerContainer": {
                justifyContent: "flex-start", // Aligns the pagination controls to the left
              },
            }}
          />
        </div>
      </Grid>
    </Grid>
  );
};

export default CourseTable;
