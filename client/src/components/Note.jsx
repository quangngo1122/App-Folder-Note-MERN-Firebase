import React, { useEffect, useMemo, useState } from "react";
import {
  ContentState,
  convertFromHTML,
  convertToRaw,
  EditorState,
} from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import {
  useLoaderData,
  useLocation,
  useSubmit,
  useNavigate,
  useParams,
} from "react-router-dom";
import { debounce, Box, Typography, Divider, Chip } from "@mui/material";
import moment from "moment";
import { Edit as EditIcon } from "@mui/icons-material";

export default function Note() {
  const { note } = useLoaderData();
  const location = useLocation();
  const submit = useSubmit();
  const navigate = useNavigate();
  const { folderId } = useParams();

  // useEffect(() => {
  //   if (!note) {
  //     navigate(`/folders/${folderId}`, { replace: true });
  //     return;
  //   }
  // }, [note, navigate, folderId]);

  // if (!note) {
  //   return null;
  // }

  const [editorState, setEditorState] = useState(() => {
    return EditorState.createEmpty();
  });

  // const [rawHTML, setRawHTML] = useState(note.content);
  //   useEffect(() => {
  //     const blocksFromHTML = convertFromHTML(note.content);
  //     const state = ContentState.createFromBlockArray(
  //       blocksFromHTML.contentBlocks,
  //       blocksFromHTML.entityMap,
  //     );
  //     setEditorState(EditorState.createWithContent(state));
  //   }, [note.id]);

  //   useEffect(() => {
  //     debouncedMemorized(rawHTML, location.pathname, note);
  //   }, [rawHTML, location.pathname]);

  const [rawHTML, setRawHTML] = useState(() => {
    return note?.content || "";
  });

  const debouncedMemorized = useMemo(() => {
    return debounce((rawHTML, pathname, note) => {
      //cac bien su dung ben trong callback phai dat trong parameter
      if (rawHTML === note.content) {
        // neu gia tri content ko thay doi thi ko gui request cap nhat
        return;
      }
      submit(
        { ...note, content: rawHTML },
        {
          method: "post",
          action: pathname,
        },
      );
    }, 1000);
  }, []);

  useEffect(() => {
    if (!note) {
      navigate(`/folders/${folderId}`, { replace: true });
      return;
    }
  }, [note, navigate, folderId]);

  useEffect(() => {
    if (!note) return;
    const blocksFromHTML = convertFromHTML(note.content);
    const state = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap,
    );
    setEditorState(EditorState.createWithContent(state));
  }, [note?.id]);

  useEffect(() => {
    if (!note) return;
    debouncedMemorized(rawHTML, location.pathname, note);
  }, [rawHTML, location.pathname, debouncedMemorized, note]);

  useEffect(() => {
    if (!note) return;
    setRawHTML(note.content);
  }, [note?.content]);

  if (!note) {
    return null;
  }

  const handleOnChange = (e) => {
    setEditorState(e);
    setRawHTML(draftToHtml(convertToRaw(e.getCurrentContent())));
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "#fafafa",
      }}
    >
      {/* Editor Header */}
      <Box
        sx={{
          px: 3,
          py: 2,
          borderBottom: "1px solid #e0e0e0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#ffffff",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <EditIcon sx={{ color: "#667eea", fontSize: 24 }} />
          <Box>
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: 14,
                color: "#999",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Editing Note
            </Typography>
            <Typography
              sx={{
                fontSize: 12,
                color: "#bbb",
                mt: 0.5,
              }}
            >
              Last saved: {moment(note.updatedAt).format("MMM DD, HH:mm")}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Chip
            label={moment(note.updatedAt).fromNow()}
            variant="outlined"
            size="small"
            sx={{
              borderColor: "#e0e0e0",
              color: "#666",
              fontSize: 12,
            }}
          />
        </Box>
      </Box>

      {/* Editor */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          p: 3,
        }}
      >
        <Box
          sx={{
            background: "#ffffff",
            borderRadius: "12px",
            padding: 2.5,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
            border: "1px solid #e0e0e0",
            height: "100%",
            "& .rdw-editor-wrapper": {
              border: "none",
              borderRadius: "8px",
            },
            "& .rdw-editor-toolbar": {
              background: "#f8f9fa",
              borderBottom: "1px solid #e0e0e0",
              borderRadius: "6px 6px 0 0",
              padding: "8px",
              marginBottom: "8px",
            },
            "& .rdw-editor-main": {
              padding: "12px 8px",
              minHeight: "400px",
              fontSize: "16px",
              lineHeight: "1.6",
              fontFamily: "'Inter', sans-serif",
            },
            "& .rdwRte": {
              borderRadius: "8px",
            },
            "& .DraftEditor-root": {
              background: "white",
            },
          }}
        >
          <Editor
            editorState={editorState}
            onEditorStateChange={handleOnChange}
            placeholder="Start typing your note here..."
            toolbar={{
              options: [
                "inline",
                "blockType",
                "fontSize",
                "fontFamily",
                "list",
                "textAlign",
                "colorPicker",
                "link",
                "embedded",
                "emoji",
                "image",
                "remove",
                "history",
              ],
              inline: {
                inDropdown: false,
              },
              blockType: {
                inDropdown: true,
              },
              fontSize: {
                icon: "fontSize",
                options: [
                  8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96,
                ],
              },
              fontFamily: {
                options: [
                  "Arial",
                  "Georgia",
                  "Impact",
                  "Tahoma",
                  "Times New Roman",
                  "Verdana",
                ],
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
