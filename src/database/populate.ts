import { client } from "../config/database-config";

async function insertUsers() {
	try {
		await client.query("DELETE FROM users");

		const testDataUsers = [
			{
				user_id: "1",
				name: "John",
				last_name: "Doe",
				email: "john.doe@example.com",
				full_address: "123 Main St, Cityville",
				phone_number: "555-1234",
				status: "paid",
				description: "Test user 1",
				payment_amount: 50.0,
				payment_year: 2023,
				membership_expiration_date: "2024-01-01",
			},
			{
				user_id: "2",
				name: "Jane",
				last_name: "Smith",
				email: "jane.smith@example.com",
				full_address: "456 Oak St, Townsville",
				phone_number: "555-5678",
				status: "unpaid",
				description: "Test user 2",
				payment_amount: 0.0,
				payment_year: 2019,
				membership_expiration_date: "2024-01-01",
			},
		];

		for (const user of testDataUsers) {
			await client.query(
				"INSERT INTO users (user_id, name, last_name, email, full_address, phone_number, status, description, payment_amount, payment_year, membership_expiration_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
				[
					user.user_id,
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
				],
			);
		}

		return true;
	} catch (error) {
		return false;
	}
}

async function insertPersonals() {
	try {
		await client.query("DELETE FROM personals;");

		const testDataPersonals = [
			{
				personal_id: "1",
				name: "Jane",
				last_name: "Smith",
				role: "employee",
				email: "employee1@example.com",
				details: "Employee details 1",
				permission: 1,
				password: "pwd",
			},
			{
				personal_id: "2",
				name: "Jane2",
				last_name: "Kurbachuv",
				role: "intern",
				email: "intern2@example.com",
				details: "Intern details 2",
				permission: 2,
				password: "pwd",
			},
			{
				personal_id: "3",
				name: "Jane3",
				last_name: "Holmqvist",
				role: "employee",
				email: "intern3@example.com",
				details: "Intern details 3",
				permission: 3,
				password: "pwd",
			},
		];

		for (const personal of testDataPersonals) {
			await client.query(
				"INSERT INTO personals (personal_id, name, last_name, role, email, details, permission, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
				[
					personal.personal_id,
					personal.name,
					personal.last_name,
					personal.role,
					personal.email,
					personal.details,
					personal.permission,
					personal.password,
				],
			);
		}

		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
}

async function insertPayments() {
	try {
		await client.query("DELETE FROM payments");
		const testDataPayments = [
			{
				payment_id: "1",
				user_id: "1",
				amount: 50.0,
				payment_year: 2023,
			},
			{
				payment_id: 2,
				user_id: 2,
				amount: 0.0,
				payment_year: 2022,
			},
		];

		for (const payment of testDataPayments) {
			await client.query(
				"INSERT INTO payments (payment_id, user_id, amount, payment_year) VALUES ($1, $2, $3, $4)",
				[
					payment.payment_id,
					payment.user_id,
					payment.amount,
					payment.payment_year,
				],
			);
		}

		return true;
	} catch (error) {
		return false;
	}
}

async function main() {
	try {
		await client.connect();
		const personals = await insertPersonals();
		console.log(personals)
		const users = personals ? await insertUsers() : false;
		const payments = users ? await insertPayments : false;
		if (payments) {
			console.log("Test data created");
		} else {
			console.log("Test data failed to insert");
		}
	} catch (error) {
		console.log("Error in making test data");
		throw new Error("Error in Database");
	} finally {
		await client.end();
	}
}

main();
