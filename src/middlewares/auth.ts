import Collaborator from "../database/models/Collaborator";
import { JwtDataType, RequestWithUserDataType, UserDataType } from "./types";

import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const authMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	var token = req.headers.authorization?.match(/Bearer (.*)/)?.[1];

	if (token) {
		try {
			const jwtData = jwt.verify(
				token,
				process.env.JWT_SECRET as string
			) as JwtDataType;

			if (!jwtData) {
				return res.status(401).json({
					error: "Não autenticado",
				});
			}

			const userData = await Collaborator.findOne({
				_id: jwtData.username,
			});

			if (!userData) {
				return res.status(401).json({
					error: "Não autenticado",
				});
			}

			if (userData.last_pass_update > new Date(jwtData.iat * 1000)) {
				return res.status(401).json({
					error: "Sessão expirada, entre novamente",
				});
			}

			if (["pending", "inactive"].includes(userData.type)) {
				return res.status(401).json({
					error: "Sessão expirada, entre novamente",
				});
			}

			(req as RequestWithUserDataType).userData = userData as UserDataType;

			next();
		} catch (err) {
			return res.status(401).json({
				error: "Não autenticado",
			});
		}
	} else {
		return res.status(401).json({
			error: "Não autenticado",
		});
	}
};

export { authMiddleware };
