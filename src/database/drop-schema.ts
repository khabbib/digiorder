import { client } from "../config/database-config";

async function main() {
	const query = `
    DROP TABLE IF EXISTS personals;
    DROP TABLE IF EXISTS payments;
    DROP TABLE IF EXISTS users;
    `;
	try {
		await client.connect();
		await client.query(query);
		console.log("Schema deleted");
	} catch (error) {
		console.log("Error in Database", error);
		throw new Error("Error in Database");
	} finally {
		client.end();
	}
}

main();
