import React, { useContext } from "react";
import { Button, Typography, Box, Container, Card } from "@mui/material";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { AuthContext } from "../context/AuthProvider";
import { useNavigate, Navigate } from "react-router-dom";
import { graphQLRequest } from "../utils/request";
import { Notes as NotesIcon, Google as GoogleIcon } from "@mui/icons-material";

export default function Login() {
  const navigate = useNavigate();
  const auth = getAuth();
  const { user } = useContext(AuthContext);

  const handleLoginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const {
      user: { uid, displayName },
    } = await signInWithPopup(auth, provider);
    const { data } = await graphQLRequest({
      query: `mutation register($uid: String!, $name: String!) {
                register(uid: $uid, name: $name) {
                  id
                  name
                }
              }`,
      variables: {
        uid,
        name: displayName,
      },
    });
    console.log("register", { data });
  };

  if (localStorage.getItem("accessToken")) {
    return <Navigate to="/" />;
  }

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
        <Card
          sx={{
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            borderRadius: "16px",
            padding: 4,
            textAlign: "center",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          }}
        >
          {/* Logo */}
          <Box
            sx={{
              width: 80,
              height: 80,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 3,
              boxShadow: "0 8px 24px rgba(102, 126, 234, 0.3)",
            }}
          >
            <NotesIcon sx={{ color: "white", fontSize: 48 }} />
          </Box>

          {/* Title */}
          <Typography
            sx={{
              fontSize: 32,
              fontWeight: 700,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              mb: 1,
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            NoteVault
          </Typography>

          {/* Subtitle */}
          <Typography
            sx={{
              fontSize: 14,
              color: "#999",
              mb: 4,
              lineHeight: 1.6,
            }}
          >
            Save and organize your thoughts, ideas, and important notes in one
            beautiful place.
          </Typography>

          {/* Welcome Message */}
          <Typography
            sx={{
              fontSize: 18,
              fontWeight: 600,
              color: "#1a1a1a",
              mb: 3,
            }}
          >
            Welcome to NoteVault
          </Typography>

          <Typography
            sx={{
              fontSize: 14,
              color: "#666",
              mb: 4,
            }}
          >
            Sign in with your Google account to get started
          </Typography>

          {/* Login Button */}
          <Button
            variant="contained"
            size="large"
            onClick={handleLoginWithGoogle}
            startIcon={<GoogleIcon />}
            sx={{
              width: "100%",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              py: 1.5,
              fontSize: 16,
              fontWeight: 600,
              textTransform: "none",
              borderRadius: "12px",
              boxShadow: "0 8px 24px rgba(102, 126, 234, 0.3)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                boxShadow: "0 12px 32px rgba(102, 126, 234, 0.4)",
                transform: "translateY(-2px)",
              },
            }}
          >
            Sign in with Google
          </Button>

          {/* Footer */}
          <Typography
            sx={{
              fontSize: 12,
              color: "#999",
              mt: 4,
              lineHeight: 1.6,
            }}
          >
            By signing in, you agree to our Terms of Service and Privacy Policy
          </Typography>
        </Card>
      </Container>
    </Box>
  );
}
