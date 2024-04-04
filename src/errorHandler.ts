import { NextFunction, Request, Response } from "express";

const errorHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (err) {
		console.log("Erro " + req.path + ": ", err);

		return res.status(500).json({
			error: {
				formErrors: ["Erro interno"],
				fieldErrors: {},
			},
		});
	}

	next();
};

export { errorHandler };
