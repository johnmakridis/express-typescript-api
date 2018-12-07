import { Request, Response } from 'express';

export class IndexRoute {
    public routes(app: any): void {
        app.route('/')
            .get((req: Request, res: Response) => {
                res.status(403).send('Access Denied');
            });
    }
}
