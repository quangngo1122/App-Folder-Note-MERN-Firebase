import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import React, { useEffect } from "react";
import { Edit } from "@mui/icons-material";
import { updateFolder } from "../utils/folderUtils";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "../hooks/useToast";
import Toast from "./Toast";

export default function EditFolder({ folder, onUpdate, folders = [] }) {
  const [folderName, setFolderName] = useState(folder.name);
  const [open, setOpen] = useState(false);
  const [searchParam, setSearchParam] = useSearchParams();
  const { toast, showToast, closeToast } = useToast();

  const popupName = searchParam.get("popup");
  const navigate = useNavigate();

  const handleOpenPopup = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSearchParam({ popup: `edit-folder-${folder.id}` });
  };

  const handleFolderNameChange = (e) => {
    setFolderName(e.target.value);
  };

  const handleClose = () => {
    setFolderName(folder.name);
    navigate(-1);
  };

  const handleUpdateFolder = async () => {
    const normalizedName = folderName?.trim();
    if (!normalizedName) {
      showToast("Vui lòng nhập tên folder", "error");
      return;
    }

    const nameExists = folders.some(
      (f) =>
        f.id !== folder.id &&
        f.name?.toLowerCase() === normalizedName.toLowerCase(),
    );
    if (nameExists) {
      showToast("Folder đã tồn tại", "error");
      return;
    }

    try {
      const { updateFolder: updatedFolder } = await updateFolder({
        id: folder.id,
        name: normalizedName,
      });
      showToast(`Folder renamed to "${normalizedName}"!`, "success");
      if (onUpdate) onUpdate();
      handleClose();
    } catch (error) {
      showToast("Error updating folder", "error");
    }
  };

  useEffect(() => {
    if (popupName === `edit-folder-${folder.id}`) {
      setOpen(true);
      return;
    }
    setOpen(false);
  }, [popupName, folder.id]);

  return (
    <div>
      <Tooltip title="Edit Folder">
        <IconButton
          size="small"
          onClick={handleOpenPopup}
          sx={{
            "&:hover": {
              background: "rgba(102, 126, 234, 0.1)",
            },
          }}
        >
          <Edit sx={{ fontSize: 16, color: "#667eea" }} />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: "12px",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, fontSize: 18 }}>
          Rename Folder
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            autoFocus
            id="name"
            label="Folder Name"
            fullWidth
            size="small"
            variant="outlined"
            sx={{
              width: "400px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                "&.Mui-focused fieldset": {
                  borderColor: "#667eea",
                },
              },
            }}
            autoComplete="off"
            value={folderName}
            onChange={handleFolderNameChange}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleUpdateFolder();
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={handleClose}
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
            onClick={handleUpdateFolder}
            variant="contained"
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 500,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={closeToast}
      />
    </div>
  );
}
