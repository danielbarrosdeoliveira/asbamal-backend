import { Request } from "express";
import { Document } from "mongoose";

export type JwtDataType = {
	username: string;
	iat: number;
	exp: number;
};

export type UserDataObjType = {
	_id: string;
	username: string;
	password: string;
	email: string;
	type: string;
	last_pass_update: Date;
};

export type UserDataType = Document<unknown, {}, UserDataObjType> &
	UserDataObjType;

export interface RequestWithUserDataType extends Request {
	userData: UserDataType;
}
