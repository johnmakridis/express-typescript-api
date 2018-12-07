import * as dotenv from 'dotenv';
dotenv.config();

export class Config {
    public server: any;

    constructor() {
        this.server = {
            port: process.env.PORT || 3000
        };
    }
}
