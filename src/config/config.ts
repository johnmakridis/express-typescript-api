import * as dotenv from 'dotenv';
dotenv.config();

class Config {

    public server: any;

    constructor() {

        this.server = {
            port: process.env.PORT || 3000,
            jwt: {
                secret: process.env.JWT_SECRET || 'test',
                duration: process.env.JWT_DURATION || '1 days'
            },
            rate_limit: {
                enabled: process.env.RATE_LIMITER_USE === 'true' ? true : false,
                store: process.env.RATE_LIMITER_STORE
            }
        };

    }

}


export class DatabaseConfig {

    public mysql: any;

    constructor() {

        this.mysql = {
            host: process.env.MYSQL_HOST,
            port: parseInt(process.env.MYSQL_PORT, 10),
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASS,
            database: process.env.MYSQL_DB,
            multipleStatements: true,
            charset: 'utf8mb4',
            character_set_server: 'utf8mb4',
            connection_limit: 100,
            timezone: 'UTC'
        };

    }

}



const config = new Config();
const dbConfig = new DatabaseConfig();

export { config, dbConfig };
