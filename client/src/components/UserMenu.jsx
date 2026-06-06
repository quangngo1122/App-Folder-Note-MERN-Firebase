import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import {
  Avatar,
  Box,
  Menu,
  MenuItem,
  Typography,
  Divider,
  ListItemIcon,
} from "@mui/material";
import { Logout as LogoutIcon } from "@mui/icons-material";

export default function UserMenu() {
  const {
    user: { displayName, photoURL, auth },
  } = useContext(AuthContext);

  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleLogout = () => {
    auth.signOut();
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: 1.5,
          py: 1,
          borderRadius: "8px",
          cursor: "pointer",
          transition: "all 0.2s",
          "&:hover": {
            background: "rgba(102, 126, 234, 0.05)",
          },
        }}
        onClick={handleClick}
      >
        <Box
          sx={{ textAlign: "right", display: "flex", flexDirection: "column" }}
        >
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: 13,
              color: "#1a1a1a",
            }}
          >
            {displayName}
          </Typography>
          <Typography sx={{ fontSize: 11, color: "#999" }}>Account</Typography>
        </Box>
        <Avatar
          alt="avatar"
          src={photoURL}
          sx={{
            width: 36,
            height: 36,
            border: "2px solid #667eea",
            boxShadow: "0 2px 8px rgba(102, 126, 234, 0.2)",
          }}
        />
      </Box>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: 13,
              color: "#999",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Signed in
          </Typography>
          <Typography sx={{ fontSize: 13, color: "#1a1a1a", fontWeight: 500 }}>
            {displayName}
          </Typography>
        </Box>
        <Divider sx={{ my: 1 }} />
        <MenuItem
          onClick={handleLogout}
          sx={{
            color: "#e74c3c",
            fontWeight: 500,
            "&:hover": {
              background: "rgba(231, 76, 60, 0.05)",
            },
          }}
        >
          <ListItemIcon sx={{ color: "#e74c3c" }}>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}
