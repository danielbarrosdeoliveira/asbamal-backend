import Person from "../../../database/models/Person";
import { PersonsQueryFields } from "./fields";

import { Request, Response } from "express";

const PersonsGetRoute = async (req: Request, res: Response) => {
	try {
		const reqData = PersonsQueryFields.safeParse(req.query);

		if (!reqData.success) {
			return res.status(400).json({
				error: reqData.error.flatten(),
			});
		}

		const limit = reqData.data.limit;
		const page = reqData.data.page;
		const skip = page * limit;

		const persons = await Person.find()
			.select(["-__v", "-password"])
			.limit(limit)
			.skip(skip);

		const totalPersonsCount = await Person.estimatedDocumentCount();

		res.status(200).json({
			page: page,
			limit: limit,
			total: totalPersonsCount,
			persons: persons,
		});
	} catch (err) {
		console.log("Erro " + req.path + ": ", err);

		return res.status(500).json({
			error: {
				formErrors: ["Erro interno"],
				fieldErrors: {},
			},
		});
	}
};

export { PersonsGetRoute };
