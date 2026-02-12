import { graphQLRequest } from "./request";

export const notesLoader = async ({ params }) => {
  const query = `query Folder($folderId: String!) {
                      folder(folderId: $folderId) {
                        id
                        name
                        notes {
                          id
                          content
                          updatedAt
                        }
                      }

                    }
                 `;
  const data = await graphQLRequest({
    query,
    variables: {
      folderId: params.folderId,
    },
  });

  return data;
};

export const noteLoader = async ({ params }) => {
  const query = `query Note($noteId: String) {
                    note(noteId: $noteId) {
                      content
                      id
                    }
                  }                  
                 `;
  const data = await graphQLRequest({
    query,
    variables: {
      noteId: params.noteId,
    },
  });
  // const res = await fetch("http://localhost:4000/graphql", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Accept: "application/json",
  //   },
  //   body: JSON.stringify({
  //     query,
  //     variables: {
  //       noteId: params.noteId,
  //     },
  //   }),
  // });
  // const { data } = await res.json();

  // console.log({ data });
  return data;
};

export const addNewNote = async ({ params, request }) => {
  const formDataObj = {};
  const newNote = await request.formData();
  newNote.forEach((value, key) => (formDataObj[key] = value));
  console.log({ newNote, formDataObj });

  const query = `mutation Mutation($content: String!, $folderId: ID!) {
                    addNote(content: $content, folderId: $folderId) {
                    id  
                    content
                    }
                  }`;
  const { addNote } = await graphQLRequest({ query, variables: formDataObj });
  console.log(addNote);

  return addNote;
};

export const updateNote = async ({ params, request }) => {
  const updatedNote = await request.formData();
  const formDataObj = {};
  updatedNote.forEach((value, key) => (formDataObj[key] = value));
  // console.log({ newNote, formDataObj });

  const query = `mutation Mutation($id: String!, $content: String!) {
                  updateNote(id: $id, content: $content) {
                    content
                    id
                  }
                }`;
  const { updateNote } = await graphQLRequest({
    query,
    variables: formDataObj,
  });
  // console.log({ updateNote });

  return updateNote;
};
