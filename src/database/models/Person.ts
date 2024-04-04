//@ts-nocheck
import mongoose from "mongoose";
import { isCPF, isPIS } from "validation-br";

const PersonSchema = new mongoose.Schema(
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
		mother_name: {
			type: String,
			default: null,
		},
		father_name: {
			type: String,
			default: null,
		},
		birthdate: {
			type: Date,
			required: true,
		},
		nis: {
			type: String,
			validate: (pis) => pis === null || !!isPIS(pis),
			default: null,
			index: {
				unique: true,
				partialFilterExpression: { nis: { $type: "string" } },
			},
		},
		family: {
			type: String,
			default: null,
		},
		last_update: {
			type: Date,
			default: Date.now,
		},
		last_update_user: {
			type: String,
			default: null,
		},
	},
	{
		id: false,
		virtuals: {
			cpf: {
				get() {
					return this._id;
				},
				set(cpf) {
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

PersonSchema.set("toObject", { virtuals: true, getters: true });
PersonSchema.set("toJSON", { virtuals: true, getters: true });

export default mongoose.model("Person", PersonSchema);
