/* eslint-disable no-unused-vars */

import {
  Box,
  Typography,
  TextField,
  styled,
  InputAdornment,
} from "@mui/material";
import React from "react";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

const CustomTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    minHeight: "1.4375em", // Set minimum height
    padding: "16px", // Adjust padding for better appearance
  },
  "& .MuiInputBase-input": {
    minHeight: "1.4375em", // Ensure input field has a minimum height
    overflow: "hidden",
  },
  "&.highlight-disabled .MuiInputBase-input.Mui-disabled": {
    color: "#090808",
    cursor: "not-allowed",
    opacity: 1,
  },
  "& .MuiInputBase-input.Mui-disabled": {
    color: "#090808",
  },
}));

const InputField = ({
  title,
  adornmentText,
  handleChange,
  placeholder,
  value,
  errors,
  disabled,
  fieldName,
  showIcon,
  ellipsis,
  mt,
}) => {
  return (
    <Box>
      <Typography sx={{ mt: mt || 1.5, fontSize: "12px" }}>{title}</Typography>
      <CustomTextField
        sx={{ mt: mt || 0.5 }}
        variant="outlined"
        value={value || ""}
        // size="medium"
        disabled={disabled}
        onChange={handleChange}
        fullWidth
        name={fieldName}
        placeholder={placeholder}
        error={!!errors}
        className={disabled ? "highlight-disabled" : ""}
        multiline={ellipsis ? false : true} // Allows text to grow dynamically
        minRows={1} // Ensures at least one row is visible
        maxRows={Infinity} // Allows the text field to expand as needed
        InputLabelProps={{
          style: { color: errors ? "#D34040" : undefined },
        }}
        InputProps={{
          endAdornment:
            (showIcon && <TaskAltIcon sx={{ color: "green" }} />) ||
            (adornmentText && (
              <InputAdornment position="end">
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    minWidth: "40px",
                  }}
                >
                  <Box
                    sx={{
                      height: "29px",
                      width: "1px",
                      bgcolor: "#8A8A8A",
                      marginRight: "8px",
                    }}
                  />
                  {adornmentText}
                </Box>
              </InputAdornment>
            )),
        }}
      />
      {errors && typeof errors === "string" && (
        <Typography variant="body2" color="#D34040">
          {errors}
        </Typography>
      )}
    </Box>
  );
};

export default InputField;
