import mongoose from "mongoose";
import User, { UserDocument, UserType } from "./User";
import { isCPF, isPIS } from "validation-br";

export interface IPersonDocument extends UserDocument {
  name: string;
  motherName: string;
  fatherName: string;
  lastUpdate: Date;
  birthdate: Date;
  nis: string;
  family: mongoose.Schema.Types.ObjectId;
}

const personSchema = new mongoose.Schema<IPersonDocument>(
  {
    _id: {
      type: String,
      required: true,
      validate: isCPF,
    },
    name: {
      type: String,
      required: true,
    },
    motherName: {
      type: String,
      default: null,
      alias: "mother_name",
    },
    fatherName: {
      type: String,
      default: null,
      alias: "father_name",
    },
    birthdate: {
      type: Date,
      required: true,
    },
    nis: {
      type: String,
      validate: (pis: string) => pis === null || !!isPIS(pis),
      default: null,
      index: {
        unique: true,
        partialFilterExpression: { nis: { $type: "string" } },
      },
    },
    family: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Family",
      required: true,
    },
    lastUpdate: {
      type: Date,
      default: Date.now,
      alias: "last_update",
    },
    type: {
      type: String,
      default: UserType.Person,
      enum: Object.values(UserType),
    },
  },
  {
    id: false,
    virtuals: {
      cpf: {
        get(this: IPersonDocument): string {
          return this._id;
        },
        set(this: IPersonDocument, cpf: string): void {
          this._id = cpf;
        },
      },
      family_data: {
        ref: "Family",
        localField: "family",
        foreignField: "_id",
        justOne: true,
      },
    },
  }
);

personSchema.set("toObject", { virtuals: true, getters: true });
personSchema.set("toJSON", { virtuals: true, getters: true });

const Person = User.discriminator<IPersonDocument>("Person", personSchema);

export default Person;
