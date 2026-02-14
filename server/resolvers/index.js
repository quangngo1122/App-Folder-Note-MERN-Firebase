// import fakeData from "../fakeData/index.js";
import { AuthorModel, FolderModel, NoteModel } from "../models/index.js";
import { GraphQLScalarType, subscribe } from "graphql";
import notificationModel from "../models/NotificationModel.js";
import { PubSub } from "graphql-subscriptions";
const pubsub = new PubSub();

export const resolvers = {
  Date: new GraphQLScalarType({
    name: "Date",
    parseValue(value) {
      return new Date(value);
    },
    serialize(value) {
      return value.toISOString();
    },
  }),
  Query: {
    folders: async (parent, args, context) => {
      const folders = await FolderModel.find({ authorId: context.uid }).sort({
        updatedAt: "desc",
      });
      //   console.log({ context,folders }); // find --> Tim all doi tuong
      return folders;
      //   return fakeData.folders; //<-- parent
    },
    folder: async (parent, args) => {
      const folderId = args.folderId;
      const foundFolder = await FolderModel.findOne({ _id: folderId }); // findone --> tim 1 doi tuong
      // return fakeData.folders.find((folder) => folder.id === folderId);
      return foundFolder;
    },
    note: async (parent, args) => {
      const noteId = args.noteId;
      const note = await NoteModel.findById(noteId);
      return note;
      // return fakeData.notes.find((note) => note.id === noteId);
    },
  },
  Folder: {
    author: async (parent, args, context, info) => {
      const authorId = parent.authorId;
      const author = await AuthorModel.findOne({
        uid: authorId,
      });
      return author;
      // return fakeData.authors.find((author) => author.id === authorId);
    },
    notes: async (parent, args) => {
      const notes = await NoteModel.find({
        folderId: parent.id,
      }).sort({
        updatedAt: "desc",
      });
      return notes;
      // return fakeData.notes.filter((note) => note.folderId === parent.id);
    },
  },
  Mutation: {
    addFolder: async (parent, args, context) => {
      const newFolder = new FolderModel({ ...args, authorId: context.uid });
      //   console.log(newFolder);
      pubsub.publish("FOLDER_CREATED", {
        folderCreated: {
          message: "A New Folder Created",
        },
      });
      await newFolder.save();
      return newFolder;
    },
    register: async (parent, args) => {
      const foundUser = await AuthorModel.findOne({ uid: args.uid });
      if (!foundUser) {
        const newUser = new AuthorModel(args);
        await newUser.save();
        return newUser;
      }
      return foundUser;
    },
    addNote: async (parent, args) => {
      const newNote = new NoteModel(args);
      await newNote.save();
      return newNote;
    },
    updateNote: async (parent, args) => {
      const noteId = args.id;
      const note = await NoteModel.findByIdAndUpdate(noteId, args);
      return note;
    },
    pushNotification: async (parent, args) => {
      const newNotification = new notificationModel(args);
      pubsub.publish("PUSH_NOTIFICATION", {
        notification: {
          message: args.content,
        },
      });
      await newNotification.save();
      return { message: "SUCCESS" };
    },
  },
  Subscription: {
    folderCreated: {
      subscribe: () => pubsub.asyncIterableIterator(["FOLDER_CREATED"]),
    },
    notification: {
      subscribe: () => pubsub.asyncIterableIterator(["PUSH_NOTIFICATION"]),
    },
  },
};
