import mongoose from "mongoose";
import Family from "../../../database/models/Family";
import Person from "../../../database/models/Person";
import { FamilyFields } from "../family/fields";
import { PersonPatchFields, PersonParamFields } from "./fields";

import { Request, Response } from "express";

const PersonPatchRoute = async (req: Request, res: Response) => {
	try {
		const reqParams = PersonParamFields.safeParse(req.params);

		if (!reqParams.success) {
			return res.status(400).json({
				error: reqParams.error.flatten(),
			});
		}

		const personData = await Person.findOne({
			_id: reqParams.data.id,
		}).select(["-__v", "-password"]);

		if (!personData) {
			return res.status(401).json({
				error: {
					formErrors: ["Pessoa não encontrada"],
					fieldErrors: {},
				},
			});
		}

		const reqData = PersonPatchFields.safeParse(req.body);

		if (!reqData.success) {
			return res.status(400).json({
				error: reqData.error.flatten(),
			});
		}

		if (reqData.data.cpf) personData.cpf = reqData.data.cpf;
		if (reqData.data.name) personData.name = reqData.data.name;
		if (reqData.data.mother_name)
			personData.mother_name = reqData.data.mother_name;
		if (reqData.data.father_name)
			personData.father_name = reqData.data.father_name;
		if (reqData.data.birthdate) personData.birthdate = reqData.data.birthdate;
		if (reqData.data.nis) personData.nis = reqData.data.nis;

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
			newFamily.responsible = personData._id;

			try {
				const familyData = await newFamily.save();

				personData.family = familyData._id;
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
			if (reqData.data.family && personData.family !== reqData.data.family)
				personData.family = reqData.data.family;
		}

		await personData.save();

		res.status(200).json({
			person: personData,
		});
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

export { PersonPatchRoute };
