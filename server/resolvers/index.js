import fakeData from "../fakeData/index.js";
import { FolderModel } from "../models/index.js";

export const resolvers = {
  Query: {
    folders: async () => {
      const folders = await FolderModel.find();
      //   console.log(folders); // find --> Tim all doi tuong
      return folders;
      //   return fakeData.folders; //<-- parent
    },
    folder: async (parent, args) => {
      const folderId = args.folderId;
      const foundFolder = await FolderModel.findOne({ _id: folderId });
      // console.log(foundFolder); // findone --> tim 1 doi tuong

      return foundFolder;
      // return fakeData.folders.find((folder) => folder.id === folderId);
    },
    note: (parent, args) => {
      const noteId = args.noteId;
      return fakeData.notes.find((note) => note.id === noteId);
    },
  },
  Folder: {
    author: (parent, args, context, info) => {
      const authorId = parent.authorId;
      return fakeData.authors.find((author) => author.id === authorId);
      // return { id: "123", name: "quang" };
    },
    notes: (parent, args) => {
      return fakeData.notes.filter((note) => note.folderId === parent.id);
    },
  },
  Mutation: {
    addFolder: async (parent, args) => {
      const newFolder = new FolderModel({ ...args, authorId: "123" });
      //   console.log(newFolder);
      await newFolder.save();
      return newFolder;
    },
  },
};
