import { randomUUID } from "crypto";
import { Client } from "pg";
import { IUser } from "./interfaces";

export async function getUsers(client: Client): Promise<IUser[]> {
	try {
		const user = await client.query("SELECT * FROM users");
		return user.rows;
	} catch (error) {
		console.error("Error executing query:", error);
		throw new Error("Database error");
	}
}

export async function getUserById(client: Client, id: string): Promise<IUser[]> {
	try {
		const user = await client.query("SELECT * FROM users WHERE user_id = $1", [
			id,
		]);
		return user.rows;
	} catch (error) {
		console.error("Error executing query:", error);
		throw new Error("Error in getUserById");
	}
}

export async function insertUser(client: Client, user: IUser): Promise<IUser[]> {
	try {
		const id = randomUUID();
		const currentDate = new Date();
		const expirationDate = new Date(currentDate);
		expirationDate.setFullYear(currentDate.getFullYear() + 1);
		const dateFormat = expirationDate.toDateString();
		const status = 'Unpaid';
		const payment_year = 2023;
		const addedUser = await client.query(
			"INSERT INTO users (user_id, name, last_name, email, full_address, phone_number, status, description, payment_amount, payment_year, membership_expiration_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
			[
				id, // Defautl generates
				user.name,
				user.last_name,
				user.email,
				user.full_address,
				user.phone_number,
				status, // must be changed when the amount is paid
				user.description,
				user.payment_amount, // Update amount how much it is paid
				payment_year, // must be changed when the amount is paid
				dateFormat,
			],
		);
		return addedUser.rows;
	} catch (error) {
		console.error("Error executing query:", error);
		throw new Error("Error in insertUser");
	}
}

export async function updateUser(client: Client, user: IUser): Promise<IUser[]> {
	try {
		const updatedUser = await client.query(
			"UPDATE users SET name = $1, last_name = $2, email = $3, full_address = $4, phone_number = $5, status = $6, description = $7, payment_amount = $8, payment_year = $9, membership_expiration_date = $10 WHERE user_id = $11 RETURNING *",
			[
				user.name,
				user.last_name,
				user.email,
				user.full_address,
				user.phone_number,
				user.status,
				user.description,
				user.payment_amount,
				user.payment_year,
				user.membership_expiration_date,
				user.user_id,
			],
		);
		return updatedUser.rows;
	} catch (error) {
		console.error("Error executing query:", error);
		throw new Error("Error updating user from the database");
	}
}

export async function deleteUser(client: Client, id: string): Promise<boolean> {
	try {
		await client.query("DELETE FROM users WHERE user_id = $1", [id]);
		return true;
	} catch (error) {
		console.error("Error executing query:", error);
		throw new Error("Error deleting user from the database");
	}
}
