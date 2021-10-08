import { NextFunction, Request, Response } from 'express';
import { config } from '../config/config';
import { v4 as uuidv4 } from 'uuid';
import { customAlphabet } from 'nanoid';
import * as jwt from 'jsonwebtoken';
import * as moment from 'moment-timezone';


export class Utils {

    public moment = moment;

    checkApiToken = (req: Request, res: Response, next: NextFunction) => {

        // tslint:disable-next-line:no-string-literal
        let apiKey: any = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase

        if (apiKey && apiKey !== null && apiKey.startsWith('Bearer '))
            apiKey = apiKey.slice(7, apiKey.length);

        if (apiKey)
            jwt.verify(apiKey, config.server.jwt.secret, (err, decoded) => {

                if (err)
                    return res.status(401).send({ code: 401, error: 'unauthorized', message: 'Wrong credentials! Failed to authenticate token.' });

                const apiKeyExpired: boolean = moment.unix(decoded.exp).diff(moment(), 'hours') < 1;

                if (apiKeyExpired)
                    return res.status(401).send({ code: 401, error: 'unauthorized', message: 'Your token has expired.' });

                console.log(decoded);

                req.uid = decoded.uid;

                return next();
            });

        else
            return res.status(400).send({ code: 400, error: 'bad_request', message: 'No token provided' });

    }



    generateNanoID(numOfChars?: number, alphabet?: string): string {
        let _nubOfChars = 16;
        let _alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';

        if (numOfChars)
            _nubOfChars = numOfChars;

        if (alphabet)
            _alphabet = alphabet;

        const nanoid = customAlphabet(_alphabet, _nubOfChars);
        return nanoid();

    }



    generateUuidV4(): string {
        return uuidv4();
    }

}


const utils = new Utils();
export { utils };
