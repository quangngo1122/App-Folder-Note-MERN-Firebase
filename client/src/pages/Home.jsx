import { Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState, useEffect } from "react";
import UserMenu from "../components/UserMenu";
import FolderList from "../components/FolderList";
import { Link, Outlet, useLoaderData } from "react-router-dom";
import PushNotification from "../components/PushNotification";
import { foldersLoader } from "../utils/folderUtils";

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
    <>
      <Typography variant="h4" sx={{ mb: "20px" }}>
        <Link
          style={{
            textDecoration: "none",
            color: "black",
          }}
          to={"/"}
        >
          Note App
        </Link>
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "right", mb: "10px" }}>
        <UserMenu />
        <PushNotification />
      </Box>

      <Grid
        container
        sx={{ height: "50vh", boxShadow: "0 0 15px 0 rgb(193 193 193 /60%)" }}
      >
        <Grid size={3} sx={{ height: "100%" }}>
          <FolderList folders={folders} onUpdate={handleUpdateFolders} />
        </Grid>
        <Grid size={9} sx={{ height: "100%" }}>
          <Outlet />
          {/* = router chilren của home -> folder/:folderId */}
        </Grid>
      </Grid>
    </>
  );
}
