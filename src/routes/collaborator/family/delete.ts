import Family from "../../../database/models/Family";
import Person from "../../../database/models/Person";
import { FamilyParamFields } from "./fields";

import { Request, Response } from "express";

const FamilyDeleteRoute = async (req: Request, res: Response) => {
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

		await Person.updateMany({ family: familyData._id }, { family: null });
		await familyData.deleteOne();

		return res.status(202).send();
	} catch (err) {
		console.log("Erro " + req.path + ": ", err);

		return res.status(500).json({
			error: "Erro interno",
		});
	}
};

export { FamilyDeleteRoute };
