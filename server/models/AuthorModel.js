import mongoose from "mongoose";

const authorSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  {
    // auto createdAt - updatedAt
    timestamps: true,
  },
);

const AuthorModel = mongoose.model("author", authorSchema);
export default AuthorModel;
