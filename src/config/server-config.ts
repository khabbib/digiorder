import * as dotenv from "dotenv";
import fs from "fs";
dotenv.config();

const serverName = "Association";
const hostName = "0.0.0.0";
const port = 4000;
const SECRET_KEY = fs
	.readFileSync("./secret_key/jwt_secret_key.key", "utf-8")
	.trim();

export interface ServerConfig {
	port: number;
	hostName: string;
}

export { serverName, hostName, port, SECRET_KEY };
