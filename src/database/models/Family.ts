//@ts-nocheck
import mongoose from "mongoose";
import phoneParser from "telefone/parse";
import { isCPF } from "validation-br";

function limitArray(limit) {
  return function (value) {
    return value.length <= limit;
  };
}

const FamilySchema = new mongoose.Schema(
  {
    responsible: {
      type: String,
      required: true,
      unique: true,
      validate: (cpf) => !!isCPF(cpf),
    },
    address: {
      type: String,
      required: true,
    },
    address_number: {
      type: String,
      validate: (addressNumber) =>
        addressNumber === null || addressNumber.match(/^[0-9]+$/),
      default: null,
    },
    address_complement: {
      type: String,
      default: null,
    },
    city: {
      type: String,
      default: "Barra de São Miguel",
    },
    state: {
      type: String,
      default: "AL",
    },
    zipcode: {
      type: String,
      default: "57180000",
    },
    phones: {
      type: [
        {
          type: String,
          validate: (phone) => !!phoneParser(phone, { apenasCelular: true }),
        },
      ],
      validate: limitArray(3),
    },
    tags: {
      type: [
        {
          type: String,
        },
      ],
      validate: limitArray(3),
    },
  },
  {
    id: false,
    virtuals: {
      members: {
        ref: "Person",
        localField: "_id",
        foreignField: "family",
      },
    },
  }
);

FamilySchema.set("toObject", { virtuals: true, getters: true });
FamilySchema.set("toJSON", { virtuals: true, getters: true });

export default mongoose.model("Family", FamilySchema);
