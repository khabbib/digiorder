import { Client } from "pg";
import { IPersonal } from "./interfaces";
import { randomUUID } from "crypto";

export async function getPersonals(client: Client): Promise<IPersonal[]> {
	try {
		const user = await client.query("SELECT * FROM personals");
		return user.rows;
	} catch (error) {
		console.error("Error executing query:", error);
		throw new Error("Database error");
	}
}

export async function getPersonalById(client: Client, id: string): Promise<IPersonal[]> {
	try {
		const user = await client.query("SELECT * FROM personals WHERE personal_id = $1", [
			id,
		]);
		return user.rows;
	} catch (error) {
		console.error("Error executing query:", error);
		throw new Error("Error in getUserById");
	}
}

export async function getPersonalByUsernameAndPassword(client: Client, 
	username: string,
	password: string,
): Promise<IPersonal[]> {
	try {
		const personal = await client.query(
			"SELECT * FROM personals WHERE name = $1 AND password = $2",
			[username, password],
		);
		return personal.rows;
	} catch (error) {
		console.error("Error executing query:", error);
		throw new Error("Error in getPersonalByUsernameAndPassword");
	}
}

export async function insertPersonal(client: Client, personal: IPersonal): Promise<IPersonal[]> {
	try {
		const id = randomUUID();
		const addedPersonal = await client.query("INSERT INTO personals (personal_id, name, last_name, role, email, details, password) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
        [
            id,
            personal.name,
            personal.last_name,
            personal.role,
            personal.email,
            personal.details,
            personal.password
        ]);
		return addedPersonal.rows;
	} catch (error) {
		console.error("Error executing query:", error);
		throw new Error("Error inserting personal from the database");
	}
}

export async function updatePersonal(client: Client, personal: IPersonal): Promise<IPersonal[]> {
	try {
		const updatedPersonal = await client.query(
			"UPDATE personals SET name = $1, last_name = $2, role = $3, email = $4, details = $5, password = $6 WHERE personal_id = $7 RETURNING *",
			[
				personal.name,
				personal.last_name,
				personal.role,
				personal.email,
				personal.details,
				personal.password,
                personal.personal_id
			],
		);
		return updatedPersonal.rows;
	} catch (error) {
		console.error("Error executing query:", error);
		throw new Error("Error updating personal from the database");
	}
}

export async function deletePersonal(client: Client, id: string): Promise<boolean> {
	try {
		await client.query("DELETE FROM personals WHERE personal_id = $1", [id]);
		return true;
	} catch (error) {
		console.error("Error executing query:", error);
		throw new Error("Error deleting personal from the database");
	}
}