import { config } from './config/config';
import { Passport } from './lib/passport';
import { RateLimiterMiddleware } from './lib/rate-limiter';
import { utils } from './lib/utils';
import * as express from 'express';
import * as morgan from 'morgan';
import * as cors from 'cors';
import * as helmet from 'helmet';

// Routes
import { IndexRoute } from './routes/index';
import { AuthRoute } from './routes/auth';


class App {

    public app: express.Application;
    private passport = new Passport(); // Initialize passport (LocalStrategy & JWTStrategy)

    public indexRoute = new IndexRoute();
    public authRoute = new AuthRoute();

    constructor() {
        this.app = express();
        this.app.set('port', config.server.port || 3000);
        this.config();
        this.routes();
    }

    private config(): void {

        this.app.use(express.json()); // support application/json type post data
        this.app.use(express.urlencoded({ extended: false })); // support application/x-www-form-urlencoded post data
        this.app.use(morgan('dev'));
        this.app.use(cors());
        this.app.use(helmet());
        this.app.use(this.passport.passport.initialize());

        this.app.use('/api/v2', utils.checkApiToken);

        if (config.server.rate_limit.enabled)
            this.app.use('/api/v2', new RateLimiterMiddleware((error) => { if (error) console.log(error); }).middleware);


        this.app.use((req: express.Request, res: express.Response, next: any) => {
            res.setHeader('Access-Control-Allow-Origin', '*'); // Website you wish to allow to connect
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Request methods you wish to allow
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Authorization, Content-Type'); // Request headers you wish to allow
            res.setHeader('Access-Control-Allow-Credentials', 'true');

            next();
        });


        this.app.listen(this.app.get('port'), () => {
            console.log(`Server listening on port ${this.app.get('port')} \nPress CTRL+C to quit.`);
        });

        process.on('uncaughtException', (err) => {
            console.log(`un Caught exception ${err} stack: ${err.stack}`);
        });

        process.on('SIGINT', () => {
            console.log('Bye Bye! ;)');
            process.exit(0);
        });

    }

    private routes(): void {
        this.indexRoute.routes(this.app);
        this.authRoute.routes(this.app);
    }
}

export default new App().app;
