import React from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useEffect } from "react";
import { createClient } from "graphql-ws";
import { GRAPHQL_SUBSCRIPTION_ENDPOINT } from "../utils/constants";
import {
  Badge,
  Menu,
  MenuItem,
  IconButton,
  Tooltip,
  Box,
  Typography,
} from "@mui/material";
import { useState } from "react";

const client = createClient({
  url: GRAPHQL_SUBSCRIPTION_ENDPOINT,
});

const query = `subscription PushNotification {
  notification {
    message
  }
}`;

export default function PushNotification() {
  const [invisible, setInvisible] = useState(true);
  const [notification, setNotification] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
    setNotification("");
    setInvisible(true);
  };

  const handleClick = (e) => {
    if (notification) {
      setAnchorEl(e.currentTarget);
    }
  };

  useEffect(() => {
    (async () => {
      const onNext = (data) => {
        setInvisible(false);
        const message = data?.data?.notification?.message;
        setNotification(message);
        console.log("[]", { data });
      };

      await new Promise((resolve, reject) => {
        client.subscribe(
          {
            query: query,
          },
          {
            next: onNext,
            error: reject,
            complete: resolve,
          },
        );
      });
    })();
  }, []);

  return (
    <>
      <Tooltip title="Notifications">
        <Badge
          color="secondary"
          variant="dot"
          invisible={invisible}
          sx={{
            "& .MuiBadge-badge": {
              backgroundColor: "#e74c3c",
              animation: !invisible ? "pulse 2s infinite" : "none",
              "@keyframes pulse": {
                "0%": {
                  boxShadow: "0 0 0 0 rgba(231, 76, 60, 0.7)",
                },
                "70%": {
                  boxShadow: "0 0 0 10px rgba(231, 76, 60, 0)",
                },
                "100%": {
                  boxShadow: "0 0 0 0 rgba(231, 76, 60, 0)",
                },
              },
            },
          }}
        >
          <IconButton
            onClick={handleClick}
            sx={{
              color: "#667eea",
              width: 40,
              height: 40,
              "&:hover": {
                background: "rgba(102, 126, 234, 0.1)",
              },
            }}
          >
            <NotificationsIcon />
          </IconButton>
        </Badge>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            minWidth: "300px",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: 13,
              color: "#999",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              mb: 1,
            }}
          >
            Notification
          </Typography>
          <Typography
            sx={{
              fontSize: 14,
              color: "#1a1a1a",
              lineHeight: 1.5,
            }}
          >
            {notification}
          </Typography>
        </Box>
      </Menu>
    </>
  );
}
