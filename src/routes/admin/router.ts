import { adminMiddleware } from "../../middlewares/admin";

import { CollaboratorsGetRoute } from "./collaborators/get";
import { CollaboratorGetRoute } from "./collaborator/get";
import { CollaboratorPatchRoute } from "./collaborator/patch";

import express from "express";

const AdminRouter = express.Router();

AdminRouter.use(adminMiddleware);

AdminRouter.route("/collaborators").get(CollaboratorsGetRoute);
AdminRouter.route("/collaborator/:id")
	.get(CollaboratorGetRoute)
	.patch(CollaboratorPatchRoute);

export { AdminRouter };
