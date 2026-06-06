import React from "react";
import { Alert, Snackbar } from "@mui/material";

export default function Toast({ open, message, severity, onClose }) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      sx={{
        "& .MuiSnackbarContent-root": {
          borderRadius: "12px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
        },
      }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        sx={{
          width: "100%",
          borderRadius: "12px",
          fontSize: "14px",
          fontWeight: 500,
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
          "& .MuiAlert-action": {
            marginRight: "-12px",
          },
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
