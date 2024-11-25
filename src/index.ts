import 'dotenv/config';
import express, { Application, Express } from 'express';
import { SequelizeConnection } from './db/sequelize';
import { ExpressApp } from './app';


class Server {
    private app: Express;
    private port: number;
    constructor(app: Express, port: number) {
        this.app = app;
        this.port = port;
    }

    public start(): void {
        this.app.listen(this.port, async () => {
            await SequelizeConnection.getInstance();
            console.log(`Server is running on http://localhost:${this.port}`);
        });
    }
}
const expressApp = new ExpressApp();
const port = parseInt(process.env.PORT || '4000'); // default to 3000 if PORT is not set
const server = new Server(expressApp.app, port);

server.start();