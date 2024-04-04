import { ChangeEmailPostRoute } from "./change-email/post";
import { ChangePasswordPostRoute } from "./change-password/post";
import { UserInfoGetRoute } from "./info/get";

import express from "express";

const UserRouter = express.Router();

UserRouter.route("/change-email").post(ChangeEmailPostRoute);
UserRouter.route("/change-password").post(ChangePasswordPostRoute);
UserRouter.route("/info").get(UserInfoGetRoute);

export { UserRouter };
