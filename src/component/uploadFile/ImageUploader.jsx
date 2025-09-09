// components/ImageUploader.js
import React from "react";
import { Box, Button, IconButton, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { postFiles } from "../../utils/api";

const ImageUploader = ({ image, onUpload, onDelete, title }) => {
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("files", file);

    try {
      const res = await postFiles("/cloud/upload", formData); // Assumes this is globally available or imported
      const imageUrl = res?.data?.urls[0];
      onUpload(imageUrl);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      event.target.value = null;
    }
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", marginTop: "1rem" }}
    >
      <Typography variant="h6" gutterBottom>
        {title ? title : "Company Logo"}
      </Typography>
      <input
        type="file"
        accept="image/*"
        // onChange={handleImageUpload}
        style={{ display: "none" }}
        id={`company-image-upload`}
      />
      <Button
        variant="contained"
        component="label" 
        sx={{
          width: "94.5px",
          backgroundColor: "#1c486b",
          textTransform: "none",
          padding: "6px 24px",
        }}
      >
        Upload
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={handleImageUpload}
        />
      </Button>

      {image && (
        <Box
          mt={2}
          position="relative"
          width="15vw"
          height="15vw"
          style={{
            border: "1px solid #ccc",
          }}
        >
          <img
            src={image}
            alt="Company Preview"
            style={{
              width: "100%",
              height: "100%",
              // objectFit: "contain",
              borderRadius: "8px",
            }}
          />
          <IconButton
            onClick={onDelete}
            style={{
              position: "absolute",
              top: "-12px",
              right: "-12px",
              backgroundColor: "white",
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
              padding: "4px",
              zIndex: 1,
            }}
            size="small"
          >
            <DeleteIcon fontSize="small" color="error" />
          </IconButton>
        </Box>
      )}
    </div>
  );
};

export default ImageUploader;
