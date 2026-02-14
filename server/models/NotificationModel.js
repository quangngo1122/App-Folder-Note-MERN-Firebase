import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    content: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const notificationModel = mongoose.model("notification", notificationSchema);
export default notificationModel;
