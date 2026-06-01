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
import { CreateNewFolderOutlined } from "@mui/icons-material";
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
    // setOpen(true);
    setSearchParam({ popup: "add-folder" });
  };
  const handleNewFolderNameChange = (e) => {
    setNewFolderName(e.target.value);
  };
  const handleClose = () => {
    // setOpen(false);
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
      console.log({ addFolder });
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
      <Tooltip title="Add Folder" onClick={handleOpenPopup}>
        <IconButton size="small">
          <CreateNewFolderOutlined sx={{ color: "white" }} />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>New Folder</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            id="name"
            margin="dense"
            label="Folder Name"
            fullWidth
            size="small"
            variant="standard"
            sx={{ width: "400px" }}
            autoComplete="off"
            value={newFolderName}
            onChange={handleNewFolderNameChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddNewFolder}>OK</Button>
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
