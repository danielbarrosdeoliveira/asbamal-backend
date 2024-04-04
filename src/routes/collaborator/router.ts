import { FamiliesGetRoute } from "./families/get";
import { FamilyGetRoute } from "./family/get";
import { FamilyPatchRoute } from "./family/patch";
import { FamilyDeleteRoute } from "./family/delete";

import { PersonsGetRoute } from "./persons/get";
import { PersonGetRoute } from "./person/get";
import { PersonPatchRoute } from "./person/patch";
import { PersonPutRoute } from "./person/put";

import express from "express";

const CollaboratorRouter = express.Router();

CollaboratorRouter.route("/families").get(FamiliesGetRoute);
CollaboratorRouter.route("/family/:id")
	.get(FamilyGetRoute)
	.patch(FamilyPatchRoute)
	.delete(FamilyDeleteRoute);

CollaboratorRouter.route("/persons").get(PersonsGetRoute);
CollaboratorRouter.route("/person").put(PersonPutRoute);
CollaboratorRouter.route("/person/:id")
	.get(PersonGetRoute)
	.patch(PersonPatchRoute);

export { CollaboratorRouter };
