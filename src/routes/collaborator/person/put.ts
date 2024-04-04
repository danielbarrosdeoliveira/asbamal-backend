import Family from "../../../database/models/Family";
import Person from "../../../database/models/Person";
import { FamilyFields } from "../family/fields";
import { PersonPutFields } from "./fields";

import { Request, Response } from "express";
import mongoose from "mongoose";

const PersonPutRoute = async (req: Request, res: Response) => {
	try {
		const reqData = PersonPutFields.safeParse(req.body);

		if (!reqData.success) {
			return res.status(400).json({
				error: reqData.error.flatten(),
			});
		}

		var person = new Person();

		person.cpf = reqData.data.cpf;
		person.name = reqData.data.name;
		person.birthdate = reqData.data.birthdate;
		if (reqData.data.mother_name) person.mother_name = reqData.data.mother_name;
		if (reqData.data.father_name) person.father_name = reqData.data.father_name;
		if (reqData.data.nis) person.nis = reqData.data.nis;

		if (
			typeof reqData.data.family === "object" &&
			reqData.data.family !== null
		) {
			const newFamilyData = FamilyFields.safeParse(reqData.data.family);

			if (!newFamilyData.success) {
				return res.status(400).json({
					error: newFamilyData.error.flatten(),
				});
			}

			var newFamily = new Family();

			newFamily.responsible = reqData.data.cpf;
			newFamily.address = newFamilyData.data.address;
			if (newFamilyData.data.address_number)
				newFamily.address_number = newFamilyData.data.address_number;
			if (newFamilyData.data.address_complement)
				newFamily.address_complement = newFamilyData.data.address_complement;
			newFamily.city = newFamilyData.data.city;
			newFamily.state = newFamilyData.data.state;
			newFamily.zipcode = newFamilyData.data.zipcode;
			newFamily.phones = newFamilyData.data.phones;
			newFamily.tags = newFamilyData.data.tags;

			try {
				const familyData = await newFamily.save();

				person.family = familyData.id.toString();
			} catch (err) {
				if (
					err instanceof mongoose.mongo.MongoServerError &&
					err.code === 11000
				) {
					type errorsReduceType = Partial<{
						[Key in string]: string[];
					}>;

					const errorKeys = Object.keys(err?.keyValue);

					const errors = errorKeys.reduce<errorsReduceType>((acc, curr) => {
						const key = curr === "_id" ? "cpf" : curr;
						acc["family." + key] = ["Já existe"];
						return acc;
					}, {});

					if (errorKeys.length > 0) {
						return res.status(400).json({
							error: {
								formErrors: [],
								fieldErrors: errors,
							},
						});
					}
				}

				console.log("Erro " + req.path + ": ", err);

				return res.status(500).json({
					error: "Erro interno",
				});
			}
		} else {
			if (reqData.data.family) person.family = reqData.data.family;
		}

		await person.save();

		res.status(202).send();
	} catch (err) {
		if (err instanceof mongoose.mongo.MongoServerError && err.code === 11000) {
			type errorsReduceType = Partial<{
				[Key in string]: string[];
			}>;

			const errorKeys = Object.keys(err?.keyValue);

			const errors = errorKeys.reduce<errorsReduceType>((acc, curr) => {
				const key = curr === "_id" ? "cpf" : curr;
				acc[key] = ["Já existe"];
				return acc;
			}, {});

			if (errorKeys.length > 0) {
				return res.status(400).json({
					error: {
						formErrors: [],
						fieldErrors: errors,
					},
				});
			}
		}

		console.log("Erro " + req.path + ": ", err);

		return res.status(500).json({
			error: "Erro interno",
		});
	}
};

export { PersonPutRoute };
