import { CollaboratorFields, CollaboratorParamFields } from "./fields";
import { RequestWithUserDataType } from "../../../middlewares/types";
import Collaborator from "../../../database/models/Collaborator";

import { Request, Response } from "express";
import bcrypt from "bcrypt";

const CollaboratorPatchRoute = async (req: Request, res: Response) => {
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

		const reqData = CollaboratorFields.safeParse(req.body);

		if (!reqData.success) {
			return res.status(400).json({
				error: reqData.error.flatten(),
			});
		}

		const reqWithType = req as RequestWithUserDataType;

		console.log(reqWithType.userData);

		if (reqParams.data.id === reqWithType.userData._id.toString()) {
			return res.status(401).json({
				error: {
					formErrors: ["Você não pode alterar seu próprio usuário por aqui"],
					fieldErrors: {},
				},
			});
		}

		if (reqData.data.email || reqData.data.password) {
			if (!reqData.data.my_password) {
				return res.status(401).json({
					error: {
						formErrors: [],
						fieldErrors: {
							my_password: ["Senha inválida"],
						},
					},
				});
			}

			const passwordIsValid = await bcrypt.compare(
				reqData.data.my_password as string,
				reqWithType.userData.password
			);

			if (!passwordIsValid) {
				return res.status(401).json({
					error: {
						formErrors: [],
						fieldErrors: {
							my_password: ["Senha inválida"],
						},
					},
				});
			}
		}

		if (reqData.data.password) {
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

			userData.password = await bcrypt.hash(reqData.data.password, 10);
			userData.last_pass_update = new Date();
		}

		if (reqData.data.email) userData.email = reqData.data.email;
		if (reqData.data.type) userData.type = reqData.data.type;

		await userData.save();

		res.status(200).json({
			user: userData,
		});
	} catch (err) {
		console.log("Erro " + req.path + ": ", err);

		return res.status(500).json({
			error: "Erro interno",
		});
	}
};

export { CollaboratorPatchRoute };
