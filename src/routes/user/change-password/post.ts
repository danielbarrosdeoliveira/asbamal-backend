import { RequestWithUserDataType } from "../../../middlewares/types";
import { ChangePasswordFields } from "./fields";

import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

const ChangePasswordPostRoute = async (req: Request, res: Response) => {
	try {
		const reqData = ChangePasswordFields.safeParse(req.body);

		if (!reqData.success) {
			return res.status(400).json({
				error: reqData.error.flatten(),
			});
		}

		const reqWithType = req as RequestWithUserDataType;

		const passwordIsValid = await bcrypt.compare(
			reqData.data.old_password,
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

		if (reqData.data.old_password == reqData.data.password) {
			return res.status(400).json({
				error: {
					formErrors: [],
					fieldErrors: {
						password: ["A senha antiga e a nova não podem ser as mesmas"],
					},
				},
			});
		}

		if (reqData.data.password !== reqData.data.confirm_password) {
			return res.status(400).json({
				error: {
					formErrors: [],
					fieldErrors: {
						confirm_password: ["As senhas não coincidem"],
					},
				},
			});
		}

		reqWithType.userData.password = await bcrypt.hash(
			reqData.data.password,
			10
		);
		reqWithType.userData.last_pass_update = new Date();

		await reqWithType.userData.save();

		const payload = {
			id: reqWithType.userData.id,
			iat: Date.now() + 5000,
		};

		var token = jwt.sign(payload, process.env.JWT_SECRET as string, {
			expiresIn: 60 * 60 * 24, // expires in 24 hours
		});

		res.status(200).json({
			token: token,
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

export { ChangePasswordPostRoute };
