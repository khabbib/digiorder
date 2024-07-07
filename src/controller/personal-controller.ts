import {Request, Response} from "express";
import { Client } from "pg";
import { deletePersonal, getPersonalById, getPersonals, insertPersonal, updatePersonal } from "../database/personals";


export class PersonalController {
    #client: Client;

    constructor(client: Client) {
        this.#client = client;
    }

    async getPersonals(req: Request, res: Response): Promise<void> {
		try {
			const personals = await getPersonals(this.#client);
			res.status(200).json({ personals });
		} catch (error) {
			console.error("Error fetching personals:", error);
			res.status(500).json({ error: "Internal server error" });
		}
	}

	async getPersonalById(req: Request, res: Response): Promise<void> {
		const { id } = req.params;
		try {
			const personal = await getPersonalById(this.#client, id);
			res.status(200).json({ personal });
		} catch (error) {
			console.error("Error fetching personal:", error);
			res.status(500).json({ error: "Internal server error" });
		}
	}

	async insertPersonal(req: Request, res: Response): Promise<void> {
		const personal = req.body.personal;
		try {
			const resp = await insertPersonal(this.#client, personal);
			res.status(201).json({ message: "Personal created successfully!", personal: resp });
		} catch (err) {
			console.error("Error insrting personal:", err);
			res.status(500).json({ error: "Internal server error" });
		}
	}

	async updatePersonal(req: Request, res: Response): Promise<void> {
        try {
			const personal = req.body.personal;
            await updatePersonal(this.#client, personal);
			res.status(201).json({ message: "Personal created successfully!", personal });
		} catch (err) {
			console.error("Error updating personal:", err);
			res.status(500).json({ error: "Internal server error" });
		}
	}

	async deletePersonal(req: Request, res: Response): Promise<void> {
		try {
			const { id } = req.params;
			await deletePersonal(this.#client, id);
			res.status(200).json({ message: "Personal deleted successfully!" });
		} catch (err) {
			console.error("Error deleting personal:", err);
			res.status(500).json({ error: "Internal server error" });
		}
	}
}