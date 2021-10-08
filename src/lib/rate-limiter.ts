import { ICallbackReady, RateLimiterMySQL } from 'rate-limiter-flexible';
import { Handler, NextFunction, Request, Response } from 'express';
import { config, dbConfig } from '../config/config';
import { mysql } from '../lib/connectors/mysql';


class RateLimiterMiddleware extends RateLimiterMySQL {

    constructor(ready: ICallbackReady) {
        super(
            {
                dbName: dbConfig.mysql.database,
                storeClient: mysql.pool,
                storeType: 'mysql',
                tableName: 'api_limits',
                keyPrefix: 'tid', // token uid generated with nanoid
                points: 1, // Max requests
                duration: 1, // per N seconds
                blockDuration: 5 // block requests from specific client for N seconds
            },
            ready,
        );
    }
    middleware: Handler = async (req: Request, res: any, next: NextFunction) => {
        try {

            const rateLimiterRes = await this.consume(req.uid, 1);

            const headers = {
                'Retry-After': rateLimiterRes.msBeforeNext / 1000,
                'X-RateLimit-Limit': this.points,
                'X-RateLimit-Remaining': rateLimiterRes.remainingPoints,
                'X-RateLimit-Reset': new Date(Date.now() + rateLimiterRes.msBeforeNext)
            };

            res.set(headers);

            next();

        } catch (error) {
            return res.status(429).send({ code: 429, error: 'too_many_requests', message: `Too many request for this API key, please try again in ${error.msBeforeNext / 1000} seconds` }); // Too Many Requests
        }
    }

}

export { RateLimiterMiddleware };
