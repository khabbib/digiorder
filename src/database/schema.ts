import { client } from "../config/database-config";
const schema = `
    CREATE TABLE IF NOT EXISTS users (
        user_id text PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        full_address VARCHAR(255),
        phone_number VARCHAR(20),
        status VARCHAR(20) DEFAULT 'unpaid',
        description TEXT,
        payment_amount DECIMAL(10, 2) DEFAULT 0.0,
        payment_year INT,
        membership_expiration_date DATE,  -- New column for member expiration date
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS personals (
        personal_id text PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        role VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        details TEXT,
        permission INT,
        password VARCHAR(100) NOT NULL, -- In practice, use a secure password hashing algorithm
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS payments (
        payment_id text PRIMARY KEY,
        user_id text REFERENCES users(user_id) ON DELETE CASCADE,
        amount DECIMAL(10, 2) NOT NULL,
        payment_year INT NOT NULL,
        payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

async function main() {
	try {
		await client.connect();
		await client.query(schema);
		console.log("Schema created.");
		return true;
	} catch (error) {
		console.error("Error in creating schema: ", error);
		throw new Error("Database error");
	} finally {
		client.end();
	}
}

main();
