import { Client } from "pg";

export const client = new Client({
	host: "localhost",
	port: 5432,
	database: "AssociationDB",
	user: "khabib",
	password: "habib.t1121",
});
