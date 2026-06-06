import { NoteAltOutlined, DeleteOutline } from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogTitle,
  Grid,
  IconButton,
  List,
  Tooltip,
  Typography,
  Button,
  Divider,
  Badge,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  Link,
  Outlet,
  useLoaderData,
  useNavigate,
  useParams,
  useSubmit,
} from "react-router-dom";
import moment from "moment";
import { useToast } from "../hooks/useToast";
import Toast from "./Toast";
import { deleteNote } from "../utils/noteUtils";

export default function NoteList({}) {
  const { folder } = useLoaderData();
  const folderNotes = folder?.notes ?? [];
  const hasFolder = Boolean(folder);
  const { noteId, folderId } = useParams();
  const [activeNoteId, setActiveNoteId] = useState(noteId);
  const navigate = useNavigate();
  const submit = useSubmit();
  const { toast, showToast, closeToast } = useToast();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [deletedNoteIds, setDeletedNoteIds] = useState(new Set());

  const handleAddNewNote = () => {
    if (!folderId || !hasFolder) {
      showToast("Không có thư mục hợp lệ để tạo ghi chú.", "error");
      return;
    }

    try {
      submit(
        {
          content: "",
          folderId: folderId,
        },
        { method: "post", action: `/folders/${folderId}` },
      );
      showToast("Đã tạo thành công 1 ghi chú mới!", "success");
    } catch (error) {
      showToast("Error creating note", "error");
    }
  };

  const handleDeleteClick = (e, noteId) => {
    e.preventDefault();
    e.stopPropagation();
    setNoteToDelete(noteId);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!noteToDelete) return;

    try {
      const formData = new FormData();
      formData.append("id", noteToDelete);

      await deleteNote({
        params: {},
        request: {
          formData: () => Promise.resolve(formData),
        },
      });

      setDeletedNoteIds((prev) => new Set([...prev, noteToDelete]));
      setOpenDeleteDialog(false);
      setNoteToDelete(null);

      if (noteToDelete === activeNoteId) {
        const remainingNotes = folderNotes.filter(
          (note) => note.id !== noteToDelete,
        );
        if (remainingNotes.length > 0) {
          navigate(`/folders/${folderId}/note/${remainingNotes[0].id}`);
        } else {
          navigate(`/folders/${folderId}`);
        }
      }

      showToast("Đã xóa 1 ghi chú!", "success");
    } catch (error) {
      console.error("Error deleting note:", error);
      showToast("Error deleting note", "error");
    }
  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
    setNoteToDelete(null);
  };

  useEffect(() => {
    if (!hasFolder) {
      navigate("/", { replace: true });
      return;
    }

    if (noteId) {
      setActiveNoteId(noteId);
      return;
    }

    if (folderNotes[0]) {
      navigate(`note/${folderNotes[0].id}`);
      return;
    }
  }, [noteId, folderNotes, hasFolder, navigate]);

  if (!hasFolder) {
    return null;
  }

  const visibleNotes = folderNotes.filter(
    (note) => !deletedNoteIds.has(note.id),
  );

  return (
    <Grid container height="100%" wrap="nowrap">
      {/* Notes List Panel */}
      <Grid
        item
        size={4}
        sx={{
          width: "100%",
          maxWidth: 360,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRight: "1px solid #e0e0e0",
          background: "#ffffff",
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <NoteAltOutlined
              sx={{
                color: "#667eea",
                fontSize: 24,
              }}
            />
            <Box>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: 16,
                  color: "#1a1a1a",
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Notes
              </Typography>
              <Typography sx={{ fontSize: 12, color: "#999" }}>
                {visibleNotes.length}{" "}
                {visibleNotes.length === 1 ? "note" : "notes"}
              </Typography>
            </Box>
          </Box>
          <Tooltip title="Add New Note">
            <IconButton
              onClick={handleAddNewNote}
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                width: 36,
                height: 36,
                "&:hover": {
                  boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
                  transform: "scale(1.05)",
                },
                transition: "all 0.2s",
              }}
            >
              <NoteAltOutlined sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Notes List */}
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
          {visibleNotes.length === 0 ? (
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
              <NoteAltOutlined sx={{ fontSize: 48, opacity: 0.3 }} />
              <Typography sx={{ fontSize: 14, opacity: 0.7 }}>
                No notes yet
              </Typography>
            </Box>
          ) : (
            visibleNotes.map(({ id, content, updatedAt }) => (
              <Link
                key={id}
                to={`note/${id}`}
                style={{ textDecoration: "none" }}
                onClick={() => {
                  setActiveNoteId(id);
                }}
              >
                <Card
                  sx={{
                    background:
                      id === activeNoteId
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
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 1,
                      }}
                    >
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: id === activeNoteId ? "#ffffff" : "#1a1a1a",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            marginBottom: "6px",
                          }}
                          dangerouslySetInnerHTML={{
                            __html: `${content.substring(0, 30) || "Empty"}`,
                          }}
                        />
                        <Typography
                          sx={{
                            fontSize: "12px",
                            color:
                              id === activeNoteId
                                ? "rgba(255, 255, 255, 0.8)"
                                : "#999",
                          }}
                        >
                          {moment(updatedAt).format("MMM DD, HH:mm")}
                        </Typography>
                      </Box>
                      <Tooltip title="Delete Note">
                        <IconButton
                          size="small"
                          onClick={(e) => handleDeleteClick(e, id)}
                          sx={{
                            color:
                              id === activeNoteId
                                ? "rgba(255, 255, 255, 0.7)"
                                : "#e74c3c",
                            opacity: 0,
                            transition: "opacity 0.2s",
                            "&:hover": {
                              background:
                                id === activeNoteId
                                  ? "rgba(255, 255, 255, 0.2)"
                                  : "rgba(231, 76, 60, 0.1)",
                            },
                            // Show on hover of parent
                            ...(id === activeNoteId && { opacity: 1 }),
                          }}
                        >
                          <DeleteOutline sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </Box>
      </Grid>

      {/* Editor Panel */}
      <Grid
        item
        size={8}
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#fafafa",
        }}
      >
        <Outlet />
      </Grid>

      {/* Toast & Dialogs */}
      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={closeToast}
      />
      <Dialog
        open={openDeleteDialog}
        onClose={handleCancelDelete}
        aria-labelledby="alert-dialog-title"
        PaperProps={{
          sx: {
            borderRadius: "12px",
          },
        }}
      >
        <DialogTitle id="alert-dialog-title" sx={{ fontWeight: 600 }}>
          Delete this note?
        </DialogTitle>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={handleCancelDelete}
            variant="outlined"
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            autoFocus
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
