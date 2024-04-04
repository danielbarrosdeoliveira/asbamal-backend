import Collaborator from "../../../database/models/Collaborator";
import { CollaboratorsQueryFields } from "./fields";

import { Request, Response } from "express";

const CollaboratorsGetRoute = async (req: Request, res: Response) => {
	try {
		const reqData = CollaboratorsQueryFields.safeParse(req.query);

		if (!reqData.success) {
			return res.status(400).json({
				error: reqData.error.flatten(),
			});
		}

		const limit = reqData.data.limit;
		const page = reqData.data.page;
		const skip = page * limit;

		const collaborators = await Collaborator.find()
			.select(["-__v", "-password"])
			.limit(limit)
			.skip(skip);

		const totalCollaboratorsCount = await Collaborator.estimatedDocumentCount();

		res.status(200).json({
			page: page,
			limit: limit,
			total: totalCollaboratorsCount,
			collaborators: collaborators,
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

export { CollaboratorsGetRoute };
