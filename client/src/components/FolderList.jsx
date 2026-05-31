import {
  Box,
  Card,
  CardContent,
  List,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import NewFolder from "./NewFolder";
import EditFolder from "./EditFolder";
import { deleteFolder } from "../utils/folderUtils";
import { Edit, Delete } from "@mui/icons-material";
import { useToast } from "../hooks/useToast";
import Toast from "./Toast";

export default function FolderList({ folders, onUpdate }) {
  const { folderId } = useParams();
  // console.log(params);

  const [activeFolderId, setActiveFolderId] = useState(folderId);
  const [hoveredFolderId, setHoveredFolderId] = useState(null);
  const { toast, showToast, closeToast } = useToast();

  const handleDelete = async (folderId) => {
    const folderName = folders.find((f) => f.id === folderId)?.name || "Folder";
    if (
      window.confirm(
        "Bạn có chắc chắn muốn xóa thư mục này và tất cả các ghi chú bên trong không?",
      )
    ) {
      try {
        await deleteFolder(folderId);
        showToast(`Folder "${folderName}" đã được xóa thành công!`, "success");
        onUpdate(); // Refresh folders
      } catch (error) {
        showToast("Error deleting folder", "error");
      }
    }
  };

  return (
    <>
      <List
        sx={{
          width: "100%",
          maxWidth: 360,
          bgcolor: "#7D9D9C",
          height: "100%",
          padding: "10px",
          textAlign: "left",
          overflowY: "auto",
        }}
        subheader={
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography sx={{ fontWeight: "bold", color: "white" }}>
              Folder
            </Typography>
            <NewFolder />
          </Box>
        }
      >
        {folders.map(({ id, name }) => {
          return (
            <Box
              key={id}
              onMouseEnter={() => setHoveredFolderId(id)}
              onMouseLeave={() => setHoveredFolderId(null)}
              sx={{ position: "relative" }}
            >
              <Link
                to={`folders/${id}`}
                style={{
                  textDecoration: "none",
                }}
                onClick={() => {
                  setActiveFolderId(id);
                }}
              >
                <Card
                  sx={{
                    mb: "5px",
                    backgroundColor:
                      id === activeFolderId ? "rgb(255 211 140)" : null,
                  }}
                >
                  <CardContent
                    sx={{ "&:last-child": { pb: "10px" }, padding: "10px" }}
                  >
                    <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                      {name}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
              {hoveredFolderId === id && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    display: "flex",
                    pt: 1,
                    borderRadius: 1,
                  }}
                >
                  <EditFolder folder={{ id, name }} onUpdate={onUpdate} />
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete(id);
                    }}
                  >
                    <Delete sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
              )}
            </Box>
          );
        })}
      </List>
      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={closeToast}
      />
    </>
  );
}
