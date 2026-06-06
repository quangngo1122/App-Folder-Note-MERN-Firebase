import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Tooltip,
  Box,
} from "@mui/material";
import React, { useEffect } from "react";
import { CreateNewFolderOutlined, FolderOutlined } from "@mui/icons-material";
import { addNewFolder } from "../utils/folderUtils";
import { useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "../hooks/useToast";
import Toast from "./Toast";

export default function NewFolder({ folders = [], onUpdate }) {
  const [newFolderName, setNewFolderName] = useState("");
  const [open, setOpen] = useState(false);
  const [searchParam, setSearchParam] = useSearchParams();
  const { toast, showToast, closeToast } = useToast();

  const popupName = searchParam.get("popup");
  const navigate = useNavigate();

  const handleOpenPopup = () => {
    setSearchParam({ popup: "add-folder" });
  };

  const handleNewFolderNameChange = (e) => {
    setNewFolderName(e.target.value);
  };

  const handleClose = () => {
    setNewFolderName("");
    navigate(-1);
  };

  const handleAddNewFolder = async () => {
    const normalizedName = newFolderName?.trim();
    if (!normalizedName) {
      showToast("Vui lòng nhập tên folder", "error");
      return;
    }

    const nameExists = folders.some(
      (folder) => folder.name?.toLowerCase() === normalizedName.toLowerCase(),
    );
    if (nameExists) {
      showToast("Folder đã tồn tại", "error");
      return;
    }

    try {
      const { addFolder } = await addNewFolder({ name: normalizedName });
      showToast(
        `Folder "${normalizedName}" đã được tạo thành công!`,
        "success",
      );
      if (onUpdate) onUpdate();
      handleClose();
    } catch (error) {
      showToast("Error creating folder", "error");
    }
  };

  useEffect(() => {
    if (popupName === "add-folder") {
      setOpen(true);
      return;
    }
    setOpen(false);
  }, [popupName]);

  return (
    <div>
      <Tooltip title="Add New Folder">
        <IconButton
          size="small"
          onClick={handleOpenPopup}
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            width: 32,
            height: 32,
            "&:hover": {
              boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
              transform: "scale(1.05)",
            },
            transition: "all 0.2s",
          }}
        >
          <CreateNewFolderOutlined sx={{ fontSize: 18 }} />
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
        <DialogTitle
          sx={{
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 1,
            fontSize: 18,
          }}
        >
          <FolderOutlined sx={{ color: "#667eea" }} />
          Create New Folder
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
            value={newFolderName}
            onChange={handleNewFolderNameChange}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleAddNewFolder();
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
            onClick={handleAddNewFolder}
            variant="contained"
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 500,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            Create
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
