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

export default function EditFolder({ folder, onUpdate }) {
  const [folderName, setFolderName] = useState(folder.name);
  const [open, setOpen] = useState(false);
  const [searchParam, setSearchParam] = useSearchParams();

  const popupName = searchParam.get("popup");
  const navigate = useNavigate();

  const handleOpenPopup = () => {
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
    const { updateFolder: updatedFolder } = await updateFolder({
      id: folder.id,
      name: folderName,
    });
    console.log({ updatedFolder });
    onUpdate(); // Callback to refresh folders
    handleClose();
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
      <Tooltip title="Edit Folder" onClick={handleOpenPopup}>
        <IconButton size="small">
          <Edit sx={{ fontSize: 16 }} />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Folder</DialogTitle>
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
            value={folderName}
            onChange={handleFolderNameChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleUpdateFolder}>OK</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
