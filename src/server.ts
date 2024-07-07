import { ServerConfig, hostName, port } from "./config/server-config";
import express, { Express } from "express";
import bodyParser from "body-parser";
import { Client } from "pg";
import cors from "cors";
import { client } from "./config/database-config";
import { Route } from "./routes/routes";

class Server {
	#config: ServerConfig;
	#server: Express;
	#client: Client;

	constructor(config: ServerConfig, client: Client) {
		this.#config = config;
		this.#client = client;
		this.#server = express();

		this.#server.use(bodyParser.urlencoded({ extended: false }));
		this.#server.use(bodyParser.json());
		this.#server.use(cors());
	}

	async start() {
		const route = new Route(this.#server);
		try {
			//await this.#client.connect();
			route.createRoutes(this.#client);
			this.#server.set('view engine', 'ejs');
			this.#server.use(express.static('views'));
			this.#server.use(express.static('views'));
			this.#server.listen(this.#config.port, () => {
				console.log(`Server is running on port ${this.#config.port}`);
			});
		} catch (error) {
			console.error("Error starting the server:", error);
		}
	}

	stop() {
		console.log("Server is stopped");
		process.exit();	
	}
}

const config: ServerConfig = {
	port,
	hostName,
};

const server = new Server(config, client);
server.start();
