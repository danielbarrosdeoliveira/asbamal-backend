import Collaborator from "../../database/models/Collaborator";
import { LoginFields } from "./fields";

import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const LoginPostRoute = async (req: Request, res: Response) => {
	try {
		const reqData = LoginFields.safeParse(req.body);

		if (!reqData.success) {
			return res.status(400).json({
				error: reqData.error.flatten(),
			});
		}

		const userData = await Collaborator.findOne({
			_id: reqData.data.username,
		});

		if (!userData || !userData.password) {
			return res.status(401).json({
				error: {
					formErrors: ["Usuário ou senha inválido"],
					fieldErrors: {},
				},
			});
		}

		const passwordIsValid = await bcrypt.compare(
			reqData.data.password,
			userData.password
		);

		if (!passwordIsValid) {
			return res.status(401).json({
				error: {
					formErrors: ["Usuário ou senha inválido"],
					fieldErrors: {},
				},
			});
		}

		if (["pending", "inactive"].includes(userData.type)) {
			return res.status(401).json({
				error: {
					formErrors: [],
					fieldErrors: {
						username: ["Usuário pendente de ativação"],
					},
				},
			});
		}

		const payload = {
			username: userData._id,
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

export { LoginPostRoute };
