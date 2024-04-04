import Family from "../../../database/models/Family";
import { FamilyPatchFields, FamilyParamFields } from "./fields";

import { Request, Response } from "express";

const FamilyPatchRoute = async (req: Request, res: Response) => {
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
					formErrors: ["Familia não encontrada"],
					fieldErrors: {},
				},
			});
		}

		const reqData = FamilyPatchFields.safeParse(req.body);

		if (!reqData.success) {
			return res.status(400).json({
				error: reqData.error.flatten(),
			});
		}

		if (reqData.data.address) familyData.address = reqData.data.address;
		if (reqData.data.address_number)
			familyData.address_number = reqData.data.address_number;
		if (reqData.data.address_complement)
			familyData.address_complement = reqData.data.address_complement;
		if (reqData.data.city) familyData.city = reqData.data.city;
		if (reqData.data.state) familyData.state = reqData.data.state;
		if (reqData.data.zipcode) familyData.zipcode = reqData.data.zipcode;
		if (reqData.data.phones) familyData.phones = reqData.data.phones;
		if (reqData.data.tags) familyData.tags = reqData.data.tags;
		if (reqData.data.responsible)
			familyData.responsible = reqData.data.responsible;

		await familyData.save();

		res.status(200).json({
			family: familyData,
		});
	} catch (err) {
		console.log("Erro " + req.path + ": ", err);

		return res.status(500).json({
			error: "Erro interno",
		});
	}
};

export { FamilyPatchRoute };
