import Collaborator from "../../../database/models/Collaborator";
import { CollaboratorParamFields } from "./fields";

import { Request, Response } from "express";

const CollaboratorGetRoute = async (req: Request, res: Response) => {
	try {
		const reqParams = CollaboratorParamFields.safeParse(req.params);

		if (!reqParams.success) {
			return res.status(400).json({
				error: reqParams.error.flatten(),
			});
		}

		const userData = await Collaborator.findOne({
			_id: reqParams.data.id,
		}).select(["-__v", "-password"]);

		if (!userData) {
			return res.status(401).json({
				error: {
					formErrors: ["Colaborador não encontrado"],
					fieldErrors: {},
				},
			});
		}

		return res.status(200).json({
			user: userData.toObject({ virtuals: true }),
		});
	} catch (err) {
		console.log("Erro " + req.path + ": ", err);

		return res.status(500).json({
			error: "Erro interno",
		});
	}
};

export { CollaboratorGetRoute };
