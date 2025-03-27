import React, { useState, useEffect } from "react";
import { Grid, Box, Select, MenuItem, FormControl, InputLabel } from "@mui/material";

const SemesterSelectorUI = ({ onSelectSemester }) => {
  // Initialize category as an empty object or null if nothing is selected
  const [selectedCategory, setSelectedCategory] = useState(null);
  // Initialize semester as an empty string
  const [selectedSemester, setSelectedSemester] = useState("");
  const [termMenu, setTermMenu] = useState([]);

  useEffect(() => {
    fetch("/api/semesters")
      .then((res) => res.json())
      .then((data) => setTermMenu(data))
      .catch((err) => console.error("Error fetching term menu:", err));
  }, []);

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);
    setSelectedSemester(""); // Reset the semester selection when the category changes
  };

  const handleSemesterChange = (event) => {
    const semesterUrl = event.target.value;
    setSelectedSemester(semesterUrl);

    if (onSelectSemester) {
        onSelectSemester(semesterUrl)
    }
  };
  
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {termMenu.length > 0 ? (
            <FormControl fullWidth>
              <InputLabel id="semester-category-label">Semester Category</InputLabel>
              <Select
                labelId="semester-category-label"
                value={selectedCategory || ""}
                label="Semester Category"
                onChange={handleCategoryChange}
              >
                {termMenu.map((group, index) => (
                  <MenuItem key={index} value={group}>
                    {group.termCategory}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <p>Loading categories...</p>
          )}
        </Grid>

        <Grid item xs={12}>
          {selectedCategory && selectedCategory.termNames.length > 0 ? (
            <FormControl fullWidth>
              <InputLabel id="semester-label">Semester</InputLabel>
              <Select
                labelId="semester-label"
                value={selectedSemester}
                label="Semester"
                onChange={handleSemesterChange}
              >
                {selectedCategory.termNames.map((termItem, index) => (
                  <MenuItem key={index} value={termItem.link}>
                    {termItem.term}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <p>{selectedCategory ? "Loading semesters..." : "Please select a category"}</p>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default SemesterSelectorUI;
