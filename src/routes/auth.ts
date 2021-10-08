import { Request, Response, Application } from 'express';
import { config } from '../config';
import { utils } from '../lib/utils';
import * as passport from 'passport';
import * as jwt from 'jsonwebtoken';


export class AuthRoutes {

    public routes(app: Application): void {

        app.route('/api/auth/login')
            .post((req: Request, res: Response) => {

                passport.authenticate('local', { session: false }, (error, user, info) => {

                    if (error || !user)
                        return res.status(400).json({ code: 400, error: 'bad_request', message: info ? info.message : 'Login failed' });

                    req.login(user, { session: false }, (err) => {

                        if (err)
                            return res.send(err);

                        // ...user,
                        const token = jwt.sign({ uid: utils.generateNanoID() }, config.server.jwt.secret, { expiresIn: config.server.jwt.duration });

                        return res.json({ user, token });
                    });

                })(req, res);

            });

    }

}
