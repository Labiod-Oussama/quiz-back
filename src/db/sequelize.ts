import { Sequelize } from "sequelize-typescript";
import { User } from "./models/user.model";
import { Patient } from "./models/patient.model";
import { Test } from "./models/test.model";

export class SequelizeConnection {
    private static instance: Sequelize;

    private constructor() {
        SequelizeConnection.instance = new Sequelize(
            process.env.DATABASE_NAME as string,
            process.env.DB_USER_NAME as string,
            process.env.DB_PASSWORD as string,
            {
                host: process.env.DB_HOST as string,
                dialect: "mysql",
                pool: {
                    max: 5,
                    min: 0,
                    acquire: 30000,
                    idle: 10000,
                },
                logging: false
            }
        );

        SequelizeConnection.instance.addModels([
            User,
            Patient,
            Test
        ]);

        SequelizeConnection.instance
            .authenticate()
            .then((s) => {
                // TODO: active this line when you want to sync the database with the models   
                // SequelizeConnection.instance.sync({
                //     alter: true,
                // })
                console.log("Connection has been established successfully.");
            })
            .catch((err) => {
                console.error("Unable to connect to the database:", err);
            });
    }


    public static getInstance(): Sequelize {
        if (!SequelizeConnection.instance) {
            new SequelizeConnection();
        }

        return SequelizeConnection.instance;
    }
}
