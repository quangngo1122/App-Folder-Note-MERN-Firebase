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
import { debounce } from "@mui/material";
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
    <Editor
      editorState={editorState}
      onEditorStateChange={handleOnChange}
      placeholder="write something"
    />
  );
}
