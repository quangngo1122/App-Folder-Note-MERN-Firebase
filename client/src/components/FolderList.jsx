import {
  Box,
  Card,
  CardContent,
  List,
  Typography,
  IconButton,
  Button,
  Divider,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import NewFolder from "./NewFolder";
import EditFolder from "./EditFolder";
import { deleteFolder } from "../utils/folderUtils";
import { Edit, Delete, FolderOutlined } from "@mui/icons-material";
import { useToast } from "../hooks/useToast";
import Toast from "./Toast";

export default function FolderList({ folders, onUpdate }) {
  const { folderId } = useParams();
  const [activeFolderId, setActiveFolderId] = useState(folderId);
  const [hoveredFolderId, setHoveredFolderId] = useState(null);
  const { toast, showToast, closeToast } = useToast();

  useEffect(() => {
    setActiveFolderId(folderId);
  }, [folderId]);

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
        onUpdate();
      } catch (error) {
        showToast("Error deleting folder", "error");
      }
    }
  };

  return (
    <>
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            px: 2,
            py: 2.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "2px solid #f0f0f0",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <FolderOutlined
              sx={{
                color: "#667eea",
                fontSize: 24,
                fontWeight: 600,
              }}
            />
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: 16,
                color: "#1a1a1a",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Folders
            </Typography>
          </Box>
          <NewFolder folders={folders} onUpdate={onUpdate} />
        </Box>

        {/* Folders List */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            px: 1.5,
            py: 1.5,
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          {folders.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                color: "#999",
                gap: 1,
              }}
            >
              <FolderOutlined sx={{ fontSize: 48, opacity: 0.3 }} />
              <Typography sx={{ fontSize: 14, opacity: 0.7 }}>
                No folders yet
              </Typography>
            </Box>
          ) : (
            folders.map(({ id, name }) => (
              <Box
                key={id}
                onMouseEnter={() => setHoveredFolderId(id)}
                onMouseLeave={() => setHoveredFolderId(null)}
                sx={{
                  position: "relative",
                }}
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
                      background:
                        id === activeFolderId
                          ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                          : "#ffffff",
                      border: "1px solid #e0e0e0",
                      cursor: "pointer",
                      transition:
                        "all 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s",
                      "&:hover": {
                        boxShadow: "0 8px 24px rgba(102, 126, 234, 0.15)",
                        transform: "translateY(-2px)",
                        borderColor: "#667eea",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          justifyContent: "space-between",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            flex: 1,
                          }}
                        >
                          <FolderOutlined
                            sx={{
                              fontSize: 20,
                              color:
                                id === activeFolderId ? "#ffffff" : "#667eea",
                            }}
                          />
                          <Typography
                            sx={{
                              fontSize: 15,
                              fontWeight: 600,
                              color:
                                id === activeFolderId ? "#ffffff" : "#1a1a1a",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {name}
                          </Typography>
                        </Box>
                        {hoveredFolderId === id && (
                          <Box
                            sx={{
                              display: "flex",
                              gap: 0.5,
                            }}
                          >
                            <EditFolder
                              folder={{ id, name }}
                              folders={folders}
                              onUpdate={onUpdate}
                            />
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.preventDefault();
                                handleDelete(id);
                              }}
                              sx={{
                                color:
                                  id === activeFolderId ? "#ffffff" : "#e74c3c",
                                "&:hover": {
                                  background:
                                    id === activeFolderId
                                      ? "rgba(255, 255, 255, 0.2)"
                                      : "rgba(231, 76, 60, 0.1)",
                                },
                              }}
                            >
                              <Delete sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Box>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Link>
              </Box>
            ))
          )}
        </Box>
      </Box>

      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={closeToast}
      />
    </>
  );
}
