import React from "react";
import { useRouteError, useNavigate } from "react-router-dom";
import { Box, Typography, Button, Container } from "@mui/material";
import { ErrorOutline as ErrorIcon } from "@mui/icons-material";

export default function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();
  console.error(error);

  const statusCode = error?.status || 404;
  const errorMessage =
    error?.statusText || error?.message || "Something went wrong";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            borderRadius: "16px",
            padding: 4,
            textAlign: "center",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          }}
        >
          <ErrorIcon
            sx={{
              fontSize: 80,
              color: "#e74c3c",
              mb: 2,
              opacity: 0.8,
            }}
          />

          <Typography
            sx={{
              fontSize: 48,
              fontWeight: 700,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              mb: 1,
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            {statusCode}
          </Typography>

          <Typography
            sx={{
              fontSize: 24,
              fontWeight: 600,
              color: "#1a1a1a",
              mb: 2,
            }}
          >
            Oops! Something went wrong
          </Typography>

          <Typography
            sx={{
              fontSize: 16,
              color: "#666",
              mb: 3,
              lineHeight: 1.6,
            }}
          >
            {errorMessage}
          </Typography>

          <Typography
            sx={{
              fontSize: 14,
              color: "#999",
              mb: 4,
              fontStyle: "italic",
            }}
          >
            Sorry for the inconvenience. Please try again later.
          </Typography>

          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <Button
              onClick={() => navigate(-1)}
              variant="outlined"
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 500,
                px: 3,
                py: 1.2,
              }}
            >
              Go Back
            </Button>
            <Button
              onClick={() => navigate("/")}
              variant="contained"
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 500,
                px: 3,
                py: 1.2,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            >
              Go Home
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
