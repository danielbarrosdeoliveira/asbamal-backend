import { RequestWithUserDataType } from "../../../middlewares/types";
import { ChangeEmailFields } from "./fields";

import { Request, Response } from "express";
import bcrypt from "bcrypt";

const ChangeEmailPostRoute = async (req: Request, res: Response) => {
	try {
		const reqData = ChangeEmailFields.safeParse(req.body);

		if (!reqData.success) {
			return res.status(400).json({
				error: reqData.error.flatten(),
			});
		}

		const reqWithType = req as RequestWithUserDataType;

		const passwordIsValid = await bcrypt.compare(
			reqData.data.password,
			reqWithType.userData.password
		);

		if (!passwordIsValid) {
			return res.status(401).json({
				error: {
					formErrors: [],
					fieldErrors: {
						old_password: ["Senha inválida"],
					},
				},
			});
		}

		reqWithType.userData.email = reqData.data.email;
		await reqWithType.userData.save();

		res.status(202).send();
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

export { ChangeEmailPostRoute };
