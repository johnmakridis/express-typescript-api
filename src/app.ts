import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import * as cors from 'cors';
import * as helmet from 'helmet';
import { Config } from './config/config';
import { Passport } from './lib/passport';

// Routes
import { IndexRoute } from './routes/index';
import { AuthRoute } from './routes/auth';



class App {

    public app: express.Application;
    private configuration: Config = new Config();
    private passport: Passport = new Passport(); // Initialize passport (LocalStrategy & JWTStrategy)

    public indexRoute: IndexRoute = new IndexRoute();
    public authRoute: AuthRoute = new AuthRoute();

    constructor() {
        this.app = express();
        this.app.set('port', this.configuration.server.port || 3000);
        this.config();
        this.routes();
    }

    private config(): void {
        this.app.use(bodyParser.json()); // support application/json type post data
        this.app.use(bodyParser.urlencoded({ extended: false })); // support application/x-www-form-urlencoded post data
        this.app.use(morgan('dev'));
        this.app.use(cors());
        this.app.use(helmet());

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
