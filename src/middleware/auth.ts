import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import fs from "fs";

const SECRET_KEY = fs
	.readFileSync("./secret_key/jwt_secret_key.key", "utf-8")
	.trim();

export interface CustomRequest extends Request {
	token: string | JwtPayload;
}

export const verifyToken =(action: string | null) => (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const token = req.headers["authorization"];
	if (!token) {
		return res.status(403).send("A token is required for authentication");
	}

	// Remove the "Bearer " prefix
	const cleanToken = token.replace("Bearer ", "").trim();

	try {
		const decoded = jwt.verify(cleanToken, SECRET_KEY) as JwtPayload;
		const userPermission = decoded.permission;
		const isSamePersonal =  action === "delete_personal" && req.params.id === decoded.userId;
		if(isSamePersonal) {
			return res.status(403).send("This action is not performable from here");
		}
		if(action !== null) {
			if(!checkPermission(action, userPermission)) {
				return res.status(403).send("Permission denied to perform this action");
			} 
		}
		(req as CustomRequest).token = decoded;
	} catch (err) {
		return res.status(401).send("Invalid Token");
	}
	next();
};


function checkPermission(action: string, permission: number) : boolean {
	console.log({action}, {permission})
	switch (action) {
		case "add_user":
		case "update_user":
		case "delete_user":
			return permission === 3 || permission === 2 ? true : false;
		case "add_personal":
		case "update_personal":
		case "delete_personal":
			return permission === 3 ? true : false;
		default:
			return false;
	}
}