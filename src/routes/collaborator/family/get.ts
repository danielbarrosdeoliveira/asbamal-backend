import Family from "../../../database/models/Family";
import { FamilyParamFields } from "./fields";

import { Request, Response } from "express";

const FamilyGetRoute = async (req: Request, res: Response) => {
	try {
		const reqParams = FamilyParamFields.safeParse(req.params);

		if (!reqParams.success) {
			return res.status(400).json({
				error: reqParams.error.flatten(),
			});
		}

		const familyData = await Family.findOne({
			_id: reqParams.data.id,
		}).select(["-__v", "-password"]);

		if (!familyData) {
			return res.status(401).json({
				error: {
					formErrors: ["Família não encontrada"],
					fieldErrors: {},
				},
			});
		}

		return res.status(200).json({
			family: familyData,
		});
	} catch (err) {
		console.log("Erro " + req.path + ": ", err);

		return res.status(500).json({
			error: "Erro interno",
		});
	}
};

export { FamilyGetRoute };
