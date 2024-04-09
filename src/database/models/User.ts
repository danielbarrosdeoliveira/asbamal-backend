import mongoose, { Document } from "mongoose";

export enum UserType {
  Admin = "admin",
  Collaborator = "collaborator",
  Person = "person",
  Pending = "peding",
}

export interface IUser extends Document {
  _id: string;
  password: string;
  type: UserType;
  last_pass_update: Date;
  email: string;
}

const userSchema = new mongoose.Schema<IUser>({
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
    required: true,
    enum: Object.values(UserType),
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
    validate: (email: string) => {
      const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
      return emailRegex.test(email);
    },
  },
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
