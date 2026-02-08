export default {
  authors: [
    { id: 123, name: "Quang" },
    {
      id: 999,
      name: "hien",
    },
  ],
  folders: [
    {
      id: "1",
      name: "Home",
      createAt: "2025-11-18T03:42:13Z",
      authorId: 123,
    },
    {
      id: "2",
      name: "New Folder",
      createAt: "2025-10-18T03:42:13Z",
      authorId: 999,
    },
    {
      id: "3",
      name: "Work",
      createAt: "2025-9-18T03:42:13Z",
      authorId: 123,
    },
  ],
  notes: [
    {
      id: "123",
      content: "<p>Go to 1</p>",
      folderId: "1",
    },
    {
      id: "234",
      content: "<p>Go to 2</p>",
      folderId: "2",
    },
    {
      id: "123",
      content: "<p>Go to 3</p>",
      folderId: "2",
    },
  ],
};
