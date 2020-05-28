import * as dotenv from 'dotenv';
dotenv.config();

export class Config {
    public server: any;

    constructor() {
        this.server = {
            port: process.env.PORT || 3000,
            jwt: {
                secret: process.env.JWT_SECRET || 'test',
                duration: process.env.JWT_DURATION || '1 days'
            }
        };
    }
}
