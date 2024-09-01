import { TextField } from '@mui/material';
import React from 'react';

const SearchBar = ({ searchTerm, setSearchTerm }) => {

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    }

    return (
        <TextField 
            label="Search"
            variants="outlined"
            value={searchTerm}
            onChange={handleSearch}
            fullWidth
        />
    )
}

export default SearchBar

