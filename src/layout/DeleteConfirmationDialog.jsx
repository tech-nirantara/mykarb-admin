/* eslint-disable no-unused-vars */
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";

const DeleteConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  companyId,
  loading, // Accept loading state as a prop
  heading,
  subHeading,
  buttonText,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{heading ?? "Delete Data"}</DialogTitle>
      <DialogContent>
        <Typography>
          {subHeading ?? "Are you sure you want to delete this data."}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          color="primary"
          variant="outlined"
          style={{ textTransform: "none" }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color="secondary"
          style={{
            backgroundColor: " #1c486b",
            fontFamily: "Inter",
            textTransform: "none",
            color: "white",
            padding: "6px 12px",
            marginLeft: "1rem",
          }}
        >
          {buttonText ?? "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
