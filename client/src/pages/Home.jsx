import { Box, Typography } from "@mui/material";
import React from "react";

export default function Home() {
  return (
    <>
      <Typography variant="h4" sx={{ mb: "20px" }}>
        Note App
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "right", mb: "10px" }}></Box>
    </>
  );
}
