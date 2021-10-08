
import { Request, Response, Application } from 'express';

export class ApiRoutes {

    public routes(app: Application): void {

        app.route('/api/test')
            .get((req: Request, res: Response) => {
                return res.status(200).send({ msg: 'Hello from API test' });
            });

    }

}
