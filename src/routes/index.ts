import { Request, Response, Application } from 'express';
import * as passport from 'passport';

export class IndexRoute {
    public routes(app: Application): void {

        app.route('/')
            .get((req: Request, res: Response) => {
                res.status(403).send({ code: 403, message: 'Access Denied' });
            });

        app.route('/protected')
            .get(passport.authenticate('jwt', { session: false }), (req: Request, res: Response) => {
                return res.status(200).send({ msg: 'you entered the protected zone' });
            });

        app.route('/api/v2/test')
            .get((req: Request, res: Response) => {
                return res.status(200).send({ msg: 'Hello from API v2 test' });
            });
    }
}
