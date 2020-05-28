import { Request, Response, Application } from 'express';
import * as passport from 'passport';
import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';
import { Config } from '../config/config';


export class AuthRoute {
    private config: Config = new Config();

    public routes(app: Application): void {

        app.route('/auth/login')
            .post((req: Request, res: Response) => {

                passport.authenticate('local', { session: false }, (error, user, info) => {

                    if (error || !user)
                        return res.status(400).json({
                            message: info ? info.message : 'Login failed',
                            user: user
                        });

                    req.login(user, { session: false }, (err) => {
                        if (err)
                            return res.send(err);

                        const token = jwt.sign(user, this.config.server.jwt.secret, { expiresIn: this.config.server.jwt.duration });

                        return res.json({ user, token });
                    });
                })(req, res);

            });
    }
}
