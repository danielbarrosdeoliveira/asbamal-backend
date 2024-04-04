//@ts-nocheck
import mongoose from "mongoose";

const CollaboratorSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "pending",
    },
    last_pass_update: {
      type: Date,
      default: Date.now,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: true,
      validate: (email) => {
        const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        return emailRegex.test(email);
      },
    },
  },
  {
    id: false,
    virtuals: {
      username: {
        get() {
          return this._id;
        },
        set(username) {
          this._id = username;
        },
      },
    },
  }
);

CollaboratorSchema.set("toObject", { virtuals: true, getters: true });
CollaboratorSchema.set("toJSON", { virtuals: true, getters: true });

export default mongoose.model("Collaborator", CollaboratorSchema);
