import React, { useState, useMemo, useEffect } from "react";
import {
  Grid,
  Paper,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Typography,
  TablePagination,
} from "@mui/material";
import PropTypes from "prop-types";

const TransferList = ({
  list,
  emptyMessage = "No data",
  primaryText,
  secondaryText = [],
  handleToggle,
  isChecked = false,
}) => {
  const [currentPage, setCurrentPage] = useState(0); // Start with a 0-based index
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const startIndex = currentPage * rowsPerPage; // Adjusted for 0-based index
  const displayedPageData = useMemo(
    () => list.slice(startIndex, startIndex + rowsPerPage),
    [list, startIndex, rowsPerPage],
  );

  useEffect(() => {
    setCurrentPage(0);
  }, [list]);

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0); // Reset to the first page
  };

  return (
    <Grid item>
      <Paper
        style={{ 
            minHeight: "400px", 
            maxHeight: "400px", 
            overflow: "auto",
            display: list.length > 0 ? 'block' : 'flex',
            justifyContent: list.length > 0 ? 'flex-start' : 'center',
            alignItems: list.length > 0 ? 'flex-start' : 'center' }}
      >
        <List dense>
          {displayedPageData.length > 0 ? (
            displayedPageData.map((listItem) => (
              <ListItemButton
                key={listItem.id}
                onClick={() => handleToggle(listItem)}
              >
                <ListItemIcon>
                  <Checkbox tabIndex={-1} disableRipple checked={isChecked} />
                </ListItemIcon>
                <ListItemText
                  disableTypography
                  primary={
                    <Typography variant="body1" style={{ fontWeight: "bold" }}>
                      {listItem[primaryText]}
                    </Typography>
                  }
                  secondary={
                  secondaryText && secondaryText.length > 0 ? (
                    <div style={{ marginLeft: "16px" }}> {/* Indent secondary text */}
                      {secondaryText.map((field) => (
                        <Typography
                          key={field}
                          variant="body2"
                          color="textSecondary"
                          style={{ fontSize: "0.75rem" }} // Smaller font size
                        >
                          {field ? `${field}: ${listItem[field]}` : ""}
                        </Typography>
                      ))}
                    </div>
                  ) : (
                    ""
                  )
                }
                />
              </ListItemButton>
            ))
          ) : (
            <ListItemText primary={emptyMessage} />
          )}
        </List>
      </Paper>
      <TablePagination
        component="div"
        count={list.length} // Total number of items
        page={currentPage} // 0-based page index
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Grid>
  );
};

TransferList.propTypes = {
  list: PropTypes.arrayOf(PropTypes.object).isRequired,
  emptyMessage: PropTypes.string,
  primaryText: PropTypes.string.isRequired,
  secondaryText: PropTypes.arrayOf(PropTypes.string),
  handleToggle: PropTypes.func.isRequired,
  isChecked: PropTypes.bool,
};

export default TransferList;
