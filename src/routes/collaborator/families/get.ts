import Family from "../../../database/models/Family";
import { FamiliesQueryFields } from "./fields";

import { Request, Response } from "express";

const FamiliesGetRoute = async (req: Request, res: Response) => {
  try {
    const reqData = FamiliesQueryFields.safeParse(req.query);

    if (!reqData.success) {
      return res.status(400).json({
        error: reqData.error.flatten(),
      });
    }

    const limit = reqData.data.limit;
    const page = reqData.data.page;
    const skip = page * limit;

    const families = await Family.find()
      .select(["-__v", "-password"])
      .limit(limit)
      .skip(skip);

    const totalFamiliesCount = await Family.estimatedDocumentCount();

    res.status(200).json({
      page: page,
      limit: limit,
      total: totalFamiliesCount,
      families: families,
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

export { FamiliesGetRoute };
