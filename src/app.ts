import { config } from './config/config';
import { Passport } from './lib/passport';
import { MySQLRateLimiterMiddleware } from './lib/rate-limiter';
import { utils } from './lib/utils';
import * as express from 'express';
import * as morgan from 'morgan';
import * as cors from 'cors';
import * as helmet from 'helmet';

// Routes
import { IndexRoutes } from './routes/index';
import { AuthRoutes } from './routes/auth';
import { ApiRoutes } from './routes/api';


class App {

    public app: express.Application;
    private passport = new Passport(); // Initialize passport (LocalStrategy & JWTStrategy)

    public indexRoutes = new IndexRoutes();
    public authRoutes = new AuthRoutes();
    public apiRoutes = new ApiRoutes();

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
        this.app.use(cors({
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
        }));
        this.app.disable('x-powered-by');
        this.app.use(helmet({ frameguard: { action: 'sameorigin' }, hidePoweredBy: true, xssFilter: true, noSniff: true, ieNoOpen: true }));
        this.app.use(this.passport.passport.initialize());


        this.app.use('/api', utils.checkToken);

        if (config.server.rate_limit.enabled && config.server.rate_limit.store === 'mysql')
            this.app.use('/api', new MySQLRateLimiterMiddleware((error) => { if (error) console.log(error); }).middleware);


        this.app.use((req: express.Request, res: express.Response, next: any) => {
            res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Authorization, Content-Type, X-Content-Type-Options'); // Request headers you wish to allow

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
        this.indexRoutes.routes(this.app);
        this.authRoutes.routes(this.app);
        this.apiRoutes.routes(this.app);
    }
}

export default new App().app;
