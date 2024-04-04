import { RequestWithUserDataType } from "../../../middlewares/types";

import { Request, Response } from "express";

const UserInfoGetRoute = async (req: Request, res: Response) => {
	try {
		const reqWithType = req as RequestWithUserDataType;

		const userToReturn: Partial<typeof reqWithType.userData> =
			reqWithType.userData.toObject({
				virtuals: true,
			});

		delete userToReturn?._id;
		delete userToReturn?.password;
		delete userToReturn?.__v;

		res.status(200).json({
			user: userToReturn,
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

export { UserInfoGetRoute };
