import { Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import UserMenu from "../components/UserMenu";
import FolderList from "../components/FolderList";
import { Outlet } from "react-router-dom";

export default function Home() {
  return (
    <>
      <Typography variant="h4" sx={{ mb: "20px" }}>
        Note App
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "right", mb: "10px" }}>
        <UserMenu />
      </Box>

      <Grid
        container
        sx={{ height: "50vh", boxShadow: "0 0 15px 0 rgb(193 193 193 /60%)" }}
      >
        <Grid size={3} sx={{ height: "100%" }}>
          <FolderList
            folders={[
              { id: "1", name: "Plan 1" },
              { id: "2", name: "Plan 2" },
            ]}
          />
        </Grid>
        <Grid size={9} sx={{ height: "100%" }}>
          <Outlet />
          {/* = router chilren của home -> folder/:folderId */}
        </Grid>
      </Grid>
    </>
  );
}
