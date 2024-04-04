import { RequestWithUserDataType } from "./types";

import { NextFunction, Request, Response } from "express";

const adminMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if ((req as RequestWithUserDataType).userData.type !== "admin") {
		return res.status(403).json({
			error: "Não autorizado",
		});
	}

	next();
};

export { adminMiddleware };
