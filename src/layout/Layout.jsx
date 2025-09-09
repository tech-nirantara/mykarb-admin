"use client";
import React, { useState } from "react";
import "./Layout.css"; // Import the CSS file
import Avatar from "@mui/material/Avatar";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Badge, Button } from "@mui/material";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  // State for managing the dropdown menu
  const [anchorEl, setAnchorEl] = useState(null);

  // Open and close the menu
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Handle Logout and Update Profile
  const handleLogout = () => {
    // Execute logout logic here
    console.log("Logging out...");
    localStorage.clear();
    window.location.href = "/login";
    handleClose();
  };

  const handleUpdateProfile = () => {
    // Execute update profile logic here
    console.log("Updating profile...");
    handleClose();
  };

  return (
    <div className="layout-container">
      <div className="sidebar-wrapper">
        <Sidebar />
      </div>
      <div className="main-content">
        <div className="header-content">
          <div className="header-left">
            <h1 className="header-title">CBAM Admin</h1>
          </div>
          <div className="header-right">
            <div className="header-actions">
              <button className="action-item" aria-label="Notifications">
                <Badge badgeContent={5} color="error">
                  <NotificationsIcon />
                </Badge>
              </button>
              <button 
                className="user-avatar" 
                onClick={handleClick}
                aria-label="User menu"
              >
                A
              </button>
            </div>
          </div>
        </div>

        <div className="content-area">
          <div className="content-wrapper">
            {children}
          </div>
        </div>
        
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          disablePortal
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 200,
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--gray-200)',
              borderRadius: 'var(--radius-lg)',
            }
          }}
        >
          <MenuItem 
            onClick={handleUpdateProfile}
            sx={{
              fontSize: '0.875rem',
              padding: 'var(--spacing-sm) var(--spacing-md)',
              '&:hover': {
                backgroundColor: 'var(--gray-100)',
              }
            }}
          >
            Update Profile
          </MenuItem>
          <MenuItem 
            onClick={handleLogout}
            sx={{
              fontSize: '0.875rem',
              padding: 'var(--spacing-sm) var(--spacing-md)',
              color: 'var(--error-color)',
              '&:hover': {
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
              }
            }}
          >
            Logout
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default Layout;
