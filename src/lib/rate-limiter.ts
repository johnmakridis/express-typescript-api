import { ICallbackReady, RateLimiterMySQL } from 'rate-limiter-flexible';
import { Handler, NextFunction, Request, Response } from 'express';
import { config, dbConfig } from '../config/config';
import { mysql } from '../lib/connectors/mysql';


export class MySQLRateLimiterMiddleware extends RateLimiterMySQL {

    constructor(ready: ICallbackReady) {
        super(
            {
                dbName: dbConfig.mysql.database,
                storeClient: mysql.pool,
                storeType: 'mysql',
                tableName: config.server.rate_limit.mysql_table,
                keyPrefix: config.server.rate_limit.key_prefix, // token uid generated with nanoid
                points: 10, // Max requests per "duration" below
                duration: 1, // seconds
                blockDuration: 5 // block requests from specific client for N seconds
            },
            ready,
        );
    }
    middleware: Handler = async (req: Request, res: any, next: NextFunction) => {
        try {

            if (config.server.rate_limit.excluded_limiter_paths.includes(req.path))
                return next();

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


