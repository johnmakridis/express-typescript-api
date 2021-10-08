import { Request, Response, Application } from 'express';
// import * as passport from 'passport';

export class IndexRoutes {

    public routes(app: Application): void {

        app.route('/')
            .get((req: Request, res: Response) => {
                res.status(403).send({ code: 403, message: 'Access Denied' });
            });



        // app.route('/protected') // NOTE: not used -> replaced with utils.checkToken()
        //     .get(passport.authenticate('jwt', { session: false }), (req: Request, res: Response) => {
        //         return res.status(200).send({ msg: 'you entered the protected zone' });
        //     });

    }
}
