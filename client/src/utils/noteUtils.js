export const notesLoader = async ({ params }) => {
  const query = `query Folder($folderId: String) {
                      folder(folderId: $folderId) {
                        id
                        name
                        notes {
                          id
                          content
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
