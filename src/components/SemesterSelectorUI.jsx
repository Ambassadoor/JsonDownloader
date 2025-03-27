import React, { useState, useEffect } from "react";

import { Grid, Box, Select, MenuItem} from "@mui/material";

const SemesterSelectorUI = () => {
    const [term, setTerm ] = useState({term: null, termLink: null});
    const [ termMenu, setTermMenu ] = useState([])

    useEffect(() => {
        fetch("/api/semesters")
            .then((res) => res.json())
            .then((data) => setTermMenu(data))
            .catch((err) => console.error("Error fetching term menu:", err))
    }, []);

    const handleChange = (event) => {
        setTerm(event.target.value);
    }

    return (
        <Box>
            <Grid>
                {termMenu.length > 0 ? (
                <Select
                    value = {term}
                    label="Semester"
                    onChange={handleChange}
                    >
                    {termMenu.map((group, index) => (
                        <MenuItem
                            key={index}
                            value={group.termCategory}
                            >{group.termCategory}
                        </MenuItem>
                    ))}
                </Select> ) :
                <p>Loading,,,</p>}
            </Grid>
        </Box>
    )
}

export default SemesterSelectorUI;