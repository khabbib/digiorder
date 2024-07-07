import express, { Express, Router } from "express";
import path from "path";
import { Controller } from "../controller/controller";
import { Client } from "pg";
// import { verifyToken } from "../middleware/auth";
import { UserController } from "../controller/user-controller";
import { PersonalController } from "../controller/personal-controller";

export class Route {
	#server: Express;

	constructor(server: Express) {
		this.#server = server;
	}

	createRoutes(client: Client) {
		const router = Router();
		const controller = new Controller(client);
		const userController = new UserController(client);
		const personalController = new PersonalController(client);

		this.#server.get("/static", (_req, res) => {
			res.json({ server: "Connection stablished" });
		});

		this.#server.get("/", (_req, res) => {
			// res.sendFile(path.join(__dirname, 'views', 'ejs'));
		});

		// router.post("/login", controller.login.bind(controller));
		// router.post("/logout", controller.logout.bind(controller));
		// router.post("/sendmail", controller.sendMail.bind(controller));
		// router.get("/dashboard", verifyToken(null), controller.getDashboard.bind(controller));

		// router.get("/users", userController.getUsers.bind(userController));
		// router.put("/users", verifyToken("update_user"), userController.updateUser.bind(userController));
		// router.post("/users", verifyToken("add_user"), userController.insertUser.bind(userController));
		// router.get("/users/:id", userController.getUserById.bind(userController));
		// router.delete("/users/:id", verifyToken("delete_user"), userController.deleteUser.bind(userController));

		// router.get("/personals", personalController.getPersonals.bind(personalController));
		// router.put("/personals", verifyToken("update_personal"), personalController.updatePersonal.bind(personalController));
		// router.post("/personals", verifyToken("add_personal"), personalController.insertPersonal.bind(personalController));
		// router.get("/personals/:id", personalController.getPersonalById.bind(personalController));
		// router.delete("/personals/:id", verifyToken("delete_personal"), personalController.deletePersonal.bind(personalController));

		this.#server.use(router);
		this.#server.get("*", controller.invalidEndpoints);
	}
}
