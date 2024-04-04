import Person from "../../../database/models/Person";
import { PersonParamFields } from "./fields";

import { Request, Response } from "express";

const PersonGetRoute = async (req: Request, res: Response) => {
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

		return res.status(200).json({
			person: personData,
		});
	} catch (err) {
		console.log("Erro " + req.path + ": ", err);

		return res.status(500).json({
			error: "Erro interno",
		});
	}
};

export { PersonGetRoute };
