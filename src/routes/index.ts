import { authMiddleware } from "../middlewares/auth";
import { LoginPostRoute } from "./login/post";
import { RegisterPostRoute } from "./register/post";
import { CollaboratorRouter } from "./collaborator/router";
import { UserRouter } from "./user/router";
import { AdminRouter } from "./admin/router";

import express from "express";

const authRouter = express.Router();
const Router = express.Router();

Router.route("/login").post(LoginPostRoute);
Router.route("/register").post(RegisterPostRoute);

authRouter.use(authMiddleware);
authRouter.use("/collaborator", CollaboratorRouter);
authRouter.use("/user", UserRouter);
authRouter.use("/admin", AdminRouter);

Router.use(authRouter);

export { Router };
