import { Request, Response } from "express";
import { Client } from "pg";
import { getUsers, getUserById, insertUser, updateUser, deleteUser } from "../database/users";


export class UserController {
    #client: Client;

    constructor(client: Client) {
        this.#client = client;
    }

    async getUsers(req: Request, res: Response): Promise<void> {
		try {
			const users = await getUsers(this.#client);
			res.status(200).json({ users });
		} catch (error) {
			console.error("Error fetching users:", error);
			res.status(500).json({ error: "Internal server error" });
		}
	}

	async getUserById(req: Request, res: Response): Promise<void> {
		const { id } = req.params;
		try {
			const user = await getUserById(this.#client, id);
			res.status(200).json({ user });
		} catch (error) {
			console.error("Error fetching user:", error);
			res.status(500).json({ error: "Internal server error" });
		}
	}

	async insertUser(req: Request, res: Response): Promise<void> {
		const { user } = req.body;
		try {
			const resp = await insertUser(this.#client, user);
			res.status(201).json({ message: "User created successfully!", user: resp });
		} catch (err) {
			console.error("Error insrting user:", err);
			res.status(500).json({ error: "Internal server error" });
		}
	}

	async updateUser(req: Request, res: Response): Promise<void> {
		try {
			const { user } = req.body;
			await updateUser(this.#client, user);
			res.status(201).json({ message: "User created successfully!", user });
		} catch (err) {
			console.error("Error updating user:", err);
			res.status(500).json({ error: "Internal server error" });
		}
	}

	async deleteUser(req: Request, res: Response): Promise<void> {
		try {
			const { id } = req.params;
			await deleteUser(this.#client, id);
			res.status(200).json({ message: "User deleted successfully!" });
		} catch (err) {
			console.error("Error deleting user:", err);
			res.status(500).json({ error: "Internal server error" });
		}
	}
}