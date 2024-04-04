import Collaborator from "../../database/models/Collaborator";
import { RegisterFields } from "./fields";

import { Request, Response } from "express";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

const RegisterPostRoute = async (req: Request, res: Response) => {
	try {
		const reqData = RegisterFields.safeParse(req.body);

		if (!reqData.success) {
			return res.status(400).json({
				error: reqData.error.flatten(),
			});
		}

		var collaborator = new Collaborator();

		collaborator._id = reqData.data.username;
		collaborator.password = await bcrypt.hash(reqData.data.password, 10);
		collaborator.email = reqData.data.email;
		collaborator.type = "pending";

		await collaborator.save();

		res.status(202).send();
	} catch (err) {
		if (err instanceof mongoose.mongo.MongoServerError && err.code === 11000) {
			type errorsReduceType = Partial<{
				[Key in string]: string[];
			}>;

			const errorKeys = Object.keys(err?.keyValue);

			const errors = errorKeys.reduce<errorsReduceType>((acc, curr) => {
				const key = curr === "_id" ? "username" : curr;
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

export { RegisterPostRoute };
