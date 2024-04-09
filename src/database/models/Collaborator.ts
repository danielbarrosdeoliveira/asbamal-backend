import mongoose from "mongoose";
import User, { IUser, UserType } from "./User";

export interface ICollaborator extends IUser {}

const collaboratorSchema = new mongoose.Schema<ICollaborator>(
  {
    type: {
      type: String,
      default: UserType.Pending,
    },
  },
  {
    id: false,
    virtuals: {
      username: {
        get(this: ICollaborator): string {
          return this._id;
        },
        set(this: ICollaborator, username: string): void {
          this._id = username;
        },
      },
    },
  }
);

collaboratorSchema.set("toObject", { virtuals: true, getters: true });
collaboratorSchema.set("toJSON", { virtuals: true, getters: true });

const Collaborator = User.discriminator<ICollaborator>(
  "Collaborator",
  collaboratorSchema
);

export default Collaborator;
