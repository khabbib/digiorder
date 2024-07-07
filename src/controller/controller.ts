import { Request, Response } from "express";
import nodemailer, { SentMessageInfo } from "nodemailer";
import { Client } from "pg";
import { sign } from "jsonwebtoken";
import { SECRET_KEY } from "../config/server-config";
import { getPersonalByUsernameAndPassword } from "../database/personals";

export class Controller {
	#client: Client;

	constructor(client: Client) {
		this.#client = client;
	}

	async login(req: Request, res: Response): Promise<void> {
		console.log(req.body)
		const { username, password } = req.body;
		try {
			const result = await getPersonalByUsernameAndPassword(this.#client, username, password);
			if (result.length > 0) {
				const personal = result[0];
				const token = sign(
					{
						userId: personal.personal_id,
						username: personal.name,
						role: personal.role,
						permission: personal.permission,
					},
					SECRET_KEY,
					{ expiresIn: "1h" },
				);
				res.cookie("token", token, { httpOnly: true });

				res.status(200).json({ user: personal.personal_id , isAuthenticated: true, token });
			} else {
				res
					.status(401)
					.json({ message: "Invalid credentials", isAuthenticated: false });
			}
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: "Internal Server Error" });
		}
	}

	async logout(req: Request, res: Response): Promise<void> {
		res.clearCookie("token");
		res.status(200).json({ message: "Logout successful", isLoggedOut: true });
	}

	async getDashboard(req: Request, res: Response): Promise<void> {
		res.status(200).json({
			message: "Access granted to the dashboard",
			isAuthenticated: true,
		});
	}

	// EMAIL Service
	async sendMail(req: Request, res: Response): Promise<void> {
		try {
			const outputmail = `
                <h3>Hello there</h3>
                <br>
                <h3>This message can not be replaied.</h3>
                <ul>
                    ${req.body.message}
                </ul>
                <br>
                <p>Community name</p>
            `;

			const transporter = nodemailer.createTransport({
				service: "gmail",
				port: 8080,
				secure: true,
				auth: {
					user: "@gmail.com", // generated ethereal user
					pass: "", // generated ethereal password
				},
			});
			console.log(req.body.mails);
			const mailOptions = {
				from: '"DevStud" <expressdesign1121@gmail.com>', // sender address
				to: `${req.body.mails}`, // list of receivers
				subject: req.body.subject, // Subject line
				text: req.body.message, // plain text body
				html: outputmail,
			};

			// send mail with defined transport object
			transporter.sendMail(
				mailOptions,
				(error: unknown, info: SentMessageInfo) => {
					if (error) {
						console.log(`${error} from sendMail`);
					} else {
						console.log(info);
					}
				},
			);
		} catch (err) {
			console.error("Error sending email:", err);
			res.status(500).json({ error: "Internal server error" });
		}
	}

	async invalidEndpoints(req: Request, res: Response): Promise<void> {
		res.status(404).json({
			success: "false",
			message: "Page not found",
			error: {
				statusCode: 404,
				message: "You reached a route that is not defined on this server",
			},
		});
	}
}
