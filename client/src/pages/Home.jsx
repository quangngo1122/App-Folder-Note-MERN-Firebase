import { Grid, Typography, Box, Container } from "@mui/material";
import React, { useState, useEffect } from "react";
import UserMenu from "../components/UserMenu";
import FolderList from "../components/FolderList";
import { Link, Outlet, useLoaderData } from "react-router-dom";
import PushNotification from "../components/PushNotification";
import { foldersLoader } from "../utils/folderUtils";
import { Notes as NotesIcon } from "@mui/icons-material";

export default function Home() {
  const { folders: initialFolders } = useLoaderData();
  const [folders, setFolders] = useState(initialFolders);

  const handleUpdateFolders = async () => {
    const { folders: updatedFolders } = await foldersLoader();
    setFolders(updatedFolders);
  };

  useEffect(() => {
    setFolders(initialFolders);
  }, [initialFolders]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        backgroundAttachment: "fixed",
        py: 2,
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
            backdropFilter: "blur(10px)",
            background: "rgba(255, 255, 255, 0.95)",
            px: 3,
            py: 2,
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <NotesIcon sx={{ color: "white", fontSize: 24 }} />
            </Box>
            <Link
              to="/"
              style={{
                textDecoration: "none",
              }}
            >
              <Typography
                sx={{
                  fontSize: "28px",
                  fontWeight: 700,
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  cursor: "pointer",
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                NoteVault
              </Typography>
            </Link>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <PushNotification />
            <UserMenu />
          </Box>
        </Box>

        {/* Main Content */}
        <Grid
          container
          spacing={0}
          sx={{
            height: "calc(100vh - 140px)",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          }}
        >
          {/* Sidebar */}
          <Grid
            size={3}
            sx={{
              height: "100%",
              background: "#ffffff",
              borderRight: "1px solid #e0e0e0",
            }}
          >
            <FolderList folders={folders} onUpdate={handleUpdateFolders} />
          </Grid>

          {/* Main Content Area */}
          <Grid
            size={9}
            sx={{
              height: "100%",
              background: "#fafafa",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Outlet />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
