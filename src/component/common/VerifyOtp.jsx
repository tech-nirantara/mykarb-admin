import { Box } from '@mui/material'
import React from 'react'

const VerifyOtp = ({handleChange,text}) => {
  return (
    <Box
    onClick={handleChange}
    sx={{
      fontSize: "14px",
      color: "blue",
      textDecoration: "underline",
      textAlign: "right",
      cursor: "pointer",
    }}
  >
    {text}
  </Box>
)}

export default VerifyOtp