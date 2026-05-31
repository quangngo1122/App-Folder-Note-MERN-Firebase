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
  // console.log(folder);
  const { noteId, folderId } = useParams(); // duong dan
  const [activeNoteId, setActiveNoteId] = useState(noteId);
  // const folder = { notes: [{ id: "1", content: "note 1" }] };
  const navigate = useNavigate();
  const submit = useSubmit();
  const { toast, showToast, closeToast } = useToast();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [deletedNoteIds, setDeletedNoteIds] = useState(new Set());

  const handleAddNewNote = () => {
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

      // Add to deleted notes set for local UI update
      setDeletedNoteIds((prev) => new Set([...prev, noteToDelete]));
      setOpenDeleteDialog(false);
      setNoteToDelete(null);

      // If the deleted note is currently active, navigate to the first remaining note or folder
      if (noteToDelete === activeNoteId) {
        const remainingNotes = folder.notes.filter(
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
    if (noteId) {
      setActiveNoteId(noteId);
      return;
    }
    if (folder?.notes?.[0]) {
      navigate(`note/${folder.notes[0].id}`);
      return;
    }
  }, [noteId, folder.notes]);
  return (
    <Grid container height="100%" wrap="nowrap">
      <Grid
        item
        // xs={4}
        size={4}
        sx={{
          width: "100%",
          maxWidth: 360,
          bgcolor: "#F0EBE3",
          height: "100%",
          overflowY: "auto",
          padding: "10px",
          textAlign: "left",
        }}
      >
        <List
          subheader={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography sx={{ fontWeight: "bold" }}>Notes</Typography>
              <Tooltip title="Add Note" onClick={handleAddNewNote}>
                <IconButton size="small">
                  <NoteAltOutlined />
                </IconButton>
              </Tooltip>
            </Box>
          }
        >
          {folder.notes
            .filter((note) => !deletedNoteIds.has(note.id))
            .map(({ id, content, updatedAt }) => {
              return (
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
                      mb: "5px",
                      backgroundColor:
                        id === activeNoteId ? "rgb(255 211 140)" : null,
                    }}
                  >
                    <CardContent
                      sx={{ "&:last-child": { pb: "10px" }, padding: "10px" }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <div
                            style={{ fontSize: 14, fontWeight: "bold" }}
                            dangerouslySetInnerHTML={{
                              __html: `${content.substring(0, 30) || "Empty"}`,
                            }}
                          />
                          <Typography sx={{ fontSize: "10px" }}>
                            {moment(updatedAt).format(
                              "MMMM Do YYYY, h:mm:ss a",
                            )}
                          </Typography>
                        </Box>
                        <Tooltip title="Delete Note">
                          <IconButton
                            size="small"
                            onClick={(e) => handleDeleteClick(e, id)}
                            sx={{ color: "error.main" }}
                          >
                            <DeleteOutline fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
        </List>
      </Grid>
      <Grid
        item
        //  xs={8}
        size={8}
        sx={{
          width: "100%",
        }}
      >
        <Outlet />
      </Grid>
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
      >
        <DialogTitle id="alert-dialog-title">Delete Note?</DialogTitle>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
